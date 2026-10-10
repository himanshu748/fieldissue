# Real revisit correction: 10 October 2026

Released on 10 October 2026 after owner approval to merge and deploy. FI-000007 remains OPEN. Migration 014 superseded legacy comparisons with audit events while preserving their original output. The owner subsequently approved the wrong-location correction and one fresh Gemma comparison; the result is recorded below. No provider settings or DEV article were changed.

## Incident and read-only reproduction

[Public report FI-000007](https://fieldissue-demo.onrender.com/app/issues/FI-000007), issue UUID `9a13ea56-24e7-4de5-8cc2-e2cda2ca703f`:

| Evidence | Time reported by the owner (IST) | Observation ID | Meaning |
|---|---|---|---|
| A | 9 Oct, approximately 17:29 | `d86c8e66-7989-4001-85dd-b9d038bf3785` | Original damaged tree |
| B | 10 Oct, approximately 08:38 | `891f7788-ee19-42b0-9ad5-8402e1b70fc8` | Owner identifies this as the wrong tree |
| C | 10 Oct, approximately 09:01 | `21174133-810b-4bf5-a090-dc42c50e95ed` | Owner identifies this as the original tree from another angle |

Read-only production API inspection on 10 October reproduced both saved comparisons:

- A → B: `5cbd0925-fcaf-4a67-9b9d-7413d45e99cb`; summary disclaims comparability, empty condition arrays, confidence 0, recommended OPEN.
- B → C: `d8bf6354-fd1a-4b1b-b05c-5e0c66501aaa`; summary disclaims comparability/different subject matter, yet added litter/dead branches and confidence 0.9, recommended OPEN.

The latter is a contradictory saved model result, not evidence that those conditions appeared. Inherited coordinates on the latest photo do not independently establish its location. Owner descriptions establish the intended subjects; the corrected pair still needs conservative visual assessment.

## Root cause and fix

The upload service chose the immediately preceding observation, without an eligibility concept. Model schemas checked field types but permitted contradictory claims. The UI inferred “no change” from empty arrays and exposed raw change indicators without a comparability assessment.

The corrected flow is:

1. An owner excludes B with a reason. A, B and C, their media, timestamps and analysis remain unchanged.
2. All current comparisons involving B are superseded. Corrections and supersessions append events.
3. Automatic selection uses the last eligible predecessor. Latest-eligible selection of A/B/C now chooses A → C. Original/latest and explicit eligible pairs are also supported.
4. Restoring B restores eligibility, not withdrawn model conclusions. Recomparison creates another comparison row.
5. A correction made while inference is running invalidates the pending save through the issue's evidence revision and row lock.
6. No comparison updates issue status. Human resolution remains an explicit action.

Same-image byte matching still bypasses inference. Its result is INSUFFICIENT_EVIDENCE, empty arrays, zero confidence and no recommended resolution. It does not prove that no physical change occurred.

## Data and API contract

Migration [`014_observation_corrections.sql`](../../db/migrations/014_observation_corrections.sql) extends existing tables; it adds no competing correction store:

- Observation exclusion type, correction reason and correction timestamp.
- Issue evidence revision for concurrency control.
- Comparison outcome, comparability reason, same-subject evidence, selection mode, revision and supersession metadata.
- A partial unique index permits one current comparison per pair while preserving previous rows.
- OBSERVATION_CORRECTED and COMPARISON_SUPERSEDED events in the existing ledger.

**Migration-wide effect:** all legacy comparisons are retained verbatim and marked superseded, because they lack an explicit comparability assessment. Each receives a migration audit event. No images, issue statuses, old summaries, arrays or confidence values are rewritten. Cached old results will require an authorized comparison before becoming current evidence again.

Owner/operator endpoint:

```http
POST /v1/issues/{id}/observations/{observationId}/correction
Content-Type: application/json

{"exclusionType":"WRONG_LOCATION","reason":"Different tree"}
```

Types: WRONG_LOCATION, WRONG_PHOTOGRAPH, NOT_SUITABLE, or `null` to restore. Reason is optional, capped at 1,000 characters. The normal guest/account session and same-origin checks apply. Authorization is repeated under the issue lock. Actor IDs in public events are pseudonymous; guest bearer credentials are not exposed.

```http
POST /v1/issues/{id}/diff
Content-Type: application/json

{"mode":"latest_eligible"}
```

Modes: `latest_eligible`, `original_latest`, or `manual` with `beforeObservationId` and `afterObservationId`. Existing manual requests remain valid. Excluded evidence is rejected (409), malformed/same/reversed pairs are rejected (400), and no eligible baseline returns 409. An excluded original is not silently replaced in original/latest mode.

Both Python and the API validate four outcomes:

- CHANGED requires an observable added/removed condition and explicit same-subject evidence.
- UNCHANGED requires positive unchanged evidence and explicit same-subject evidence.
- NOT_COMPARABLE / INSUFFICIENT_EVIDENCE require empty condition arrays, confidence 0 and recommended OPEN.
- Missing comparability fields or contradictory explanations fail conservatively. Invalid provider output cannot become a saved comparison; the uploaded observation remains saved.

Text checks catch explicit contradiction patterns; they are not proof of visual identity. The model prompt asks for subject/viewpoint assessment before changes. A model's same-subject assertions and confidence remain model output, not independent location proof.

## Interface and screenshots

The report shows eligibility, capture and upload timestamps, location source, original model output, owner correction controls and historical comparison links. The revisit page offers an original-photo reference. Selected observation IDs and historical comparison ID are encoded in the comparison URL and survive reload.

The viewer supports a keyboard-operated divider, a side-by-side option at mobile widths and reduced motion. Unreliable/superseded comparisons show a neutral explanation; original fields remain inspectable as raw historical output. They do not display verified change indicators or a confidence meter. An owner can still explicitly choose human resolution.

A read-only route, `/app/issues/:id/evidence`, presents the chronology, exclusion and latest current comparison without inference requests. The deployed route is available: [FI-000007 evidence walkthrough](https://fieldissue-demo.onrender.com/app/issues/FI-000007/evidence).

These are actual browser screenshots of the built application using a local PostgreSQL database and **synthetic schematic PNGs with a deterministic test-only provider**. They verify UI behavior, not real model accuracy or a completed outdoor correction.

| State | 360px | 390px |
|---|---|---|
| Non-comparable result | [Screenshot](assets/revisit-360-not-comparable.png) | [Screenshot](assets/revisit-390-not-comparable.png) |
| Excluded observation retained | [Screenshot](assets/revisit-360-excluded.png) | [Screenshot](assets/revisit-390-excluded.png) |
| Selected A → C comparison | [Screenshot](assets/revisit-360-comparison.png) | [Screenshot](assets/revisit-390-comparison.png) |
| Read-only walkthrough | [Screenshot](assets/revisit-360-walkthrough.png) | [Screenshot](assets/revisit-390-walkthrough.png) |

## Executed verification

Local verification completed on 10 October 2026:

| Command | Result |
|---|---|
| `npm test` with isolated TEST_DATABASE_URL | **180 passed**, 37 files, no skipped API tests |
| Python `pytest` | **76 passed** |
| Python `ruff check src tests` | Passed |
| `npm run lint` | Passed, including API types, formatting and web types |
| `npm run build` | Passed; Vite reports the existing >500 kB bundle warning |
| `npm run test:e2e` with local opt-in | **2 passed**, 1 live-provider journey intentionally skipped |
| `git diff --check` | Passed |

No live inference test was enabled.

[PR #4](https://github.com/himanshu748/fieldissue/pull/4) was merged as `077376ce2f1d6e6273a31f0a7318a401e0ef21d4`. Final branch CI [38025149289](https://github.com/himanshu748/fieldissue/actions/runs/38025149289) and merged-main CI [38025590879](https://github.com/himanshu748/fieldissue/actions/runs/38025590879) both passed all three jobs: Docker/PostGIS/API/Python verification, Render container lifecycle and isolated mobile journeys.

- PostgreSQL 17 with PostGIS/pgvector, isolated container `fieldissue-revisit-test`, localhost port 55439, tmpfs storage, database `fieldissue_test`. No production URL used by fixtures.
- API tests cover A/B/C correction, owner versus unrelated guest exclusion/restoration, metadata immutability, append-only comparison history, eligible automatic/manual selection, restore/recompare, concurrent correction, no baseline, exact-image protection, invalid provider responses and unchanged OPEN status.
- Migration test reconstructs the old schema in a rolled-back isolated schema, inserts the contradictory 0.9-confidence result, applies the upgrade and checks unchanged model fields, supersession event and OPEN status.
- Model validators were observed rejecting the production contradiction. A separate red/green test caught a CHANGED outcome whose reason said “not comparable”.
- Browser tests use real HTTP, guest cookies, PostgreSQL, built frontend and three schematic images. At both 360px and 390px: exclude B through confirmation, reload, compare A → C, reload selected pair, use keyboard slider, inspect side by side, view walkthrough, restore B and retain two superseded comparisons. No uncaught page errors or horizontal overflow observed. Slider touch area exceeds 44px; controls have accessible role/label selectors. Browser reduced-motion preference is enabled. This is not a physical screen-reader or Android camera test.
- Existing real-provider Playwright journey remains intentionally skipped. It would spend quota and modify live evidence if enabled.

Reproduce after `npm ci` and starting the isolated database:

```sh
npm run lint
npm run build
TEST_DATABASE_URL=postgresql://fieldissue:fieldissue-test-only@127.0.0.1:55439/fieldissue_test npm test
(cd services/intelligence && .venv/bin/python -m pytest && .venv/bin/ruff check src tests)
TEST_DATABASE_URL=postgresql://fieldissue:fieldissue-test-only@127.0.0.1:55439/fieldissue_test node scripts/revisit-test-server.mjs
# In another terminal, against the isolated server only:
FIELDISSUE_LOCAL_E2E=1 FIELDISSUE_E2E_URL=http://127.0.0.1:3190 npm run test:e2e
```

The test server refuses non-local databases and never loads production configuration. Its provider is confined to a test script. The normal Gemma, Tinker, Tiger Data, Mastra, Sentry and other provider configuration remains intact. Regression tests cover those code boundaries; this task does not certify fresh external calls to every provider.

## Release and rollback

Base inspected: `origin/main` at `e09e966`; last successful main CI inspected: [37984571682](https://github.com/himanshu748/fieldissue/actions/runs/37984571682), `d773b31`. Main remained unchanged at the pre-commit fetch. Branch: `fix/revisit-evidence-corrections`.

Release procedure (steps 1–4 completed; remaining owner actions are separate):

1. Review the PR and require all three CI jobs, including the isolated mobile workflow. Recheck main and Render's deployed commit so newer work is not overwritten.
2. Take a private database backup using the existing verified-TLS connection. Record the Render deployment ID, current schema migrations and counts of observations/diffs/events. Do not print connection secrets or publish backups.
3. Approve the migration-wide legacy supersession effect. Deploy API, Python validator/prompt and web UI from the same commit. Render's existing startup applies migrations transactionally when configured to migrate first. Do not run seeds in production.
4. Verify health/readiness, public reads, original media, new schema, OPEN status, mobile owner controls and unrelated-user denial before inference. Historical comparisons should be visibly superseded.
5. Obtain explicit owner approval to mark B WRONG_LOCATION through the normal owner browser interface, using the original guest session or linked account. Do not replace this with an unapproved operator SQL update.
6. Separately authorize one fresh A → C comparison within existing credit limits. Select the exact IDs above and preserve the exact result, provider/model/version, comparison ID, timestamp and uncertainty. NOT_COMPARABLE or INSUFFICIENT_EVIDENCE is an acceptable honest result. Never claim a repair or automatically resolve.
7. Record deployment/CI/comparison identifiers here, capture the actual outdoor walkthrough and request approval before editing the DEV post.

If verification fails: pause new evidence writes/inference and retain the backup plus current audit trail. Prefer a forward fix or a verified compatible application revision. A blind rollback to the old comparison code is unsafe: it would ignore exclusions, misread superseded rows and rely on a removed unique constraint. Do not drop correction columns/events or unsupersede legacy results to make the old binary work. A database restore is an exceptional, separately approved maintenance operation because it would discard post-backup evidence; export and reconcile any newer records first. A failed migration rolls back transactionally and must not trigger seeding or deletion.

## Remaining production actions

Merge, deployment, the owner-approved correction of B, and one fresh A → C comparison are complete. Any DEV edit still needs approval. Physical Android confirmation of the owner controls and a real 90-second recording remain. No repair or resolved status is claimed.

Companion: [90-second recording script and unpublished article evidence draft](real-revisit-demo-script-2026-10-10.md).


## Production release receipt

- Render service: `srv-db3jpv5g1s2s73aood40`, existing free plan, not suspended.
- Deployment: `dep-db4sf6dckfvc7383ggj0`, commit `077376ce2f1d6e6273a31f0a7318a401e0ef21d4`, LIVE at **2026-10-10 05:06:47 UTC**.
- Pre-release PostgreSQL custom-format backup completed over verified TLS: 4,455,518 bytes, SHA-256 `fe41142a4a537a82d20595e38ceeddbcd161ee63af6f1b4a2e72bbaa37608879`. Archive listing and complete decompression succeeded, including media data. The private backup is not committed. This is archive validation, not a restore drill.
- Temporary write-pause triggers protected the migration. All three were removed after the new deployment became live. The temporary workstation database allowlist entry was removed and the prior allowlist restored.
- Migration 014 applied. Counts remain **5 issues, 9 observations, 4 comparisons**. Events increased from **27 to 31**, exactly four migration supersession events. Every original field of FI-000007's three observations and two comparisons matched the pre-release snapshot. All observations remain eligible pending the owner's correction; issue status remains OPEN.
- Live HTTP: `/health`, `/ready`, `/app-config`, issue detail, comparison history and integration status all returned 200. An unrelated guest's malformed correction request was rejected with **403 before input validation** and could not modify evidence.
- Integration status reported ten configured providers/frameworks and Entire documented, with core readiness true. No fresh inference was invoked; configuration/readiness is not proof of a fresh successful call to every provider.
- Live browser checks: original-versus-latest link targets A → C; historical B → C displays “Superseded comparison: not current evidence”, a neutral explanation and no verified change indicators. Both photos loaded in side-by-side mode, keyboard slider interaction worked, and no horizontal overflow was observed at 360px or 390px. Full owner correction/restoration remains covered by isolated CI; the unrelated live browser does not own FI-000007.
- Startup logs confirm both processes running and the service live; no error-level records returned in the release log check.
- Automatic deployments remain **off** to hold the judged version. The cloud availability workflow supersedes the laptop-dependent Codex heartbeat; see [cloud monitoring](cloud-monitor-2026-10-10.md). The user requires the code freeze on **12 October**; the monitor never changes application code or deploys.


## Authorized real correction and comparison

At the owner's explicit approval on 10 October, B was marked WRONG_LOCATION through the authenticated operator API. It remains in history with the owner's reason. A and C remain eligible. The correction appended its actor/time event and advanced the evidence revision to 1; no original note, image, analysis, timestamp or location source was rewritten.

Exactly one Gemma comparison request selected A → C. The saved result is **UNCHANGED**, comparison `0fc1db56-0030-4826-992e-31861426d0f2`, created **2026-10-10 05:11:57 UTC (10:41:57 IST)**, model `models/gemma-4-26b-a4b-it`, version `001`. The model identified the severed trunk, dry branches/leaves and litter as still visible, with empty added/removed lists. Its 0.95 confidence is model output, not an independently calibrated probability or proof of location. The optional real-history revisit predictor returned PREDICTION_UNAVAILABLE; that does not invalidate the saved visual comparison and does not establish a TabPFN prediction for this real report.

The [exact saved provider result](real-revisit-result-2026-10-10.json) is retained. The [live read-only walkthrough](https://fieldissue-demo.onrender.com/app/issues/FI-000007/evidence) was reloaded and visibly showed the excluded first revisit, original → second revisit pair, UNCHANGED explanation and OPEN status. All three photos and both superseded comparisons remain.

A separate real SerpApi diagnosis used one existing free search (219 available before the call). It returned HTTP 200 / Success in about 1.65 seconds, with 20 positioned results. All were outside the existing 2,000 m cutoff; the nearest was about 2,032 m away. Returning no verified nearby place is correct for that response. No place name or existing report location was changed, and the historical request outcome cannot be reconstructed from this current lookup.

## Follow-up capture and update fixes

New revisit drafts now default to recording the current location, with the existing explicit inherited-location option retained. No permission is requested until the user presses Use my location. The request disallows a browser-cached position, and revisit forms hide the reuse-last-location shortcut. This changes future captures only; the two real revisits remain honestly labelled inherited.

The prewritten no-change checkbox and leading example were removed. Notes start empty and ask what is visible. Existing notes and restored drafts are not rewritten. The offline fallback now retains a chosen device location instead of forcing inherited coordinates, and offline storage rejects a missing location unless inheritance was explicitly chosen.

The service worker already uses network-first navigation and excludes API/media responses from its cache. An open app can retain its loaded JavaScript. The new update notice reacts to a changed worker and checks for updates when the tab becomes visible; it asks the user to reload after finishing or saving their work, without forcing a reload. Older already-loaded versions need one normal reload to receive this improvement.

Validation: build and lint passed. Four isolated browser tests passed: both existing owner-correction journeys (360/390px), a fresh-GPS and offline-save/upload journey, and an update-notice draft-preservation test. The update test uses a real initial worker installation followed by a simulated controller-change event; it is not a two-production-deployment test. Browser GPS is simulated on the isolated server; this does not establish a new physical Android capture. The opt-in live-provider test remains skipped to avoid extra quota use.
