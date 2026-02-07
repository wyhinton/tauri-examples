# Open File in VS Code

A minimal Tauri v2 example demonstrating how to:

1. Select a file path and (optionally) a line number
2. Open the file in VS Code at the specified line using a custom Tauri command

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites)
- [VS Code](https://code.visualstudio.com/) (and ensure the `code` command is available in PATH)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run in development mode:

```bash
npm run tauri dev
```

3. Build for production:

```bash
npm run tauri build
```

## Project Structure

```
open_file_in_vscode/
├── index.html          # Main HTML file with UI
├── package.json        # Node.js dependencies
├── vite.config.js      # Vite configuration
├── src/
│   └── main.js         # Frontend JavaScript logic
└── src-tauri/
    ├── Cargo.toml      # Rust dependencies
    ├── tauri.conf.json # Tauri configuration
    ├── build.rs
    └── src/
        ├── lib.rs      # Tauri commands
        └── main.rs     # Application entry point
```

## How It Works

### Frontend (JavaScript)

- Uses `@tauri-apps/plugin-dialog` for the file open dialog
- Invokes the custom `open_file_in_editor` Tauri command

### Backend (Rust)

- Uses the `open_file_in_editor` command to launch VS Code at the specified file and line
- Handles Windows and non-Windows platforms

## Platform Support

This example works on:
- ✅ Windows
- ✅ macOS
- ✅ Linux
