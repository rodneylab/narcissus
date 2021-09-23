use ::regex::Regex;
use postgrest::Postgrest;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use worker::*;

mod utils;

#[derive(Deserialize)]
struct DataRequest {
    slug: String,
}

#[derive(Serialize)]
struct DataResponse {
    likes: i32,
    views: i32,
}

#[derive(Deserialize)]
struct LikeRequest {
    id: String,
    response: String,
    slug: String,
    unlike: bool,
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
struct LikeRow {
    uid: String,
}

//Expected response
// {
//  "success": true|false, // is the passcode valid, and does it meet security criteria you specified, e.g. sitekey?
//  "challenge_ts": timestamp, // timestamp of the challenge (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
//  "hostname": string, // the hostname of the site where the challenge was solved
//  "credit": true|false, // optional: whether the response will be credited
//  "error-codes": [...] // optional: any error codes
//  "score": float, // ENTERPRISE feature: a score denoting malicious activity.
//  "score_reason": [...] // ENTERPRISE feature: reason(s) for score.
// }
#[derive(Deserialize)]
struct HcaptchaResponse {
    success: bool,
    // challenge_ts: String, // timestamp
    // hostname: String,
    // credit: bool,
    // error-codes: [String],
}

#[derive(Serialize)]
struct LikeResponse {
    likes: i32,
    id: String,
}

#[derive(Serialize)]
struct ViewResponse {
    views: i32,
}

#[derive(Deserialize)]
struct ViewRequest {
    slug: String,
}

fn log_request(req: &Request) {
    console_log!(
        "{} - [{}], located at: {:?}, within: {}",
        Date::now().to_string(),
        req.path(),
        req.cf().coordinates().unwrap_or_default(),
        // req.cf().region().unwrap_or("unknown region".into())
        req.cf().region().unwrap_or_else(|| "unknown region".into())
    );
}

fn get_count_from_supabase_response_header(headers: &reqwest::header::HeaderMap) -> Option<i32> {
    if headers.contains_key(reqwest::header::CONTENT_RANGE) {
        match headers[reqwest::header::CONTENT_RANGE]
            .to_str()
            .unwrap()
            .split('/')
            .nth(1)
        {
            Some(count) => return Some(count.parse::<i32>().unwrap()),
            None => return None,
        }
    } else if headers.contains_key(reqwest::header::RANGE) {
        match headers[reqwest::header::RANGE]
            .to_str()
            .unwrap()
            .split('-')
            .nth(1)
        {
            Some(count) => return Some(count.parse::<i32>().unwrap()),
            None => return None,
        }
    }
    None
}

fn get_supabase_client(supabase_url: &str, api_key: &str) -> Result<Postgrest> {
    let supabase_endpoint = format!("{}/rest/v1/", supabase_url);
    let authorization_value = format!("Bearer {}", api_key);
    let client = Postgrest::new(supabase_endpoint)
        .insert_header("apikey", api_key)
        .insert_header("Authorization", authorization_value);
    Ok(client)
}

// fn get_origin_from_request_headers(headers: &worker::Headers) -> Option<String> {
//     headers.get("Origin").unwrap()
// }

fn add_access_control_allow_origin_to_response_headers<'a>(
    headers: &'a mut worker::Headers,
    origin: &str,
    cors_origin: &str,
) -> &'a worker::Headers {
    for origin_element in cors_origin.split(',') {
        if origin.eq(origin_element) {
            match headers.set("Access-Control-Allow-Origin", origin) {
                Ok(_) => return headers,
                Err(err) => {
                    console_log!(
                        "Error adding Access-Control-Allow-Origin to response headers: {}",
                        err
                    );
                    return headers;
                }
            }
        }
    }
    headers
}

fn preflight_response(headers: &worker::Headers, cors_origin: &str) -> Result<Response> {
    let origin = match headers.get("Origin").unwrap() {
        Some(value) => value,
        None => return Response::empty(),
    };
    let mut headers = worker::Headers::new();
    headers.set("Access-Control-Allow-Headers", "Content-Type")?;
    headers.set("Access-Control-Allow-Methods", "POST")?;
    add_access_control_allow_origin_to_response_headers(&mut headers, &origin, cors_origin);
    headers.set("Access-Control-Max-Age", "86400")?;
    Ok(Response::empty()
        .unwrap()
        .with_headers(headers)
        .with_status(204))
}

// consider parsing the i32 and if successful returning it as a string
async fn slug_exists(client: &Postgrest, slug: &str) -> Option<i32> {
    let response = match client
        .from("Post")
        .eq("slug", slug)
        .select("id")
        .single()
        .execute()
        .await
    {
        Ok(res) => res,
        Err(_) => return None,
    };
    // todo(rodneylab): try converting this to parse json instead of text
    // Called .text() on an HTTP body which does not appear to be text. The body's Content-Type is "application/x-www-form-urlencoded". The result will probably be corrupted. Consider checking the Content-Type header before interpreting entities as text.
    let body = match response.text().await {
        Ok(res) => res,
        Err(_) => return None,
    };

    let data: IdResponse = match serde_json::from_str(&body) {
        Ok(res) => res,
        Err(_) => return None,
    };
    Some(data.id)
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
        .form(&map)
        .send()
        .await
    {
        Ok(res) => res,
        Err(_) => return None,
    };
    match response.json::<HcaptchaResponse>().await {
        Ok(res) => Some(res.success),
        Err(_) => None,
    }
}

