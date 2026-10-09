(() => {
  if (window.top !== window) return;
  if (document.getElementById("flambhub-widget")) return;

  /* ============ Styles ============ */
  const CSS = `
  .fhb-root {
    --bg: #060a14;
    --surface: #0b1220;
    --surface-2: #0f1728;
    --surface-3: #1a2438;
    --border: #223252;
    --border-strong: #33507d;
    --fg: #e6edf7;
    --muted: #8fa3bd;
    --primary: #3b82f6;
    --primary-strong: #60a5fa;
    --cyan: #22d3ee;
    --success: #34d399;
    --danger: #f87171;
    background: radial-gradient(420px 220px at 90% -10%, rgba(59,130,246,0.35), transparent 60%), radial-gradient(300px 200px at -10% 110%, rgba(34,211,238,0.14), transparent 60%), var(--bg);
    color: var(--fg);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 12.5px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
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
    border-radius: 10px; color: var(--fg); padding: 9px 11px; font-size: 13px; outline: none;
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
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 13px;
    border: 1px dashed rgba(251,146,60,0.45);
    background: rgba(251,146,60,0.06);
    border-radius: 999px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 800;
    color: #fb923c;
    user-select: none;
    transition: color 0.15s, border-color 0.15s, background 0.15s, box-shadow 0.15s;
    flex: 0 0 auto;
  }
  .bounty-toggle input { display: none; }
  .bounty-toggle:hover { border-color: rgba(251,146,60,0.7); }
  .bounty-toggle.on {
    color: #fdba74;
    border-style: solid;
    border-color: rgba(251,146,60,0.65);
    background: linear-gradient(135deg, rgba(251,146,60,0.28), rgba(244,63,94,0.14));
    box-shadow: 0 0 14px rgba(251,146,60,0.25);
  }
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
  .slots { list-style: none; display: flex; flex-direction: column; gap: 5px; flex: 1; min-height: 0; overflow-y: auto; padding-bottom: 4px; }
  .slots-empty {
    text-align: center; color: var(--muted); font-size: 11.5px; padding: 18px 0;
    border: 1px dashed var(--border-strong); border-radius: 12px; margin-top: 2px;
  }
  .slot {
    display: flex; align-items: center; gap: 7px;
    background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
    padding: 8px 10px; transition: border-color 0.15s, background 0.15s;
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
  .stake-chip {
    flex: 0 0 auto;
    font-size: 10px;
    font-weight: 700;
    color: var(--muted);
    background: var(--surface-3);
    border-radius: 999px;
    padding: 2.5px 8px;
  }
  .mult-chip {
    flex: 0 0 auto;
    font-size: 10px;
    font-weight: 800;
    color: var(--cyan);
    background: rgba(34,211,238,0.12);
    border: 1px solid rgba(34,211,238,0.3);
    border-radius: 999px;
    padding: 2.5px 8px;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 9.5px;
    font-weight: 700;
    border-radius: 999px;
    padding: 2.5px 8px;
    flex: 0 0 auto;
  }
  .badge::before {
    content: "";
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
  }
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
  .hunt-fini {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 8px;
    padding: 10px 14px;
    border-radius: 12px;
    font-weight: 800;
    font-size: 12.5px;
    letter-spacing: 0.02em;
    color: #67e8f9;
    background: linear-gradient(90deg, rgba(34,211,238,0.1), rgba(59,130,246,0.14));
    border: 1px solid rgba(34,211,238,0.35);
    box-shadow: 0 0 16px rgba(34,211,238,0.1);
    transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
  }
  .hunt-fini:hover {
    background: linear-gradient(90deg, rgba(34,211,238,0.18), rgba(59,130,246,0.22));
    border-color: rgba(34,211,238,0.6);
    box-shadow: 0 0 22px rgba(34,211,238,0.2);
    filter: none;
  }
  .hunt-fini svg {
    width: 15px;
    height: 15px;
  }
  .open-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .open-title { font-weight: 800; font-size: 13.5px; flex: 1; }
  .open-progress {
    font-size: 11px; font-weight: 700; color: var(--cyan);
    background: rgba(34,211,238,0.1); border: 1px solid rgba(34,211,238,0.3);
    border-radius: 999px; padding: 2px 9px;
  }
  .open-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
    padding: 14px; display: flex; flex-direction: column; gap: 10px;
  }
  .open-name { font-size: 18px; font-weight: 800; }
  .open-meta { font-size: 11.5px; color: var(--muted); }
  .bounty-tag {
    font-size: 10px; font-weight: 800; color: #fb923c;
    background: rgba(251,146,60,0.12); border: 1px solid rgba(251,146,60,0.45);
    border-radius: 999px; padding: 3px 10px; align-self: flex-start;
  }
  .open-form { display: flex; gap: 6px; }
  .open-form input { flex: 1; font-size: 16px; padding: 10px 12px; }
  .open-actions { display: flex; gap: 6px; }
  .open-actions button { flex: 1; }
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
    width: 380px; height: min(600px, calc(100vh - 70px));
    border: 1px solid rgba(42,63,95,0.9); border-radius: 14px;
    overflow: hidden; background: #060a14;
    box-shadow: 0 18px 50px rgba(0,0,0,0.6);
    display: none;
  }
  .fhb-panel.open { display: flex; flex-direction: column; }
  `;

  const ICONS = {
    play: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="7 4 19 12 7 20 7 4"/></svg>',
    coins: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>',
    undo: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>',
    x: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    flame: '<svg class="bounty-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3.5 4 6 7 6 10.5a6 6 0 0 1-12 0C6 10 8.5 7 12 3Z"/><path d="M12 10.5c1.8 1.8 2.7 3.4 2.7 4.8A2.7 2.7 0 0 1 12 18a2.7 2.7 0 0 1-2.7-2.7c0-1.4.9-3 2.7-4.8Z"/></svg>',
  };

  const FLAME_SVG = `<svg width="20" height="20" viewBox="0 0 100 100" aria-hidden="true"><defs>
<linearGradient id="fhbh-rim" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#00C8FF"/>
<stop offset="30%" stop-color="#006CFF"/>
<stop offset="65%" stop-color="#003BFF"/>
<stop offset="100%" stop-color="#071A45"/>
</linearGradient>
<linearGradient id="fhbh-cyan" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#00C8FF"/>
<stop offset="100%" stop-color="#006CFF"/>
</linearGradient>
<radialGradient id="fhbh-halo" cx="50%" cy="50%" r="50%">
<stop offset="0%" stop-color="rgba(0,200,255,0.35)"/>
<stop offset="100%" stop-color="rgba(0,200,255,0)"/>
</radialGradient>
</defs>
<g transform="translate(4 4) scale(0.92)">
<g transform="translate(3.2 3.2) scale(1.3)">
<path d="M51.3344,58.3018c7.563-9.7894,4.0318-21.8721,2.4461-25.5688c-0.1799-0.4193-0.9302-0.5566-0.982-0.1006 c-0.1225,1.0797-0.4061,2.3611-2.0041,1.9736c-0.8203-0.1989-1.3479-0.556-1.3479-1.8802 c0.511-15.0494-10.5109-25.2968-14.3463-28.5356c-0.5103-0.4309-1.2668,0.0293-1.1587,0.7039 c2.456,15.3348-1.6079,14.2846-3.0986,13.8192c-0.2593-0.081-0.5408,0.0546-0.6603,0.3074 c-4.5882,9.7014-3.4112,14.2653-3.519,17.4455c0,0.2569,0,0.687,0,0.9581c0,1.746-1.4154,2.5822-2.5607,2.0714 c-2.0545-0.9163-2.4047-6.3729-2.4134-7.8235c-0.0041-0.6828-0.8094-0.8791-1.202-0.332 c-8.8048,12.267-2.3251,23.1974-0.0822,26.3171c0.6459,0.8984,0.9025,2.0748,0.5354,3.1298 c-0.0412,0.1183-0.0896,0.2352-0.1465,0.349c-0.3988,0.7981,0.6707,1.4,0.6707,1.4c1.3155,1.2339,5.4651,5.1806,14.2817,5.1805 c7.1344-0.0001,11.9478-3.0595,13.8297-4.7247c0.8829-0.7812,1.2761-0.8594,1.2732-1.6827 C50.8459,60.3243,50.8238,58.8066,51.3344,58.3018" fill="url(#fhbh-rim)"/>
<path d="M51.3344,58.3018c7.563-9.7894,4.0318-21.8721,2.4461-25.5688c-0.1799-0.4193-0.9302-0.5566-0.982-0.1006 c-0.1225,1.0797-0.4061,2.3611-2.0041,1.9736c-0.8203-0.1989-1.3479-0.556-1.3479-1.8802 c0.511-15.0494-10.5109-25.2968-14.3463-28.5356c-0.5103-0.4309-1.2668,0.0293-1.1587,0.7039 c2.456,15.3348-1.6079,14.2846-3.0986,13.8192c-0.2593-0.081-0.5408,0.0546-0.6603,0.3074 c-4.5882,9.7014-3.4112,14.2653-3.519,17.4455c0,0.2569,0,0.687,0,0.9581c0,1.746-1.4154,2.5822-2.5607,2.0714 c-2.0545-0.9163-2.4047-6.3729-2.4134-7.8235c-0.0041-0.6828-0.8094-0.8791-1.202-0.332 c-8.8048,12.267-2.3251,23.1974-0.0822,26.3171c0.6459,0.8984,0.9025,2.0748,0.5354,3.1298 c-0.0412,0.1183-0.0896,0.2352-0.1465,0.349c-0.3988,0.7981,0.6707,1.4,0.6707,1.4c1.3155,1.2339,5.4651,5.1806,14.2817,5.1805 c7.1344-0.0001,11.9478-3.0595,13.8297-4.7247c0.8829-0.7812,1.2761-0.8594,1.2732-1.6827 C50.8459,60.3243,50.8238,58.8066,51.3344,58.3018" fill="#050505" transform="translate(36 34) scale(0.9) translate(-36 -34)"/>
</g>
<g fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round">
<path d="M 41 84 Q 40 78 38 74"/>
<path d="M 59 84 Q 60 78 62 74"/>
</g>
<g fill="none" stroke="#00C8FF" stroke-width="1" opacity="0.7">
<path d="M 27 62 Q 29 50 32 42"/>
<path d="M 73 62 Q 71 50 68 42"/>
<path d="M 44 30 Q 46 36 48 40"/>
<path d="M 56 30 Q 54 36 52 40"/>
</g>
<g fill="none" stroke="#00C8FF" stroke-width="2.5" opacity="0.5" stroke-linejoin="round">
<polygon points="38 48, 48 46, 49 50, 39 52.5"/>
<polygon points="62 48, 52 46, 51 50, 61 52.5"/>
</g>
<g fill="url(#fhbh-cyan)" stroke="#00C8FF" stroke-width="0.6" stroke-linejoin="round">
<polygon points="38 48, 48 46, 49 50, 39 52.5"/>
<polygon points="62 48, 52 46, 51 50, 61 52.5"/>
</g>
<g fill="#000000" stroke="#006CFF" stroke-width="1.4" opacity="0.95" stroke-linejoin="round">
<polygon points="40 41, 48 46.5, 49 50.5, 39.5 44.5"/>
<polygon points="60 41, 52 46.5, 51 50.5, 60.5 44.5"/>
</g>
<path d="M 47.5 52 L 50 56 L 52.5 52" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M 50 56 Q 53 58 56 59" fill="none" stroke="#00C8FF" stroke-width="1" opacity="0.55"/>
<path d="M 41 64 Q 50 70 59 63" fill="none" stroke="#00C8FF" stroke-width="5" opacity="0.3" stroke-linecap="round"/>
<path d="M 41 64 Q 50 70 59 63" fill="none" stroke="url(#fhbh-cyan)" stroke-width="2.4" stroke-linecap="round"/>
</g></svg>`;

  /* ============ DOM ============ */
  const host = document.createElement("div");
  host.id = "flambhub-widget";
  const shadow = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = CSS;

  const button = document.createElement("button");
  button.className = "fhb-btn";
  button.title = "FlambHub — Bonus Hunt";
  button.innerHTML = `<svg viewBox="0 0 100 100" fill="none"><defs><linearGradient id="fhbg-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00C8FF"/><stop offset="30%" stop-color="#006CFF"/><stop offset="65%" stop-color="#003BFF"/><stop offset="100%" stop-color="#071A45"/></linearGradient><linearGradient id="fhbg-cyan" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00C8FF"/><stop offset="100%" stop-color="#006CFF"/></linearGradient><radialGradient id="fhbg-halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(0,200,255,0.35)"/><stop offset="100%" stop-color="rgba(0,200,255,0)"/></radialGradient></defs><g transform="translate(4 4) scale(0.92)"><g transform="translate(3.2 3.2) scale(1.3)"><path d="M51.3344,58.3018c7.563-9.7894,4.0318-21.8721,2.4461-25.5688c-0.1799-0.4193-0.9302-0.5566-0.982-0.1006 c-0.1225,1.0797-0.4061,2.3611-2.0041,1.9736c-0.8203-0.1989-1.3479-0.556-1.3479-1.8802 c0.511-15.0494-10.5109-25.2968-14.3463-28.5356c-0.5103-0.4309-1.2668,0.0293-1.1587,0.7039 c2.456,15.3348-1.6079,14.2846-3.0986,13.8192c-0.2593-0.081-0.5408,0.0546-0.6603,0.3074 c-4.5882,9.7014-3.4112,14.2653-3.519,17.4455c0,0.2569,0,0.687,0,0.9581c0,1.746-1.4154,2.5822-2.5607,2.0714 c-2.0545-0.9163-2.4047-6.3729-2.4134-7.8235c-0.0041-0.6828-0.8094-0.8791-1.202-0.332 c-8.8048,12.267-2.3251,23.1974-0.0822,26.3171c0.6459,0.8984,0.9025,2.0748,0.5354,3.1298 c-0.0412,0.1183-0.0896,0.2352-0.1465,0.349c-0.3988,0.7981,0.6707,1.4,0.6707,1.4c1.3155,1.2339,5.4651,5.1806,14.2817,5.1805 c7.1344-0.0001,11.9478-3.0595,13.8297-4.7247c0.8829-0.7812,1.2761-0.8594,1.2732-1.6827 C50.8459,60.3243,50.8238,58.8066,51.3344,58.3018" fill="url(#fhbg-rim)"/><path d="M51.3344,58.3018c7.563-9.7894,4.0318-21.8721,2.4461-25.5688c-0.1799-0.4193-0.9302-0.5566-0.982-0.1006 c-0.1225,1.0797-0.4061,2.3611-2.0041,1.9736c-0.8203-0.1989-1.3479-0.556-1.3479-1.8802 c0.511-15.0494-10.5109-25.2968-14.3463-28.5356c-0.5103-0.4309-1.2668,0.0293-1.1587,0.7039 c2.456,15.3348-1.6079,14.2846-3.0986,13.8192c-0.2593-0.081-0.5408,0.0546-0.6603,0.3074 c-4.5882,9.7014-3.4112,14.2653-3.519,17.4455c0,0.2569,0,0.687,0,0.9581c0,1.746-1.4154,2.5822-2.5607,2.0714 c-2.0545-0.9163-2.4047-6.3729-2.4134-7.8235c-0.0041-0.6828-0.8094-0.8791-1.202-0.332 c-8.8048,12.267-2.3251,23.1974-0.0822,26.3171c0.6459,0.8984,0.9025,2.0748,0.5354,3.1298 c-0.0412,0.1183-0.0896,0.2352-0.1465,0.349c-0.3988,0.7981,0.6707,1.4,0.6707,1.4c1.3155,1.2339,5.4651,5.1806,14.2817,5.1805 c7.1344-0.0001,11.9478-3.0595,13.8297-4.7247c0.8829-0.7812,1.2761-0.8594,1.2732-1.6827 C50.8459,60.3243,50.8238,58.8066,51.3344,58.3018" fill="#050505" transform="translate(36 34) scale(0.9) translate(-36 -34)"/></g><g fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round"><path d="M 41 84 Q 40 78 38 74"/><path d="M 59 84 Q 60 78 62 74"/></g><g fill="none" stroke="#00C8FF" stroke-width="1" opacity="0.7"><path d="M 27 62 Q 29 50 32 42"/><path d="M 73 62 Q 71 50 68 42"/><path d="M 44 30 Q 46 36 48 40"/><path d="M 56 30 Q 54 36 52 40"/></g><g fill="none" stroke="#00C8FF" stroke-width="2.5" opacity="0.5" stroke-linejoin="round"><polygon points="38 48, 48 46, 49 50, 39 52.5"/><polygon points="62 48, 52 46, 51 50, 61 52.5"/></g><g fill="url(#fhbg-cyan)" stroke="#00C8FF" stroke-width="0.6" stroke-linejoin="round"><polygon points="38 48, 48 46, 49 50, 39 52.5"/><polygon points="62 48, 52 46, 51 50, 61 52.5"/></g><g fill="#000000" stroke="#006CFF" stroke-width="1.4" opacity="0.95" stroke-linejoin="round"><polygon points="40 41, 48 46.5, 49 50.5, 39.5 44.5"/><polygon points="60 41, 52 46.5, 51 50.5, 60.5 44.5"/></g><path d="M 47.5 52 L 50 56 L 52.5 52" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M 50 56 Q 53 58 56 59" fill="none" stroke="#00C8FF" stroke-width="1" opacity="0.55"/><path d="M 41 64 Q 50 70 59 63" fill="none" stroke="#00C8FF" stroke-width="5" opacity="0.3" stroke-linecap="round"/><path d="M 41 64 Q 50 70 59 63" fill="none" stroke="url(#fhbg-cyan)" stroke-width="2.4" stroke-linecap="round"/></g></svg>`;

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

    <button id="startOpen" class="hunt-fini hidden">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v6a5 5 0 0 1-10 0Z"/><path d="M7 6H4.5a2.5 2.5 0 0 0 0 5H7M17 6h2.5a2.5 2.5 0 0 1 0 5H17"/><path d="M12 15v3M8 21h8M10 18h4"/></svg>
      Hunt fini — Ouvrir les bonus
    </button>

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

    <div id="openMode" class="hidden">
      <div class="open-head">
        <span class="open-title">Ouverture des bonus</span>
        <span id="openProgress" class="open-progress">0/0</span>
        <button id="openExit" class="icon" title="Quitter l'ouverture">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="open-card">
        <div class="open-name" id="openName">—</div>
        <div class="open-meta" id="openMeta"></div>
        <span id="openBounty" class="bounty-tag hidden">Bounty</span>
        <div class="open-form">
          <input id="openResult" type="number" min="0" step="0.01" placeholder="Résultat" />
          <button id="openValidate" class="primary">Valider</button>
        </div>
        <div class="open-actions">
          <button id="openSkip">Passer à la fin</button>
        </div>
      </div>
      <div id="openDone" class="card center-card hidden">
        <div class="empty-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v6a5 5 0 0 1-10 0Z"/><path d="M7 6H4.5a2.5 2.5 0 0 0 0 5H7M17 6h2.5a2.5 2.5 0 0 1 0 5H17"/><path d="M12 15v3M8 21h8M10 18h4"/></svg>
        </div>
        <h2>Tous les bonus sont ouverts</h2>
        <p class="muted">Retourne sur le site pour voir les statistiques et le RTP.</p>
        <button id="openDoneClose" class="primary wide">Terminer</button>
      </div>
    </div>
  `;

  panel.appendChild(root);
  shadow.appendChild(style);
  shadow.appendChild(button);
  shadow.appendChild(panel);
  document.documentElement.appendChild(host);

  /* ============ Garde anti-invalidation ============ */
  function onContextInvalidated() {
    try {
      if (!sessionStorage.getItem("flambhub-reloaded")) {
        sessionStorage.setItem("flambhub-reloaded", "1");
        location.reload();
        return;
      }
    } catch {
      /* ignorer */
    }
    try {
      root.innerHTML = "";
      const errBox = document.createElement("div");
      errBox.className = "alert";
      errBox.style.margin = "10px";
      errBox.textContent =
        "Extension rechargée : actualise la page (Cmd + R) pour activer la nouvelle version.";
      root.appendChild(errBox);
      panel.classList.add("open");
    } catch {
      /* ignorer */
    }
  }

  function isInvalidation(err) {
    const msg = (err && err.message ? err.message : String(err)).toLowerCase();
    return (
      msg.includes("extension context invalidated") ||
      msg.includes("invalid extension context") ||
      msg.includes("context invalidated")
    );
  }

  /* ============ Logique ============ */
  const $ = (id) => shadow.getElementById(id);

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

  function api(path, options = {}) {
    // Les requêtes passent par le service worker : elles échappent à la CSP
    // des sites visités (Stake, etc.).
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage({ type: "flambhub-api", path, options }, (resp) => {
          if (chrome.runtime.lastError) {
            if (isInvalidation(chrome.runtime.lastError)) {
              onContextInvalidated();
              reject(new Error("Extension rechargée : la page se rafraîchit."));
              return;
            }
            reject(new Error("Extension mise à jour : recharge la page (Cmd + R) puis réessaie."));
            return;
          }
          if (!resp) {
            reject(new Error("Pas de réponse de l'extension."));
            return;
          }
          if (!resp.ok) {
            const serverError = resp.data && resp.data.error ? resp.data.error : null;
            reject(new Error(serverError || resp.error || `Erreur serveur (${resp.status})`));
            return;
          }
          resolve(resp.data);
        });
      } catch (err) {
        if (isInvalidation(err)) {
          onContextInvalidated();
          reject(new Error("Extension rechargée : la page se rafraîchit."));
          return;
        }
        reject(err);
      }
    });
  }

  function render() {
    clearError();
    const hasHunts = state.hunts.length > 0;
    $("noHunts").classList.toggle("hidden", hasHunts || !state.url);
    $("startOpen").classList.toggle("hidden", !hasHunts || !state.url);
    const openingActive = !$("openMode").classList.contains("hidden");
    if (openingActive) {
      if (state.detail) {
        renderOpening();
        return;
      }
      $("openMode").classList.add("hidden");
    }
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

    if (state.detail) {
      renderDetail();
    } else {
      // Plus de hunt sélectionné : ne pas laisser traîner d'anciens bonus.
      $("slotList").innerHTML = "";
    }
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
        <span>Gagné ${fmt(detail.stats.totalWon, cur)} · Moy ${detail.stats.averageMultiplier != null ? detail.stats.averageMultiplier.toFixed(1) + "x" : "—"}</span>
        <span>${detail.stats.collectedCount}/${detail.stats.slotCount} collectées · ${detail.stats.bountyCount} bounty · Tot ${detail.stats.totalMultiplier != null ? detail.stats.totalMultiplier.toFixed(1) + "x" : "—"}</span>
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
      <span class="stake-chip">${fmt(slot.stake, currency)}</span>
      ${
        slot.status === "collected" && slot.stake > 0
          ? `<span class="mult-chip">${(slot.winAmount / slot.stake).toFixed(1)}x</span>`
          : ""
      }
      <span class="badge ${badgeClass}">${badgeText}</span>
      <span class="actions">${action}</span>`;

    li.querySelector('[data-action="start"]')?.addEventListener("click", () => setSlotStatus(slot, "in_progress"));
    li.querySelector('[data-action="collect"]')?.addEventListener("click", () => showGainInput(li, slot, currency));
    li.querySelector('[data-action="reopen"]')?.addEventListener("click", () => setSlotStatus(slot, "in_progress"));
    li.querySelector('[data-action="delete"]')?.addEventListener("click", () => deleteSlot(slot));
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
      if (String(input.value).trim() === "") return;
      const value = Number(String(input.value).replace(",", "."));
      if (!Number.isFinite(value) || value < 0) return;
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

  const opening = { queue: [], index: 0, currentRenderedId: null };

  function currentOpenSlot() {
    if (!state.detail) return null;
    // Avance au-delà des slots déjà collectés : après validation,
    // on passe directement au bonus suivant.
    while (opening.index < opening.queue.length) {
      const slot = state.detail.slots.find((s) => s.id === opening.queue[opening.index]);
      if (!slot) {
        opening.index += 1;
        continue;
      }
      if (slot.status !== "collected") return slot;
      opening.index += 1;
    }
    return null;
  }

  function enterOpening() {
    if (!state.detail) return;
    const remaining = state.detail.slots.filter((s) => s.status !== "collected");
    if (remaining.length === 0) return;
    opening.queue = remaining.map((s) => s.id);
    opening.index = 0;
    opening.currentRenderedId = null;
    $("openMode").classList.remove("hidden");
    $("huntBar").classList.add("hidden");
    $("startOpen").classList.add("hidden");
    $("profit").classList.add("hidden");
    $("addForm").classList.add("hidden");
    $("slotList").classList.add("hidden");
    renderOpening();
  }

  function renderOpening() {
    const detail = state.detail;
    if (!detail) return;
    const total = detail.slots.length;
    const done = detail.slots.filter((s) => s.status === "collected").length;
    $("openProgress").textContent = `${done}/${total}`;
    const slot = currentOpenSlot();
    if (!slot) {
      opening.currentRenderedId = null;
      $("openDone").classList.remove("hidden");
      return;
    }
    $("openDone").classList.add("hidden");
    if (opening.currentRenderedId !== slot.id) {
      opening.currentRenderedId = slot.id;
      $("openName").textContent = slot.slotName;
      $("openMeta").textContent = `Mise ${fmt(slot.stake, detail.currency)}${slot.player ? " · " + slot.player : ""}`;
      $("openBounty").classList.toggle("hidden", !slot.isBounty);
      $("openResult").value = "";
      $("openResult").focus();
    }
  }

  async function validateOpen() {
    const slot = currentOpenSlot();
    if (!slot) return;
    if (String($("openResult").value).trim() === "") return;
    const value = Number(String($("openResult").value).replace(",", "."));
    if (!Number.isFinite(value) || value < 0) return;
    try {
      await api(`/api/hunts/${state.selectedId}/slots/${slot.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          slotName: slot.slotName,
          provider: slot.provider || "",
          stake: slot.stake,
          player: slot.player || "",
          status: "collected",
          isBounty: !!slot.isBounty,
          winAmount: value,
        }),
      });
      await loadDetail(state.selectedId);
      renderOpening();
    } catch (err) {
      showError(err.message);
    }
  }

  function skipOpen() {
    const current = opening.queue[opening.index];
    if (current === undefined) return;
    opening.queue.splice(opening.index, 1);
    opening.queue.push(current);
    renderOpening();
  }

  function exitOpening() {
    $("openMode").classList.add("hidden");
    render();
  }

  function setup() {
    $("closeBtn").addEventListener("click", () => panel.classList.remove("open"));

    $("startOpen").addEventListener("click", enterOpening);
    $("openValidate").addEventListener("click", () => void validateOpen());
    $("openResult").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        void validateOpen();
      }
    });
    $("openSkip").addEventListener("click", skipOpen);
    $("openExit").addEventListener("click", exitOpening);
    $("openDoneClose").addEventListener("click", exitOpening);

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
      const isBounty = $("slotBounty").checked;
      const body = {
        slotName: name,
        provider: "",
        stake,
        isBounty,
      };
      try {
        await api(`/api/hunts/${state.selectedId}/slots`, { method: "POST", body: JSON.stringify(body) });
        $("slotName").value = "";
        $("slotStake").value = "";
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
    e.preventDefault();
    panel.classList.toggle("open");
  });
  button.addEventListener("pointerup", (e) => {
    e.stopPropagation();
  });

  try {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg && msg.type === "flambhub-toggle") {
        panel.classList.toggle("open");
      }
    });
  } catch (err) {
    if (isInvalidation(err)) onContextInvalidated();
  }

  /* ============ Init ============ */
  try {
    setup();
    console.log("[FlambHub] widget injecté sur", location.hostname);
  } catch (err) {
    console.error("[FlambHub] erreur d'initialisation :", err);
    root.innerHTML = "";
    const errBox = document.createElement("div");
    errBox.className = "alert";
    errBox.style.margin = "10px";
    errBox.textContent = "Erreur FlambHub : " + (err && err.message ? err.message : err);
    root.appendChild(errBox);
    panel.classList.add("open");
    return;
  }

  try {
    // Synchronisation temps réel : recharge silencieuse toutes les 4 s.
  setInterval(() => {
    if (!panel.classList.contains("open") || !state.url) return;
    if (document.visibilityState !== "visible") return;
    const el = document.activeElement;
    if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA") && root.contains(el)) {
      return;
    }
    loadHunts().catch(() => {});
  }, 4000);

  chrome.storage.local.get(["serverUrl", "linkCode", "adminToken"], async (result) => {
    try {
      if (result.serverUrl) {
        state.url = result.serverUrl;
        state.linkCode = result.linkCode || "";
        state.adminToken = result.adminToken || "";
        $("serverUrl").value = result.serverUrl;
        $("linkCode").value = result.linkCode || "";
        $("adminToken").value = result.adminToken || "";
        await loadHunts();
        if (state.hunts.length > 0) $("slotName").focus();
      } else {
        $("settings").classList.remove("hidden");
        $("serverUrl").focus();
        panel.classList.add("open");
      }
    } catch (err) {
      if (isInvalidation(err)) {
        onContextInvalidated();
        return;
      }
      showError(err.message);
      $("settings").classList.remove("hidden");
      panel.classList.add("open");
    }
    });
  } catch (err) {
    if (isInvalidation(err)) onContextInvalidated();
  }
})();
