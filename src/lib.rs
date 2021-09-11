use postgrest::Postgrest;
use serde::Deserialize;
use serde_json::json;
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

#[derive(Deserialize)]
struct DataRequest {
    slug: String,
}

#[derive(Deserialize)]
struct LikeRequest {
    slug: String,
    // unlike: bool,
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
                .from("likes")
                .select("*")
                .eq("slug", slug)
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

            // 0. get slug
            let data: LikeRequest;
            match req.json().await {
                Ok(res) => data = res,
                Err(_) => panic!("Error deserialising JSON"),
            }
            let slug = &data.slug;

            // 1. check slug is expected format

            // 2. check slug exists

            // 3. add like
            let insert_query = format!("[{{ \"slug\": \"{}\" }}]", slug);
            match client.from("likes").insert(insert_query).execute().await {
                Ok(res) => res,
                Err(_) => panic!("Sorry about this!"),
            };

            Response::ok("Like inserted. Thankee!")
        })
        .run(req, env)
        .await
}
