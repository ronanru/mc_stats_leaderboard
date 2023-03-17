use std::{net::SocketAddr, path::PathBuf, sync::Arc};

use axum::{routing::get, Router};
mod stats;
use clap::Parser;
use stats::get_stats;

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
struct Cli {
  #[arg(value_hint = clap::ValueHint::DirPath)]
  data_dir: PathBuf,

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
    .route("/", get(|| async { "Hello, World!" }))
    .route("/api/getStats", get(get_stats))
    .with_state(app_state);

  let addr = SocketAddr::from(([0, 0, 0, 0], args.port));
  println!("listening on {}", addr);
  axum::Server::bind(&addr)
    .serve(app.into_make_service())
    .await
    .unwrap();
}

// fn check_dir_exists(s: &str) -> Result<(), String> {
//   if let Ok(metadata) = std::fs::metadata(s) {
//     if metadata.is_dir() {
//       Ok(())
//     } else {
//       Err("Not a directory".to_string())
//     }
//   } else {
//     Err("Directory does not exist".to_string())
//   }
// }
