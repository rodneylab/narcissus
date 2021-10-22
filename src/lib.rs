use ::regex::Regex;
use postgrest::Postgrest;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use worker::*;

mod utils;

#[derive(Deserialize)]
struct CommentRequest {
    author: String,
    text: String,
    email: String,
    response: String,
    slug: String,
}

#[derive(Deserialize)]
struct DataRequest {
    slug: String,
}

#[derive(Serialize)]
struct DataResponse {
    comments: Vec<CommentRow>,
    likes: i32,
    views: i32,
}

#[derive(Deserialize)]
struct LikeRequest {
    id: String,
    // response: String,
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

#[derive(Deserialize, Serialize)]
struct CommentRow {
    uid: String,
    created_at: String,
    updated_at: String,
    author: String,
    text: String,
    verified_author: bool,
    // path: String,
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

fn contains_only_printable_characters(text: &str) -> bool {
    let re = Regex::new(
        r"^[[:print:]]+$", // printable
    )
    .unwrap();
    re.is_match(text)
}

fn author_valid(author: &str) -> Option<String> {
    if contains_only_printable_characters(author) {
        return None;
    }
    console_log!("Check the comment author name");
    Some("Check the comment author name".to_string())
}

// todo(rodneylab): allow emoji try /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug
fn comment_text_valid(text: &str) -> Option<String> {
    let re = Regex::new(r"^[[:print:]\n\t]+$").unwrap();
    if !re.is_match(text) {
        console_log!("Check the comment");
        return Some("Check the comment".to_string());
    }
    if text.chars().count() > 1024 {
        console_log!("Comment is a little long!");
        return Some("Comment is a little long!".to_string());
    }
    None
}

fn email_valid(email: &str) -> Option<String> {
    let re = Regex::new(r"^([a-zA-Z0-9_+]([a-zA-Z0-9_+.]*[a-zA-Z0-9_+])?)@([a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,6})").unwrap();

    if re.is_match(email) {
        return None;
    }
    console_log!("Check the email address");
    Some("Check the email address".to_string())
}

fn title_valid(title: &str) -> bool {
    contains_only_printable_characters(title)
}

fn get_header_value(headers: &worker::Headers, header: &str) -> Option<String> {
    match headers.get(header) {
        Ok(value) => value,
        Err(_) => None,
    }
}

async fn spam_check(
    site_url: &str,
    email: &str,
    name: &str,
    text: &str,
    headers: &worker::Headers,
    akismet_api_key: &str,
) -> Option<bool> {
    // for entry in headers.entries() {
    //     console_log!("Key: {}, Value: {}", entry.0, entry.1);
    // }
    let mut map = HashMap::new();
    map.insert("blog", site_url);
    let user_ip: String;
    if let Some(value) = get_header_value(headers, "x-real-ip") {
        user_ip = value;
        map.insert("user_ip", &user_ip);
    }
    let user_agent: String;
    if let Some(value) = get_header_value(headers, "user-agent") {
        user_agent = value;
        map.insert("user_agent", &user_agent);
    }
    let referrer: String;
    if let Some(value) = get_header_value(headers, "referer") {
        referrer = value;
        map.insert("referrer", &referrer);
    }
    map.insert("permalink", "full_link_to_article");
    map.insert("comment_type", "comment");
    map.insert("comment_author", name);
    map.insert("comment_email", email);
    map.insert("comment_content", text);
    map.insert("blog_lang", "en");
    // map.insert("blog_charset", "UTF-8");
    let client = reqwest::Client::new();
    let url = format!(
        "https://{}.rest.akismet.com/1.1/comment-check",
        akismet_api_key
    );
    let response = match client.post(url).form(&map).send().await {
        Ok(res) => res,
        Err(_) => {
            console_log!("Akismet response error");
            return None;
        }
    };
    match response.text().await {
        Ok(value) => {
            let result = value.get(..);
            match result {
                Some("true") => Some(true),
                Some("false") => Some(false),
                _ => {
                    console_log!("Akismet response error");
                    None
                }
            }
        }
        Err(_) => {
            console_log!("Akismet response error");
            None
        }
    }
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

// todo(rodneylab): add pagination cursor
async fn comments(client: &Postgrest, post_id: &i32, limit: Option<u32>) -> Vec<CommentRow> {
    let default_limit = 10u32;
    let limit_used = match limit {
        Some(value) => value,
        None => default_limit,
    };
    //     uid: String,
    // created_at: String,
    // updated_at: String,
    // author: String,
    // text: String,
    // verified_author: String,
    // path: String,
    let response = match client
        .from("Comment")
        .eq("post_id", post_id.to_string())
        .select("uid,created_at,updated_at,author,text, verified_author")
        .order("created_at.asc")
        .limit(limit_used as usize)
        .execute()
        .await
    {
        Ok(value) => value,
        Err(_) => return Vec::<CommentRow>::new(),
    };
    let body = match response.text().await {
        Ok(res) => res,
        Err(_) => return Vec::<CommentRow>::new(),
    };
    let result: Vec<CommentRow>;
    match serde_json::from_str(&body) {
        Ok(res) => result = res,
        Err(_) => result = Vec::<CommentRow>::new(),
    };
    result
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
            let comments_future = comments(&client, &post_id, Some(8));
            let (comments_result, likes_result, views_result) = futures::join!(comments_future,likes_future, views_future);
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
            let data: DataResponse = DataResponse { comments: comments_result, likes, views };
            let has_origin_header = req.headers().has("Origin").unwrap_or(false);
            if has_origin_header {
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
            } else {
                Response::ok(serde_json::to_string(&data).unwrap())
            }
        })
        .options("/post/comment", |req, ctx| {
            preflight_response(req.headers(), &ctx.var("CORS_ORIGIN")?.to_string())
        })
        .post_async("/post/comment", |mut req, ctx| async move {
            let supabase_url = ctx.var("SUPABASE_URL")?.to_string();
            let api_key = ctx.var("SUPABASE_SERVICE_API_KEY")?.to_string();
            let client = match get_supabase_client(&supabase_url, &api_key) {
                Ok(res) => res,
                Err(_) => return Response::error("Error creating PostgREST Supabase client", 400),
            };
            let data: CommentRequest;
            match req.json().await {
                Ok(res) => data = res,
                Err(_) => return Response::error("Bad request", 400),
            }
            let author = &data.author;
            let email = &data.email;
            let response = &data.response;
            let slug = &data.slug;
            let text = &data.text;
            let hcaptcha_sitekey = ctx.var("HCAPTCHA_SITEKEY")?.to_string();
            let hcaptcha_secretkey = ctx.var("HCAPTCHA_SECRETKEY")?.to_string();
            if let Some(value) = author_valid(author) { return Response::error(value, 400)};
            if let Some(value) = email_valid(email) { return Response::error(value, 400)};
            if let Some(value) = comment_text_valid(text) { return Response::error(value, 400)};
            if !slug_valid(slug) {
                return Response::error("Bad request", 400);
            }
            let verify_captcha_future = verify_captcha(response, &hcaptcha_secretkey, &hcaptcha_sitekey);
            let blog = ctx.var("SITE_URL")?.to_string();
            let akismet_api_key = ctx.var("AKISMET_API_KEY")?.to_string();
            let spam_check_future = spam_check(&blog, email, author, text, req.headers(),&akismet_api_key);
            let slug_exists_future = slug_exists(&client, slug);
            let (verify_captcha_result, spam_check_result, slug_exists_result) =
                futures::join!(verify_captcha_future, spam_check_future, slug_exists_future);
            let mut marked_bot = false;
            match verify_captcha_result {
                Some(value) => {
                    if !value {
                        marked_bot = true;
                        console_log!("hCaptcha flags bot!");
                    }
                }
                None => return Response::error("Bad request: captcha!", 400),
            };
            let marked_spam = match spam_check_result {
                Some(value) => value,
                None => return Response::error("Bad request: spam_check", 400),
            };
            let post_id = match slug_exists_result {
                Some(res) => res,
                None => return Response::error("Bad request: slug", 400),
            };
            let insert_query = format!(
                r#"{{ "author": "{}", "text": "{}", "marked_bot": {}, "marked_spam": {}, "post_id": {} }}"#,
                author, text, marked_bot, marked_spam, post_id);
            let response = match client.from("Comment").insert(insert_query).execute().await {
                Ok(value) => value,
                Err(_) => return Response::error("Error adding comment", 400),
            };
            let body = match response.text().await {
                Ok(value) => value,
                Err(_) => return Response::error("Bad request: resp", 400),
            };
            let _data: CommentRow = match serde_json::from_str(&body) {
                Ok(value) => value,
                Err(_) => return Response::error("Bad request: json", 400),
            };
            Response::ok("Thanks for your comment!")
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
            // return Response::error("Bad request", 401);
            let is_unlike = &data.unlike;
            let mut like_id = &data.id;
            if !slug_valid(slug) {
                return Response::error("Bad request", 400);
            }
            let post_id = match slug_exists(&client, slug).await {
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
                    Ok(_) => (),
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
fn test_comment_text_valid() {
    // let valid_comments = ["Lovely post!", "Really\ngood\tpost.", "Simply amazing ❤️"];
    let valid_comments = ["Lovely post!", "Really\ngood\tpost.", "Simply amazing "];
    for element in valid_comments.iter() {
        assert_eq!(comment_text_valid(element), None);
    }

    let invalid_comments = ["Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Auctor eu augue ut lectus arcu bibendum at varius vel. Amet purus gravida quis blandit turpis. Hendrerit gravida rutrum quisque non tellus orci ac auctor. Purus sit amet volutpat consequat mauris nunc. Quis commodo odio aenean sed. Habitasse platea dictumst vestibulum rhoncus est pellentesque elit. Tortor aliquam nulla facilisi cras fermentum odio eu feugiat pretium. Dignissim convallis aenean et tortor at risus viverra adipiscing. Et sollicitudin ac orci phasellus egestas tellus rutrum tellus. Nunc scelerisque viverra mauris in aliquam sem fringilla ut. Hendrerit gravida rutrum quisque non tellus orci ac auctor augue. In cursus turpis massa tincidunt dui ut ornare lectus. Laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean. Blandit turpis cursus in hac habitasse platea dictumst. Quis enim lobortis scelerisque fermentum dui faucibus in. Leo urna molestie at elementum. Morbi leo urna molestie at elementum. Gravida cum sociis natoque penatibus et magnis dis parturient. Vitae suscipit tellus mauris a diam maecenas sed enim."];
    for element in &invalid_comments {
        assert!(comment_text_valid(element)
            .unwrap()
            .eq("Comment is a little long!"));
    }
}

#[test]
fn test_name_author() {
    let valid_names = ["Matthew", "MATTHEW", "matthew", "mark Luke"];
    for element in valid_names.iter() {
        assert_eq!(author_valid(element), None);
    }

    let invalid_names = ["Jo\nhn", "Matthew \t Mark"];
    for element in &invalid_names {
        assert!(author_valid(element)
            .unwrap()
            .eq("Check the comment author name"));
    }
}

#[test]
fn test_contains_only_printable_characters() {
    let valid_strings = ["My New Title", "My New Title 1", "My New Title: 1"];
    for element in valid_strings.iter() {
        assert!(contains_only_printable_characters(element));
    }

    let invalid_strings = ["My\nNew\nTitle"];
    for element in &invalid_strings {
        assert!(!contains_only_printable_characters(element));
    }
}

#[test]
fn test_email_valid() {
    let valid_emails = [
        "john@john.com",
        "MATTHEW@matthew.co.JP",
        "mark.luke@mark.biz",
    ];
    for element in valid_emails.iter() {
        assert_eq!(email_valid(element), None);
    }

    let invalid_emails = [
        "@john.com",
        "john",
        "john.com",
        "m@rk@mark.com",
        "peter&paul@va",
    ];
    for element in &invalid_emails {
        assert!(email_valid(element).unwrap().eq("Check the email address"));
    }
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
