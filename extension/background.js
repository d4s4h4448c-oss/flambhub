chrome.action.onClicked.addListener(async (tab) => {
  if (tab && tab.id) {
    try {
      await chrome.tabs.sendMessage(tab.id, { type: "flambhub-toggle" });
    } catch {
      /* page sans content script (chrome://, Web Store…) */
    }
  }
});

// Les requêtes API passent par le service worker : elles ne sont pas
// soumises à la politique de sécurité (CSP) des sites visités.
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (!msg || msg.type !== "flambhub-api") return false;

  (async () => {
    try {
      const { serverUrl, linkCode, adminToken } = await chrome.storage.local.get([
        "serverUrl",
        "linkCode",
        "adminToken",
      ]);
      if (!serverUrl) {
        throw new Error("Configure l'URL du serveur (réglages).");
      }
      const headers = { "Content-Type": "application/json", ...(msg.headers || {}) };
      if (linkCode) headers["x-flamb-code"] = String(linkCode).toUpperCase();
      if (adminToken) headers["x-admin-token"] = adminToken;

      const res = await fetch(serverUrl + msg.path, {
        ...(msg.options || {}),
        headers,
      });
      const data = await res.json().catch(() => ({}));
      sendResponse({ ok: res.ok, status: res.status, data });
    } catch (err) {
      sendResponse({
        ok: false,
        status: 0,
        error: err && err.message ? err.message : String(err),
        data: {},
      });
    }
  })();

  return true;
});
