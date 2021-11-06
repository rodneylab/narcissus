use serde::Deserialize;
use std::collections::HashMap;

pub struct HcaptchaClient {
    base_url: String,
    secret: String,
    sitekey: String,
}

#[derive(Deserialize)]
struct HcaptchaResponse {
    success: bool,
}

impl HcaptchaClient {
    pub fn new(secret: &str, sitekey: &str, base_url: Option<&str>) -> HcaptchaClient {
        let actual_base_url: &str = match base_url {
            Some(value) => value,
            None => "https://hcaptcha.com/",
        };
        HcaptchaClient {
            base_url: actual_base_url.into(),
            secret: secret.into(),
            sitekey: sitekey.into(),
        }
    }

    pub fn base_url(&self) -> &str {
        &self.base_url
    }

    pub fn secret(&self) -> &str {
        &self.secret
    }

    pub fn sitekey(&self) -> &str {
        &self.sitekey
    }

    pub async fn verify(&self, client_response: &str) -> Option<bool> {
        let mut map = HashMap::<&str, &str>::new();
        map.insert("response", client_response);
        map.insert("secret", &self.secret);
        map.insert("sitekey", &self.sitekey);
        let client = reqwest::Client::new();
        let url = format!("{}siteverify", self.base_url);
        let response = match client.post(url).form(&map).send().await {
            Ok(res) => res,
            Err(_) => return None,
        };
        println!("response: {:?}", response);
        match response.json::<HcaptchaResponse>().await {
            Ok(res) => Some(res.success),
            Err(_) => None,
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::hcaptcha_client::HcaptchaClient;

    #[test]
    pub fn test_new() {
        let url = "https://example.com/";
        let secret = "0x0000000000000000000000000000000000000000";
        let sitekey = "10000000-ffff-ffff-ffff-000000000001";
        let client = HcaptchaClient::new(secret, sitekey, Some(url));

        assert_eq!(client.secret(), secret);
        assert_eq!(client.sitekey(), sitekey);
        assert_eq!(client.base_url(), url);

        let client = HcaptchaClient::new(secret, sitekey, None);
        assert_eq!(client.secret(), secret);
        assert_eq!(client.sitekey(), sitekey);
        assert_eq!(client.base_url(), "https://hcaptcha.com/");
    }

    #[tokio::test]
    pub async fn test_verify() {
        use httptest::{
            matchers::{all_of, contains, request, url_decoded},
            responders::json_encoded,
            Expectation, Server,
        };
        use serde_json::json;

        let _ = pretty_env_logger::try_init();
        let server = Server::run();

        let secret = "0x0000000000000000000000000000000000000000";
        let sitekey = "10000000-ffff-ffff-ffff-000000000001";
        let client_response = "10000000-aaaa-bbbb-cccc-000000000001";

        // responds to passed verification
        server.expect(
            Expectation::matching(all_of![
                request::method("POST"),
                request::path("/siteverify"),
                request::body(url_decoded(contains(("response", client_response)))),
                request::body(url_decoded(contains(("secret", secret)))),
                request::body(url_decoded(contains(("sitekey", sitekey)))),
            ])
            .times(1)
            .respond_with(json_encoded(json!({
                "success": true,
                "challenge_ts": "2021-11-06T19:31:02.000+0000",
                "hostname": "example.com",
                "credit": true,
                "error-codes": [],
                "score": 0.9,
                "score_reason": []
            }))),
        );
        let url: &str = &server.url_str("");
        let client = HcaptchaClient::new(secret, sitekey, Some(url));
        let result = client.verify(client_response).await;
        assert_eq!(result, Some(true));

        // responds to failed verification
        server.expect(
            Expectation::matching(all_of![
                request::method("POST"),
                request::path("/siteverify"),
                request::body(url_decoded(contains(("response", client_response)))),
                request::body(url_decoded(contains(("secret", secret)))),
                request::body(url_decoded(contains(("sitekey", sitekey)))),
            ])
            .times(1)
            .respond_with(json_encoded(json!({
                "success": false,
                "challenge_ts": "2021-11-06T19:31:02.000+0000",
                "hostname": "example.com",
                "credit": true,
                "error-codes": [],
                "score": 0.9,
                "score_reason": []
            }))),
        );
        let url: &str = &server.url_str("");
        println!("url: {}", url);
        let client = HcaptchaClient::new(secret, sitekey, Some(url));
        let result = client.verify(client_response).await;
        assert_eq!(result, Some(false));
    }

    #[tokio::test]
    async fn test_verify_no_mock() {
        let client_response = "10000000-aaaa-bbbb-cccc-000000000001";
        let secret = "0x0000000000000000000000000000000000000000";
        let sitekey = "10000000-ffff-ffff-ffff-000000000001";
        let client = HcaptchaClient::new(secret, sitekey, None);

        let result = match client.verify(&client_response).await {
            Some(res) => res,
            None => false,
        };
        assert!(result);
    }
}
