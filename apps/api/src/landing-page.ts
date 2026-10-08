// The public landing page, served by the API at GET /. It is static marketing
// only: no forms, no API calls and no secrets. The working product lives at
// /app. Everything is same-origin: styles are inline, the hero image is
// /assets/field-walk.png and the only script is /landing.js (scroll reveals).
// Without JavaScript, or with reduced motion, every section is fully visible.
export const landingPageCsp = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'unsafe-inline'",
  "img-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join("; ");

const repoUrl = "https://github.com/himanshu748/fieldissue";

export const landingPageHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="FieldIssue is GitHub Issues for the real world. Photograph a public problem, revisit the same spot, compare the evidence and close it only when a person confirms the fix.">
<meta name="theme-color" content="#f6f4ec">
<title>FieldIssue: GitHub Issues for the real world</title>
<script src="/landing.js" defer></script>
<style>
  :root {
    --paper:#f6f4ec; --paper2:#ebe9da; --ink:#1c211d; --muted:#4a524a; --rule:#d8d5c4;
    --forest:#24402c; --forest2:#30523a; --olive:#56632f; --lime:#c9e86a;
    --ease:cubic-bezier(.2,.7,.2,1);
    --sans:ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
  * { box-sizing:border-box; }
  html { -webkit-text-size-adjust:100%; scroll-behavior:smooth; }
  body { margin:0; background:var(--paper); color:var(--ink); font:17px/1.6 var(--sans); overflow-x:hidden; }
  img { display:block; max-width:100%; height:auto; }
  a { color:inherit; }
  :focus-visible { outline:3px solid var(--forest); outline-offset:3px; border-radius:6px; }
  .skip { position:absolute; left:12px; top:-80px; z-index:30; background:var(--forest); color:var(--paper); padding:12px 16px; border-radius:8px; font-weight:700; text-decoration:none; }
  .skip:focus { top:12px; }
  .wrap { max-width:1240px; margin:0 auto; padding:0 20px; }
  section[id] { scroll-margin-top:84px; }

  /* Top bar */
  .top { position:relative; z-index:20; background:rgba(246,244,236,.94); border-bottom:1px solid var(--rule); }
  .top-in { max-width:1240px; margin:0 auto; padding:6px 20px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:0 16px; }
  .brand { display:inline-flex; align-items:center; gap:10px; min-height:44px; font-weight:800; font-size:1.1rem; letter-spacing:-.02em; text-decoration:none; }
  .mark { position:relative; flex:none; width:22px; height:22px; border-radius:7px 7px 7px 2px; background:var(--forest); }
  .mark::after { content:""; position:absolute; right:4px; top:4px; width:7px; height:7px; border-radius:50%; background:var(--lime); }
  .top nav { display:flex; align-items:center; gap:2px; margin-left:-10px; }
  .top nav a { display:inline-flex; align-items:center; min-height:44px; padding:0 10px; border-radius:8px; font-size:.95rem; font-weight:600; color:var(--muted); text-decoration:none; transition:background .2s, color .2s; }
  .top nav a:hover { color:var(--ink); background:var(--paper2); }
  .top nav a.nav-cta { margin-left:6px; padding:0 16px; color:var(--paper); background:var(--forest); }
  .top nav a.nav-cta:hover { background:var(--forest2); }

  /* Buttons */
  .actions { display:flex; flex-wrap:wrap; gap:12px; margin-top:32px; }
  .btn { display:inline-flex; align-items:center; justify-content:center; min-height:48px; padding:0 22px; border-radius:10px; font-weight:700; text-decoration:none; transition:background .2s, transform .2s var(--ease); }
  .btn-primary { background:var(--forest); color:var(--paper); box-shadow:inset 0 -3px 0 rgba(0,0,0,.2); }
  .btn-primary:hover { background:var(--forest2); transform:translateY(-1px); }
  .btn-quiet { border:1.5px solid var(--ink); color:var(--ink); }
  .btn-quiet:hover { background:var(--paper2); transform:translateY(-1px); }

  /* Hero */
  .hero { display:grid; grid-template-columns:20px minmax(0,1fr) 20px; row-gap:40px; padding:44px 0 80px; }
  .hero-copy { grid-column:2; }
  .eyebrow { display:flex; align-items:center; gap:12px; margin:0 0 22px; font-size:.8rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--olive); }
  .eyebrow::before { content:""; flex:none; width:28px; height:4px; border-radius:2px; background:var(--lime); }
  h1 { margin:0; font-size:clamp(2.9rem, 12vw, 5.6rem); line-height:.95; letter-spacing:-.05em; font-weight:850; }
  h1 span { display:block; }
  h1 .hl { text-decoration:underline; text-decoration-color:var(--lime); text-decoration-thickness:.16em; text-underline-offset:.1em; text-decoration-skip-ink:none; }
  .lead { margin:26px 0 0; max-width:33em; font-size:1.12rem; color:var(--muted); }
  .hero-media { grid-column:1 / -1; margin:0; }
  .hero-media img { width:100%; aspect-ratio:4 / 3; object-fit:cover; object-position:58% 55%; background:var(--paper2); }
  .hero-media figcaption { margin-top:10px; padding:0 20px; font-size:.84rem; color:var(--muted); }
  @keyframes up { from { opacity:0; transform:translateY(16px); } }
  @keyframes settle { from { opacity:0; transform:scale(1.025); } }
  .hero-copy > * { animation:up .8s var(--ease) both; }
  .hero-copy > :nth-child(2) { animation-delay:.08s; }
  .hero-copy > :nth-child(3) { animation-delay:.16s; }
  .hero-copy > :nth-child(4) { animation-delay:.24s; }
  .hero-media img { animation:settle 1.1s .1s var(--ease) both; }

  /* Shared section type */
  .kicker { margin:0 0 14px; font-size:.8rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--olive); }
  h2 { margin:0; font-size:clamp(2rem, 7vw, 3.4rem); line-height:1.02; letter-spacing:-.04em; font-weight:820; text-wrap:balance; }
  .section-lede { margin:18px 0 0; max-width:30em; color:var(--muted); font-size:1.06rem; }

  /* How it works: a ruled ledger, not cards */
  .how { padding:88px 0; border-top:1px solid var(--rule); }
  .steps { list-style:none; margin:44px 0 0; padding:0; border-top:2px solid var(--ink); }
  .steps li { display:grid; grid-template-columns:56px minmax(0,1fr); column-gap:14px; padding:28px 0; border-bottom:1px solid var(--rule); }
  .num { grid-row:span 2; font-size:2.1rem; line-height:1; font-weight:300; letter-spacing:-.04em; font-variant-numeric:tabular-nums; color:var(--olive); }
  .steps h3 { margin:0; font-size:1.45rem; line-height:1.2; letter-spacing:-.02em; }
  .when { display:block; margin-top:4px; font-size:.78rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--olive); }
  .steps p { grid-column:2; margin:12px 0 0; max-width:34em; color:var(--muted); }

  /* Evidence and human confirmation */
  .proof { padding:96px 0; background:var(--paper2); }
  .proof .wrap { display:grid; gap:36px; }
  .proof h2 { font-size:clamp(2.2rem, 8vw, 4.2rem); }
  .proof-body p { margin:0 0 16px; max-width:34em; color:var(--muted); font-size:1.06rem; }
  .proof-body p:first-child { color:var(--ink); font-size:1.2rem; line-height:1.5; }
  .trail-box { background:var(--paper); border:1px solid var(--rule); border-radius:16px; padding:26px 24px 8px; }
  .trail-label { margin:0 0 20px; font-size:.78rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--olive); }
  .trail { list-style:none; margin:0; padding:0; }
  .trail li { position:relative; padding:0 0 22px 32px; }
  .trail li::before { content:""; position:absolute; left:0; top:7px; width:12px; height:12px; border-radius:50%; border:2px solid var(--forest); background:var(--paper); }
  .trail li:not(:last-child)::after { content:""; position:absolute; left:5px; top:23px; bottom:2px; width:2px; background:var(--rule); }
  .trail li.done::before { background:var(--lime); }
  .trail b { display:block; font-size:1.05rem; }
  .trail span { display:block; color:var(--muted); font-size:.94rem; }

  /* Open source close and footer */
  .open { padding:96px 0 72px; }
  .open-in { max-width:760px; }
  .open-in::before { content:""; display:block; width:64px; height:6px; margin-bottom:28px; border-radius:3px; background:var(--lime); }
  .open p { margin:18px 0 0; max-width:34em; color:var(--muted); font-size:1.08rem; }
  .foot { border-top:1px solid var(--rule); }
  .foot .wrap { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:8px 24px; padding-top:20px; padding-bottom:36px; }
  .foot p { margin:0; font-size:.9rem; color:var(--muted); }
  .foot p a { color:var(--ink); font-weight:650; }

  /* Scroll reveals (only when /landing.js opts in) */
  [data-reveal] { transition:opacity .7s var(--ease), transform .7s var(--ease); }
  .has-reveal [data-reveal]:not(.is-in) { opacity:0; transform:translateY(20px); }
  .steps li:nth-child(2) { transition-delay:.06s; }
  .steps li:nth-child(3) { transition-delay:.12s; }

  @media (min-width:760px) {
    .top { position:sticky; top:0; -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px); }
    .top nav { margin-left:0; }
    .steps li { grid-template-columns:96px 220px minmax(0,1fr); column-gap:24px; padding:34px 0; }
    .num { grid-row:auto; font-size:3.2rem; }
    .steps p { grid-column:3; margin:4px 0 0; }
  }
  @media (min-width:960px) {
    .hero { grid-template-columns:minmax(28px,1fr) minmax(0,470px) 72px minmax(0,700px) minmax(0,1fr); align-items:center; padding:72px 0 124px; }
    .hero-media { grid-column:4 / -1; }
    .hero-media img { aspect-ratio:auto; height:min(72vh, 640px); min-height:460px; border-radius:22px 0 0 22px; }
    .hero-media figcaption { padding:0 28px 0 4px; }
    .how { padding:128px 0; }
    .how .wrap { display:grid; grid-template-columns:minmax(0,4fr) minmax(0,7fr); gap:72px; align-items:start; }
    .how-head { position:sticky; top:110px; }
    .steps { margin-top:0; }
    .proof { padding:128px 0; }
    .proof .wrap { grid-template-columns:minmax(0,7fr) minmax(0,5fr); column-gap:80px; row-gap:32px; }
    .proof-lede { grid-column:1; grid-row:1; }
    .proof-body { grid-column:1; grid-row:2; }
    .trail-box { grid-column:2; grid-row:1 / span 2; align-self:end; }
    .open { padding:128px 0 96px; }
  }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior:auto; }
    *, *::before, *::after { animation:none !important; transition:none !important; }
    .has-reveal [data-reveal]:not(.is-in) { opacity:1; transform:none; }
  }
