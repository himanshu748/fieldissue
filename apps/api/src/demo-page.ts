// The landing page and browser demo, served by the API itself at GET /. It
// holds no secrets and calls only the public API routes, so it behaves exactly
// like any other HTTP client. With API_ACCESS_TOKEN set, the visitor pastes the
// shared demo token; it is kept in sessionStorage and never baked into this
// file. Everything (CSS, scripts, artwork) is served from this origin: styles
// are inline, artwork is inline SVG, and the two scripts are /landing.js
// (motion only) and /demo.js (the working demo).
export const demoPageCsp = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "connect-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join("; ");

// One illustrated scene drawn twice: the first visit and the revisit. Plain
// strings so both copies share the same geometry.
const benchFrame = `
  <rect width="320" height="220" fill="#dfe8d3"/>
  <circle cx="262" cy="46" r="20" fill="#f6e7a8"/>
  <path d="M0 132 Q60 112 120 126 T240 120 T320 124 V220 H0Z" fill="#9cc77a"/>
  <path d="M0 150 H320 V220 H0Z" fill="#78ad57"/>
  <path d="M0 176 L320 168 V196 L0 206Z" fill="#cfc6b2"/>
  <rect x="34" y="84" width="10" height="70" rx="3" fill="#6b4a2f"/>
  <circle cx="39" cy="70" r="30" fill="#4f8d45"/>
  <circle cx="58" cy="88" r="20" fill="#5f9c50"/>
  <circle cx="20" cy="90" r="18" fill="#5f9c50"/>
  <ellipse cx="160" cy="171" rx="78" ry="6" fill="#33503a" opacity=".28"/>
  <rect x="101" y="86" width="6" height="84" rx="2" fill="#23322a"/>
  <rect x="213" y="86" width="6" height="84" rx="2" fill="#23322a"/>
  <rect x="92" y="122" width="22" height="5" rx="2" fill="#23322a"/>
  <rect x="206" y="122" width="22" height="5" rx="2" fill="#23322a"/>
  <rect x="96" y="90" width="128" height="9" rx="2" fill="#b9773f"/>
  <rect x="94" y="129" width="132" height="7" rx="2" fill="#b9773f"/>`;

