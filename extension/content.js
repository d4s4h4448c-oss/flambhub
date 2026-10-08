(() => {
  if (window.top !== window) return;
  if (document.getElementById("flambhub-widget")) return;

  const host = document.createElement("div");
  host.id = "flambhub-widget";
  const shadow = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = `
    .fhb-btn {
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 2147483647;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(160deg, rgba(59,130,246,0.25), rgba(13,19,32,0.95));
      border: 1px solid rgba(96,165,250,0.5);
      box-shadow: 0 0 18px rgba(59,130,246,0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: transform 0.15s ease, filter 0.15s ease;
    }
    .fhb-btn:hover {
      transform: scale(1.08);
      filter: brightness(1.2);
    }
    .fhb-btn svg {
      width: 22px;
      height: 22px;
      display: block;
    }
    .fhb-panel {
      position: fixed;
      top: 58px;
      right: 10px;
      z-index: 2147483646;
      width: 360px;
      height: min(560px, calc(100vh - 70px));
      border: 1px solid rgba(42,63,95,0.9);
      border-radius: 14px;
      overflow: hidden;
      background: #05070c;
      box-shadow: 0 18px 50px rgba(0,0,0,0.6);
      display: none;
    }
    .fhb-panel.open {
      display: block;
    }
    .fhb-panel iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }
  `;

  const button = document.createElement("button");
  button.className = "fhb-btn";
  button.title = "FlambHub — Bonus Hunt";
  button.innerHTML =
    '<svg viewBox="0 0 100 100" fill="none"><defs><linearGradient id="fhbf" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#67e8f9"/><stop offset="55%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient></defs><path fill="url(#fhbf)" fill-rule="evenodd" d="M50 6 C41 13 33 22 29 33 C25 44 23 55 23 64 C23 74 25 82 29 88 Q37 83 44 84 Q47 90 50 93 Q53 90 56 84 Q63 83 71 88 C75 82 77 74 77 64 C77 55 75 44 71 33 C67 22 59 13 50 6 Z M38 48 48 46 49 50 39 52.5 Z M62 48 52 46 51 50 61 52.5 Z"/></svg>';

  const panel = document.createElement("div");
  panel.className = "fhb-panel";

  let iframe = null;
  const ensureIframe = () => {
    if (iframe) return;
    iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("sidepanel.html");
    iframe.allow = "clipboard-write";
    panel.appendChild(iframe);
  };

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = panel.classList.toggle("open");
    if (open) ensureIframe();
  });

  shadow.appendChild(style);
  shadow.appendChild(button);
  shadow.appendChild(panel);
  document.documentElement.appendChild(host);

  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "flambhub-close") {
      panel.classList.remove("open");
    }
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.type === "flambhub-toggle") {
      const open = panel.classList.toggle("open");
      if (open) ensureIframe();
    }
  });
})();
