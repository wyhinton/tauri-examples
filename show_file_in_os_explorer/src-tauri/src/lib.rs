use std::sync::Arc;
use tauri::State;

pub struct AppState {
    // Add any shared state here if needed
}

#[tauri::command]
fn open_in_explorer(_state: State<'_, Arc<AppState>>, file_to_open: String) {
    println!("SHOWING IN EXP: {}", file_to_open);
    showfile::show_path_in_file_manager(file_to_open);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .manage(Arc::new(AppState {}))
        .invoke_handler(tauri::generate_handler![open_in_explorer])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