export const demoPageHtml = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="FieldIssue: walk your street, photograph what's broken, and come back to prove it got fixed. Open source, with an open-weight Gemma vision model.">
<meta name="theme-color" content="#0e1a13">
<title>FieldIssue: walk your street, prove it got fixed</title>
<script src="/landing.js"></script>
<style>
  :root {
    --night:#0e1a13; --night2:#14251b; --night3:#1b3123; --cream:#f3efe4; --dim:#b8c5b2; --lime:#c6f36b; --lime2:#9fd94a;
    --ink:#17231b; --muted:#4c5c51; --line:#d5dccf; --paper:#f5f3ea; --card:#fff; --accent:#2a7347; --warn:#7a4f00; --warnbg:#fff2d6;
    --r:18px; --ease:cubic-bezier(.2,.7,.2,1);
    --sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    --serif: "Iowan Old Style", "Palatino Linotype", Palatino, Charter, Georgia, ui-serif, serif;
    --mono: ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  }
  * { box-sizing:border-box; }
  html { scroll-behavior:smooth; -webkit-text-size-adjust:100%; }
  body { margin:0; font:16px/1.55 var(--sans); color:var(--cream); background:var(--night); overflow-x:hidden; }
  body::before { content:""; position:fixed; inset:0; pointer-events:none; z-index:50; opacity:.07;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
  a { color:inherit; }
  :focus-visible { outline:3px solid var(--lime); outline-offset:3px; border-radius:6px; }
  .skip { position:absolute; left:12px; top:-60px; background:var(--lime); color:var(--night); padding:10px 14px; border-radius:10px; font-weight:700; z-index:60; }
  .skip:focus { top:12px; }
  .wrap { max-width:1160px; margin:0 auto; padding:0 20px; }

  /* Top bar */
  .bar { position:sticky; top:0; z-index:40; background:rgba(14,26,19,.78); -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px); border-bottom:1px solid rgba(243,239,228,.08); }
  .bar .wrap { display:flex; align-items:center; justify-content:space-between; height:60px; gap:12px; }
  .brand { display:flex; align-items:center; gap:9px; font-weight:800; letter-spacing:-.02em; text-decoration:none; font-size:1.08rem; }
  .brand svg { width:26px; height:26px; flex:none; }
  .bar nav { display:flex; align-items:center; gap:6px; }
  .bar nav a { text-decoration:none; font-size:.92rem; font-weight:600; padding:8px 10px; border-radius:99px; color:var(--dim); }
  .bar nav a:hover { color:var(--cream); }
  .bar nav a.cta { background:var(--lime); color:var(--night); padding:8px 14px; }
  .bar nav a.cta:hover { color:var(--night); background:#d6fa8f; }
  .bar nav .hide-sm, .hide-xs { display:none; }

  /* Hero */
  .hero { position:relative; padding:40px 0 64px; overflow:hidden; isolation:isolate; }
  .hero::before { content:""; position:absolute; inset:-20% -30% auto; height:120%; z-index:-1;
    background:radial-gradient(40% 45% at 18% 20%, rgba(198,243,107,.20), transparent 70%), radial-gradient(45% 50% at 85% 35%, rgba(42,115,71,.45), transparent 70%), radial-gradient(50% 40% at 50% 100%, rgba(96,170,120,.18), transparent 70%);
    animation:drift 18s var(--ease) infinite alternate; }
  @keyframes drift { to { transform:translate3d(0,3%,0) scale(1.06); } }
  .hero .wrap { display:grid; gap:40px; }
  .eyebrow { display:inline-flex; align-items:center; gap:8px; font-size:.7rem; font-weight:700; letter-spacing:.05em; text-transform:uppercase; color:var(--lime); border:1px solid rgba(198,243,107,.35); border-radius:99px; padding:6px 12px; margin:0 0 18px; }
  .eyebrow i { flex:none; width:7px; height:7px; border-radius:50%; background:var(--lime); box-shadow:0 0 0 0 rgba(198,243,107,.6); animation:ping 2.4s infinite; }
  @keyframes ping { 70% { box-shadow:0 0 0 9px rgba(198,243,107,0); } 100% { box-shadow:0 0 0 0 rgba(198,243,107,0); } }
  h1 { font-size:clamp(2.2rem, 9.4vw, 5.4rem); line-height:.96; letter-spacing:-.045em; font-weight:850; margin:0; text-wrap:balance; }
  h1 .line { display:block; }
  h1 em { font-family:var(--serif); font-style:italic; font-weight:700; letter-spacing:-.02em; color:var(--lime); position:relative; white-space:nowrap; }
  h1 em svg { position:absolute; left:-2%; bottom:-.12em; width:104%; height:.32em; overflow:visible; }
  h1 em svg path { fill:none; stroke:var(--lime); stroke-width:5; stroke-linecap:round; stroke-dasharray:420; stroke-dashoffset:0; }
  .js h1 em svg path { stroke-dashoffset:420; animation:draw 1.1s .9s var(--ease) forwards; }
  @keyframes draw { to { stroke-dashoffset:0; } }
  .lead { font-size:1.08rem; color:var(--dim); max-width:36em; margin:22px 0 0; }
  .lead strong { color:var(--cream); font-weight:650; }
  .ctas { display:flex; flex-wrap:wrap; gap:12px; margin-top:28px; }
  .btn { display:inline-flex; align-items:center; gap:10px; min-height:48px; padding:12px 20px; border-radius:99px; font-weight:700; text-decoration:none; transition:transform .25s var(--ease), background .25s, box-shadow .25s; }
  .btn.primary { background:var(--lime); color:var(--night); box-shadow:0 10px 30px -10px rgba(198,243,107,.6); }
  .btn.primary:hover { transform:translateY(-2px); background:#d6fa8f; }
  .btn.ghost { border:1px solid rgba(243,239,228,.25); color:var(--cream); }
  .btn.ghost:hover { background:rgba(243,239,228,.08); transform:translateY(-2px); }
  .btn svg { width:18px; height:18px; transition:transform .25s var(--ease); }
  .btn:hover svg { transform:translateX(3px); }
  .facts { list-style:none; padding:0; margin:26px 0 0; display:flex; flex-wrap:wrap; gap:8px; }
  .facts li { font-size:.82rem; color:var(--dim); border:1px solid rgba(243,239,228,.14); border-radius:99px; padding:5px 11px; }

  /* Hero intro motion */
  .js .rise { opacity:0; transform:translateY(22px); animation:rise .9s var(--ease) forwards; }
  .js .d1 { animation-delay:.08s; } .js .d2 { animation-delay:.2s; } .js .d3 { animation-delay:.32s; } .js .d4 { animation-delay:.44s; } .js .d5 { animation-delay:.56s; }
  @keyframes rise { to { opacity:1; transform:none; } }

  /* Before / after revisit card */
  .device { position:relative; background:linear-gradient(180deg, #1c3326, #13251a); border:1px solid rgba(243,239,228,.12); border-radius:28px; padding:14px; box-shadow:0 40px 80px -30px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.06); max-width:520px; width:100%; justify-self:center; }
  .device-top { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:2px 4px 12px; font-size:.78rem; color:var(--dim); }
  .device-top b { color:var(--cream); font-weight:700; }
  .tag { font-size:.7rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; border-radius:99px; padding:3px 9px; background:rgba(243,239,228,.1); color:var(--dim); }
  .compare { --p:50%; position:relative; aspect-ratio:320/220; border-radius:16px; overflow:hidden; background:#dfe8d3; touch-action:pan-y; }
  .compare svg.scene { position:absolute; inset:0; width:100%; height:100%; display:block; }
  .compare .after { clip-path:inset(0 0 0 var(--p)); }
  .compare .handle { position:absolute; top:0; bottom:0; left:var(--p); width:2px; margin-left:-1px; background:#fff; box-shadow:0 0 0 1px rgba(0,0,0,.15); pointer-events:none; }
  .compare .handle::after { content:""; position:absolute; top:50%; left:50%; width:34px; height:34px; margin:-17px 0 0 -17px; border-radius:50%; background:#fff; box-shadow:0 4px 14px rgba(0,0,0,.3);
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2317231b' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 7l-5 5 5 5M15 7l5 5-5 5'/%3E%3C/svg%3E"); background-size:20px; background-repeat:no-repeat; background-position:center; }
  .compare .lbl { position:absolute; top:10px; font-size:.7rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase; padding:4px 9px; border-radius:99px; pointer-events:none; }
  .compare .lbl.b { left:10px; background:rgba(23,35,27,.85); color:#fff; }
  .compare .lbl.a { right:10px; background:var(--lime); color:var(--night); }
  .compare input[type=range] { position:absolute; inset:0; width:100%; height:100%; margin:0; opacity:0; cursor:ew-resize; -webkit-appearance:none; appearance:none; }
  .compare:focus-within { outline:3px solid var(--lime); outline-offset:3px; }
  .diffcard { margin-top:12px; display:grid; gap:8px; }
  .diffrow { display:grid; grid-template-columns:96px 1fr; align-items:center; gap:10px; font-size:.86rem; background:rgba(243,239,228,.05); border:1px solid rgba(243,239,228,.08); border-radius:12px; padding:8px 10px; }
  .diffrow span:first-child { font-size:.68rem; font-weight:800; letter-spacing:.07em; text-transform:uppercase; }
  .diffrow.rm span:first-child { color:#ffb3a1; } .diffrow.ad span:first-child { color:var(--lime); } .diffrow.un span:first-child { color:var(--dim); }
  .js .diffrow { opacity:0; transform:translateX(-10px); transition:opacity .5s var(--ease), transform .5s var(--ease); }
  .js .device.live .diffrow { opacity:1; transform:none; }
  .js .device.live .diffrow:nth-child(2) { transition-delay:.12s; } .js .device.live .diffrow:nth-child(3) { transition-delay:.24s; } .js .device.live .verdict { transition-delay:.36s; }
  .verdict { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:8px; margin-top:10px; font-size:.84rem; color:var(--dim); }
  .js .verdict { opacity:0; transition:opacity .5s var(--ease); } .js .device.live .verdict { opacity:1; }
  .verdict b { color:var(--night); background:var(--lime); border-radius:99px; padding:3px 10px; font-size:.74rem; letter-spacing:.04em; }
  .mini { list-style:none; margin:14px 0 2px; padding:0; display:grid; grid-template-columns:repeat(4,1fr); gap:6px; counter-reset:m; }
  .mini li { position:relative; font-size:.72rem; font-weight:700; text-align:center; color:var(--dim); padding:8px 2px 0; border-top:3px solid rgba(243,239,228,.14); transition:color .4s, border-color .4s; }
  .mini li.on { color:var(--lime); border-color:var(--lime); }
  .mini li.done { border-color:rgba(198,243,107,.45); }
  .caption { font-size:.76rem; color:var(--dim); margin:10px 4px 0; }

  /* Sections */
  section.band { padding:84px 0; position:relative; }
  .kicker { font-size:.78rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; color:var(--lime); margin:0 0 12px; }
  h2.big { font-size:clamp(2rem, 7.6vw, 3.6rem); line-height:1; letter-spacing:-.04em; font-weight:850; margin:0; text-wrap:balance; }
  h2.big em { font-family:var(--serif); font-style:italic; font-weight:700; color:var(--lime); letter-spacing:-.02em; }
  .sub { color:var(--dim); max-width:38em; margin:16px 0 0; font-size:1.04rem; }
  .js .reveal { opacity:0; transform:translateY(28px); transition:opacity .8s var(--ease), transform .8s var(--ease); }
  .js .reveal.in { opacity:1; transform:none; }

  /* Why it gets people outside */
  .why { background:var(--night2); border-top:1px solid rgba(243,239,228,.06); border-bottom:1px solid rgba(243,239,228,.06); }
  .grid3 { display:grid; gap:14px; margin-top:36px; }
  .tile { background:rgba(243,239,228,.04); border:1px solid rgba(243,239,228,.1); border-radius:var(--r); padding:22px; transition:transform .35s var(--ease), border-color .35s, background .35s; }
  .tile:hover { transform:translateY(-4px); border-color:rgba(198,243,107,.4); background:rgba(243,239,228,.06); }
  .tile svg { width:40px; height:40px; color:var(--lime); }
  .tile h3 { font-size:1.18rem; letter-spacing:-.02em; margin:14px 0 6px; }
  .tile p { color:var(--dim); margin:0; font-size:.96rem; }
  code { font-family:var(--mono); font-size:.84em; background:rgba(243,239,228,.08); border-radius:6px; padding:1px 6px; color:var(--cream); overflow-wrap:anywhere; }

  /* Flow */
  .flow-wrap { display:grid; gap:36px; }
  .rail { position:relative; list-style:none; margin:0; padding:0 0 0 46px; }
  .rail::before, .rail::after { content:""; position:absolute; left:17px; top:8px; bottom:8px; width:3px; border-radius:3px; background:rgba(243,239,228,.12); }
  .rail::after { background:linear-gradient(180deg, var(--lime), var(--lime2)); transform-origin:top; transform:scaleY(var(--fill,1)); box-shadow:0 0 18px rgba(198,243,107,.45); }
  .step { position:relative; padding:0 0 30px; }
  .step:last-child { padding-bottom:0; }
  .dot { position:absolute; left:-46px; top:0; width:37px; height:37px; border-radius:50%; display:grid; place-items:center; font-weight:850; font-size:.95rem; z-index:1; background:var(--night); border:2px solid rgba(243,239,228,.25); color:var(--dim); transition:all .5s var(--ease); }
  .step.in .dot { background:var(--lime); border-color:var(--lime); color:var(--night); box-shadow:0 0 0 6px rgba(198,243,107,.14); }
  .scard { background:linear-gradient(180deg, rgba(243,239,228,.06), rgba(243,239,228,.025)); border:1px solid rgba(243,239,228,.1); border-radius:var(--r); padding:20px; display:grid; gap:12px; }
  .scard header { display:flex; align-items:center; gap:14px; }
  .scard header svg { width:44px; height:44px; flex:none; color:var(--lime); }
  .scard h3 { margin:0; font-size:1.3rem; letter-spacing:-.025em; line-height:1.15; }
  .scard h3 small { display:block; font-size:.74rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--dim); margin-bottom:2px; }
  .scard p { margin:0; color:var(--dim); font-size:.97rem; }
  .scard p strong { color:var(--cream); font-weight:650; }
  .api { display:flex; flex-wrap:wrap; gap:6px; }
  .api code { font-size:.74rem; padding:3px 8px; border:1px solid rgba(198,243,107,.25); background:rgba(198,243,107,.07); color:#dff7b5; }
  .draw path, .draw circle, .draw rect, .draw line, .draw polyline { stroke-dasharray:160; stroke-dashoffset:0; }
  .js .step .draw path, .js .step .draw circle, .js .step .draw rect, .js .step .draw line, .js .step .draw polyline { stroke-dashoffset:160; transition:stroke-dashoffset 1.3s .15s var(--ease); }
  .js .step.in .draw path, .js .step.in .draw circle, .js .step.in .draw rect, .js .step.in .draw line, .js .step.in .draw polyline { stroke-dashoffset:0; }
  .flow-head .sticky { position:static; }

  /* Honest status */
  .stack { display:grid; gap:12px; margin-top:34px; }
  .srow { display:grid; gap:6px; padding:18px 20px; border-radius:var(--r); background:rgba(243,239,228,.035); border:1px solid rgba(243,239,228,.1); }
  .srow .top { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:8px; }
  .srow h3 { margin:0; font-size:1.08rem; letter-spacing:-.015em; }
  .srow p { margin:0; color:var(--dim); font-size:.93rem; }
  .st { font-size:.7rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase; border-radius:99px; padding:4px 10px; white-space:nowrap; }
  .st.ok { background:rgba(198,243,107,.16); color:var(--lime); }
  .st.part { background:rgba(255,206,120,.14); color:#ffd58a; }
  .st.no { background:rgba(255,179,161,.13); color:#ffc2b3; }

  /* Try it: the working demo, on paper */
  .try { background:var(--paper); color:var(--ink); padding:76px 0 90px; border-radius:32px 32px 0 0; position:relative; z-index:1; }
  .try .kicker { color:var(--accent); }
  .try h2.big em { color:var(--accent); }
  .try .sub { color:var(--muted); }
  .demo { max-width:740px; margin:30px auto 0; }
  .demo section { background:var(--card); border:1px solid var(--line); border-radius:var(--r); padding:20px; margin:14px 0; box-shadow:0 1px 0 rgba(23,35,27,.03), 0 12px 30px -24px rgba(23,35,27,.35); }
  .demo h2 { font-size:1.18rem; letter-spacing:-.02em; margin:0 0 8px; color:var(--ink); }
  .demo h3 { font-size:.98rem; margin:12px 0 2px; }
  .demo label { display:block; font-weight:650; font-size:.9rem; margin:12px 0 5px; }
  .demo input[type=text], .demo input[type=password], .demo input[type=number], .demo textarea { width:100%; padding:11px 12px; border:1.5px solid var(--line); border-radius:11px; font:inherit; color:var(--ink); background:#fbfbf8; transition:border-color .2s, box-shadow .2s; }
  .demo input:focus, .demo textarea:focus { outline:none; border-color:var(--accent); box-shadow:0 0 0 4px rgba(42,115,71,.18); }
  .demo input[type=file] { width:100%; font:inherit; font-size:.9rem; color:var(--muted); }
  .demo input[type=file]::file-selector-button { font:inherit; font-weight:650; border:0; border-radius:99px; padding:9px 14px; margin-right:10px; background:#e7eee6; color:var(--ink); cursor:pointer; }
  .demo textarea { min-height:72px; resize:vertical; }
  .demo .row { display:flex; gap:10px; flex-wrap:wrap; }
  .demo .row > div { flex:1 1 140px; }
  .demo button { margin-top:14px; min-height:46px; padding:11px 18px; border:0; border-radius:99px; background:var(--accent); color:#fff; font:inherit; font-weight:700; cursor:pointer; transition:transform .2s var(--ease), background .2s; }
  .demo button:hover { background:#215c39; transform:translateY(-1px); }
  .demo button:focus-visible { outline:3px solid var(--accent); outline-offset:3px; }
  .demo button.secondary { background:#e7eee6; color:var(--ink); }
  .demo button.secondary:hover { background:#d8e3d7; }
  .demo button:disabled { opacity:.6; cursor:progress; transform:none; }
  .demo a { color:var(--accent); font-weight:600; }
  .demo .banner { background:var(--warnbg); color:var(--warn); border-radius:11px; padding:11px 13px; margin:12px 0; font-size:.92rem; }
  .demo .error { background:#fde8e8; color:#8a1f1f; border-radius:11px; padding:11px 13px; margin:12px 0; font-size:.92rem; overflow-wrap:anywhere; }
  .demo .muted { color:var(--muted); font-size:.9rem; }
  .demo .pill { display:inline-block; padding:3px 9px; border-radius:99px; background:#e7eee6; font-size:.78rem; font-weight:700; margin:0 4px 4px 0; }
  .demo .photos { display:flex; gap:10px; flex-wrap:wrap; margin-top:10px; }
  .demo .photos figure { margin:0; flex:1 1 200px; }
  .demo .photos img { width:100%; max-height:260px; object-fit:cover; border-radius:11px; border:1px solid var(--line); background:#eee; }
  .demo .photos figcaption { font-size:.8rem; color:var(--muted); }
  .demo ul.compact { margin:4px 0 0; padding-left:20px; }
  .demo .diff h3 { font-size:.95rem; margin:10px 0 0; }
  .demo ol.timeline { padding-left:20px; margin:6px 0 0; overflow-wrap:anywhere; }
  .demo ol.timeline li { margin:3px 0; }
  .demo .issues button { margin:6px 6px 0 0; text-align:left; }
  .demo .stepno { display:inline-grid; place-items:center; width:26px; height:26px; border-radius:50%; background:var(--accent); color:#fff; font-size:.8rem; margin-right:8px; vertical-align:2px; }
  [hidden] { display:none !important; }

  footer { background:var(--paper); color:var(--muted); padding:0 0 48px; font-size:.9rem; }
  footer .wrap { border-top:1px solid var(--line); padding-top:24px; display:flex; flex-wrap:wrap; gap:10px 24px; justify-content:space-between; }
  footer a { color:var(--ink); font-weight:650; }

  @media (min-width:640px) {
    .bar nav .hide-sm { display:inline-block; }
    .eyebrow { font-size:.78rem; letter-spacing:.08em; }
    .hide-xs { display:inline; }
    .grid3 { grid-template-columns:repeat(3,1fr); }
    .diffrow { grid-template-columns:110px 1fr; }
  }
  @media (min-width:960px) {
    .hero { padding:72px 0 110px; }
    .hero .wrap { grid-template-columns:1.2fr .8fr; align-items:center; gap:56px; }
    h1 { font-size:clamp(3rem, 4.5vw, 4.4rem); }
    .try .kicker, .try h2.big, .try .sub { max-width:740px; margin-left:auto; margin-right:auto; }
    .flow-wrap { grid-template-columns:.8fr 1.2fr; gap:64px; }
    .flow-head .sticky { position:sticky; top:110px; }
    .stack { grid-template-columns:1fr 1fr; }
    section.band { padding:120px 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior:auto; }
    *, *::before, *::after { animation:none !important; transition:none !important; }
    .js .rise, .js .reveal, .js .diffrow, .js .verdict { opacity:1 !important; transform:none !important; }
    .js h1 em svg path, .js .step .draw path, .js .step .draw circle, .js .step .draw rect, .js .step .draw line, .js .step .draw polyline { stroke-dashoffset:0 !important; }
  }
</style>
</head>
<body>
<a class="skip" href="#try">Skip to the demo</a>
<header class="bar">
  <div class="wrap">
    <a class="brand" href="#top" aria-label="FieldIssue, back to top">
      <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2c-6.1 0-11 4.8-11 10.8C5 21 16 30 16 30s11-9 11-17.2C27 6.8 22.1 2 16 2z" fill="#c6f36b"/><path d="M11.5 16.5c0-4.2 3-7.2 9-7.6-.2 5.6-3.2 8.8-7.6 8.8" fill="none" stroke="#0e1a13" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 19.5l6-6" stroke="#0e1a13" stroke-width="2.2" stroke-linecap="round"/></svg>
      FieldIssue
    </a>
    <nav aria-label="Page">
      <a class="hide-sm" href="#how">How it works</a>
      <a class="hide-sm" href="https://github.com/himanshu748/fieldissue">GitHub</a>
      <a class="cta" href="#try">Try it</a>
    </nav>
  </div>
</header>

<main id="top">
<section class="hero" aria-labelledby="heroTitle">
  <div class="wrap">
    <div>
      <p class="eyebrow rise d1"><i aria-hidden="true"></i>DEV Hacktoberfest<span class="hide-xs"> · Week 1</span> · Touch Grass</p>
      <h1 id="heroTitle">
        <span class="line rise d2">Walk your street.</span>
        <span class="line rise d3">Photograph what's broken.</span>
        <span class="line rise d4">Come back to prove it got <em>fixed.<svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="M3 14 C 50 4, 110 4, 197 10"/></svg></em></span>
      </h1>
      <p class="lead rise d5">FieldIssue turns a neighbourhood walk into evidence. A geotagged photo and one sentence open an issue, an <strong>open-weight Gemma vision model</strong> describes what it sees, and a revisit photo shows what was <strong>removed, added or unchanged</strong>. A person, never the model, marks it resolved.</p>
      <div class="ctas rise d5">
        <a class="btn primary" href="#try">Report your first issue <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
        <a class="btn ghost" href="#how">See how it works</a>
      </div>
      <ul class="facts rise d5" aria-label="Project facts">
        <li>Open source, MIT</li>
        <li>No accounts</li>
        <li>Works in a phone browser</li>
      </ul>
    </div>

    <figure class="device rise d4" id="revisitCard" aria-labelledby="revisitCaption">
      <div class="device-top"><span><b>Park bench</b> · revisit</span><span class="tag">Illustration</span></div>
      <div class="compare" id="compare">
        <svg class="scene before" viewBox="0 0 320 220" aria-hidden="true">${benchFrame}
          <rect x="96" y="104" width="52" height="9" rx="2" fill="#b9773f"/>
          <path d="M148 104 l7 4 -5 3 6 2 -8 0z" fill="#b9773f"/>
          <rect x="94" y="138" width="38" height="7" rx="2" fill="#b9773f"/>
          <path d="M132 138 l9 3 -9 4z" fill="#b9773f"/>
          <rect x="196" y="138" width="30" height="7" rx="2" fill="#b9773f"/>
          <path d="M196 138 l-8 2 8 5z" fill="#b9773f"/>
          <rect x="150" y="178" width="58" height="8" rx="2" fill="#a46a37" transform="rotate(9 179 182)"/>
          <g transform="translate(234 70)"><path d="M14 0 L28 25 H0Z" fill="#f2a33a" stroke="#7a4f00" stroke-width="2" stroke-linejoin="round"/><rect x="12.6" y="8" width="2.8" height="9" rx="1.2" fill="#3b2600"/><circle cx="14" cy="20.5" r="1.7" fill="#3b2600"/></g>
        </svg>
        <svg class="scene after" viewBox="0 0 320 220" aria-hidden="true">${benchFrame}
          <rect x="96" y="104" width="128" height="9" rx="2" fill="#e0aa66"/>
          <rect x="94" y="138" width="132" height="7" rx="2" fill="#e0aa66"/>
          <g transform="translate(236 66)"><circle cx="14" cy="14" r="14" fill="#2a7347"/><path d="M7.5 14.5l4.2 4.2 8.6-9" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>
        </svg>
        <span class="lbl b">First visit</span>
        <span class="lbl a">Revisit</span>
        <span class="handle" aria-hidden="true"></span>
        <input id="compareRange" type="range" min="0" max="100" value="50" aria-label="Slide to compare the first visit with the revisit">
      </div>
      <div class="diffcard" aria-label="Example comparison output">
        <div class="diffrow rm"><span>Removed</span><span>Missing and splintered seat slats</span></div>
        <div class="diffrow ad"><span>Added</span><span>Two new slats on the seat and back</span></div>
        <div class="diffrow un"><span>Unchanged</span><span>Metal frame, armrests, position</span></div>
      </div>
      <div class="verdict"><span>Model recommends <b>RESOLVED</b></span><span>You make the call.</span></div>
      <ol class="mini" id="mini" aria-label="FieldIssue flow">
        <li>Report</li><li>Analyze</li><li>Revisit</li><li>Resolve</li>
      </ol>
      <figcaption class="caption" id="revisitCaption">Illustrated example of a revisit comparison. Drag the slider to compare. Real comparisons come from your own photos and notes.</figcaption>
    </figure>
  </div>
</section>

<section class="band why" aria-labelledby="whyTitle">
  <div class="wrap">
    <p class="kicker reveal">Touch grass, with a purpose</p>
    <h2 class="big reveal" id="whyTitle">The walk is <em>the point.</em></h2>
    <div class="grid3">
      <article class="tile reveal">
        <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="30" height="21" rx="4"/><path d="M14 11l2.5-4h7L26 11"/><circle cx="20" cy="21.5" r="5.5"/></svg>
        <h3>The phone is a camera, not a feed</h3>
        <p>You only open it to take a photo and type one sentence. The model does the describing.</p>
      </article>
      <article class="tile reveal">
        <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 20a12 12 0 0 1 21-8l3-3v9h-9l3-3a8 8 0 1 0 2 8"/></svg>
        <h3>Revisits are the hook</h3>
        <p>Every open issue near you is a reason to walk back past it and see whether it actually changed.</p>
      </article>
      <article class="tile reveal">
        <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 10l9-4 12 4 9-4v24l-9 4-12-4-9 4z"/><path d="M14 6v24M26 10v24"/></svg>
        <h3>Plan a route past open issues</h3>
        <p>Nearby and map queries (<code>near_lat</code>, <code>radius_meters</code>, <code>bbox</code>) let a walking group find what is open around them.</p>
      </article>
    </div>
  </div>
</section>

<section class="band" id="how" aria-labelledby="howTitle">
  <div class="wrap flow-wrap">
    <div class="flow-head"><div class="sticky">
      <p class="kicker reveal">How it works</p>
      <h2 class="big reveal" id="howTitle">From a photo to <em>proof.</em></h2>
      <p class="sub reveal">Four steps and a timeline. Every step is a plain HTTP call, so the demo below is just another client of the same API.</p>
    </div></div>
    <ol class="rail" id="rail">
      <li class="step">
        <span class="dot" aria-hidden="true">1</span>
        <div class="scard">
          <header>
            <svg class="draw" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="12" width="32" height="23" rx="4"/><path d="M16 12l2.5-4h7L28 12"/><circle cx="22" cy="23.5" r="6"/></svg>
            <h3><small>Step 1</small>Report</h3>
          </header>
          <p>One photo, one sentence and a location. Your browser resizes the photo to at most 1600 px, which also <strong>strips its EXIF and GPS metadata</strong>, before upload.</p>
          <div class="api"><code>POST /v1/issues</code></div>
        </div>
      </li>
      <li class="step">
        <span class="dot" aria-hidden="true">2</span>
        <div class="scard">
          <header>
            <svg class="draw" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 22s7-12 18-12 18 12 18 12-7 12-18 12S4 22 4 22z"/><circle cx="22" cy="22" r="5.5"/></svg>
            <h3><small>Step 2</small>Analyze with Gemma</h3>
          </header>
          <p>An open-weight Gemma vision model describes the photo as structured JSON: <strong>category, severity, conditions, objects, evidence and confidence</strong>. With no model configured, mock mode builds this from your note instead of the photo, with confidence 0, and the page says so.</p>
          <div class="api"><code>aiAnalysis</code></div>
        </div>
      </li>
      <li class="step">
        <span class="dot" aria-hidden="true">3</span>
        <div class="scard">
          <header>
            <svg class="draw" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="10" width="16" height="24" rx="3"/><rect x="24" y="10" width="16" height="24" rx="3"/><path d="M20 22h4"/></svg>
            <h3><small>Step 3</small>Revisit and compare</h3>
          </header>
          <p>Walk back past it and take a new photo of the same spot. FieldIssue compares it with the previous observation: <strong>what was removed, added or unchanged</strong>, plus a recommended status.</p>
          <div class="api"><code>POST /v1/issues/:id/observations</code></div>
        </div>
      </li>
      <li class="step">
        <span class="dot" aria-hidden="true">4</span>
        <div class="scard">
          <header>
            <svg class="draw" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="22" cy="22" r="17"/><polyline points="14,22.5 19.5,28 30,16.5"/></svg>
            <h3><small>Step 4</small>A person resolves</h3>
          </header>
          <p>The model can only recommend. <strong>Closing an issue is your explicit decision</strong>, saved with your note.</p>
          <div class="api"><code>POST /v1/issues/:id/resolve</code></div>
        </div>
      </li>
      <li class="step">
        <span class="dot" aria-hidden="true">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 5h12M4 10h12M4 15h8"/></svg>
        </span>
        <div class="scard">
          <header>
            <svg class="draw" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="6" x2="12" y2="38"/><circle cx="12" cy="11" r="3.5"/><circle cx="12" cy="22" r="3.5"/><circle cx="12" cy="33" r="3.5"/><path d="M20 11h16M20 22h12M20 33h14"/></svg>
            <h3><small>Always on</small>Timeline</h3>
          </header>
          <p>Every event in order: created, classification, observation, diff, status change, resolution. The evidence trail is the product.</p>
          <div class="api"><code>GET /v1/issues/:id/timeline</code></div>
        </div>
      </li>
    </ol>
  </div>
</section>

<section class="band why" aria-labelledby="stackTitle">
  <div class="wrap">
    <p class="kicker reveal">Open-source AI, stated plainly</p>
    <h2 class="big reveal" id="stackTitle">What runs <em>today.</em></h2>
    <p class="sub reveal">No inflated claims. This is the state of each piece, as the README records it.</p>
    <div class="stack">
      <div class="srow reveal"><div class="top"><h3>Gemma (open-weight, vision)</h3><span class="st ok">Live run verified</span></div><p>Describes each photo and compares before and after as structured JSON. Speaks the OpenAI-compatible <code>chat/completions</code> API, so it can point at any Gemma server.</p></div>
      <div class="srow reveal"><div class="top"><h3>Mastra workflows</h3><span class="st ok">In the API</span></div><p>Typed create-issue and revisit workflows. Database writes stay deterministic, outside the model.</p></div>
      <div class="srow reveal"><div class="top"><h3>PostGIS nearby and map queries</h3><span class="st ok">In the API</span></div><p>Proximity and bounding-box queries for planning a walk past open issues.</p></div>
      <div class="srow reveal"><div class="top"><h3>Tinker (Qwen3-8B fine-tune)</h3><span class="st part">Separate demo</span></div><p>Note-to-JSON training on 54 synthetic notes. A small experiment, not part of the app's vision path.</p></div>
      <div class="srow reveal"><div class="top"><h3>Mock mode (no keys)</h3><span class="st part">Notes only</span></div><p>Without a model key, analysis and comparison come from your notes, not the photo, with confidence 0. A banner says so.</p></div>
      <div class="srow reveal"><div class="top"><h3>TabPFN revisit prediction</h3><span class="st no">Not on the demo</span></div><p>Adapter built; it needs real labelled revisit data before it can run, so no predictions are shown here.</p></div>
    </div>
  </div>
</section>

<section class="try" id="try" aria-labelledby="tryTitle">
  <div class="wrap">
    <p class="kicker">Try it</p>
    <h2 class="big" id="tryTitle">Go outside. <em>Report one thing.</em></h2>
    <p class="sub">This drives the same public API as any HTTP client: report, revisit, compare, then a person resolves. On a phone, the photo button opens your camera.</p>
    <div class="demo">
  <section id="access">
    <h2>Access</h2>
    <p class="muted">Only needed on a hosted demo that sets a shared access token. Kept in this browser tab only.</p>
    <label for="token">Demo access token</label>
    <input id="token" type="password" autocomplete="off" placeholder="leave empty for a local run">
    <div id="modeBanner" class="banner" hidden></div>
  </section>

  <section id="report">
    <h2><span class="stepno" aria-hidden="true">1</span>Report an issue</h2>
    <p class="muted">Take one photo and write one sentence. The photo is resized in your browser (which also strips its EXIF metadata) before upload.</p>
    <label for="photo1">Photo (JPEG, PNG or WebP)</label>
    <input id="photo1" type="file" accept="image/jpeg,image/png,image/webp,image/*" capture="environment">
    <label for="title">Title (optional)</label>
    <input id="title" type="text" maxlength="200" placeholder="e.g. Broken bench on the park loop">
    <label for="note1">Note</label>
    <textarea id="note1" maxlength="5000" placeholder="e.g. two seat slats missing, splintered edge"></textarea>
    <div class="row">
      <div><label for="lat">Latitude</label><input id="lat" type="number" step="any" min="-90" max="90"></div>
      <div><label for="lon">Longitude</label><input id="lon" type="number" step="any" min="-180" max="180"></div>
    </div>
    <button id="locate" class="secondary" type="button">Use my location</button>
    <button id="create" type="button">Report issue</button>
    <div id="createError" class="error" hidden></div>
  </section>

  <section id="issue" hidden>
    <h2 id="issueHeading">Issue</h2>
    <div id="issueMeta"></div>
    <div id="analysis"></div>
    <div class="photos" id="photos"></div>
  </section>

  <section id="revisit" hidden>
    <h2><span class="stepno" aria-hidden="true">2</span>Revisit and compare</h2>
    <p class="muted">Come back later, take a new photo of the same spot, and describe what you see now. FieldIssue compares it with the previous observation.</p>
    <label for="photo2">New photo</label>
    <input id="photo2" type="file" accept="image/jpeg,image/png,image/webp,image/*" capture="environment">
    <label for="note2">Note</label>
    <textarea id="note2" maxlength="5000" placeholder="e.g. seat slats replaced, frame still upright"></textarea>
    <button id="addRevisit" type="button">Add revisit</button>
    <div id="revisitError" class="error" hidden></div>
    <div id="diff" class="diff"></div>
  </section>

  <section id="resolve" hidden>
    <h2><span class="stepno" aria-hidden="true">3</span>Resolve (a person decides)</h2>
    <p class="muted">The model can only recommend a status. Closing the issue is your explicit decision and is recorded in the timeline.</p>
    <label for="resolveNote">Resolution note</label>
    <input id="resolveNote" type="text" maxlength="5000" placeholder="e.g. Checked on revisit: slats replaced">
    <button id="doResolve" type="button">Mark resolved</button>
    <div id="resolveError" class="error" hidden></div>
  </section>

  <section id="timelineBox" hidden>
    <h2>Timeline</h2>
    <button id="refreshIssue" class="secondary" type="button">Refresh issue</button>
    <div id="refreshError" class="error" hidden></div>
    <ol class="timeline" id="timeline"></ol>
  </section>

  <section id="open">
    <h2>Open issues</h2>
    <p class="muted">Pick an existing issue to revisit it. Seeded demo issues (FI-9000xx) are fictional and their images say DEMO FIXTURE.</p>
    <button id="loadOpen" class="secondary" type="button">Load open issues</button>
    <div id="openError" class="error" hidden></div>
    <div id="openList" class="issues"></div>
  </section>
    </div>
  </div>
</section>
</main>

<footer>
  <div class="wrap">
    <span>Open source (MIT): <a href="https://github.com/himanshu748/fieldissue">github.com/himanshu748/fieldissue</a></span>
    <span>Built for the DEV Hacktoberfest Open-Source AI Challenge, Week 1: Touch Grass.</span>
  </div>
</footer>
<script src="/demo.js"></script>
</body>
</html>
`;

// Client script. Plain ES2020, no build step, no template literals so it can
// live inside this TypeScript string unchanged.
export const demoPageScript = String.raw`"use strict";
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var state = { issue: null, objectUrls: [], selection: 0, render: 0, read: 0, selecting: false, create: null, revisits: Object.create(null) };
  var tokenInput = $("token");
  tokenInput.value = sessionStorage.getItem("fieldissue-token") || "";
  tokenInput.addEventListener("change", function () {
    sessionStorage.setItem("fieldissue-token", tokenInput.value.trim());
  });

  function headers(extra) {
    var h = Object.assign({}, extra || {});
    var t = tokenInput.value.trim();
    if (t) h.Authorization = "Bearer " + t;
    return h;
  }
  async function api(path, options) {
    options = options || {};
    var response = await fetch(path, Object.assign({}, options, { headers: headers(options.headers) }));
    var body = null;
    try { body = await response.json(); } catch (e) { body = null; }
    if (!response.ok) {
      var err = body && body.error ? body.error : {};
      var msg = (err.code || ("HTTP_" + response.status)) + ": " + (err.message || "Request failed");
      if (response.status === 401) msg += " (enter the demo access token above)";
      if (response.status === 503) msg += " (a dependency is unavailable; this response does not establish whether a write was saved)";
      var failure = new Error(msg);
      failure.status = response.status;
      throw failure;
    }
    return body;
  }
  function el(tag, text, cls) {
    var node = document.createElement(tag);
    if (text !== undefined && text !== null) node.textContent = String(text);
    if (cls) node.className = cls;
    return node;
  }
  function showError(id, error) {
    var box = $(id);
    if (!error) { box.hidden = true; box.textContent = ""; return; }
    box.hidden = false;
    box.textContent = error.message || String(error);
  }
  function busy(button, on, label) {
    if (on) { button.dataset.label = button.textContent; button.textContent = label; button.disabled = true; }
    else { button.textContent = button.dataset.label || button.textContent; button.disabled = false; }
  }
  function list(title, items) {
    var wrap = document.createElement("div");
    wrap.appendChild(el("h3", title));
    if (!items || !items.length) { wrap.appendChild(el("p", "none", "muted")); return wrap; }
    var ul = el("ul", null, "compact");
    items.forEach(function (x) { ul.appendChild(el("li", x)); });
    wrap.appendChild(ul);
    return wrap;
  }
  function modeNotice(model) {
    var banner = $("modeBanner");
    if (model === "development-fixture") {
      banner.hidden = false;
      banner.textContent = "Development fixture mode: no vision model is configured, so the analysis and comparison below are built from your notes only. The photo is stored but not interpreted. Confidence is 0.";
    } else if (model) {
      banner.hidden = false;
      banner.textContent = "Live model: " + model + ". Outputs are model descriptions of your photos, not verified facts.";
    }
  }

  // Resize to at most 1600px and re-encode as JPEG. This keeps uploads small on
  // mobile data and drops EXIF metadata (including GPS) from the stored file.
  function prepareImage(file) {
    return new Promise(function (resolve, reject) {
      if (!file) { reject(new Error("Choose a photo first")); return; }
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var max = 1600, w = img.naturalWidth, h = img.naturalHeight;
        var scale = Math.min(1, max / Math.max(w, h));
        var canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(w * scale));
        canvas.height = Math.max(1, Math.round(h * scale));
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob(function (blob) {
          if (!blob) { reject(new Error("Could not read this image")); return; }
          resolve(new File([blob], "photo.jpg", { type: "image/jpeg" }));
        }, "image/jpeg", 0.85);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("This browser cannot read that image format; try a JPEG or PNG")); };
      img.src = url;
    });
  }
  async function mediaUrl(observation, version) {
    var key = observation.storageKey;
    if (!key) return null;
    var response = await fetch("/media/" + encodeURIComponent(key), { headers: headers() });
    if (!response.ok) return null;
    var url = URL.createObjectURL(await response.blob());
    if (version !== state.render) { URL.revokeObjectURL(url); return null; }
    state.objectUrls.push(url);
    return url;
  }
  function renderAnalysis(observation) {
    var box = $("analysis");
    box.textContent = "";
    var a = observation && observation.aiAnalysis;
    if (!a || !a.model) return;
    modeNotice(a.model);
    box.appendChild(el("h3", "What the model reported (first observation)"));
    var p = el("p");
    p.appendChild(el("span", a.suggestedCategory, "pill"));
    p.appendChild(el("span", a.suggestedSeverity, "pill"));
    p.appendChild(el("span", "confidence " + a.confidence, "pill"));
    box.appendChild(p);
    box.appendChild(list("Conditions", a.conditions));
    box.appendChild(list("Objects", a.objects));
    box.appendChild(list("Evidence", a.evidence));
    box.appendChild(el("p", "Model: " + a.model + " (" + a.modelVersion + ")", "muted"));
  }
  async function renderIssue(issue, selection) {
    if (selection !== state.selection) return;
    state.selecting = false;
    var version = ++state.render;
    var changedIssue = !state.issue || state.issue.id !== issue.id;
    state.issue = issue;
    if (changedIssue) {
      $("photo2").value = "";
      $("note2").value = "";
      showError("revisitError", null);
      showError("resolveError", null);
    }
    $("modeBanner").hidden = true;
    $("diff").textContent = "";
    $("timeline").textContent = "";
    $("timelineBox").hidden = false;
    showError("refreshError", null);
    var revisit = state.revisits[issue.id];
    if (revisit && revisit.result) renderDiff(revisit.result);
    if (revisit && revisit.uncertain) showError("revisitError", new Error("Save outcome unknown. Refresh and check the observations before choosing a new photo. This request will not be posted again."));
    state.objectUrls.forEach(function (u) { URL.revokeObjectURL(u); });
    state.objectUrls = [];
    $("issue").hidden = false;
    $("revisit").hidden = issue.status === "RESOLVED" || issue.status === "REJECTED";
    $("resolve").hidden = issue.status === "RESOLVED" || issue.status === "REJECTED";
    $("issueHeading").textContent = issue.publicId + " - " + issue.title;
    var meta = $("issueMeta");
    meta.textContent = "";
    var p = el("p");
    p.appendChild(el("span", issue.status, "pill"));
    p.appendChild(el("span", issue.category, "pill"));
    p.appendChild(el("span", issue.severity, "pill"));
    meta.appendChild(p);
    meta.appendChild(el("p", "Location " + issue.latitude + ", " + issue.longitude + " - " + issue.observations.length + " observation(s)", "muted"));
    if (issue.placeContext && issue.placeContext.name) meta.appendChild(el("p", "Near: " + issue.placeContext.name, "muted"));
    if (issue.nearbyIssues && issue.nearbyIssues.length) meta.appendChild(el("p", issue.nearbyIssues.length + " other open issue(s) within 100 m", "muted"));
    renderAnalysis(issue.observations[0]);
    var photos = $("photos");
    photos.textContent = "";
    for (var i = 0; i < issue.observations.length; i++) {
      var o = issue.observations[i];
      var fig = document.createElement("figure");
      var img = document.createElement("img");
      img.alt = "Observation " + (i + 1);
      var src = await mediaUrl(o, version);
      if (version !== state.render || selection !== state.selection) return;
      if (src) img.src = src;
      fig.appendChild(img);
      fig.appendChild(el("figcaption", (i === 0 ? "First" : "Revisit " + i) + " - " + new Date(o.capturedAt).toLocaleString() + (o.note ? " - " + o.note : "")));
      photos.appendChild(fig);
    }
    await renderTimeline(issue.id, version, selection);
  }
  async function renderTimeline(id, version, selection) {
    var data = await api("/v1/issues/" + id + "/timeline");
    if (version !== state.render || selection !== state.selection) return;
    var ol = $("timeline");
    ol.textContent = "";
    data.events.forEach(function (e) {
      var extra = "";
      if (e.payload && e.payload.note) extra = " - " + e.payload.note;
      ol.appendChild(el("li", new Date(e.createdAt).toLocaleString() + "  " + e.eventType + extra));
    });
    $("timelineBox").hidden = false;
  }
  function renderDiff(result) {
    var box = $("diff");
    box.textContent = "";
    if (!result) return;
    if (!result.realWorldDiff) {
      box.appendChild(el("p", result.diffUnavailable ? "The revisit was saved, but the comparison failed. Nothing was inferred." : "Saved. Add another revisit to compare.", "muted"));
      return;
    }
    var d = result.realWorldDiff;
    modeNotice(d.model);
    box.appendChild(el("h3", "What changed since the previous observation"));
    box.appendChild(el("p", d.summary));
    box.appendChild(list("Removed", d.removed));
    box.appendChild(list("Added", d.added));
    box.appendChild(list("Unchanged", d.unchanged));
    var rec = el("p");
    rec.appendChild(el("span", "model recommends " + d.recommendedStatus, "pill"));
    rec.appendChild(el("span", "confidence " + d.confidence, "pill"));
    box.appendChild(rec);
    box.appendChild(el("p", "This is a recommendation only. The issue stays " + state.issue.status + " until you resolve it below. Model: " + d.model + " (" + d.modelVersion + ")", "muted"));
  }
  function randomKey() {
    if (window.crypto && crypto.randomUUID) return "web-" + crypto.randomUUID();
    return "web-" + Date.now() + "-" + Math.random().toString(36).slice(2);
  }

  $("locate").addEventListener("click", function () {
    if (!navigator.geolocation) { showError("createError", new Error("Location is not available in this browser; type coordinates instead")); return; }
    navigator.geolocation.getCurrentPosition(function (pos) {
      $("lat").value = pos.coords.latitude.toFixed(6);
      $("lon").value = pos.coords.longitude.toFixed(6);
      showError("createError", null);
    }, function () { showError("createError", new Error("Location permission was denied; type coordinates instead")); }, { enableHighAccuracy: true, timeout: 10000 });
  });

  // Save confirmation and read recovery are separate. A failed refresh must
  // never make a committed write look retryable.
  async function refresh(id, selection, saved) {
    if (selection !== state.selection) return;
    var read = ++state.read;
    try {
      var issue = await api("/v1/issues/" + id);
      if (read !== state.read) return;
      await renderIssue(issue, selection);
    } catch (error) {
      if (selection === state.selection && read === state.read) showError("refreshError", new Error((saved ? "Saved. " : "") + "Could not refresh this issue. Use Refresh issue to retry the read. " + error.message));
    }
  }
  async function showSaved(issue, selection) {
    if (selection !== state.selection) return;
    var read = ++state.read;
    try { await renderIssue(issue, selection); }
    catch (error) {
      if (selection === state.selection && read === state.read) showError("refreshError", new Error("Saved. Could not refresh photos or timeline. Use Refresh issue to retry the read. " + error.message));
    }
  }
  $("refreshIssue").addEventListener("click", async function () {
    if (this.disabled || !state.issue || state.selecting) return;
    busy(this, true, "Refreshing...");
    try { await refresh(state.issue.id, state.selection, false); }
    finally { busy(this, false); }
  });

  $("create").addEventListener("click", async function () {
    var button = this;
    if (button.disabled) return;
    if (state.selecting) { showError("createError", new Error("Wait for the selected issue to finish loading before reporting another issue.")); return; }
    var selection = state.selection;
    showError("createError", null);
    busy(button, true, "Analysing photo...");
    try {
      if (!state.create) {
        if ($("lat").value === "" || $("lon").value === "") throw new Error("Add a location (Use my location, or type latitude and longitude)");
        var source = $("photo1").files[0];
        var note = $("note1").value.trim(), title = $("title").value.trim();
        var form = new FormData();
        if (title) form.set("title", title);
        form.set("note", note);
        form.set("latitude", $("lat").value);
        form.set("longitude", $("lon").value);
        form.set("capturedAt", new Date().toISOString());
        form.set("image", await prepareImage(source));
        // Keep the exact prepared bytes, fields, timestamp and key until the
        // server confirms success, even if the form changes or a reply is lost.
        state.create = { form: form, key: randomKey(), source: source, note: note, title: title };
      }
      var pending = state.create;
      var issue = await api("/v1/issues", { method: "POST", body: pending.form, headers: { "Idempotency-Key": pending.key } });
      if (!issue || !issue.id) throw new Error("Save response was not readable");
      state.create = null;
      if ($("photo1").files[0] === pending.source) $("photo1").value = "";
      if ($("note1").value.trim() === pending.note) $("note1").value = "";
      if ($("title").value.trim() === pending.title) $("title").value = "";
      await showSaved(issue, selection);
      if (selection === state.selection) $("issue").scrollIntoView({ behavior: "smooth" });
      else showError("createError", new Error("Saved report " + issue.publicId + ". Pick it from Open issues to view it."));
    } catch (error) {
      // Validation/auth/upload rejection is safe to correct. Network errors
      // and dependency failures remain uncertain and retain the same request.
      if (state.create) {
        var rejected = [400, 401, 403, 413, 422].indexOf(error.status) !== -1;
        if (rejected && !state.create.uncertain) state.create = null;
        else state.create.uncertain = true;
      }
      showError("createError", state.create ? new Error("Save not confirmed. Retry sends the same report, including its original photo, note and location. " + error.message) : error);
    }
    finally { busy(button, false); }
  });

  $("addRevisit").addEventListener("click", async function () {
    var button = this;
    if (button.disabled) return;
    if (state.selecting) { showError("revisitError", new Error("Wait for the selected issue to finish loading before adding a revisit.")); return; }
    showError("revisitError", null);
    busy(button, true, "Comparing...");
    var id = state.issue && state.issue.id, selection = state.selection;
    var attempt = null;
    try {
      if (!id) throw new Error("Report or pick an issue first");
      var source = $("photo2").files[0], note = $("note2").value.trim();
      var previous = state.revisits[id];
      if (previous && previous.uncertain && (!source || source === previous.source)) {
        await refresh(id, selection, false);
        throw new Error("Save outcome unknown. Check the refreshed observations before choosing a new photo. This request will not be posted again.");
      }
      var form = new FormData();
      form.set("note", note);
      form.set("capturedAt", new Date().toISOString());
      form.set("image", await prepareImage(source));
      attempt = { source: source, uncertain: true };
      state.revisits[id] = attempt;
      var result = await api("/v1/issues/" + id + "/observations", { method: "POST", body: form });
      if (!result || !result.observation) throw new Error("Save response was not readable");
      attempt.uncertain = false;
      attempt.result = result;
      // Retire only this submitted input; never erase a newer issue's draft.
      if (selection === state.selection) {
        if ($("photo2").files[0] === source) $("photo2").value = "";
        if ($("note2").value.trim() === note) $("note2").value = "";
        renderDiff(result);
        await refresh(id, selection, true);
      }
    } catch (error) {
      if (selection === state.selection) showError("revisitError", attempt && attempt.uncertain ? new Error("Save outcome unknown. Refresh and check the observations before choosing a new photo. This request will not be posted again. " + error.message) : error);
    }
    finally { busy(button, false); }
  });

  $("doResolve").addEventListener("click", async function () {
    var button = this;
    if (button.disabled) return;
    if (state.selecting) { showError("resolveError", new Error("Wait for the selected issue to finish loading before resolving it.")); return; }
    var id = state.issue && state.issue.id, selection = state.selection;
    showError("resolveError", null);
    busy(button, true, "Resolving...");
    try {
      if (!id) throw new Error("Report or pick an issue first");
      var issue = await api("/v1/issues/" + id + "/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: $("resolveNote").value.trim() }),
      });
      await showSaved(issue, selection);
    } catch (error) { if (selection === state.selection) showError("resolveError", error); }
    finally { busy(button, false); }
  });

  $("loadOpen").addEventListener("click", async function () {
    var button = this;
    showError("openError", null);
    busy(button, true, "Loading...");
    try {
      var data = await api("/v1/issues?status=OPEN&limit=20");
      var box = $("openList");
      box.textContent = "";
      if (!data.items.length) box.appendChild(el("p", "No open issues yet.", "muted"));
      data.items.forEach(function (item) {
        var b = el("button", item.publicId + " - " + item.title, "secondary");
        b.type = "button";
        b.addEventListener("click", async function () {
          var selection = ++state.selection;
          var read = ++state.read;
          state.selecting = true;
          ++state.render;
          try {
            var issue = await api("/v1/issues/" + item.id);
            if (read !== state.read) return;
            await renderIssue(issue, selection);
            if (selection === state.selection) $("issue").scrollIntoView({ behavior: "smooth" });
          } catch (error) { if (selection === state.selection && read === state.read) showError("openError", error); }
          finally { if (selection === state.selection) state.selecting = false; }
        });
        box.appendChild(b);
      });
    } catch (error) { showError("openError", error); }
    finally { busy(button, false); }
  });
})();
`;

// Landing-page motion only. It never calls the API and the demo works without
// it. Loaded in <head> so the "js" class is set before first paint; everything
// else waits for the DOM. Honours prefers-reduced-motion by skipping motion.
export const landingScript = String.raw`"use strict";
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onReady() {
    var hasIO = "IntersectionObserver" in window;

    // Reveal sections and flow steps as they scroll into view, once.
    var revealables = document.querySelectorAll(".reveal, .step");
    if (!hasIO || reduce) {
      revealables.forEach(function (n) { n.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
      revealables.forEach(function (n) { io.observe(n); });
    }

    // Before / after revisit slider.
    var card = document.getElementById("revisitCard");
    var compare = document.getElementById("compare");
    var range = document.getElementById("compareRange");
    var touched = false, visible = !hasIO, t0 = 0;
    function setPos(v) { compare.style.setProperty("--p", v + "%"); }
    if (compare && range) {
      range.addEventListener("input", function () { touched = true; setPos(range.value); });
      range.addEventListener("pointerdown", function () { touched = true; });
      setPos(range.value);
    }
    if (card) {
      if (!hasIO || reduce) card.classList.add("live");
      else new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          visible = e.isIntersecting;
          if (visible) setTimeout(function () { card.classList.add("live"); }, 900);
        });
      }, { threshold: 0.35 }).observe(card);
    }
    function sweep(ts) {
      if (!t0) t0 = ts;
      if (!touched && visible && !document.hidden) {
        // Ease between mostly-before and mostly-after, starting from the middle.
        var v = 50 + 34 * Math.sin((ts - t0) / 1400);
        range.value = String(Math.round(v));
        setPos(v.toFixed(2));
      }
      if (!touched) requestAnimationFrame(sweep);
    }
    if (compare && range && !reduce) requestAnimationFrame(sweep);

    // Report, analyze, revisit, resolve: a small looping step indicator.
    var mini = document.getElementById("mini");
    if (mini) {
      var items = mini.querySelectorAll("li");
      var i = 0;
      var paint = function () {
        items.forEach(function (li, k) {
          li.classList.toggle("on", k === i);
          li.classList.toggle("done", k < i);
        });
      };
      if (reduce) items.forEach(function (li) { li.classList.add("done"); });
      else { paint(); setInterval(function () { if (!document.hidden) { i = (i + 1) % items.length; paint(); } }, 1700); }
    }

    // The flow rail fills as you scroll through the steps.
    var rail = document.getElementById("rail");
    if (rail && !reduce) {
      var queued = false;
      var update = function () {
        queued = false;
        var r = rail.getBoundingClientRect();
        var vh = window.innerHeight || 800;
        var p = (vh * 0.62 - r.top) / Math.max(1, r.height);
        rail.style.setProperty("--fill", String(Math.max(0, Math.min(1, p)).toFixed(3)));
      };
      var request = function () { if (!queued) { queued = true; requestAnimationFrame(update); } };
      window.addEventListener("scroll", request, { passive: true });
      window.addEventListener("resize", request);
      update();
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", onReady);
  else onReady();
})();
`;
