# Show File in OS Explorer

A minimal Tauri v2 example demonstrating how to:

1. Use a text input to write content
2. Select an output file path using Tauri's dialog plugin
3. Save the content as a `.txt` file using Tauri's fs plugin
4. Show the saved file in the OS file explorer using the `showfile` crate

## Features

- **Text Input**: Write any text content you want to save
- **File Path Selection**: Use the native file dialog to choose where to save
- **Save File**: Write the text content to a `.txt` file
- **Show in Explorer**: Open the OS file explorer with the saved file highlighted

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites)

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
show_file_in_os_explorer/
├── index.html          # Main HTML file with UI
├── package.json        # Node.js dependencies
├── vite.config.js      # Vite configuration
├── src/
│   └── main.js         # Frontend JavaScript logic
└── src-tauri/
    ├── Cargo.toml      # Rust dependencies
    ├── tauri.conf.json # Tauri configuration
    ├── capabilities/   # Tauri permissions
    └── src/
        ├── lib.rs      # Tauri commands
        └── main.rs     # Application entry point
```

## How It Works

### Frontend (JavaScript)

- Uses `@tauri-apps/plugin-dialog` for the file save dialog
- Uses `@tauri-apps/plugin-fs` to write the text file
- Invokes the custom `open_in_explorer` Tauri command

### Backend (Rust)

- Uses the `showfile` crate to show a file in the OS file explorer
- The `open_in_explorer` command receives a file path and opens it in the native file manager

## Platform Support

This example works on:
- ✅ Windows (Explorer)
- ✅ macOS (Finder)
- ✅ Linux (varies by file manager)
