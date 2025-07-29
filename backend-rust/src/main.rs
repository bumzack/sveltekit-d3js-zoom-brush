use std::{fs, net::SocketAddr};

use axum::{Json, Router, routing::get};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use tower_http::cors::CorsLayer;

use crate::demoerror::DemoError;

mod demoerror;

#[tokio::main]
async fn main() {
    // build our application with some routes
    let routes = Router::new().route("/api/chartdata", get(get_multi_line_chart_data));

    let app = routes.layer(CorsLayer::permissive());

    // run it with hyper
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();

    axum::serve(listener, app)
        .await
        .expect("should listen on port 3000");
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PointData {
    pub x: DateTime<Utc>,
    pub y: f64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LineData {
    pub points: Vec<PointData>,
    pub legend: String,
    pub color: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct MultilineChart {
    pub min_x: DateTime<Utc>,
    pub max_x: DateTime<Utc>,
    pub min_y: f64,
    pub max_y: f64,
    pub line_data: Vec<LineData>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MultilineChartRequest {
    pub ids: Vec<i32>,
}

pub async fn get_multi_line_chart_data() -> Result<Json<MultilineChart>, DemoError> {
    let file_name = "../multline_chart.json";
    let file_content = fs::read_to_string(file_name).expect("file should be there.");
    let multi_line_chart: MultilineChart = serde_json::from_str(&file_content)?;
    println!("Rust-Axum: returning chart data");
    Ok(Json(multi_line_chart))
}
