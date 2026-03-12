chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "open_side_panel" && message.url) {
    // We store the url so the side panel can read it once it opens
    chrome.storage.local.set({ pendingSidePanelUrl: message.url }, () => {
        // Open the side panel for the current window
        chrome.sidePanel.open({ windowId: sender.tab.windowId });
    });
    sendResponse({ status: "opening" });
  }
});

// Allow the user to open the side panel by clicking the extension icon
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch((error) => console.error(error));
