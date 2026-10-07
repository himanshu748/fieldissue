# FieldIssue demo walkthrough

A judge can try FieldIssue in a browser: the API serves one static page at `/`
that drives the same public endpoints as any HTTP client. Report an issue with
a photo, revisit it with a new photo, read the before/after comparison, then
resolve it yourself.

## Try it

**Hosted:** _add the URL and the demo access token here after deploying with
[`render.demo.yaml`](render.demo.yaml) (see
[docs/render-deployment.md](docs/render-deployment.md#judge-demo-profile-renderdemoyaml))._
The free service sleeps when idle and takes about a minute to wake. Photos are
kept only until the service restarts.

**Locally, no API keys (fixture mode):**

```sh
cp .env.example .env
make dev                      # Docker: API, intelligence service, PostGIS; seeds 7 demo issues
open http://127.0.0.1:3000/   # or paste the URL into any browser
```

No Docker? Follow "Native development" in the README, then open
`http://127.0.0.1:3000/`. Leave the access token field empty locally.

In fixture mode the page says so in a yellow banner: no vision model is
configured, so the "analysis" and "comparison" are built from your notes only
and confidence is 0. The photo is stored but not interpreted. Set
`AI_MOCK_MODE=false` and the `GEMMA_*` variables for real Gemma vision.

## What each step does

| Step on the page | API call | What you should see |
| --- | --- | --- |
| 1. Report an issue | `POST /v1/issues` (multipart photo + note + location) | `FI-…` ID, category, severity, conditions, objects, evidence, model name and confidence. The photo is resized to at most 1600 px in the browser, which also strips EXIF/GPS metadata. |
| 2. Revisit and compare | `POST /v1/issues/:id/observations`, which runs the comparison against the previous observation | Removed / added / unchanged conditions, a summary, and the model's recommended status. The issue stays in its current status. |
| 3. Resolve | `POST /v1/issues/:id/resolve` | Status `RESOLVED`; `STATUS_CHANGED` and `ISSUE_RESOLVED` events with your note in the timeline. |
| Timeline | `GET /v1/issues/:id/timeline` | Every event in order: created, classification, observation, diff, status, resolution. |
| Open issues | `GET /v1/issues?status=OPEN` | Pick any open issue (including the fictional seeded ones, `FI-9000xx`) to revisit it. |

Things the page deliberately does not do: it never resolves an issue on the
model's say-so, and it has no accounts, map view or revisit prediction
(TabPFN needs real labelled history first).

## ~2-minute video shot list

Record on a real walk with real Gemma (`AI_MOCK_MODE=false`). Only show what
actually happened; if Gemma gets something wrong, leave it in and say so.

| Time | Shot | Voice-over (suggested) |
| --- | --- | --- |
| 0:00–0:10 | Outside, phone in hand, the broken thing in frame (bench, pothole, dead streetlight). | "Every street has something broken that's been 'reported' three times. FieldIssue turns a walk into evidence." |
| 0:10–0:35 | Screen: open the page, take the photo with the phone camera, tap **Use my location**, type one sentence, tap **Report issue**. | "One photo, one sentence. That's all the screen time it asks for." |
| 0:35–0:55 | Screen: the result. Zoom on the conditions, evidence lines and the model name. | "An open-weight Gemma vision model describes what's actually in the frame, with the evidence behind each claim, and the issue gets an ID." |
| 0:55–1:05 | Outside again, later (different time of day is fine): same spot. | "The part that gets you back outside is the revisit." |
| 1:05–1:30 | Screen: **Add revisit** with the new photo; show removed / added / unchanged and the recommendation line. | "FieldIssue compares the two observations. The model can recommend a status, but it never closes the issue." |
| 1:30–1:45 | Screen: type a resolution note, **Mark resolved**, scroll to the timeline. | "A person does that, explicitly, and it lands in the timeline." |
| 1:45–2:00 | Screen: GitHub repo, then back outside. | "It's MIT-licensed, built on open models. Go for a walk." |

If nothing was actually fixed between your two visits, film the revisit anyway
and show Gemma reporting "unchanged": that is an honest result and still shows
the comparison working.

## Checklist before recording

- [ ] `AI_MOCK_MODE=false`, `GEMMA_*` set, and one test upload worked (no yellow fixture banner; the banner names the Gemma model).
- [ ] Filming on a phone outdoors needs the hosted demo (HTTPS). The local stack listens on `127.0.0.1` only, and browsers block location on plain-HTTP LAN addresses.
- [ ] Location permission allowed in the phone browser (or type coordinates).
- [ ] Photos contain no faces, number plates or private property you don't want public.
- [ ] Hosted demo: the access token is pasted into the page.
