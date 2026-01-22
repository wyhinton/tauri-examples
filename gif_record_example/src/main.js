import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';

// Make recordGif available globally
window.recordGif = recordGif;

// Update window info on load
updateWindowInfo();

async function updateWindowInfo() {
  try {
    const currentWindow = getCurrentWindow();
    const position = await currentWindow.outerPosition();
    const size = await currentWindow.outerSize();
    
    const x = position.x;
    const y = position.y;
    const width = size.width;
    const height = size.height;
    const region = `${x},${y},${width},${height}`;
    
    document.getElementById('windowInfo').innerHTML = `
      📍 Position: (${x}, ${y})<br>
      📐 Size: ${width} × ${height}<br>
      🎯 Region: <code>${region}</code>
    `;
  } catch (error) {
    document.getElementById('windowInfo').textContent = 'Could not get window info: ' + error.message;
  }
}

// Update window info periodically
setInterval(updateWindowInfo, 1000);

async function recordGif() {
  const statusEl = document.getElementById('status');
  const recordBtn = document.getElementById('recordBtn');
  
  const name = document.getElementById('name').value || 'recording';
  const delay = parseInt(document.getElementById('delay').value) || 2;
  const duration = parseInt(document.getElementById('duration').value) || 5;
  
  try {
    // Disable button during recording
    recordBtn.disabled = true;
    recordBtn.innerHTML = '<span class="icon">⏳</span> Starting...';
    
    // Get window info
    const currentWindow = getCurrentWindow();
    const position = await currentWindow.outerPosition();
    const size = await currentWindow.outerSize();
    
    const x = position.x;
    const y = position.y;
    const width = size.width;
    const height = size.height;
    const region = `${x},${y},${width},${height}`;
    
    statusEl.className = 'status info';
    statusEl.textContent = `🎬 Starting GIF recording...\n\nName: ${name}\nRegion: ${region}\nDelay: ${delay}s\nDuration: ${duration}s`;
    
    console.log('Starting GIF recording with:', { name, delay, duration, region });

    // Show countdown timer
    if (delay > 0) {
      for (let i = delay; i > 0; i--) {
        recordBtn.innerHTML = `<span class="icon">⏱</span> Recording in ${i}s`;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Update button to show recording has started
    recordBtn.innerHTML = '<span class="icon">🎥</span> Recording...';
    
    // Execute the recording script
    const result = await invoke('plugin:shell|execute', {
      program: 'node',
      args: [
        '../scripts/record-gif.mjs',
        `--name=${name}`,
        `--delay=${delay}`,
        `--duration=${duration}`,
        `--region=${region}`,
      ],
      options: {
        env: {},
      },
    });
    
    console.log('Recording result:', result);
    
    if (result.code === 0) {
      statusEl.className = 'status success';
      statusEl.textContent = `✅ Recording completed!\n\nOutput: scripts/gif_output/${name}.gif\n\nstdout: ${result.stdout || '(empty)'}\nstderr: ${result.stderr || '(empty)'}`;
    } else {
      statusEl.className = 'status error';
      statusEl.textContent = `❌ Recording failed (exit code: ${result.code})\n\nstdout: ${result.stdout || '(empty)'}\nstderr: ${result.stderr || '(empty)'}`;
    }
    
  } catch (error) {
    console.error('Recording error:', error);
    statusEl.className = 'status error';
    statusEl.textContent = `❌ Error: ${error.message || error}\n\nMake sure:\n1. Node.js is installed\n2. ScreenToGif is installed\n3. Dependencies are installed (npm install)`;
  } finally {
    recordBtn.disabled = false;
    recordBtn.innerHTML = '<span class="icon">⏺</span> Record GIF';
  }
}
