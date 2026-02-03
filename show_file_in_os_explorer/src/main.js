import { invoke } from '@tauri-apps/api/core';
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';

// DOM Elements
const textContent = document.getElementById('textContent');
const outputPath = document.getElementById('outputPath');
const browseBtn = document.getElementById('browseBtn');
const saveBtn = document.getElementById('saveBtn');
const openExplorerBtn = document.getElementById('openExplorerBtn');
const status = document.getElementById('status');

let savedFilePath = null;

// Show status message
function showStatus(message, isError = false) {
  status.textContent = message;
  status.className = `status ${isError ? 'error' : 'success'}`;
}

// Update button states
function updateButtonStates() {
  const hasPath = outputPath.value.trim() !== '';
  const hasContent = textContent.value.trim() !== '';
  
  saveBtn.disabled = !hasPath || !hasContent;
  openExplorerBtn.disabled = !savedFilePath;
}

// Browse for output file path
browseBtn.addEventListener('click', async () => {
  try {
    const filePath = await save({
      defaultPath: 'output.txt',
      filters: [
        {
          name: 'Text Files',
          extensions: ['txt']
        }
      ]
    });
    
    if (filePath) {
      outputPath.value = filePath;
      updateButtonStates();
    }
  } catch (error) {
    showStatus(`Error selecting file: ${error}`, true);
  }
});

// Save file
saveBtn.addEventListener('click', async () => {
  try {
    const content = textContent.value;
    const path = outputPath.value;
    
    await writeTextFile(path, content);
    savedFilePath = path;
    
    showStatus(`File saved successfully to: ${path}`);
    updateButtonStates();
  } catch (error) {
    showStatus(`Error saving file: ${error}`, true);
  }
});

// Open in explorer
openExplorerBtn.addEventListener('click', async () => {
  try {
    if (savedFilePath) {
      await invoke('open_in_explorer', { fileToOpen: savedFilePath });
      showStatus('Opening file in explorer...');
    }
  } catch (error) {
    showStatus(`Error opening in explorer: ${error}`, true);
  }
});

// Update button states on input
textContent.addEventListener('input', updateButtonStates);
outputPath.addEventListener('input', updateButtonStates);

// Initialize
updateButtonStates();
