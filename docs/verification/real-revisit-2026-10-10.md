# Real revisit correction: 10 October 2026

Release candidate only. No production records, provider settings, deployment or DEV article were changed during this fix. FI-000007 remains OPEN. A fresh real comparison has not been performed.

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

A read-only route, `/app/issues/:id/evidence`, presents the chronology, exclusion and latest current comparison without inference requests. The real route will exist only after deployment: [FI-000007 evidence walkthrough](https://fieldissue-demo.onrender.com/app/issues/FI-000007/evidence).

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

[PR #4](https://github.com/himanshu748/fieldissue/pull/4) is open and unmerged. Full CI passed for implementation commit `b9564c036ab9c3ef4d7f2aacdd17bc9a98a847b0` in [run 38024942907](https://github.com/himanshu748/fieldissue/actions/runs/38024942907): Docker/PostGIS/API/Python tests, lint, migrations, HTTP development/runtime exercises, Render container boundaries and lifecycle, and both mobile correction journeys. A subsequent audit-label correction preserves the existing `image_identity` event marker and human-readable status recommendation; local tests, lint and build were rerun successfully. Check [the PR's current checks](https://github.com/himanshu748/fieldissue/pull/4/checks) for that final revision before merging.

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

Before deployment, with explicit approval:

1. Review the PR and require all three CI jobs, including the isolated mobile workflow. Recheck main and Render's deployed commit so newer work is not overwritten.
2. Take a private database backup using the existing verified-TLS connection. Record the Render deployment ID, current schema migrations and counts of observations/diffs/events. Do not print connection secrets or publish backups.
3. Approve the migration-wide legacy supersession effect. Deploy API, Python validator/prompt and web UI from the same commit. Render's existing startup applies migrations transactionally when configured to migrate first. Do not run seeds in production.
4. Verify health/readiness, public reads, original media, new schema, OPEN status, mobile owner controls and unrelated-user denial before inference. Historical comparisons should be visibly superseded.
5. Obtain explicit owner approval to mark B WRONG_LOCATION through the normal owner browser interface, using the original guest session or linked account. Do not replace this with an unapproved operator SQL update.
6. Separately authorize one fresh A → C comparison within existing credit limits. Select the exact IDs above and preserve the exact result, provider/model/version, comparison ID, timestamp and uncertainty. NOT_COMPARABLE or INSUFFICIENT_EVIDENCE is an acceptable honest result. Never claim a repair or automatically resolve.
7. Record deployment/CI/comparison identifiers here, capture the actual outdoor walkthrough and request approval before editing the DEV post.

If verification fails: pause new evidence writes/inference and retain the backup plus current audit trail. Prefer a forward fix or a verified compatible application revision. A blind rollback to the old comparison code is unsafe: it would ignore exclusions, misread superseded rows and rely on a removed unique constraint. Do not drop correction columns/events or unsupersede legacy results to make the old binary work. A database restore is an exceptional, separately approved maintenance operation because it would discard post-backup evidence; export and reconcile any newer records first. A failed migration rolls back transactionally and must not trigger seeding or deletion.

## Remaining production actions

Approval is still required for merge/deployment, correcting B, one fresh real A → C comparison and any DEV edit. Physical Android confirmation of the new correction controls and a real 90-second recording remain after deployment. No repair, resolved status or new model conclusion is claimed in this release candidate.

Companion: [90-second recording script and unpublished article evidence draft](real-revisit-demo-script-2026-10-10.md).
