const api = globalThis.browser ?? globalThis.chrome;

api.action.onClicked.addListener(async (tab) => {
  if (tab && tab.id) {
    try {
      await api.tabs.sendMessage(tab.id, { type: "flambhub-toggle" });
    } catch {
      /* page sans content script (chrome://, Web Store…) */
    }
  }
});

// Les requêtes API passent par le service worker : elles ne sont pas
// soumises à la politique de sécurité (CSP) des sites visités.
api.runtime.onMessage.addListener((msg) => {
  if (!msg || msg.type !== "flambhub-api") return;

  return (async () => {
    try {
      const { serverUrl, linkCode, adminToken } = await api.storage.local.get([
        "serverUrl",
        "linkCode",
        "adminToken",
      ]);
      if (!serverUrl) {
        return {
          ok: false,
          status: 0,
          error: "Configure l'URL du serveur (réglages).",
          data: {},
        };
      }
      const headers = { "Content-Type": "application/json", ...(msg.headers || {}) };
      if (linkCode) headers["x-flamb-code"] = String(linkCode).toUpperCase();
      if (adminToken) headers["x-admin-token"] = adminToken;

      const res = await fetch(serverUrl + msg.path, {
        ...(msg.options || {}),
        headers,
      });
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, status: res.status, data };
    } catch (err) {
      return {
        ok: false,
        status: 0,
        error: err && err.message ? err.message : String(err),
        data: {},
      };
    }
  })();
});
