const $ = (id) => document.getElementById(id);


const I = {
  play: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="7 4 19 12 7 20 7 4"/></svg>',
  flame: '<svg class="bounty-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3.5 4 6 7 6 10.5a6 6 0 0 1-12 0C6 10 8.5 7 12 3Z"/><path d="M12 10.5c1.8 1.8 2.7 3.4 2.7 4.8A2.7 2.7 0 0 1 12 18a2.7 2.7 0 0 1-2.7-2.7c0-1.4.9-3 2.7-4.8Z"/></svg>',
  coins: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>',
  undo: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>',
  x: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
};

const state = {
  url: "",
  linkCode: "",
  hunts: [],
  selectedId: null,
  detail: null,
};

async function api(path, options = {}) {
  if (!state.url) throw new Error("Configure l'URL du serveur (réglages).");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.linkCode) headers["x-flamb-code"] = state.linkCode.toUpperCase();
  const res = await fetch(state.url + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Erreur serveur (${res.status})`);
  return data;
}

function fmt(value, currency) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function showError(message) {
  const el = $("error");
  el.textContent = message;
  el.classList.remove("hidden");
}

function clearError() {
  $("error").classList.add("hidden");
}

function escapeHtml(text) {
  return String(text).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

/* ---------- Rendu ---------- */

function render() {
  clearError();
  const hasHunts = state.hunts.length > 0;

  $("noHunts").classList.toggle("hidden", hasHunts || !state.url);
  $("addForm").classList.toggle("hidden", !hasHunts || !state.url);
  $("profit").classList.toggle("hidden", !state.detail);
  $("huntBar").classList.toggle("hidden", !hasHunts || !state.url);

  const current =
    state.hunts.find((h) => h.id === state.selectedId) || state.hunts[0] || null;
  $("huntLabel").textContent = current ? current.name : "—";

  $("huntMenu").innerHTML = state.hunts
    .map(
      (h) => `<li><button class="menu-item ${h.id === state.selectedId ? "active" : ""}" data-id="${h.id}">
        <span class="mi-name">${escapeHtml(h.name)}</span>
        <span class="mi-count">${h.stats.slotCount}</span>
      </button></li>`,
    )
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
    </div>
  `;

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
    $("slotList").innerHTML =
      '<li class="slots-empty">Ajoute ta première slot ci-dessus.</li>';
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
  const statusClass =
    slot.status === "collected"
      ? "collected"
      : slot.status === "in_progress"
        ? "in_progress"
        : "pending";
  const badgeClass =
    slot.status === "collected"
      ? "collected"
      : slot.status === "in_progress"
        ? "progress"
        : "pending";
  const badgeText =
    slot.status === "collected"
      ? fmt(slot.winAmount, currency)
      : slot.status === "in_progress"
        ? "En cours"
        : "En attente";

  let action = "";
  if (slot.status === "pending") {
    action = `<button class="action play" data-action="start" title="Démarrer">${I.play}</button>`;
  } else if (slot.status === "in_progress") {
    action = `<button class="action coins" data-action="collect" title="Collecter">${I.coins}</button>`;
  } else {
    action = `<button class="action undo" data-action="reopen" title="Remettre en cours">${I.undo}</button>`;
  }
  action += `<button class="action x" data-action="delete" title="Supprimer">${I.x}</button>`;

  li.innerHTML = `
    <span class="status-dot ${statusClass}"></span>
    <span class="name">${slot.isBounty ? I.flame : ""}${escapeHtml(slot.slotName)}</span>
    <span class="stake">${fmt(slot.stake, currency)}</span>
    <span class="badge ${badgeClass}">${badgeText}</span>
    <span class="actions">${action}</span>
  `;

  li.querySelector('[data-action="start"]')?.addEventListener("click", () =>
    setSlotStatus(slot, "in_progress"),
  );
  li.querySelector('[data-action="collect"]')?.addEventListener("click", () =>
    showGainInput(li, slot, currency),
  );
  li.querySelector('[data-action="reopen"]')?.addEventListener("click", () =>
    setSlotStatus(slot, "in_progress"),
  );
  li.querySelector('[data-action="delete"]')?.addEventListener("click", () =>
    deleteSlot(slot),
  );
}

function showGainInput(li, slot, currency) {
  li.innerHTML = `
    <div class="gain-input">
      <input type="number" min="0" step="0.01" placeholder="Gain" autofocus />
      <button class="primary" data-action="confirm">OK</button>
      <button data-action="cancel">✕</button>
    </div>
  `;
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
  li.querySelector('[data-action="cancel"]').addEventListener("click", () =>
    renderSlot(li, slot, currency),
  );
}

/* ---------- Actions ---------- */

async function loadHunts() {
  const data = await api("/api/hunts");
  state.hunts = data.hunts || [];
  const valid = state.hunts.some((h) => h.id === state.selectedId);
  if (!valid) {
    state.selectedId = state.hunts[0]?.id ?? null;
  }
  if (state.selectedId) {
    await loadDetail(state.selectedId);
  } else {
    state.detail = null;
  }
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
    await api(`/api/hunts/${state.selectedId}/slots/${slot.id}`, {
      method: "DELETE",
    });
    await loadDetail(state.selectedId);
  } catch (err) {
    showError(err.message);
  }
}

/* ---------- Init ---------- */

function setup() {
  $("refreshBtn").addEventListener("click", () => {
    if (!state.url) return;
    loadHunts().catch((err) => showError(err.message));
  });

  window.addEventListener("focus", () => {
    if (!state.url) return;
    loadHunts().catch(() => {});
  });

  $("settingsBtn").addEventListener("click", () =>
    $("settings").classList.toggle("hidden"),
  );

  $("saveUrl").addEventListener("click", async () => {
    const url = $("serverUrl").value.trim().replace(/\/+$/, "");
    if (!url) return;
    const raw = $("linkCode").value.trim().toUpperCase();
    const code = raw.replace(/[^A-Z0-9]/g, "").match(/[A-Z0-9]{4}/g)?.slice(0, 3).join("-") || "";
    state.url = url;
    state.linkCode = code;
    await chrome.storage.local.set({ serverUrl: url, linkCode: code });
    $("settings").classList.add("hidden");
    try {
      await loadHunts();
    } catch (err) {
      showError(err.message);
    }
  });

  $("noHuntsRefresh").addEventListener("click", () => {
    if (!state.url) return;
    loadHunts().catch((err) => showError(err.message));
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
      await api(`/api/hunts/${state.selectedId}/slots`, {
        method: "POST",
        body: JSON.stringify(body),
      });
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

chrome.storage.local.get(["serverUrl", "linkCode"], async (result) => {
  setup();
  if (result.serverUrl) {
    state.url = result.serverUrl;
    state.linkCode = result.linkCode || "";
    $("serverUrl").value = result.serverUrl;
    $("linkCode").value = result.linkCode || "";
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
