import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';

const filePathInput = document.getElementById('filePath');
const lineNumberInput = document.getElementById('lineNumber');
const browseBtn = document.getElementById('browseBtn');
const openBtn = document.getElementById('openBtn');
const status = document.getElementById('status');

function showStatus(message, isError = false) {
  status.textContent = message;
  status.className = `status ${isError ? 'error' : 'success'}`;
}

function updateButtonState() {
  openBtn.disabled = !filePathInput.value.trim();
}

browseBtn.addEventListener('click', async () => {
  try {
    const selected = await open({ multiple: false });
    if (selected) {
      filePathInput.value = selected;
      updateButtonState();
    }
  } catch (error) {
    showStatus(`Error selecting file: ${error}`, true);
  }
});

filePathInput.addEventListener('input', updateButtonState);

openBtn.addEventListener('click', async () => {
  try {
    const filePath = filePathInput.value.trim();
    const lineNumber = lineNumberInput.value ? Number(lineNumberInput.value) : undefined;
    await invoke('open_file_in_editor', { filePath, lineNumber });
    showStatus('Opening file in VS Code...');
  } catch (error) {
    showStatus(`Error opening file: ${error}`, true);
  }
});

updateButtonState();
