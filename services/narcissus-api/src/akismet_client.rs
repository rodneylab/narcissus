use std::collections::HashMap;
use worker::console_log;

pub struct AkismetClient {
    base_url: String,
    site_url: String,
    site_language: String,
    site_charset: String,
}

impl AkismetClient {
    pub fn new(site_url: &str, api_key: &str, base_url: Option<&str>) -> AkismetClient {
        let actual_base_url: String = match base_url {
            Some(value) => value.to_string(),
            None => format!("https://{}.rest.akismet.com/", api_key),
        };
        AkismetClient {
            base_url: actual_base_url,
            site_url: site_url.into(),
            site_language: "en".to_string(),
            site_charset: "UTF-8".to_string(),
        }
    }

    pub async fn check_comment(
        &self,
        email: &str,
        name: &str,
        text: &str,
        headers: &worker::Headers,
    ) -> Option<bool> {
        let mut map = HashMap::<&str, &str>::new();
        map.insert("blog", &self.site_url);
        let user_ip: String;
        if let Some(value) = super::get_header_value(headers, "x-real-ip") {
            user_ip = value;
            map.insert("user_ip", &user_ip);
        }
        let user_agent: String;
        if let Some(value) = super::get_header_value(headers, "user-agent") {
            user_agent = value;
            map.insert("user_agent", &user_agent);
        }
        let referrer: String;
        if let Some(value) = super::get_header_value(headers, "referer") {
            referrer = value;
            map.insert("referrer", &referrer);
        }
        map.insert("permalink", "full_link_to_article");
        map.insert("comment_type", "comment");
        map.insert("comment_author", name);
        map.insert("comment_email", email);
        map.insert("comment_content", text);
        map.insert("blog_lang", &self.site_language);
        map.insert("blog_charset", &self.site_charset);
        let client = reqwest::Client::new();
        let url = format!("{}1.1/comment-check", self.base_url);
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

    // pub async fn check_message(&self, client_response: &str) -> Option<bool> {}
}
