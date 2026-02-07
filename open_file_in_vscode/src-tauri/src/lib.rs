use tauri::State;
use std::sync::Arc;

pub struct AppState {}

/// Open a file in VS Code at a specific line
#[tauri::command]
fn open_file_in_editor(file_path: String, line_number: Option<u32>) -> Result<(), String> {
    use std::process::Command;

    let path = file_path.replace('\', "/");
    println!("Normalized file path: {}", path);

    let args = if let Some(line) = line_number {
        println!("Opening at line: {}", line);
        vec!["--goto".to_string(), format!("{}:{}", path, line)]
    } else {
        println!("Opening without line number");
        vec![path.clone()]
    };
    println!("VS Code args: {:?}", args);

    #[cfg(target_os = "windows")]
    {
        let possible_paths = vec![
            std::path::PathBuf::from("C:\\Program Files\\Microsoft VS Code\\bin\\code.cmd"),
            std::path::PathBuf::from("C:\\Program Files (x86)\\Microsoft VS Code\\bin\\code.cmd"),
            std::path::PathBuf::from(std::env::var("LOCALAPPDATA").unwrap_or_default())
                .join("Programs\\Microsoft VS Code\\bin\\code.cmd"),
        ];

        for code_path in possible_paths {
            println!("Trying VS Code path: {:?}", code_path);
            if code_path.exists() {
                println!("Found VS Code at: {:?}", code_path);
                return Command::new(&code_path)
                    .args(&args)
                    .spawn()
                    .map(|_| ())
                    .map_err(|e| {
                        println!("Failed to launch VS Code at {:?}: {}", code_path, e);
                        format!("Failed to launch VS Code: {}", e)
                    });
            }
        }

        println!("Attempting to run: code {:?}", args);
        match Command::new("code").args(&args).spawn() {
            Ok(_) => return Ok(()),
            Err(e) => println!("Failed to launch 'code' from PATH: {}", e),
        }

        Err("VS Code not found. Make sure VS Code is installed and 'code' command is available in PATH.".to_string())
    }

    #[cfg(not(target_os = "windows"))]
    {
        println!("Attempting to run: code {:?}", args);
        Command::new("code").args(&args).spawn().map_err(|e| {
            println!("Failed to open file in VS Code: {}", e);
            format!("Failed to open file in VS Code: {}", e)
        })?;
        Ok(())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(Arc::new(AppState {}))
        .invoke_handler(tauri::generate_handler![open_file_in_editor])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