async fn likes(client: &Postgrest, post_id: &i32) -> Option<i32> {
    match client
        .from("Like")
        .eq("postId", post_id.to_string())
        .eq("unliked", "false")
        .select("id")
        .estimated_count()
        .execute()
        .await
    {
        Ok(response) => get_count_from_supabase_response_header(response.headers()),
        Err(_) => None,
    }
}

async fn views(client: &Postgrest, post_id: &i32) -> Option<i32> {
    match client
        .from("View")
        .eq("postId", post_id.to_string())
        .select("id")
        .estimated_count()
        .execute()
        .await
    {
        Ok(response) => get_count_from_supabase_response_header(response.headers()),
        Err(_) => None,
    }
}

#[event(fetch)]
pub async fn main(req: Request, env: Env) -> Result<Response> {
    log_request(&req);

    // Optionally, get more helpful error messages written to the console in the case of a panic.
    utils::set_panic_hook();

    // Optionally, use the Router to handle matching endpoints, use ":name" placeholders, or "*name"
    // catch-alls to match on specific patterns. The Router takes some data with its `new` method
    // that can be shared throughout all routes. If you don't need any shared data, use `()`.
    // let router = Router::new(());
    let router = Router::new();

    // Add as many routes as your Worker needs! Each route will get a `Request` for handling HTTP
    // functionality and a `RouteContext` which you can use to  and get route parameters and
    // Enviornment bindings like KV Stores, Durable Objects, Secrets, and Variables.
    router
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
            let slug = data.slug;
            if !slug_valid(&slug) {
                return Response::error("Bad request", 400);
            }
            let title = &data.title;
            if !title_valid(&slug) {
                return Response::error("Bad request", 400);
            }
            let insert_query = format!("[{{ \"slug\": \"{}\", \"title\": \"{}\" }}]", slug, title);
            let response = match client.from("Post").insert(insert_query).execute().await {
                Ok(res) => res,
                Err(_) => return Response::error("Error creating post", 400),
            };
            match response.text().await {
                Ok(_) => Response::ok("Post created. Thankee!"),
                Err(_) => Response::error("Error creating post", 400),
            }
        })
        .options("/post/data", |req, ctx| {
            preflight_response(req.headers(), &ctx.var("CORS_ORIGIN")?.to_string())
        })
        .post_async("/post/data", |mut req, ctx| async move {
            let supabase_url = ctx.var("SUPABASE_URL")?.to_string();
            let api_key = ctx.var("SUPABASE_SERVICE_API_KEY")?.to_string();
            let client = match get_supabase_client(&supabase_url, &api_key) {
                Ok(res) => res,
                Err(_) => return Response::error("Error creating PostgREST Supabase client", 400),
            };
            let data: DataRequest;
            match req.json().await {
                Ok(res) => data = res,
                Err(_) => return Response::error("Bad request", 400),
            }
            let slug = &data.slug;
            let post_id = match slug_exists(&client, slug).await {
                Some(res) => res,
                None => return Response::error("Bad request", 400),
            };
            let likes_future = likes(&client, &post_id);
            let views_future = views(&client, &post_id);
            let (likes_result, views_result) = futures::join!(likes_future, views_future);
            let likes: i32;
            match likes_result {
                Some(value) => likes = value,
                None => likes = -1,
            }
            let views: i32;
            match views_result {
                Some(value) => views = value,
                None => views = -1,
            }
            let data: DataResponse = DataResponse { likes, views };
            Response::ok(serde_json::to_string(&data).unwrap())
        })
        .options("/post/like", |req, ctx| {
            preflight_response(req.headers(), &ctx.var("CORS_ORIGIN")?.to_string())
        })
        .post_async("/post/like", |mut req, ctx| async move {
            let supabase_url = ctx.var("SUPABASE_URL")?.to_string();
            let api_key = ctx.var("SUPABASE_SERVICE_API_KEY")?.to_string();
            let client = match get_supabase_client(&supabase_url, &api_key) {
                Ok(res) => res,
                Err(_) => panic!("Error creating PostgREST Supabase client"),
            };
            let data: LikeRequest;
            match req.json().await {
                Ok(res) => data = res,
                Err(_) => return Response::error("Bad request", 400),
            }
            let slug = &data.slug;
            let is_unlike = &data.unlike;
            let mut like_id = &data.id;
            let hcaptcha_sitekey = ctx.var("HCAPTCHA_SITEKEY")?.to_string();
            let hcaptcha_secretkey = ctx.var("HCAPTCHA_SECRETKEY")?.to_string();
            if !slug_valid(slug) {
                return Response::error("Bad request", 400);
            }
            let verify_captcha_future =
                verify_captcha(&data.response, &hcaptcha_secretkey, &hcaptcha_sitekey);
            let slug_exists_future = slug_exists(&client, slug);
            let (verify_captcha_result, slug_exists_result) =
                futures::join!(verify_captcha_future, slug_exists_future);
            match verify_captcha_result {
                Some(value) => {
                    if !value {
                        return Response::error("Bad request", 400);
                    }
                }
                None => return Response::error("Bad request", 400),
            };
            let post_id = match slug_exists_result {
                Some(res) => res,
                None => return Response::error("Bad request", 400),
            };
            let data: Vec<LikeRow>;
            if !is_unlike {
                // add like to db
                let insert_query = format!("[{{ \"postId\": \"{}\" }}]", post_id.to_string());
                let response = match client.from("Like").insert(insert_query).execute().await {
                    Ok(value) => value,
                    Err(_) => return Response::error("Error adding like", 400),
                };
                // get uid of new like from response
                let body = match response.text().await {
                    Ok(value) => value,
                    Err(_) => return Response::error("Bad request", 400),
                };
                data = match serde_json::from_str(&body) {
                    Ok(value) => value,
                    Err(_) => return Response::error("Bad request", 400),
                };
                like_id = &data[0].uid;
            } else {
                // add unliked flag in Like table row
                match client
                    .from("Like")
                    .eq("uid", like_id)
                    .update(r#"{ "unliked": true }"#)
                    .execute()
                    .await
                {
                    Ok(_value) => (),
                    Err(_) => return Response::error("Error unliking post", 400),
                };
            }
            // get current like count
            let like_count: i32;
            match likes(&client, &post_id).await {
                Some(value) => like_count = value,
                None => like_count = -1,
            };
            // respond
            let data = LikeResponse {
                likes: like_count,
                id: like_id.to_string(),
            };
            // set CORS header
            let origin = match req.headers().get("Origin").unwrap() {
                Some(value) => value,
                None => return Response::error("Bad request", 400),
            };
            let mut headers = worker::Headers::new();
            add_access_control_allow_origin_to_response_headers(
                &mut headers,
                &origin,
                &ctx.var("CORS_ORIGIN")?.to_string(),
            );
            Ok(Response::ok(serde_json::to_string(&data).unwrap())
                .unwrap()
                .with_headers(headers))
        })
        .options("/post/view", |req, ctx| {
            preflight_response(req.headers(), &ctx.var("CORS_ORIGIN")?.to_string())
        })
        .post_async("/post/view", |mut req, ctx| async move {
            let supabase_url = ctx.var("SUPABASE_URL")?.to_string();
            let api_key = ctx.var("SUPABASE_SERVICE_API_KEY")?.to_string();
            let client = match get_supabase_client(&supabase_url, &api_key) {
                Ok(res) => res,
                Err(_) => panic!("Error creating PostgREST Supabase client"),
            };
            let data: ViewRequest;
            match req.json().await {
                Ok(res) => data = res,
                Err(_) => return Response::error("Bad request", 400),
            }
            let slug = &data.slug;
            if !slug_valid(slug) {
                return Response::error("Bad request", 400);
            }
            let post_id = match slug_exists(&client, slug).await {
                Some(res) => res,
                None => return Response::error("Bad request", 400),
            };
            let insert_query = format!("[{{ \"postId\": \"{}\" }}]", post_id.to_string());
            match client.from("View").insert(insert_query).execute().await {
                Ok(_) => (),
                Err(_) => return Response::error("Error adding view", 400),
            };
            let view_count: i32;
            match views(&client, &post_id).await {
                Some(value) => view_count = value,
                None => view_count = -1,
            };
            let data = ViewResponse { views: view_count };
            // set CORS header
            let origin = match req.headers().get("Origin").unwrap() {
                Some(value) => value,
                None => return Response::error("Bad request", 400),
            };
            let mut headers = worker::Headers::new();
            add_access_control_allow_origin_to_response_headers(
                &mut headers,
                &origin,
                &ctx.var("CORS_ORIGIN")?.to_string(),
            );
            Ok(Response::ok(serde_json::to_string(&data).unwrap())
                .unwrap()
                .with_headers(headers))
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
fn test_get_count_from_supabase_response_header() {
    let mut headers = reqwest::header::HeaderMap::new();
    headers.insert(
        reqwest::header::CONTENT_RANGE,
        "0-24/3573458".parse().unwrap(),
    );
    assert_eq!(
        get_count_from_supabase_response_header(&headers),
        Some(3573458)
    );

    let mut headers = reqwest::header::HeaderMap::new();
    headers.insert(reqwest::header::CONTENT_RANGE, "*/0".parse().unwrap());
    assert_eq!(get_count_from_supabase_response_header(&headers), Some(0));

    let mut headers = reqwest::header::HeaderMap::new();
    headers.insert(reqwest::header::RANGE, "0-24".parse().unwrap());
    assert_eq!(get_count_from_supabase_response_header(&headers), Some(24));
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
