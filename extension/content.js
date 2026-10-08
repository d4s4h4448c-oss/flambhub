(() => {
  if (window.top !== window) return;
  if (document.getElementById("flambhub-widget")) return;

  /* ============ Styles ============ */
  const CSS = `
  .fhb-root {
    --bg: #05070c;
    --surface: #0a0e16;
    --surface-2: #0d1320;
    --surface-3: #16202f;
    --border: #1c2a3f;
    --border-strong: #2a3f5f;
    --fg: #e6edf7;
    --muted: #8fa3bd;
    --primary: #3b82f6;
    --primary-strong: #60a5fa;
    --cyan: #22d3ee;
    --success: #34d399;
    --danger: #f87171;
    background: radial-gradient(420px 220px at 90% -10%, rgba(59,130,246,0.14), transparent 60%), var(--bg);
    color: var(--fg);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 12.5px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    box-sizing: border-box;
  }
  .fhb-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .hidden { display: none !important; }
  .fhb-header {
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
    padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid var(--border);
  }
  .fhb-brand { display: flex; align-items: center; gap: 8px; }
  .fhb-logo {
    display: flex; align-items: center; justify-content: center;
    width: 34px; height: 34px; border-radius: 10px;
    background: linear-gradient(160deg, rgba(59,130,246,0.22), rgba(13,19,32,0.9));
    border: 1px solid rgba(96,165,250,0.35);
    box-shadow: 0 0 14px rgba(59,130,246,0.25);
  }
  .fhb-title { font-weight: 800; font-size: 14.5px; letter-spacing: -0.03em; line-height: 1.1; }
  .fhb-title span {
    background: linear-gradient(90deg, #67e8f9, #60a5fa);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .fhb-subtitle { font-size: 10px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--cyan); opacity: 0.85; }
  .fhb-header-right { display: flex; align-items: center; gap: 5px; flex: 1; justify-content: flex-end; }
  input, select {
    width: 100%; background: var(--surface-2); border: 1px solid var(--border);
    border-radius: 10px; color: var(--fg); padding: 8px 10px; font-size: 12.5px; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  input::placeholder { color: var(--muted); opacity: 0.7; }
  input:focus, select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(59,130,246,0.18); }
  select option { background: var(--surface-2); }
  button {
    cursor: pointer; border: 1px solid var(--border); background: var(--surface-3);
    color: var(--fg); border-radius: 10px; padding: 8px 12px; font-size: 12.5px; font-weight: 600;
    white-space: nowrap; transition: filter 0.15s, transform 0.1s, background 0.15s;
  }
  button:hover { filter: brightness(1.15); }
  button:active { transform: scale(0.97); }
  button.primary {
    background: linear-gradient(180deg, #3b82f6, #2563eb); border-color: transparent;
    color: #fff; box-shadow: 0 2px 12px rgba(59,130,246,0.35);
  }
  button.wide { width: 100%; }
  button.icon { background: transparent; border-color: transparent; color: var(--muted); padding: 6px; flex: 0 0 auto; display: inline-flex; align-items: center; }
  button.icon:hover { color: var(--fg); }
  button.add { width: 40px; flex: 0 0 auto; font-size: 17px; padding: 7px 0; line-height: 1; }
  .panel {
    background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
    padding: 14px; margin-bottom: 10px; display: flex; flex-direction: column; gap: 8px;
  }
  .panel-title { font-weight: 700; font-size: 12.5px; margin-bottom: 2px; }
  .panel label {
    font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted);
  }
  .panel button.primary { margin-top: 8px; }
  .card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
    padding: 14px; display: flex; flex-direction: column; gap: 9px;
  }
  .center-card { text-align: center; align-items: center; }
  .center-card h2 { font-size: 14px; font-weight: 700; }
  .center-card .muted { color: var(--muted); font-size: 11.5px; line-height: 1.45; max-width: 260px; }
  .empty-icon {
    display: flex; align-items: center; justify-content: center;
    width: 48px; height: 48px; border-radius: 14px;
    background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.3);
    color: var(--primary-strong); box-shadow: 0 0 18px rgba(59,130,246,0.2);
  }
  .alert {
    background: rgba(248,113,113,0.12); border: 1px solid rgba(248,113,113,0.4); color: var(--danger);
    border-radius: 10px; padding: 8px 10px; margin-bottom: 8px; font-size: 11.5px;
  }
  .hint { font-size: 10.5px; color: var(--muted); line-height: 1.4; }
  .profit {
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
    background: linear-gradient(160deg, rgba(59,130,246,0.16), rgba(13,19,32,0.95));
    border: 1px solid rgba(96,165,250,0.3); border-radius: 14px; padding: 11px 13px;
    margin-bottom: 8px; box-shadow: 0 4px 18px rgba(59,130,246,0.15);
  }
  .profit-main { display: flex; flex-direction: column; }
  .plabel { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
  .pvalue { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }
  .pvalue.good { color: var(--success); }
  .pvalue.bad { color: var(--danger); }
  .profit-side { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; font-size: 10.5px; color: var(--muted); }
  .fhb-form { display: flex; flex-direction: column; gap: 5px; margin-bottom: 8px; }
  .form-row { display: flex; gap: 5px; }
  .form-row input:first-child { flex: 2.2; min-width: 0; }
  .form-row input:nth-child(2) { flex: 1; min-width: 0; }
  .bounty-toggle {
    display: inline-flex; align-items: center; gap: 5px; padding: 7px 10px;
    border: 1px solid var(--border); background: var(--surface-2); border-radius: 10px;
    cursor: pointer; font-size: 11px; font-weight: 700; color: var(--muted);
    user-select: none; transition: color 0.15s, border-color 0.15s, background 0.15s; flex: 0 0 auto;
  }
  .bounty-toggle input { display: none; }
  .bounty-toggle:hover { border-color: var(--border-strong); }
  .bounty-toggle.on { color: #fb923c; border-color: rgba(251,146,60,0.45); background: rgba(251,146,60,0.12); }
  .hunt-bar { position: relative; margin-bottom: 8px; }
  .hunt-btn {
    width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 8px;
    background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
    padding: 9px 12px; font-size: 12.5px; font-weight: 700; text-align: left;
  }
  .hunt-btn:hover { border-color: var(--border-strong); background: var(--surface-2); filter: none; }
  .hunt-btn span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hunt-btn svg { color: var(--muted); flex: 0 0 auto; transition: transform 0.15s ease; }
  .hunt-btn.open svg { transform: rotate(180deg); }
  .menu {
    position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 20;
    background: var(--surface-2); border: 1px solid var(--border-strong); border-radius: 12px;
    padding: 4px; list-style: none; max-height: 190px; overflow-y: auto;
    box-shadow: 0 12px 32px rgba(0,0,0,0.55);
  }
  .menu-item {
    width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 8px;
    background: transparent; border: none; border-radius: 9px; padding: 8px 10px; font-weight: 600; text-align: left;
  }
  .menu-item:hover { background: var(--surface-3); filter: none; }
  .menu-item.active { background: rgba(59,130,246,0.15); color: var(--primary-strong); }
  .mi-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .mi-count { font-size: 10px; font-weight: 700; color: var(--muted); background: var(--surface-3); border-radius: 999px; padding: 1.5px 7px; flex: 0 0 auto; }
  .menu-item.active .mi-count { background: rgba(59,130,246,0.25); color: var(--primary-strong); }
  .slots { list-style: none; display: flex; flex-direction: column; gap: 5px; flex: 1; overflow-y: auto; }
  .slots-empty {
    text-align: center; color: var(--muted); font-size: 11.5px; padding: 18px 0;
    border: 1px dashed var(--border-strong); border-radius: 12px; margin-top: 2px;
  }
  .slot {
    display: flex; align-items: center; gap: 7px;
    background: var(--surface); border: 1px solid var(--border); border-radius: 11px;
    padding: 7px 9px; transition: border-color 0.15s, background 0.15s;
  }
  .slot:hover { border-color: var(--border-strong); background: var(--surface-2); }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; flex: 0 0 auto; }
  .status-dot.pending { background: #64748b; }
  .status-dot.in_progress { background: var(--primary-strong); box-shadow: 0 0 7px rgba(96,165,250,0.8); }
  .status-dot.collected { background: var(--success); box-shadow: 0 0 7px rgba(52,211,153,0.8); }
  .slot .name {
    flex: 1; min-width: 0; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    display: inline-flex; align-items: center; gap: 3px;
  }
  .bounty-mark { width: 11px; height: 11px; color: #fb923c; flex: 0 0 auto; }
  .slot .stake { color: var(--muted); font-size: 10.5px; flex: 0 0 auto; }
  .badge { font-size: 9.5px; font-weight: 700; border-radius: 999px; padding: 2px 7px; flex: 0 0 auto; }
  .badge.pending { background: rgba(100,116,139,0.16); color: var(--muted); }
  .badge.progress { background: rgba(59,130,246,0.16); color: var(--primary-strong); }
  .badge.collected { background: rgba(52,211,153,0.16); color: var(--success); }
  .slot .actions { display: flex; gap: 2px; flex: 0 0 auto; }
  .slot .action {
    background: transparent; border-color: transparent; padding: 4px 5px; font-size: 12px;
    flex: 0 0 auto; display: inline-flex; align-items: center; border-radius: 8px;
  }
  .slot .action:hover { background: var(--surface-3); filter: none; }
  .slot .action.play { color: var(--primary-strong); }
  .slot .action.coins { color: var(--success); }
  .slot .action.undo { color: var(--muted); }
  .slot .action.x { color: var(--danger); }
  .slot .gain-input { display: flex; gap: 4px; align-items: center; flex: 1; min-width: 0; }
  .slot .gain-input input { padding: 6px 8px; font-size: 12px; }
  .fhb-btn {
    position: fixed; top: 10px; right: 10px; z-index: 2147483647;
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(160deg, rgba(59,130,246,0.25), rgba(13,19,32,0.95));
    border: 1px solid rgba(96,165,250,0.5);
    box-shadow: 0 0 18px rgba(59,130,246,0.4);
    cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0;
    transition: transform 0.15s ease, filter 0.15s ease;
  }
  .fhb-btn:hover { transform: scale(1.08); filter: brightness(1.2); }
  .fhb-btn svg { width: 22px; height: 22px; display: block; }
  .fhb-panel {
    position: fixed; top: 58px; right: 10px; z-index: 2147483646;
    width: 360px; height: min(560px, calc(100vh - 70px));
    border: 1px solid rgba(42,63,95,0.9); border-radius: 14px;
    overflow: hidden; background: #05070c;
    box-shadow: 0 18px 50px rgba(0,0,0,0.6);
    display: none;
  }
  .fhb-panel.open { display: block; }
  `;

  const ICONS = {
    play: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="7 4 19 12 7 20 7 4"/></svg>',
    coins: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>',
    undo: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>',
    x: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    flame: '<svg class="bounty-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3.5 4 6 7 6 10.5a6 6 0 0 1-12 0C6 10 8.5 7 12 3Z"/><path d="M12 10.5c1.8 1.8 2.7 3.4 2.7 4.8A2.7 2.7 0 0 1 12 18a2.7 2.7 0 0 1-2.7-2.7c0-1.4.9-3 2.7-4.8Z"/></svg>',
  };

  const FLAME_SVG = `<svg width="20" height="20" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="fhbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00C8FF"/><stop offset="30%" stop-color="#006CFF"/><stop offset="65%" stop-color="#003BFF"/><stop offset="100%" stop-color="#071A45"/></linearGradient></defs><path fill="url(#fhbg)" d="M50 6 C41 13 33 22 29 33 C25 44 23 55 23 64 C23 74 25 82 29 88 Q37 83 44 84 Q47 90 50 93 Q53 90 56 84 Q63 83 71 88 C75 82 77 74 77 64 C77 55 75 44 71 33 C67 22 59 13 50 6 Z"/></svg>`;

  /* ============ DOM ============ */
  const host = document.createElement("div");
  host.id = "flambhub-widget";
  const shadow = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = CSS;

  const button = document.createElement("button");
  button.className = "fhb-btn";
  button.title = "FlambHub — Bonus Hunt";
  button.innerHTML = FLAME_SVG;

  const panel = document.createElement("div");
  panel.className = "fhb-panel";

  const root = document.createElement("div");
  root.className = "fhb-root";

  root.innerHTML = `
    <div class="fhb-header">
      <div class="fhb-brand">
        <div class="fhb-logo">${FLAME_SVG}</div>
        <div>
          <div class="fhb-title">Flamb<span>Hub</span></div>
          <div class="fhb-subtitle">Bonus Hunt</div>
        </div>
      </div>
      <div class="fhb-header-right">
        <button id="refreshBtn" class="icon" title="Actualiser">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>
        </button>
        <button id="closeBtn" class="icon" title="Masquer">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <button id="settingsBtn" class="icon" title="Réglages">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55h.01a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z"/></svg>
        </button>
      </div>
    </div>

    <div id="settings" class="panel hidden">
      <div class="panel-title">Connexion au serveur</div>
      <label>URL du serveur</label>
      <input id="serverUrl" placeholder="https://flambhub.vercel.app" spellcheck="false" />
      <label>Code de liaison</label>
      <input id="linkCode" placeholder="XXXX-XXXX-XXXX" spellcheck="false" maxlength="14" />
      <label>Clé d'administration (optionnelle)</label>
      <input id="adminToken" type="password" placeholder="Clé ADMIN_API_TOKEN" spellcheck="false" />
      <p class="hint">Code : sur le site → Bonus Hunt → « Lier l'extension ».</p>
      <button id="saveUrl" class="primary wide">Enregistrer</button>
    </div>

    <div id="error" class="alert hidden"></div>

    <div id="noHunts" class="card center-card hidden">
      <div class="empty-icon">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="7.2" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="16.8" cy="12" r="1.7"/><path d="M17 5a4 4 0 0 1 4-4"/></svg>
      </div>
      <h2>Aucun hunt lié</h2>
      <p class="muted">
        Crée ton hunt sur le site (page Bonus Hunt). Grâce à ton code de
        liaison, il apparaîtra ici automatiquement.
      </p>
      <button id="noHuntsRefresh" class="primary wide">Actualiser</button>
    </div>

    <div id="profit" class="profit hidden"></div>

    <div id="huntBar" class="hunt-bar hidden">
      <button id="huntBtn" class="hunt-btn" title="Changer de hunt">
        <span id="huntLabel">—</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <ul id="huntMenu" class="menu hidden"></ul>
    </div>

    <form id="addForm" class="fhb-form hidden">
      <div class="form-row">
        <input id="slotName" placeholder="Nom de la slot" list="slotSuggest" maxlength="120" required />
        <input id="slotStake" type="number" min="0" step="0.01" placeholder="Mise" required />
      </div>
      <div class="form-row">
        <input id="slotGain" type="number" min="0" step="0.01" placeholder="Gain (optionnel)" />
        <label class="bounty-toggle" id="bountyToggle" title="Marquer comme Bounty">
          <input type="checkbox" id="slotBounty" />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3.5 4 6 7 6 10.5a6 6 0 0 1-12 0C6 10 8.5 7 12 3Z"/><path d="M12 10.5c1.8 1.8 2.7 3.4 2.7 4.8A2.7 2.7 0 0 1 12 18a2.7 2.7 0 0 1-2.7-2.7c0-1.4.9-3 2.7-4.8Z"/></svg>
          Bounty
        </label>
        <button type="submit" class="primary add" title="Ajouter la slot">+</button>
      </div>
    </form>

    <datalist id="slotSuggest"></datalist>

    <ul id="slotList" class="slots"></ul>
  `;

  panel.appendChild(root);
  shadow.appendChild(style);
  shadow.appendChild(button);
  shadow.appendChild(panel);
  document.documentElement.appendChild(host);

  /* ============ Logique ============ */
  const $ = (id) => root.getElementById(id);

  const state = { url: "", linkCode: "", adminToken: "", hunts: [], selectedId: null, detail: null };

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  function fmt(value, currency) {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
  }

  function showError(message) {
    const el = $("error");
    el.textContent = message;
    el.classList.remove("hidden");
  }

  function clearError() {
    $("error").classList.add("hidden");
  }

  async function api(path, options = {}) {
    if (!state.url) throw new Error("Configure l'URL du serveur (réglages).");
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    if (state.linkCode) headers["x-flamb-code"] = state.linkCode.toUpperCase();
    if (state.adminToken) headers["x-admin-token"] = state.adminToken;
    const res = await fetch(state.url + path, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Erreur serveur (${res.status})`);
    return data;
  }

  function render() {
    clearError();
    const hasHunts = state.hunts.length > 0;
    $("noHunts").classList.toggle("hidden", hasHunts || !state.url);
    $("addForm").classList.toggle("hidden", !hasHunts || !state.url);
    $("profit").classList.toggle("hidden", !state.detail);
    $("huntBar").classList.toggle("hidden", !hasHunts || !state.url);

    const current = state.hunts.find((h) => h.id === state.selectedId) || state.hunts[0] || null;
    $("huntLabel").textContent = current ? current.name : "—";

    $("huntMenu").innerHTML = state.hunts
      .map((h) => `<li><button class="menu-item ${h.id === state.selectedId ? "active" : ""}" data-id="${h.id}">
        <span class="mi-name">${escapeHtml(h.name)}</span>
        <span class="mi-count">${h.stats.slotCount}</span>
      </button></li>`)
      .join("");

    if (state.detail) renderDetail();
  }

  function renderDetail() {
    const detail = state.detail;
    const cur = detail.currency;
    const profit = detail.stats.profit;

    $("profit").innerHTML = `
      <div class="profit-main">
        <span class="plabel">Profit / Pertes</span>
        <span class="pvalue ${profit >= 0 ? "good" : "bad"}">${profit >= 0 ? "+" : ""}${fmt(profit, cur)}</span>
      </div>
      <div class="profit-side">
        <span>Gagné ${fmt(detail.stats.totalWon, cur)}</span>
        <span>${detail.stats.collectedCount}/${detail.stats.slotCount} collectées · ${detail.stats.bountyCount} bounty</span>
      </div>`;

    const seen = new Set();
    $("slotSuggest").innerHTML = detail.slots
      .map((s) => s.slotName)
      .filter((n) => {
        if (seen.has(n)) return false;
        seen.add(n);
        return true;
      })
      .map((n) => `<option value="${escapeHtml(n)}"></option>`)
      .join("");

    $("slotList").innerHTML = "";
    if (detail.slots.length === 0) {
      $("slotList").innerHTML = '<li class="slots-empty">Ajoute ta première slot ci-dessus.</li>';
      return;
    }
    for (const slot of detail.slots) {
      const li = document.createElement("li");
      li.className = "slot";
      renderSlot(li, slot, cur);
      $("slotList").appendChild(li);
    }
  }

  function renderSlot(li, slot, currency) {
    const statusClass = slot.status === "collected" ? "collected" : slot.status === "in_progress" ? "in_progress" : "pending";
    const badgeClass = slot.status === "collected" ? "collected" : slot.status === "in_progress" ? "progress" : "pending";
    const badgeText = slot.status === "collected" ? fmt(slot.winAmount, currency) : slot.status === "in_progress" ? "En cours" : "En attente";

    let action = "";
    if (slot.status === "pending") action = `<button class="action play" data-action="start" title="Démarrer">${ICONS.play}</button>`;
    else if (slot.status === "in_progress") action = `<button class="action coins" data-action="collect" title="Collecter">${ICONS.coins}</button>`;
    else action = `<button class="action undo" data-action="reopen" title="Remettre en cours">${ICONS.undo}</button>`;
    action += `<button class="action x" data-action="delete" title="Supprimer">${ICONS.x}</button>`;

    li.innerHTML = `
      <span class="status-dot ${statusClass}"></span>
      <span class="name">${slot.isBounty ? ICONS.flame : ""}${escapeHtml(slot.slotName)}</span>
      <span class="stake">${fmt(slot.stake, currency)}</span>
      <span class="badge ${badgeClass}">${badgeText}</span>
      <span class="actions">${action}</span>`;

    li.querySelector('[data-action="start"]').addEventListener("click", () => setSlotStatus(slot, "in_progress"));
    li.querySelector('[data-action="collect"]').addEventListener("click", () => showGainInput(li, slot, currency));
    li.querySelector('[data-action="reopen"]').addEventListener("click", () => setSlotStatus(slot, "in_progress"));
    li.querySelector('[data-action="delete"]').addEventListener("click", () => deleteSlot(slot));
  }

  function showGainInput(li, slot, currency) {
    li.innerHTML = `
      <div class="gain-input">
        <input type="number" min="0" step="0.01" placeholder="Gain" autofocus />
        <button class="primary" data-action="confirm">OK</button>
        <button data-action="cancel">✕</button>
      </div>`;
    const input = li.querySelector("input");
    input.focus();
    const confirm = () => {
      const value = Number(String(input.value).replace(",", "."));
      if (!(value > 0)) return;
      setSlotStatus(slot, "collected", value);
    };
    li.querySelector('[data-action="confirm"]').addEventListener("click", confirm);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") confirm();
    });
    li.querySelector('[data-action="cancel"]').addEventListener("click", () => renderSlot(li, slot, currency));
  }

  async function loadHunts() {
    const data = await api("/api/hunts");
    state.hunts = data.hunts || [];
    const valid = state.hunts.some((h) => h.id === state.selectedId);
    if (!valid) state.selectedId = state.hunts[0]?.id ?? null;
    if (state.selectedId) await loadDetail(state.selectedId);
    else state.detail = null;
    render();
  }

  async function loadDetail(huntId) {
    state.selectedId = huntId;
    const data = await api(`/api/hunts/${huntId}`);
    state.detail = data.hunt;
    render();
  }

  async function setSlotStatus(slot, status, winAmount) {
    try {
      await api(`/api/hunts/${state.selectedId}/slots/${slot.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          slotName: slot.slotName,
          provider: slot.provider || "",
          stake: slot.stake,
          player: slot.player || "",
          status,
          isBounty: !!slot.isBounty,
          winAmount: status === "collected" ? winAmount || slot.winAmount : 0,
        }),
      });
      await loadDetail(state.selectedId);
    } catch (err) {
      showError(err.message);
    }
  }

  async function deleteSlot(slot) {
    try {
      await api(`/api/hunts/${state.selectedId}/slots/${slot.id}`, { method: "DELETE" });
      await loadDetail(state.selectedId);
    } catch (err) {
      showError(err.message);
    }
  }

  function setup() {
    $("closeBtn").addEventListener("click", () => panel.classList.remove("open"));

    $("refreshBtn").addEventListener("click", () => {
      if (!state.url) return;
      loadHunts().catch((err) => showError(err.message));
    });

    $("noHuntsRefresh").addEventListener("click", () => {
      if (!state.url) return;
      loadHunts().catch((err) => showError(err.message));
    });

    window.addEventListener("focus", () => {
      if (!state.url) return;
      loadHunts().catch(() => {});
    });

    $("settingsBtn").addEventListener("click", () => $("settings").classList.toggle("hidden"));

    $("saveUrl").addEventListener("click", async () => {
      const url = $("serverUrl").value.trim().replace(/\/+$/, "");
      if (!url) return;
      const raw = $("linkCode").value.trim().toUpperCase();
      const code = raw.replace(/[^A-Z0-9]/g, "").match(/[A-Z0-9]{4}/g)?.slice(0, 3).join("-") || "";
      state.url = url;
      state.linkCode = code;
      state.adminToken = $("adminToken").value.trim();
      await chrome.storage.local.set({ serverUrl: url, linkCode: code, adminToken: state.adminToken });
      $("settings").classList.add("hidden");
      try {
        await loadHunts();
      } catch (err) {
        showError(err.message);
      }
    });

    $("huntBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = $("huntMenu");
      const willOpen = menu.classList.contains("hidden");
      menu.classList.toggle("hidden", !willOpen);
      $("huntBtn").classList.toggle("open", willOpen);
    });

    document.addEventListener("click", () => {
      $("huntMenu").classList.add("hidden");
      $("huntBtn").classList.remove("open");
    });

    $("huntMenu").addEventListener("click", async (e) => {
      const btn = e.target.closest(".menu-item");
      if (!btn) return;
      $("huntMenu").classList.add("hidden");
      $("huntBtn").classList.remove("open");
      try {
        await loadDetail(btn.dataset.id);
      } catch (err) {
        showError(err.message);
      }
    });

    $("bountyToggle").addEventListener("click", () => {
      $("slotBounty").checked = !$("slotBounty").checked;
      $("bountyToggle").classList.toggle("on", $("slotBounty").checked);
    });

    $("addForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = $("slotName").value.trim();
      const stake = Number($("slotStake").value.replace(",", "."));
      if (!name || !(stake > 0)) return;
      const gain = Number($("slotGain").value.replace(",", "."));
      const isBounty = $("slotBounty").checked;
      const body = {
        slotName: name,
        provider: "",
        stake,
        isBounty,
        ...(gain > 0 ? { status: "collected", winAmount: gain } : {}),
      };
      try {
        await api(`/api/hunts/${state.selectedId}/slots`, { method: "POST", body: JSON.stringify(body) });
        $("slotName").value = "";
        $("slotStake").value = "";
        $("slotGain").value = "";
        $("slotBounty").checked = false;
        $("bountyToggle").classList.remove("on");
        $("slotName").focus();
        await loadDetail(state.selectedId);
      } catch (err) {
        showError(err.message);
      }
    });
  }

  /* ============ Toggle ============ */
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.classList.toggle("open");
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.type === "flambhub-toggle") {
      panel.classList.toggle("open");
    }
  });

  /* ============ Init ============ */
  setup();
  chrome.storage.local.get(["serverUrl", "linkCode", "adminToken"], async (result) => {
    if (result.serverUrl) {
      state.url = result.serverUrl;
      state.linkCode = result.linkCode || "";
      state.adminToken = result.adminToken || "";
      $("serverUrl").value = result.serverUrl;
      $("linkCode").value = result.linkCode || "";
      $("adminToken").value = result.adminToken || "";
      try {
        await loadHunts();
        if (state.hunts.length > 0) $("slotName").focus();
      } catch (err) {
        showError(err.message);
        $("settings").classList.remove("hidden");
      }
    } else {
      $("settings").classList.remove("hidden");
      $("serverUrl").focus();
    }
  });
})();
