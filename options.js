// Default settings
const DEFAULT_MIRROR_URL = "https://freedium-mirror.cfd/";
const DEFAULT_OPEN_BEHAVIOR = "current_tab";
const DEFAULT_BUTTON_POSITION = "bottom_center";

// Saves options to chrome.storage
const saveOptions = () => {
  const mirrorUrl = document.getElementById('mirrorUrl').value;
  const openBehavior = document.getElementById('openBehavior').value;
  const buttonPosition = document.getElementById('buttonPosition').value;

  chrome.storage.sync.set(
    { bypassMirrorUrl: mirrorUrl, openBehavior: openBehavior, buttonPosition: buttonPosition },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'Settings saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 2000);
    }
  );
};

// Restores select box and text field state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get(
    { bypassMirrorUrl: DEFAULT_MIRROR_URL, openBehavior: DEFAULT_OPEN_BEHAVIOR, buttonPosition: DEFAULT_BUTTON_POSITION },
    (items) => {
      document.getElementById('mirrorUrl').value = items.bypassMirrorUrl;
      document.getElementById('openBehavior').value = items.openBehavior;
      document.getElementById('buttonPosition').value = items.buttonPosition;
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveBtn').addEventListener('click', saveOptions);
