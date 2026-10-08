chrome.action.onClicked.addListener(async (tab) => {
  if (tab && tab.id) {
    try {
      await chrome.tabs.sendMessage(tab.id, { type: "flambhub-toggle" });
    } catch {
      /* page sans content script (chrome://, Web Store…) */
    }
  }
});
