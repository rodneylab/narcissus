extern crate worker;
use reqwest::header::{HeaderMap, HeaderName, HeaderValue};
use serde::Deserialize;
use std::collections::HashMap;

#[derive(Deserialize)]
struct SupabaseUserMetadata {
    avatar_url: String,
    email: String,
    email_verified: bool,
    iss: String,
    preferred_username: String,
    provider_id: String,
    sub: String,
    user_name: String,
}

#[derive(Deserialize)]
struct SupabaseUserData {
    id: String,
    aud: String,
    role: String,
    email: String,
    email_confirmed_at: String,
    phone: String,
    confirmed_at: String,
    last_sign_in_at: String,
    // app_metadata: { provider: 'github', providers: [Array]},
    user_metadata: SupabaseUserMetadata,
    // identities: [],
    created_at: String,
    updated_at: String,
}

#[derive(Deserialize)]
struct SupabaseRefreshResponse {
    access_token: Option<String>,
    token_type: Option<String>,
    expires_in: Option<i32>,
    refresh_token: Option<String>,
    user: Option<SupabaseUserData>,
    error: Option<String>,
    error_description: Option<String>,
}

#[derive(Debug)]
pub struct SupabaseAuthenticationCredentials {
    access_token: String,
    refresh_token: String,
}

impl SupabaseAuthenticationCredentials {
    pub fn access_token(&self) -> &str {
        &self.access_token
    }
}

impl SupabaseAuthenticationCredentials {
    pub fn refresh_token(&self) -> &str {
        &self.refresh_token
    }
}

pub struct SupabaseClient {
    base_url: String,
    anon_api_key: String,
}

impl SupabaseClient {
    pub fn new(anon_api_key: &str, base_url: &str) -> SupabaseClient {
        SupabaseClient {
            anon_api_key: anon_api_key.into(),
            base_url: if base_url.chars().last().unwrap().eq(&'/') {
                base_url.into()
            } else {
                format!("{}/", base_url)
            },
        }
    }
    pub async fn sign_in_with_refresh_token(
        &self,
        refresh_token: &str,
    ) -> Option<SupabaseAuthenticationCredentials> {
        let client = reqwest::Client::new();
        let mut headers = HeaderMap::new();
        headers.insert(
            HeaderName::from_lowercase(b"apikey").unwrap(),
            HeaderValue::from_str(&self.anon_api_key).unwrap(),
        );
        let mut body = HashMap::<&str, &str>::new();
        body.insert("refresh_token", refresh_token);
        let url = format!("{}auth/v1/token?grant_type=refresh_token", self.base_url);
        let response = match client.post(url).headers(headers).json(&body).send().await {
            Ok(res) => res,
            Err(_) => return None,
        };
        match response.json::<SupabaseRefreshResponse>().await {
            Ok(value) => match value.error {
                Some(value) => {
                    println!("Refresh error: {}", value);
                    None
                }
                None => Some(SupabaseAuthenticationCredentials {
                    access_token: value.access_token.unwrap(),
                    refresh_token: value.refresh_token.unwrap(),
                }),
            },
            Err(error) => {
                println!("Json error: {}", error);
                None
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::supabase_client::SupabaseClient;

    #[tokio::test]
    pub async fn test_sign_in_with_refresh_token() {
        use httptest::{
            matchers::{all_of, contains, eq, json_decoded, request, url_decoded},
            responders::json_encoded,
            Expectation, Server,
        };
        use serde_json::json;

        let _ = pretty_env_logger::try_init();
        let server = Server::run();

        // credentials taken from supabase github repo - safe to commit
        // let supabase_url = "https://evuqlpfsuimdzxurpcgn.supabase.co";
        let supabase_anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYwNDIzODk3MywiZXhwIjoxOTE5ODE0OTczfQ.ud4NW5ZFc0Zky-ARnOzbzxqvLcYwVIyvk3GwW3aKC3Y";

        // randomly generated credential - safe to commit
        let refresh_token = "zDVm4vu4Yzl0ws0COVZIhm";

        // valid request
        server.expect(
            Expectation::matching(all_of![
                request::method("POST"),
                request::path("/auth/v1/token"),
                request::query(url_decoded(contains(("grant_type", "refresh_token")))),
                request::headers(contains(("apikey", supabase_anon_key))),
                request::body(json_decoded(eq(json!({ "refresh_token": refresh_token })))),
            ])
            .times(1)
            .respond_with(json_encoded(json!({"access_token": "some.fake.key",
                "token_type": "bearer",
                "expires_in": 3600,
                "refresh_token": "sRJPhHM35JT5bq59HEibKD",
                "user": {
                    "id": " a2a8889a-ed48-42e8-aa89-44e6e0e9665c",
                    "aud": "authenticated",
                    "role": "authenticated",
                    "email": "test@example.com",
                    "email_confirmed_at": "2021-11-12T09:54:01.808668Z",
                    "phone": "",
                    "confirmed_at": "2021-11-12T09:54:01.808668Z",
                    "last_sign_in_at": "2021-11-12T09:55:06.808668Z",
                        // app_metadata: { provider: 'github', providers: [Array]},
                    "user_metadata": {
                        "avatar_url": "https://avatars.githubusercontent.com/u/12345678?v=4",
                        "email": "test@example.com",
                        "email_verified": true,
                        "iss": "https://api.github.com",
                        "preferred_username": "example-username",
                        "provider_id": "12345678",
                        "sub": "12345678",
                        "user_name": "example-username"
                    },
                // identities: [],
                "created_at": "2021-11-12T09:54:01.808668Z",
                "updated_at": "2021-13-11T09:54:01.808668Z",
            },
            }))),
        );
        let url: &str = &server.url_str("");
        let client = SupabaseClient::new(supabase_anon_key, url);
        match client.sign_in_with_refresh_token(refresh_token).await {
            Some(value) => {
                assert_eq!(value.access_token, "some.fake.key");
                assert_eq!(value.refresh_token, "sRJPhHM35JT5bq59HEibKD");
            }
            None => panic!("no result"),
        };

        // invalid refresh token
        server.expect(
            Expectation::matching(all_of![
                request::method("POST"),
                request::path("/auth/v1/token"),
                request::query(url_decoded(contains(("grant_type", "refresh_token")))),
                request::headers(contains(("apikey", supabase_anon_key))),
                request::body(json_decoded(eq(json!({ "refresh_token": refresh_token })))),
            ])
            .times(1)
            .respond_with(json_encoded(json!({
                "error": "invalid_grant",
                "error_description": "Invalid Refresh Token"
            }))),
        );
        let url: &str = &server.url_str("");
        let client = SupabaseClient::new(supabase_anon_key, url);
        match client.sign_in_with_refresh_token(refresh_token).await {
            Some(_) => panic!("Expected no result"),
            None => (),
        }
    }
}
