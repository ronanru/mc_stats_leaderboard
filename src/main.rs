use axum::{routing::get, Router};
mod stats;
use stats::get_stats;

#[tokio::main]
async fn main() {
  let app = Router::new()
    .route("/", get(|| async { "Hello, World!" }))
    .route("/api/getStats", get(get_stats));

  axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
    .serve(app.into_make_service())
    .await
    .unwrap();
}
