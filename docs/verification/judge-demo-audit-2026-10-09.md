# Judge demo and article factual corrections — 9 October 2026

This pass addresses an independent audit of the public demo and published DEV article. It does not claim a genuine outdoor visit or new model inference.

## Changes

- Public Lab visitors can inspect all 18 held-out Tinker notes with their actual recorded base and fine-tuned outputs, targets, checkpoint provenance and mistakes. These come from the existing public synthetic evaluation JSON. The live note action remains owner-only and consent-based.
- Walk planning can start near an existing public open report. The synthetic 0,0 sample is explicitly identified; Google Maps directions are unavailable for a sample start or destination at 0,0. Explore explains when the visible records are only synthetic samples.
- The identical-file warning states that it is an exact-byte safeguard. It does not verify a repair or defeat edited copies. Manual owner resolution remains explicitly labeled as confirmation without new evidence.
- App configuration refresh uses one set of global listeners and shares requests across hook subscribers. This removes the per-component focus-listener fan-out; no measured production request-count claim is made here.
- The Render blueprint documents optional Tinker, Backboard, Tiger Data and TabPFN configuration, and correctly describes Node plus loopback FastAPI in one container with external inference providers. Validation did not create new infrastructure.

## Verification

- Local production build, TypeScript/format checks and 16 focused API tests passed.
- New tests compare every public Tinker example against the original evaluation JSON and verify an anonymous HTTP read without provider calls or private database queries. CI initially exposed a missing fixture in the development image; the image now includes that public JSON.
- Read-only local browser preview used the real hosted public API, the built frontend and the recorded evaluation endpoint. It verified report-based discovery, saving a guest walk locally, and the 0,0 directions restriction.
- A 375px viewport showed no horizontal overflow in the recorded examples. The hash link scrolled the selector to 96px below the viewport top; selecting a different note changed the displayed actual outputs.

Release: `fc47f62797ed38ea96e67c2f1395be895f7edd0b`, Render deployment `dep-db4bmkbbc2fs73bjq6f0`, verified live. [CI run 37914605612](https://github.com/himanshu748/fieldissue/actions/runs/37914605612) passed 168 API and 74 Python tests (242 total), types/formatting, PostGIS/pgvector and both development/compiled HTTP journeys, plus Render process-isolation and lifecycle checks.

At 10:02 UTC, anonymous hosted `/health`, `/ready` and `/v1/model-lab/evaluations` returned 200. All 18 hosted examples matched the original public JSON exactly; the current Qwen3 checkpoint was marked serving. The hosted browser displayed the selector, changed outputs when another example was selected, and landed at the intended hash section. Explore displayed the synthetic-data notice. No new hosted console errors appeared; the same tab retained two earlier localhost errors caused by rebuilding assets while its old page remained open, resolved by reloading.

The published [DEV article](https://dev.to/himanshu_748/fieldissue-take-a-walk-report-a-problem-come-back-with-evidence-e40) received only factual corrections, against the writer's latest version. Readback exactly matched the submitted corrected body. Its title, cover, tags and original publication time remained unchanged. Corrections cover synthetic versus outdoor evidence, exact-file limits and manual resolution, public recorded Tinker inspection versus owner-only live inference, varying synthetic scores, hosting boundaries, quota/expiry limits, optional audio/place context, sampled tracing, and the current test count. No fully-autonomous claim was added; the article retains AI-assistance disclosure.

## Remaining real-world evidence

FI-000005 is a sample-photo workflow test at synthetic coordinates, not a field visit. Physical Android camera/GPS acceptance and an actual outdoor before-and-after revisit remain unverified. No fake neighborhood issues, replacement coordinates or fabricated outdoor photos were introduced. No new paid inference or payment configuration was used in this pass.
