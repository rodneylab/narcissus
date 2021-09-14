use ::regex::Regex;
use postgrest::Postgrest;
use reqwest;
use serde::Deserialize;
use serde_json::json;
use std::collections::HashMap;
use worker::*;

mod utils;

fn log_request(req: &Request) {
    console_log!(
        "{} - [{}], located at: {:?}, within: {}",
        Date::now().to_string(),
        req.path(),
        req.cf().coordinates().unwrap_or_default(),
        req.cf().region().unwrap_or("unknown region".into())
    );
}

fn get_supabase_client(supabase_url: &str, api_key: &str) -> Result<Postgrest> {
    let supabase_endpoint = format!("{}/rest/v1/", supabase_url);
    let authorization_value = format!("Bearer {}", api_key);
    let client = Postgrest::new(supabase_endpoint)
        .insert_header("apikey", api_key)
        .insert_header("Authorization", authorization_value);
    Ok(client)
}

async fn slug_exists(client: &Postgrest, slug: &str) -> Option<i32> {
    let response = match client
        .from("Posts")
        .eq("slug", slug)
        .select("id")
        .execute()
        .await
    {
        Ok(res) => res,
        Err(_) => return None,
    };

    match response.json::<IdResponse>().await {
        Ok(res) => Some(res.id),
        Err(_) => None,
    }
}

fn slug_valid(slug: &str) -> bool {
    let re = Regex::new(
        r"^(/?[[:digit:],[:lower:]]+[[:digit:],[:lower:],-]+[[:digit:],[:lower:]]+)+/?$",
    )
    .unwrap();
    re.is_match(slug)
}

fn title_valid(slug: &str) -> bool {
    let re = Regex::new(
        r"^[[:print:]]+$", // printable
    )
    .unwrap();
    re.is_match(slug)
}

async fn verify_captcha(client_response: &str, secret: &str, sitekey: &str) -> Option<bool> {
    let mut map = HashMap::new();
    map.insert("response", client_response);
    map.insert("secret", secret);
    map.insert("sitekey", sitekey);

    let client = reqwest::Client::new();
    let response = match client
        .post("https://hcaptcha.com/siteverify")
        .json(&map)
        .send()
        .await
    {
        Ok(res) => res,
        Err(_) => return None,
    };
    match response.json::<HcaptchaResponse>().await {
        Ok(res) => Some(res.success),
        Err(_) => return None,
    }
}

#[derive(Deserialize)]
struct DataRequest {
    slug: String,
}

#[derive(Deserialize)]
struct LikeRequest {
    slug: String,
    // unlike: bool,
}

#[derive(Deserialize)]
struct PostCreateRequest {
    slug: String,
    title: String,
}

#[derive(Deserialize)]
struct IdResponse {
    id: i32,
}

#[derive(Deserialize)]
struct HcaptchaResponse {
    success: bool,
    challenge_ts: String, // timestamp
    hostname: String,
    credit: bool,
    // error-codes: [String],
}

