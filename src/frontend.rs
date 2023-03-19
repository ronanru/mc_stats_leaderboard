use std::{convert::Infallible, sync::Arc};

use axum::{
  body::Body,
  extract::{Path, State},
  http::{header, HeaderValue, StatusCode},
  response::Html,
  response::Response,
  routing::get,
  Router,
};
use include_dir::include_dir;

static FRONTEND_DIR: include_dir::Dir = include_dir!("./frontend/dist");

struct FrontendState {
  server_name: String,
}

pub fn get_frontend_router(server_name: String) -> axum::Router {
  let frontend_state = Arc::new(FrontendState { server_name });

  Router::new()
    .route("/", get(index))
    .route("/assets/:filename", get(assets))
    .with_state(frontend_state)
}

async fn index(State(state): State<Arc<FrontendState>>) -> Html<String> {
  Html(
    FRONTEND_DIR
      .get_file("index.html")
      .unwrap()
      .contents_utf8()
      .unwrap()
      .replace("{{serverName}}", &state.server_name)
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
