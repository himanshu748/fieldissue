> V2 uses the React build served by the API: `/` landing, `/app/explore`, `/app/report`, issue-specific revisit/compare/resolve routes, `/app/walk`, and `/app/lab`. Build with `npm run build`. See [V2 implementation](docs/v2-implementation.md). The shot list below is a filming guide, not proof that a physical revisit occurred.

# FieldIssue demo walkthrough

A judge can try FieldIssue in a browser: `/` introduces the project and `/app`
is the separate field workspace, backed by the public API. Report an issue with
a photo, revisit it with a new photo, read the before/after comparison, then
resolve it yourself.

## Try it

**Hosted:** [Landing page](https://fieldissue-demo.onrender.com/) · [Workspace](https://fieldissue-demo.onrender.com/app). Public guest access requires no token or account. Your browser owns the reports it creates; sign in through Community to retain ownership across devices. Operator access is for private administration, not judges.
The free service sleeps when idle and takes about a minute to wake. Photos and comparisons survive web restarts in PostgreSQL. The free database
expires on **7 November 2026**; export or migrate before then. The workspace shows this retention limit.

For a read-only preview, open [FI-000005](https://fieldissue-demo.onrender.com/app/issues/FI-000005): a labeled integration control with a CC0 sample photo and synthetic 0,0 location. Its repeated-photo comparison demonstrates the no-new-evidence safeguard. It is not outdoor proof. Play its saved ElevenLabs audio, then inspect real saved model outputs in [the Lab](https://fieldissue-demo.onrender.com/app/lab).

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
| Issue directory | `GET /v1/issues` with filters, search and cursor | Find active or closed issues and open their permanent `/app/issues/FI-…` links. |
| Saved comparisons | `GET /v1/issues/:id/diffs` | Evidence stays visible after reload, resolution and reopening. |
| Reopen | `PATCH /v1/issues/:id` | A resolved issue becomes open with a status event; previous evidence is retained. |

The model never resolves an issue itself. Ordinary status changes require report ownership. Optional accounts support private communities, assignments, saved walks and an inbox. Community resolution requires fresh compared evidence and two eligible member approvals; accounts are nicknames, not verified identities.

The Lab includes real Tinker trained-note interpretation and a real TabPFN API scenario tester. TabPFN uses clearly labeled synthetic data and scored below the majority baseline; real-history revisit ranking is disabled. Backboard compares two real open models. Saved responses are identified as saved, not fresh inference.

Walks can be saved and loaded manually across signed-in sessions. Google Maps walking directions require consent to share coordinates; internal map lines are straight connections. The PWA stores offline photo captures with explicit consent and manual retry, but does not provide offline AI or maps. Calendar files and in-app reminders do not send email or push. Open311 downloads are exports, not government submissions.

The dated [P2 acceptance ledger](docs/verification/p2-acceptance-2026-10-09.md) distinguishes local, hosted, provider and device checks. Physical Android camera/GPS and a real outdoor before/after visit still need independent verification.

## ~2-minute video shot list

Record on a real walk with real Gemma (`AI_MOCK_MODE=false`). Only show what
actually happened; if Gemma gets something wrong, leave it in and say so.

| Time | Shot | Voice-over (suggested) |
| --- | --- | --- |
| 0:00–0:10 | Outside, phone in hand, the broken thing in frame (bench, pothole, dead streetlight). | "FieldIssue lets me photograph an issue on a walk and return later to check whether it changed." |
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
- [ ] Public reporting works without an access token. Keep the creating browser's cookies, or sign in to preserve ownership.
- [ ] Any sample photos or synthetic coordinates are explicitly identified. Do not present this shot list as a recording that already happened.
