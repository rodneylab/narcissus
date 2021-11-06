extern crate worker;

use std::collections::HashMap;
use worker::console_log;

pub struct TelegramClient {
    base_url: String,
    bot_api_token: String,
    bot_chat_id: String,
}

impl TelegramClient {
    pub fn new(bot_api_token: &str, bot_chat_id: &str, base_url: Option<&str>) -> TelegramClient {
        let actual_base_url: &str = match base_url {
            Some(value) => value,
            None => "https://api.telegram.org/",
        };
        TelegramClient {
            bot_api_token: bot_api_token.into(),
            bot_chat_id: bot_chat_id.into(),
            base_url: actual_base_url.into(),
        }
    }

    pub async fn send_message(&self, message: &str) -> bool {
        let client = reqwest::Client::new();
        let mut map = HashMap::<&str, &str>::new();
        map.insert("chat_id", self.bot_chat_id.as_str());
        map.insert("text", message);
        let url = format!("{}bot{}/sendMessage", self.base_url, self.bot_api_token);

        match client.post(url).json(&map).send().await {
            Ok(_) => true,
            Err(_) => {
                console_log!("Telegram API response error");
                false
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::telegram_client::TelegramClient;

    #[tokio::test]
    pub async fn test_send_message() {
        use httptest::{
            matchers::{all_of, eq, json_decoded, request},
            responders::*,
            Expectation, Server,
        };
        pub use serde_json::json;

        let _ = pretty_env_logger::try_init();
        let server = Server::run();

        let message = "test message";
        let telegram_bot_api_token = "123456789:AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQq";
        let telegram_bot_chat_id = "-123456789";
        let path = &format!("/bot{}/sendMessage", telegram_bot_api_token);

        server.expect(
            Expectation::matching(all_of![
                request::method("POST"),
                request::path(path.to_string()),
                request::body(json_decoded(eq(json!(
            {"chat_id": telegram_bot_chat_id, "text": message } )))),
            ])
            .times(1)
            .respond_with(status_code(200)),
        );
        let url: &str = &server.url_str("");
        let client = TelegramClient::new(telegram_bot_api_token, telegram_bot_chat_id, Some(url));
        let result = client.send_message(&message).await;
        assert!(result);
    }
}