#[event(fetch)]
pub async fn main(req: Request, env: Env) -> Result<Response> {
    log_request(&req);

    // Optionally, get more helpful error messages written to the console in the case of a panic.
    utils::set_panic_hook();

    // Optionally, use the Router to handle matching endpoints, use ":name" placeholders, or "*name"
    // catch-alls to match on specific patterns. The Router takes some data with its `new` method
    // that can be shared throughout all routes. If you don't need any shared data, use `()`.
    let router = Router::new(());

    // Add as many routes as your Worker needs! Each route will get a `Request` for handling HTTP
    // functionality and a `RouteContext` which you can use to  and get route parameters and
    // Enviornment bindings like KV Stores, Durable Objects, Secrets, and Variables.
    router
        .post_async("/form/:field", |mut req, ctx| async move {
            if let Some(name) = ctx.param("field") {
                let form = req.form_data().await?;
                match form.get(name) {
                    Some(FormEntry::Field(value)) => {
                        return Response::from_json(&json!({ name: value }))
                    }
                    Some(FormEntry::File(_)) => {
                        return Response::error("`field` param in form shouldn't be a File", 422);
                    }
                    None => return Response::error("Bad Request", 400),
                }
            }

            Response::error("Bad Request", 400)
        })
        .get("/worker-version", |_, ctx| {
            let version = ctx.var("WORKERS_RS_VERSION")?.to_string();
            Response::ok(version)
        })
        .post_async("/post/create", |mut req, ctx| async move {
            let supabase_url = ctx.var("SUPABASE_URL")?.to_string();
            let api_key = ctx.var("SUPABASE_SERVICE_API_KEY")?.to_string();
            let client = match get_supabase_client(&supabase_url, &api_key) {
                Ok(res) => res,
                Err(_) => return Response::error("Error connecting to database", 400),
            };
            let data: PostCreateRequest;
            match req.json().await {
                Ok(res) => data = res,
                Err(_) => return Response::error("Bad request", 400),
            }
            let slug = &data.slug;
            if !slug_valid(&slug) {
                return Response::error("Bad request", 400);
            }
            let title = &data.title;
            if !title_valid(&slug) {
                return Response::error("Bad request", 400);
            }
            match slug_exists(&client, &slug).await {
                Some(_) => return Response::error("Bad request", 400),
                None => (),
            };
            let insert_query = format!("[{{ \"slug\": \"{}\", \"title\": \"{}\" }}]", slug, title);
            let response = match client.from("Post").insert(insert_query).execute().await {
                Ok(res) => res,
                Err(_) => return Response::error("Error creating post", 400),
            };
            let response_body = match response.text().await {
                Ok(res) => res,
                Err(_) => return Response::error("Error creating post", 400),
            };
            println!("Creating new post: {}", response_body);
            Response::ok("post created. Thankee!")
        })
        .post_async("/post/data", |mut req, ctx| async move {
            let supabase_url = ctx.var("SUPABASE_URL")?.to_string();
            let api_key = ctx.var("SUPABASE_SERVICE_API_KEY")?.to_string();
            let client = match get_supabase_client(&supabase_url, &api_key) {
                Ok(res) => res,
                Err(_) => panic!("Error creating postgrest supabase client"),
            };
            let data: DataRequest;
            match req.json().await {
                Ok(res) => data = res,
                Err(_) => panic!("Error deserialising JSON"),
            }
            let slug = &data.slug;
            let response = match client
                .from("Likes")
                .eq("slug", slug)
                .select("*")
                .estimated_count()
                .execute()
                .await
            {
                Ok(res) => res,
                Err(_) => panic!("This didn't happen in the dry run!"),
            };

            let body = match response.text().await {
                Ok(res) => res,
                Err(_) => panic!("What can I say?"),
            };
            Response::ok(body)
        })
        .post_async("/post/like", |mut req, ctx| async move {
            let supabase_url = ctx.var("SUPABASE_URL")?.to_string();
            let api_key = ctx.var("SUPABASE_SERVICE_API_KEY")?.to_string();
            let client = match get_supabase_client(&supabase_url, &api_key) {
                Ok(res) => res,
                Err(_) => panic!("Error creating postgrest supabase client"),
            };
            let data: LikeRequest;
            match req.json().await {
                Ok(res) => data = res,
                Err(_) => return Response::error("Bad request: invalid data", 400),
            }
            let slug = &data.slug;
            if !slug_valid(&slug) {
                return Response::error("Bad request", 400);
            }
            let post_id = match slug_exists(&client, &slug).await {
                Some(res) => res,
                None => return Response::error("Bad request", 400),
            };
            let insert_query = format!(
                "[{{ \"slug\": \"{}\", \"postId\": \"{}\" }}]",
                slug, post_id
            );
            match client.from("Likes").insert(insert_query).execute().await {
                Ok(res) => res,
                Err(_) => panic!("Sorry about this!"),
            };
            Response::ok("Like inserted. Thankee!")
        })
        .run(req, env)
        .await
}

#[test]
fn test_slug_valid() {
    let valid_slugs = [
        "/example/",
        "example",
        "/example",
        "example/",
        "/example-slug/",
        "example-slug",
        "/example-slug",
        "example-slug/",
        "/path/example-slug/",
        "path/example-slug",
        "/path/example-slug",
        "path/example-slug/",
        "/route/path/example-slug/",
        "route/path/example-slug",
        "/route/path/example-slug",
        "route/path/example-slug/",
    ];
    for element in valid_slugs.iter() {
        assert!(slug_valid(element));
    }

    let invalid_slugs = [
        "Example-slug",
        "-example-slug",
        "example-slug-",
        "-example/slug-",
        "e><ample-slug",
    ];
    for element in &invalid_slugs {
        assert!(!slug_valid(element));
    }
}

#[test]
fn test_title_valid() {
    let valid_titles = ["My New Title", "My New Title 1", "My New Title: 1"];
    for element in valid_titles.iter() {
        assert!(title_valid(element));
    }

    let invalid_titles = ["My\nNew\nTitle"];
    for element in &invalid_titles {
        assert!(!title_valid(element));
    }
}

#[test]
fn test_verify_captcha() {
    let client_response = "10000000-aaaa-bbbb-cccc-000000000001";
    let secret = "0x0000000000000000000000000000000000000000";
    let sitekey = "10000000-ffff-ffff-ffff-000000000001";
    async {
        let result = match verify_captcha(&client_response, &secret, &sitekey).await {
            Some(res) => res,
            None => false,
        };
        assert!(result);
    };
}
