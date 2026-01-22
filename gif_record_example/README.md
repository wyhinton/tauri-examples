# GIF Recorder Example

A minimal standalone Tauri application demonstrating how to record screen GIFs using the ScreenToGif tool.

## Prerequisites

1. **Node.js** - Required to run the recording script
2. **ScreenToGif** - Install from [screentogif.com](https://www.screentogif.com/)
   - Default installation path: `C:\Program Files (x86)\ScreenToGif\ScreenToGif.exe`
3. **Rust** - Required for Tauri

## Setup

```bash
# Install dependencies
npm install

# Run the development server
npm run tauri dev
```

## How It Works

1. The app gets the current window position and size using Tauri's window API
2. When you click "Record GIF", it executes a Node.js script via Tauri's shell plugin
3. The script launches ScreenToGif with the window's region coordinates
4. ScreenToGif records the specified region for the given duration
5. The GIF is saved to `scripts/gif_output/`

## Configuration

- **Name**: Output filename (without .gif extension)
- **Delay**: Seconds to wait before recording starts
- **Duration**: How long to record (in seconds)

## Project Structure

```
gif_record_example/
├── index.html          # Main UI
├── src/
│   └── main.js         # Frontend JavaScript
├── scripts/
│   ├── record-gif.mjs  # Recording script
│   └── gif_output/     # Output directory
└── src-tauri/
    ├── tauri.conf.json # Tauri configuration
    ├── Cargo.toml      # Rust dependencies
    └── src/
        ├── main.rs     # Rust entry point
        └── lib.rs      # Tauri setup with shell plugin
```

## Key Features

- **Window region detection**: Automatically captures the current window position and size
- **Shell plugin integration**: Executes Node.js scripts from Tauri
- **Desktop icon hiding**: Optionally hides desktop icons during recording (Windows)
- **Non-interactive mode**: All parameters passed via command-line arguments

## Tauri Shell Plugin Configuration

The shell plugin is configured in `tauri.conf.json` to allow executing Node.js:

```json
{
  "identifier": "shell:allow-execute",
  "allow": [
    {
      "name": "node",
      "cmd": "node",
      "args": true,
      "sidecar": false
    }
  ]
}
```

## Customization

To modify the ScreenToGif path, edit `scripts/record-gif.mjs`:

```javascript
await execa(
  'C:\\Program Files (x86)\\ScreenToGif\\ScreenToGif.exe',
  // ...
);
```

## License

MIT
