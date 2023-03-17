use std::convert::Infallible;

use axum::{
  body::Body,
  extract::Path,
  http::{header, HeaderValue, StatusCode},
  response::Html,
  response::Response,
  routing::get,
  Router,
};
use include_dir::include_dir;

static FRONTEND_DIR: include_dir::Dir = include_dir!("./frontend/dist");

pub fn get_frontend_router() -> axum::Router {
  Router::new()
    .route("/", get(index))
    .route("/assets/:filename", get(assets))
}

async fn index() -> Html<String> {
  Html(
    FRONTEND_DIR
      .get_file("index.html")
      .unwrap()
      .contents_utf8()
      .unwrap()
      .to_string(),
  )
}

async fn assets(Path(filename): Path<String>) -> Result<Response<Body>, Infallible> {
  match FRONTEND_DIR.get_file(&format!("assets/{}", filename)) {
    Some(file) => {
      let content_type = mime_guess::from_path(file.path()).first_or_octet_stream();
      let mut response = Response::new(Body::from(file.contents()));
      response.headers_mut().insert(
        header::CONTENT_TYPE,
        HeaderValue::from_str(&content_type.to_string()).unwrap(),
      );
      Ok(response)
    }
    None => {
      let mut response = Response::new(Body::empty());
      *response.status_mut() = StatusCode::NOT_FOUND;
      Ok(response)
    }
  }
}
