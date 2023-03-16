use json;
use once_cell::sync::Lazy;
use std::collections::HashMap;
use tokio::sync::Mutex;

static USERNAMES: Lazy<Mutex<HashMap<String, String>>> = Lazy::new(|| Mutex::new(HashMap::new()));

pub async fn uuid_to_nickname(uuid: &str) -> Option<String> {
  let mut usernames = USERNAMES.lock().await;

  match usernames.get(uuid) {
    Some(name) => return Some(name.to_string()),
    None => {
      let resp = reqwest::get(format!(
        "https://sessionserver.mojang.com/session/minecraft/profile/{}",
        uuid
      ))
      .await
      .unwrap()
      .text()
      .await
      .unwrap();

      let name = json::parse(&resp).unwrap()["name"].to_string();
      usernames.insert(uuid.to_string(), name.clone());

      Some(name)
    }
  }
}
