// Listen for messages from the background script to set the iframe URL
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "load_side_panel_url" && message.url) {
    document.getElementById("article-frame").src = message.url;
    sendResponse({ status: "success" });
  }
});

// Optionally, if the panel is opened and we have a stored pending URL
chrome.storage.local.get(['pendingSidePanelUrl'], (result) => {
  if (result.pendingSidePanelUrl) {
    document.getElementById("article-frame").src = result.pendingSidePanelUrl;
    // Clear it
    chrome.storage.local.remove('pendingSidePanelUrl');
  }
});
