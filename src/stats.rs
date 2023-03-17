use axum::{
  extract::{Query, State},
  Json,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::fs::{read_dir, read_to_string};

mod usernames;
use usernames::uuid_to_nickname;

use crate::AppState;

#[derive(Serialize, Clone)]
pub struct Player {
  uuid: String,
  nickname: String,
}

#[derive(Serialize, Clone)]
pub struct Stat {
  player: Player,
  value: u32,
}

#[derive(Deserialize)]
pub struct GetStatsParams {
  page: Option<usize>,
  group: String,
  stat: String,
}

pub async fn get_stats(
  params: Query<GetStatsParams>,
  State(state): State<Arc<AppState>>,
) -> Json<Vec<Stat>> {
  let mut files = read_dir(&state.data_dir).await.unwrap();

  let mut stats = Vec::new();

  while let Some(file) = files.next_entry().await.unwrap() {
    let json = json::parse(&read_to_string(file.path()).await.unwrap()).unwrap();

    if let Some(value) = json["stats"][&params.group][&params.stat].as_u32() {
      let uuid = file
        .file_name()
        .into_string()
        .unwrap()
        .get(0..36)
        .unwrap()
        .to_string();
      let nickname = uuid_to_nickname(&uuid).await.unwrap();
      stats.push(Stat {
        player: Player { uuid, nickname },
        value,
      });
    }
  }
  stats.sort_by(|a, b| b.value.cmp(&a.value));
  let start_index = params.page.unwrap_or(0) * 50;
  stats = stats[start_index..std::cmp::min(start_index + 50, stats.len())].to_vec();
  Json(stats)
}
