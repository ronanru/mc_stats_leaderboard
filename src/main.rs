mod frontend;
mod stats;
use axum::{routing::get, Router};
use clap::Parser;
use frontend::get_frontend_router;
use stats::get_stats;
use std::{net::SocketAddr, path::PathBuf, sync::Arc};

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
struct Cli {
  /// Path to ./server/world/stats directory
  #[arg(value_hint = clap::ValueHint::DirPath)]
  data_dir: PathBuf,

  /// Server name
  #[clap(short, long)]
  server_name: Option<String>,

  /// Port to listen on
  #[clap(short, long)]
  #[arg(default_value_t = 3000, value_parser = clap::value_parser!(u16).range(1..))]
  port: u16,
}

pub struct AppState {
  data_dir: PathBuf,
}

#[tokio::main]
async fn main() {
  let args = Cli::parse();

  let app_state = Arc::new(AppState {
    data_dir: args.data_dir.clone(),
  });

  let app = Router::new()
    .route("/api/stats", get(get_stats))
    .with_state(app_state)
    .nest("/", get_frontend_router(args.server_name));

  let addr = SocketAddr::from(([0, 0, 0, 0], args.port));
  println!("listening on http://{}", addr);
  axum::Server::bind(&addr)
    .serve(app.into_make_service())
    .await
    .unwrap();
}
