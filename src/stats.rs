use axum::{extract::Query, Json};
use serde::{Deserialize, Serialize};
use tokio::fs::{read_dir, read_to_string};

mod usernames;
use usernames::uuid_to_nickname;

#[derive(Serialize)]
pub struct Player {
  uuid: String,
  nickname: String,
}

#[derive(Serialize)]
pub struct Stat {
  player: Player,
  stat: u32,
}

#[derive(Deserialize)]
pub struct GetStatsParams {
  // page: usize,
  group: String,
  stat: String,
}

pub async fn get_stats(params: Query<GetStatsParams>) -> Json<Vec<Stat>> {
  let mut files = read_dir("data").await.unwrap();

  let mut stats = Vec::new();

  while let Some(file) = files.next_entry().await.unwrap() {
    let json = json::parse(&read_to_string(file.path()).await.unwrap()).unwrap();

    if let Some(stat) = json["stats"][&params.group][&params.stat].as_u32() {
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
        stat,
      });
    }
  }
  stats.sort_by(|a, b| b.stat.cmp(&a.stat));
  Json(stats)
}