@media(prefers-color-scheme:dark){:root{--paper:#19261c;--paper2:#243525;--ink:#e7ecd9;--muted:#b6c2ad;--rule:#43523d;--forest:#c9e86a;--forest2:#d4eb9b;--olive:#b3c98d;--lime:#30442b}.top{background:#19261c}.hero-photo img{opacity:.95}}
</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <div class="top-in">
    <a class="brand" href="/" aria-label="FieldIssue home"><span class="mark" aria-hidden="true"></span>FieldIssue</a>
    <nav aria-label="Primary">
      <a href="#how">How it works</a>
      <a href="${repoUrl}">GitHub</a>
      <a class="nav-cta" href="/app">Open dashboard</a>
    </nav>
  </div>
</header>

<main id="main">
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-copy">
    <p class="eyebrow">GitHub Issues for the real world</p>
    <h1 id="hero-title"><span>Report it.</span><span>Revisit it.</span><span class="hl">Close it.</span></h1>
    <p class="lead">Notice a problem on your walk. Photograph it, return later, and keep a clear record of what changed.</p>
    <div class="actions">
      <a class="btn btn-primary" href="/app">Open the dashboard</a>
      <a class="btn btn-quiet" href="#how">How it works</a>
    </div>
  </div>
  <figure class="hero-media">
    <img src="/assets/field-walk.png" width="1536" height="1024" alt="Illustrated neighbourhood park with a path, trees and benches." fetchpriority="high" decoding="async">
    <figcaption>AI-generated illustration. Not submitted field evidence.</figcaption>
  </figure>
</section>

<section class="how" id="how" aria-labelledby="how-title">
  <div class="wrap">
    <div class="how-head" data-reveal>
      <p class="kicker">How it works</p>
      <h2 id="how-title">One place, looked at more than once.</h2>
      <p class="section-lede">An issue is not a single complaint. It is a record that grows every time someone walks back past it.</p>
    </div>
    <ol class="steps">
      <li data-reveal>
        <span class="num" aria-hidden="true">01</span>
        <h3>Observe<span class="when">On the first walk</span></h3>
        <p>Photograph the problem where it is, add a short note and pin it to the place. That opens the issue.</p>
      </li>
      <li data-reveal>
        <span class="num" aria-hidden="true">02</span>
        <h3>Revisit<span class="when">Days or weeks later</span></h3>
        <p>Go back to the same spot and photograph it again from a similar angle. Each visit is added to the issue, never written over.</p>
      </li>
      <li data-reveal>
        <span class="num" aria-hidden="true">03</span>
        <h3>Compare<span class="when">Side by side</span></h3>
        <p>Put the earlier and later evidence next to each other and note what was removed, added or still the same. One question matters: did it actually change?</p>
      </li>
    </ol>
  </div>
</section>

<section class="proof" aria-labelledby="proof-title">
  <div class="wrap">
    <div class="proof-lede" data-reveal>
      <p class="kicker">Evidence, then a decision</p>
      <h2 id="proof-title">Software can suggest. A person closes.</h2>
    </div>
    <div class="proof-body" data-reveal>
      <p>Every photo, note and visit stays attached to its issue, so anyone can see why it was opened and what happened next.</p>
      <p>Gemma comparisons are labelled suggestions. If the model is unavailable, FieldIssue reports the failure without inventing an answer. A person reviews the evidence and decides whether to close the issue.</p>
    </div>
    <div class="trail-box" data-reveal>
      <p class="trail-label" id="trail-label">How an issue's history builds up</p>
      <ol class="trail" aria-labelledby="trail-label">
        <li><b>Opened</b><span>First photo, note and place</span></li>
        <li><b>Revisited</b><span>A new photo from the same spot</span></li>
        <li><b>Compared</b><span>What changed, side by side</span></li>
        <li class="done"><b>Resolved</b><span>Confirmed by a person, with a note</span></li>
      </ol>
    </div>
  </div>
</section>

<section class="open" aria-labelledby="open-title">
  <div class="wrap">
    <div class="open-in" data-reveal>
      <h2 id="open-title">Built in the open.</h2>
      <p>FieldIssue is an open-source hackathon project. Read the code, open an issue of your own, or run it for your neighbourhood.</p>
      <div class="actions">
        <a class="btn btn-primary" href="${repoUrl}">View on GitHub</a>
        <a class="btn btn-quiet" href="/app">Open dashboard</a>
      </div>
    </div>
  </div>
</section>
</main>

<footer class="foot">
  <div class="wrap">
    <a class="brand" href="/" aria-label="FieldIssue home"><span class="mark" aria-hidden="true"></span>FieldIssue</a>
    <p>Open source on <a href="${repoUrl}">GitHub</a>. The image on this page is an AI-generated illustration, not field evidence.</p>
  </div>
</footer>
</body>
</html>
`;

// Scroll reveals only. Loaded with defer, so the DOM is ready. Anything already
// on screen is marked visible before the opt-in class is added, so nothing
// above the fold flashes. With reduced motion or no IntersectionObserver the
// script does nothing and the page stays fully visible.
export const landingPageScript = String.raw`"use strict";
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;
  var items = document.querySelectorAll("[data-reveal]");
  var vh = window.innerHeight || document.documentElement.clientHeight || 0;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
  items.forEach(function (node) {
    if (node.getBoundingClientRect().top < vh) node.classList.add("is-in");
    else io.observe(node);
  });
  document.documentElement.classList.add("has-reveal");
})();
`;
