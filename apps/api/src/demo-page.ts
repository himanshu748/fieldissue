// A single static demo page served by the API itself. It holds no secrets and
// calls only the public API routes below, so it behaves exactly like any other
// HTTP client. With API_ACCESS_TOKEN set, the visitor pastes the shared demo
// token; it is kept in sessionStorage and never baked into this file.
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

export const demoPageHtml = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>FieldIssue demo</title>
<style>
  :root { --ink:#1d2a22; --muted:#5b6b60; --line:#d6ddd8; --bg:#f6f8f5; --card:#fff; --accent:#2f7d4f; --warn:#8a5a00; --warnbg:#fff4dc; }
  * { box-sizing:border-box; }
  body { margin:0; font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:var(--ink); background:var(--bg); }
  main { max-width:720px; margin:0 auto; padding:20px 16px 64px; }
  h1 { font-size:1.6rem; margin:0 0 4px; }
  h2 { font-size:1.15rem; margin:0 0 8px; }
  p.lead { color:var(--muted); margin:0 0 16px; }
  section { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:16px; margin:14px 0; }
  label { display:block; font-weight:600; font-size:.9rem; margin:10px 0 4px; }
  input[type=text], input[type=password], input[type=number], textarea { width:100%; padding:9px 10px; border:1px solid var(--line); border-radius:8px; font:inherit; }
  textarea { min-height:64px; }
  .row { display:flex; gap:10px; flex-wrap:wrap; }
  .row > div { flex:1 1 140px; }
  button { margin-top:12px; padding:10px 16px; border:0; border-radius:8px; background:var(--accent); color:#fff; font:inherit; font-weight:600; cursor:pointer; }
  button.secondary { background:#e8eee9; color:var(--ink); }
  button:disabled { opacity:.55; cursor:progress; }
  .banner { background:var(--warnbg); color:var(--warn); border-radius:8px; padding:10px 12px; margin:10px 0; font-size:.92rem; }
  .error { background:#fde8e8; color:#8a1f1f; border-radius:8px; padding:10px 12px; margin:10px 0; font-size:.92rem; }
  .muted { color:var(--muted); font-size:.88rem; }
  .pill { display:inline-block; padding:2px 8px; border-radius:99px; background:#e8eee9; font-size:.8rem; font-weight:600; margin-right:4px; }
  .photos { display:flex; gap:10px; flex-wrap:wrap; margin-top:10px; }
  .photos figure { margin:0; flex:1 1 200px; }
  .photos img { width:100%; max-height:260px; object-fit:cover; border-radius:8px; border:1px solid var(--line); background:#eee; }
  .photos figcaption { font-size:.8rem; color:var(--muted); }
  ul.compact { margin:4px 0 0; padding-left:20px; }
  .diff h3 { font-size:.95rem; margin:10px 0 0; }
  ol.timeline { padding-left:20px; margin:6px 0 0; }
  ol.timeline li { margin:2px 0; }
  .issues button { margin:6px 6px 0 0; }
  [hidden] { display:none !important; }
</style>
</head>
<body>
<main>
  <h1>FieldIssue</h1>
  <p class="lead">Walk your street, photograph what's broken, and come back to prove it got fixed. This page drives the same public API as any HTTP client: report, revisit, compare, then a person resolves.</p>

  <section id="access">
    <h2>Access</h2>
    <p class="muted">Only needed on a hosted demo that sets a shared access token. Kept in this browser tab only.</p>
    <label for="token">Demo access token</label>
    <input id="token" type="password" autocomplete="off" placeholder="leave empty for a local run">
    <div id="modeBanner" class="banner" hidden></div>
  </section>

  <section id="report">
    <h2>1. Report an issue</h2>
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
    <h2>2. Revisit and compare</h2>
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
    <h2>3. Resolve (a person decides)</h2>
    <p class="muted">The model can only recommend a status. Closing the issue is your explicit decision and is recorded in the timeline.</p>
    <label for="resolveNote">Resolution note</label>
    <input id="resolveNote" type="text" maxlength="5000" placeholder="e.g. Checked on revisit: slats replaced">
    <button id="doResolve" type="button">Mark resolved</button>
    <div id="resolveError" class="error" hidden></div>
  </section>

  <section id="timelineBox" hidden>
    <h2>Timeline</h2>
    <ol class="timeline" id="timeline"></ol>
  </section>

  <section id="open">
    <h2>Open issues</h2>
    <p class="muted">Pick an existing issue to revisit it. Seeded demo issues (FI-9000xx) are fictional and their images say DEMO FIXTURE.</p>
    <button id="loadOpen" class="secondary" type="button">Load open issues</button>
    <div id="openError" class="error" hidden></div>
    <div id="openList" class="issues"></div>
  </section>

  <p class="muted">Open source (MIT): <a href="https://github.com/himanshu748/fieldissue">github.com/himanshu748/fieldissue</a></p>
</main>
<script src="/demo.js"></script>
</body>
</html>
`;

// Client script. Plain ES2020, no build step, no template literals so it can
// live inside this TypeScript string unchanged.
export const demoPageScript = String.raw`"use strict";
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var state = { issue: null, objectUrls: [] };
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
      if (response.status === 503) msg += " (the vision model or a dependency is unavailable; nothing was saved as evidence)";
      throw new Error(msg);
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
  async function mediaUrl(observation) {
    var key = observation.storageKey;
    if (!key) return null;
    var response = await fetch("/media/" + encodeURIComponent(key), { headers: headers() });
    if (!response.ok) return null;
    var url = URL.createObjectURL(await response.blob());
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
  async function renderIssue(issue) {
    state.issue = issue;
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
      var src = await mediaUrl(o);
      if (src) img.src = src;
      fig.appendChild(img);
      fig.appendChild(el("figcaption", (i === 0 ? "First" : "Revisit " + i) + " - " + new Date(o.capturedAt).toLocaleString() + (o.note ? " - " + o.note : "")));
      photos.appendChild(fig);
    }
    await renderTimeline();
  }
  async function renderTimeline() {
    if (!state.issue) return;
    var data = await api("/v1/issues/" + state.issue.id + "/timeline");
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

  $("create").addEventListener("click", async function () {
    var button = this;
    showError("createError", null);
    busy(button, true, "Analysing photo...");
    try {
      if ($("lat").value === "" || $("lon").value === "") throw new Error("Add a location (Use my location, or type latitude and longitude)");
      var file = await prepareImage($("photo1").files[0]);
      var form = new FormData();
      if ($("title").value.trim()) form.set("title", $("title").value.trim());
      form.set("note", $("note1").value.trim());
      form.set("latitude", $("lat").value);
      form.set("longitude", $("lon").value);
      form.set("capturedAt", new Date().toISOString());
      form.set("image", file);
      var issue = await api("/v1/issues", { method: "POST", body: form, headers: { "Idempotency-Key": randomKey() } });
      $("diff").textContent = "";
      await renderIssue(issue);
      $("issue").scrollIntoView({ behavior: "smooth" });
    } catch (error) { showError("createError", error); }
    finally { busy(button, false); }
  });

  $("addRevisit").addEventListener("click", async function () {
    var button = this;
    showError("revisitError", null);
    busy(button, true, "Comparing...");
    try {
      if (!state.issue) throw new Error("Report or pick an issue first");
      var file = await prepareImage($("photo2").files[0]);
      var form = new FormData();
      form.set("note", $("note2").value.trim());
      form.set("capturedAt", new Date().toISOString());
      form.set("image", file);
      var result = await api("/v1/issues/" + state.issue.id + "/observations", { method: "POST", body: form });
      await renderIssue(await api("/v1/issues/" + state.issue.id));
      renderDiff(result);
    } catch (error) { showError("revisitError", error); }
    finally { busy(button, false); }
  });

  $("doResolve").addEventListener("click", async function () {
    var button = this;
    showError("resolveError", null);
    busy(button, true, "Resolving...");
    try {
      if (!state.issue) throw new Error("Report or pick an issue first");
      var issue = await api("/v1/issues/" + state.issue.id + "/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: $("resolveNote").value.trim() }),
      });
      await renderIssue(issue);
    } catch (error) { showError("resolveError", error); }
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
          try {
            $("diff").textContent = "";
            await renderIssue(await api("/v1/issues/" + item.id));
            $("issue").scrollIntoView({ behavior: "smooth" });
          } catch (error) { showError("openError", error); }
        });
        box.appendChild(b);
      });
    } catch (error) { showError("openError", error); }
    finally { busy(button, false); }
  });
})();
`;
