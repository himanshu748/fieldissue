export {
  dashboardCsp as demoPageCsp,
  dashboardHtml as demoPageHtml,
} from "./dashboard-page.js";
export { landingPageScript as landingScript } from "./landing-page.js";
export const demoPageScript = String.raw`"use strict";
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var state = { listRequest:0, items:[], cursor:null, near:null, diffs:[], revisitLocation:null, locationSource:"manual", issue: null, objectUrls: [], selection: 0, render: 0, read: 0, selecting: false, create: null, revisits: Object.create(null) };
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
      if (response.status === 401) { msg = "Enter your workspace access token to continue."; $("access").hidden = false; $("access").open = true; }
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
      if (file.size > 20971520) { reject(new Error("Choose a photo smaller than 20 MB")); return; }
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
    showView("issue");
    if (window.history && window.location) {
      var canonical = "/app/issues/" + encodeURIComponent(issue.publicId || issue.id);
      if (window.location.pathname !== canonical) window.history.pushState({},"",canonical);
    }
    $("prediction").textContent = issue.revisitPrediction ? "Estimated chance of change: " + Math.round(issue.revisitPrediction.probabilityChanged*100) + "% · priority " + Number(issue.revisitPrediction.priorityScore).toFixed(2) + ". Model " + issue.revisitPrediction.modelVersion + ". This is a suggestion, not a verified change." : "Revisit ranking is unavailable for this issue. No prediction has been invented.";
    $("reopen").hidden = issue.status !== "RESOLVED";
    $("audioPlayer").hidden = true;
    $("copied").textContent = "";
    if (changedIssue) {
      state.revisitLocation = null;
      $("revisitLocationHint").textContent = "Location is inherited from the issue unless you check it here.";
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
    if (revisit && revisit.uncertain) showError("revisitError", new Error("Save not confirmed. Retry sends the identical revisit with the same key."));
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
      if (src) { img.src = src; fig.appendChild(img); }
      else fig.appendChild(el("p","Photo unavailable. The observation is still recorded. Contact the workspace owner to restore its media.","media-missing"));
      fig.appendChild(el("figcaption", (i === 0 ? "First" : "Revisit " + i) + " - " + new Date(o.capturedAt).toLocaleString() + (o.captureTimeSource === "upload" ? " (upload time)" : "") + (o.locationSource === "inherited" ? " · inherited location" : "") + (o.note ? " - " + o.note : "")));
      photos.appendChild(fig);
    }
    await loadDiffs(issue,version,selection);
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
      var names = {ISSUE_CREATED:"Issue reported", OBSERVATION_ADDED:"Observation added", CLASSIFICATION_UPDATED:"Classification updated", DIFF_GENERATED:"Comparison saved", ISSUE_RESOLVED:"Marked resolved", REVISIT_REVIEWED:"Revisit reviewed", STATUS_CHANGED:"Status changed"};
      if (e.eventType === "STATUS_CHANGED" && e.payload) extra = " · " + e.payload.from + " → " + e.payload.to + extra;
      ol.appendChild(el("li", new Date(e.createdAt).toLocaleString() + " · " + (names[e.eventType] || e.eventType) + extra));
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
    if(d.supersededAt || !["CHANGED","UNCHANGED"].includes(d.outcome)) {
      box.appendChild(el("h3",d.supersededAt ? "Superseded comparison" : "No reliable change conclusion"));
      box.appendChild(el("p",d.supersededReason || d.comparabilityReason || "An explicit comparability assessment is needed."));
      box.appendChild(el("p",d.summary));
      return;
    }
    modeNotice(d.model);
    var suggestion = el("details"), suggestionTitle = el("summary", "Show Gemma’s comparison suggestion");
    suggestion.appendChild(suggestionTitle);
    var modelBox=el("div");suggestion.appendChild(modelBox);
    modelBox.appendChild(el("h3", "What changed since the previous observation"));
    modelBox.appendChild(el("p", d.summary));
    var lists = el("div",null,"diff-lists");
    lists.appendChild(list("Removed",d.removed)); lists.appendChild(list("Added",d.added)); lists.appendChild(list("Unchanged",d.unchanged)); modelBox.appendChild(lists);
    var rec = el("p");
    rec.appendChild(el("span", "model recommends " + d.recommendedStatus, "pill"));
    rec.appendChild(el("span", "confidence " + d.confidence, "pill"));
    modelBox.appendChild(rec);
    modelBox.appendChild(el("p", "This is a recommendation only. Current issue status: " + state.issue.status + ". Model: " + d.model + " (" + d.modelVersion + ")", "muted"));
    var observedAfter = state.issue.observations.find(function(o){return o.id===d.afterObservationId;});
    if(observedAfter && observedAfter.revisitFeatures && observedAfter.previousObservationId===d.beforeObservationId){
      var review = el("form"), reviewTitle=el("h3","Your assessment"), reviewHint=el("p","Review both photos yourself. These answers help learn when a return visit is useful; they do not close the issue.","muted");
      var decisionLabel=el("label","Did the physical condition materially change?"), decision=el("select");
      decision.required=true;
      [["","Choose an assessment"],["changed","Yes, it changed"],["unchanged","No material change"]].forEach(function(v){var opt=el("option",v[1]);opt.value=v[0];decision.appendChild(opt);});decisionLabel.appendChild(decision);
      var noteLabel=el("label","What in the photos supports your assessment?"), note=el("textarea");note.required=true;note.minLength=10;note.maxLength=2000;noteLabel.appendChild(note);
      var genuineLabel=el("label"), genuine=el("input");genuine.type="checkbox";genuine.required=true;genuineLabel.appendChild(genuine);genuineLabel.appendChild(el("span"," These are genuine field visits, not a demonstration or generated evidence."));
      var submit=el("button","Save my assessment"), status=el("p",null,"muted");submit.type="submit";status.setAttribute("role","status");
      [reviewTitle,reviewHint,decisionLabel,noteLabel,genuineLabel,submit,status].forEach(function(n){review.appendChild(n);});
      var reviewIssueId=state.issue.id;
      review.addEventListener("submit",async function(event){event.preventDefault();if(!decision.value||!genuine.checked)return;busy(submit,true,"Saving…");try{await api("/v1/issues/"+reviewIssueId+"/revisit-review",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({beforeObservationId:d.beforeObservationId,afterObservationId:d.afterObservationId,materialChange:decision.value==="changed",note:note.value,evidenceIsGenuine:true})});status.textContent="Assessment saved. Issue status is unchanged.";}catch(error){status.textContent=error.message;}finally{busy(submit,false);}});
      box.appendChild(review);
    }
    box.appendChild(suggestion);
  }
  function randomKey() {
    if (window.crypto && crypto.randomUUID) return "web-" + crypto.randomUUID();
    return "web-" + Date.now() + "-" + Math.random().toString(36).slice(2);
  }

  $("locate").addEventListener("click", function () {
    if (!navigator.geolocation) { showError("createError", new Error("Location is not available in this browser; type coordinates instead")); return; }
    navigator.geolocation.getCurrentPosition(function (pos) {
      state.locationSource = "device";
      $("locationHint").textContent = "Location checked. Accuracy about " + Math.round(pos.coords.accuracy) + " m.";
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
        setCapture(form,"captured1");
        form.set("locationSource",state.locationSource);
        form.set("image", await prepareImage(source));
        // Keep the exact prepared bytes, fields, timestamp and key until the
        // server confirms success, even if the form changes or a reply is lost.
        state.create = { form: form, key: randomKey(), source: source, note: note, title: title };
      }
      var pending = state.create;
      var issue = await api("/v1/issues", { method: "POST", body: pending.form, headers: { "Idempotency-Key": pending.key } });
      if (!issue || !issue.id) throw new Error("Save response was not readable");
      state.create = null;
      if ($("photo1").files[0] === pending.source) { $("photo1").value = ""; $("preview1").hidden=true; }
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
      if (previous && previous.uncertain) { attempt = previous; }
      else {
        var form = new FormData();
        form.set("note",note);
        setCapture(form,"captured2");
        if (state.revisitLocation) {
          form.set("latitude",String(state.revisitLocation.latitude));
          form.set("longitude",String(state.revisitLocation.longitude));
          form.set("locationSource","device");
        } else form.set("locationSource","inherited");
        form.set("image",await prepareImage(source));
        attempt = {source:source, note:note, form:form, key:randomKey(), uncertain:false};
        state.revisits[id] = attempt;
      }
      attempt.inFlight = true;
      var result = await api("/v1/issues/" + id + "/observations", {method:"POST",body:attempt.form,headers:{"Idempotency-Key":attempt.key}});
      if (!result || !result.observation) throw new Error("Save response was not readable");
      attempt.uncertain = false;
      attempt.result = result;
      // Retire only this submitted input; never erase a newer issue's draft.
      if (selection === state.selection) {
        if ($("photo2").files[0] === attempt.source) { $("photo2").value = ""; $("preview2").hidden=true; }
        if ($("note2").value.trim() === attempt.note) $("note2").value = "";
        renderDiff(result);
        await refresh(id, selection, true);
      }
    } catch (error) {
      if (attempt && !attempt.result) {
        var rejected = [400,401,403,409,413,422,429].includes(error.status);
        if (rejected && !attempt.uncertain) delete state.revisits[id];
        else attempt.uncertain = true;
      }
      if (selection === state.selection) showError("revisitError", attempt && attempt.uncertain ? new Error("Save not confirmed. Retry sends the identical revisit, safely using the same key. " + error.message) : error);
    }
    finally { if(attempt) attempt.inFlight = false; busy(button, false); }
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

  $("loadOpen").addEventListener("click",function(){ return loadIssues(false); });
  $("loadMore").addEventListener("click",function(){ return loadIssues(true); });
  $("searchForm").addEventListener("submit",function(event){event.preventDefault();return loadIssues(false);});
  function showView(view) {
    $("listView").hidden=view!=="list"; $("reportView").hidden=view!=="report"; $("issueView").hidden=view!=="issue";
    if ($("navIssues").setAttribute) {
      $("navIssues").setAttribute("aria-current",view==="list"?"page":"false");
      $("navReport").setAttribute("aria-current",view==="report"?"page":"false");
    }
  }
  function setCapture(form,id) {
    var value=$(id).value;
    var date=value?new Date(value):new Date();
    if (!Number.isFinite(date.getTime()) || date.getTime()>Date.now()+60000) throw new Error("Choose a valid capture time that is not in the future.");
    form.set("capturedAt",date.toISOString()); form.set("captureTimeSource",value?"user":"upload");
  }
  async function selectIssue(id) {
    var selection=++state.selection,read=++state.read; state.selecting=true; ++state.render;
    try {
      var issue=await api("/v1/issues/"+encodeURIComponent(id));
      if (read!==state.read) return;
      await renderIssue(issue,selection);
      if (selection===state.selection) $("issue").scrollIntoView({behavior:"smooth"});
    } catch(error) { if(selection===state.selection && read===state.read) showError("openError",error); }
    finally {if(selection===state.selection)state.selecting=false;}
  }
  async function loadIssues(append) {
    var request=++state.listRequest; var button=append?$("loadMore"):$("loadOpen");
    busy(button,true,"Loading…"); showError("openError",null);
    var query=new URLSearchParams({limit:"20"});
    [["status","statusFilter"],["category","categoryFilter"],["severity","severityFilter"],["search","search"]].forEach(function(pair){ if($(pair[1]).value)query.set(pair[0],$(pair[1]).value.trim()); });
    if(append && state.cursor)query.set("cursor",state.cursor);
    if(state.near){query.set("near_lat",state.near.latitude);query.set("near_lon",state.near.longitude);query.set("radius_meters","2000");}
    try {
      var data=await api("/v1/issues?"+query.toString());
      if(request!==state.listRequest)return;
      state.items=append?state.items.concat(data.items):data.items; state.cursor=data.nextCursor || null;
      $("loadMore").hidden=!state.cursor;
      $("listCount").textContent=state.items.length+" issue"+(state.items.length===1?"":"s")+" loaded"+(state.near?" within 2 km":"")+(state.cursor?" · more available":"");
      var box=$("openList");box.textContent="";
      if(!state.items.length){var empty=el("div",null,"empty");empty.appendChild(el("h3","A place for the things you notice."));empty.appendChild(el("p","No matching issues yet. Try another filter, or report something on your next walk.","muted"));var link=el("a","Report an issue","button");link.href="/app/report";empty.appendChild(link);box.appendChild(empty);}
      state.items.forEach(function(item){
        var b=el("button",null,"issue-card");b.type="button";
        var copy=el("div");copy.appendChild(el("span",item.publicId,"issue-id"));copy.appendChild(el("span",item.title,"issue-name"));
        var updated = new Date(item.updatedAt || item.createdAt);
        copy.appendChild(el("span",item.category.toLowerCase().replaceAll("_"," ")+(Number.isNaN(updated.getTime()) ? "" : " · updated "+updated.toLocaleDateString()),"muted"));b.appendChild(copy);
        var tags=el("span",null,"card-tags"),status=el("span",item.status.toLowerCase().replaceAll("_"," "),"pill"),severity=el("span",item.severity.toLowerCase(),"pill");status.dataset.status=item.status;severity.dataset.severity=item.severity;tags.appendChild(status);tags.appendChild(severity);b.appendChild(tags);
        b.addEventListener("click",function(){return selectIssue(item.id);});box.appendChild(b);
      });
      if(window.history && window.location && window.location.pathname==="/app"){
        query.delete("cursor");query.delete("limit");window.history.replaceState({},"","/app"+(query.size?"?"+query.toString():""));
      }
      renderMap();
    }catch(error){if(request===state.listRequest)showError("openError",error);}
    finally{busy(button,false);}
  }
  async function loadDiffs(issue,version,selection) {
    $("beforeSelect").textContent="";$("afterSelect").textContent="";
    issue.observations.forEach(function(o,i){
      ["beforeSelect","afterSelect"].forEach(function(id){var option=el("option",(i+1)+" · "+new Date(o.capturedAt).toLocaleString());option.value=o.id;$(id).appendChild(option);});
    });
    if(issue.observations.length>1){$("beforeSelect").value=issue.observations.at(-2).id;$("afterSelect").value=issue.observations.at(-1).id;}
    $("compareAgain").disabled=issue.observations.length<2;
    showError("diffError",null);
    try{
      var data=await api("/v1/issues/"+issue.id+"/diffs");
      if(version!==state.render || selection!==state.selection)return;
      state.diffs=data.items || [];$("diffSelect").textContent="";$("diffSelect").disabled=!state.diffs.length;
      state.diffs.forEach(function(d,i){var before=issue.observations.findIndex(o=>o.id===d.beforeObservationId)+1,after=issue.observations.findIndex(o=>o.id===d.afterObservationId)+1;var option=el("option","Observation "+before+" → "+after);option.value=String(i);$("diffSelect").appendChild(option);});
      if(state.diffs.length){$("diffSelect").value=String(state.diffs.length-1);renderDiff({realWorldDiff:state.diffs.at(-1)});}
      else if(!state.revisits[issue.id] || !state.revisits[issue.id].result){$("diff").textContent=issue.observations.length<2?"Add a revisit to compare what changed.":"No saved comparison yet. Choose two observations to compare.";}
    }catch(error){if(version===state.render)showError("diffError",new Error("Could not load saved comparisons. "+error.message));}
  }
  $("diffSelect").addEventListener("change",function(){var diff=state.diffs[Number(this.value)];if(diff)renderDiff({realWorldDiff:diff});});
  $("compareAgain").addEventListener("click",async function(){
    if(!state.issue || this.disabled)return;var id=state.issue.id,selection=state.selection;busy(this,true,"Comparing…");
    try{var diff=await api("/v1/issues/"+id+"/diff",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({beforeObservationId:$("beforeSelect").value,afterObservationId:$("afterSelect").value})});if(selection===state.selection){renderDiff({realWorldDiff:diff});await refresh(id,selection,true);}}
    catch(error){if(selection===state.selection)showError("diffError",error);}finally{busy(this,false);}
  });
  ["lat","lon"].forEach(function(id){$(id).addEventListener("input",function(){state.locationSource="manual";$("locationHint").textContent="Manually entered location.";});});
  $("locateRevisit").addEventListener("click",function(){
    if(!navigator.geolocation){showError("revisitError",new Error("Location is unavailable. The issue location will be labeled inherited."));return;}
    var selection=state.selection;
    navigator.geolocation.getCurrentPosition(function(pos){if(selection!==state.selection)return;state.revisitLocation={latitude:pos.coords.latitude,longitude:pos.coords.longitude};$("revisitLocationHint").textContent="Device location checked, accuracy about "+Math.round(pos.coords.accuracy)+" m. Verify that you are at the same place.";},function(){showError("revisitError",new Error("Location was not shared. The issue location will be labeled inherited."));},{enableHighAccuracy:true,timeout:10000});
  });
  $("copyLink").addEventListener("click",async function(){try{await navigator.clipboard.writeText(window.location.origin+"/app/issues/"+state.issue.publicId);$("copied").textContent="Link copied";}catch(error){$("copied").textContent="Copy the address from your browser.";}});
  $("reopen").addEventListener("click",async function(){if(!state.issue || this.disabled)return;var id=state.issue.id,selection=state.selection;busy(this,true,"Reopening…");try{var issue=await api("/v1/issues/"+id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"OPEN"})});await showSaved(issue,selection);}catch(error){showError("refreshError",error);}finally{busy(this,false);}});
  var audioUrl=null;
  $("listen").addEventListener("click",async function(){if(!state.issue || this.disabled)return;var id=state.issue.id,selection=state.selection;busy(this,true,"Preparing briefing…");showError("audioError",null);try{var audio=await api("/v1/issues/"+id+"/audio-summary",{method:"POST"});var response=await fetch("/media/"+encodeURIComponent(audio.storageKey),{headers:headers()});if(!response.ok)throw new Error("The saved briefing could not be loaded.");var blob=await response.blob();if(selection!==state.selection)return;if(audioUrl)URL.revokeObjectURL(audioUrl);audioUrl=URL.createObjectURL(blob);$("audioPlayer").src=audioUrl;$("audioPlayer").hidden=false;}catch(error){if(selection===state.selection)showError("audioError",error);}finally{busy(this,false);}});
  var map=null,markers=null;
  function renderMap(){
    if($("mapPanel").hidden || !window.L)return;
    if(!map){map=L.map("map").setView([12.97,77.59],12);L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).on("tileerror",function(){$("mapError").textContent="Street tiles are unavailable. Issue locations and the list remain usable.";}).addTo(map);markers=L.layerGroup().addTo(map);}
    markers.clearLayers();var bounds=[];
    state.items.forEach(function(item){var point=[item.latitude,item.longitude];bounds.push(point);var popup=el("div",null,"map-card");popup.appendChild(el("strong",item.publicId+" · "+item.title));var open=el("button","Open issue");open.addEventListener("click",function(){selectIssue(item.id);});popup.appendChild(open);L.circleMarker(point,{radius:8,color:item.status==="RESOLVED"?"#749359":"#245b3b",fillOpacity:.85,weight:2}).bindPopup(popup).addTo(markers);});
    map.invalidateSize();if(bounds.length)map.fitBounds(bounds,{padding:[30,30],maxZoom:16});
  }
  $("toggleMap").addEventListener("click",function(){$("mapPanel").hidden=!$("mapPanel").hidden;this.textContent=$("mapPanel").hidden?"Show map":"Hide map";this.setAttribute("aria-expanded",String(!$("mapPanel").hidden));renderMap();});
  $("nearby").addEventListener("click",function(){if(!navigator.geolocation){showError("openError",new Error("Location unavailable in this browser."));return;}navigator.geolocation.getCurrentPosition(function(pos){state.near={latitude:pos.coords.latitude,longitude:pos.coords.longitude};$("clearNearby").hidden=false;loadIssues(false);},function(){showError("openError",new Error("Location was not shared. All issues remain available."));},{timeout:10000});});
  $("clearNearby").addEventListener("click",function(){state.near=null;this.hidden=true;loadIssues(false);});
  [1,2].forEach(function(n){var previewUrl=null;$("photo"+n).addEventListener("change",function(){if(previewUrl)URL.revokeObjectURL(previewUrl);var file=this.files[0];$("preview"+n).hidden=!file;if(file){previewUrl=URL.createObjectURL(file);$("preview"+n).src=previewUrl;}});});
  async function boot(){
    var path=window.location.pathname;
    showView(path==="/app/report"?"report":"list");
    var params=new URLSearchParams(window.location.search);
    [["status","statusFilter"],["category","categoryFilter"],["severity","severityFilter"],["search","search"]].forEach(function(pair){$(pair[1]).value=params.get(pair[0]) || "";});
    try{var response=await fetch("/app-config");var config=await response.json();$("access").hidden=!config.accessRequired;$("access").open=config.accessRequired && !tokenInput.value;$("listen").hidden=!config.audio;$("retentionNotice").textContent=config.retentionNotice || "";$("retentionNotice").hidden=!config.retentionNotice;if(config.mock)modeNotice("development-fixture");}catch(error){$("statusBar").textContent="Workspace settings unavailable. You can retry your request.";}
    var id=path.match(/^\/app\/issues\/([^/]+)$/);
    if(id)await selectIssue(decodeURIComponent(id[1]));else if(path!=="/app/report")await loadIssues(false);
  }
  $("connect").addEventListener("click",function(){sessionStorage.setItem("fieldissue-token",tokenInput.value.trim());$("access").open=false;return boot();});
  $("theme").addEventListener("click",function(){var dark=document.documentElement.dataset.theme!=="dark";document.documentElement.dataset.theme=dark?"dark":"light";sessionStorage.setItem("fieldissue-theme",dark?"dark":"light");});
  if(window.location){document.documentElement.dataset.theme=sessionStorage.getItem("fieldissue-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");boot();window.addEventListener("popstate",boot);window.addEventListener("beforeunload",function(event){if(state.create || Object.values(state.revisits).some(x=>x.uncertain || x.inFlight)){event.preventDefault();event.returnValue="";}});}
})();
`;
