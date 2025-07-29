use axum::{http::StatusCode, response::IntoResponse};
use std::fmt;

#[derive(Debug)]
pub enum DemoError {
    ErrorJson(serde_json::error::Error),
}

impl fmt::Display for DemoError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            DemoError::ErrorJson(err) => {
                write!(f, "Serde deserialization error: {err}")
            }
        }
    }
}

impl From<serde_json::error::Error> for DemoError {
    fn from(error: serde_json::error::Error) -> Self {
        DemoError::ErrorJson(error)
    }
}

impl IntoResponse for DemoError {
    fn into_response(self) -> axum::response::Response {
        let (status, message) = match self {
            DemoError::ErrorJson(e) => {
                let msg = format!("fmp serde json deserializing error. err {e:?}");
                println!("{msg}");
                (StatusCode::INTERNAL_SERVER_ERROR, msg)
            }
        };
        (status, message).into_response()
    }
}
