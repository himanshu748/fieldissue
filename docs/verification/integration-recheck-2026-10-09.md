# Integration verification — 9 October 2026

This checks the real Render demo using explicitly labeled public-photo controls. These are not genuine outdoor before/after observations or an accuracy benchmark. No payment settings were changed.

Runtime commit: `9c4030c8e48e2bcba7c6c07367fcde0e82016f2c`, Render deployment `dep-db46mi142hec73c7qqm0` (live). [CI](https://github.com/himanshu748/fieldissue/actions/runs/37883073123) passed 135 API tests, 74 Python tests, database/HTTP checks and the deployment-container checks.

The final public Lab run completed both fresh Backboard interpretations: Gemma 3 in 9.3 seconds and Qwen 2.5 in 4.0 seconds, with `fieldissue-text-interpretation-v2`. Both validated, left the issue OPEN, and subsequent readback used cached results. [Machine-readable proof](backboard-recovery-2026-10-09.json). The post-deploy ready check returned 200 and no browser console errors were observed.

## Executed checks

- Public reporting and ownership: FI-000005 was created without an operator token, classified by real Gemma 4, edited, resolved manually and reopened. Another browser's status change returned 403. Existing private issues and the deleted FI-000004 returned 404 anonymously. Public media and the public map returned 200. Browser ownership lasts 30 days unless cookies are cleared.
- Fresh revisit: a second observation was saved by the guest UI with real `models/gemma-4-26b-a4b-it`, version `001`. Uploading the same photo was correctly classified by the exact-file safeguard as no new evidence. It left the issue OPEN and disabled latest-photo resolution. This comparison deliberately uses no model inference.
- ElevenLabs: a new briefing for FI-000005 was generated and played to completion in the browser: 7.523265 seconds, readyState 4, no media error. Its wording uses “less than a day ago” rather than claiming an old capture date. Previously generated MP3 data was also retrieved successfully.
- Maps: the Leaflet region and issue marker loaded. The control is explicitly at 0,0, so the UI explains that it lies in the Atlantic Ocean. No real user location was published by these tests.
- SerpApi: a fresh application-adapter lookup of the public Cubbon Park landmark returned Sir Mark Cubbon Statue in 1.715 seconds. The account API verified a zero-price Free Plan with 223 searches remaining before this lookup.
- Tiger Data: the deployed hybrid keyword/vector search returned the public control using `sentence-transformers/all-MiniLM-L6-v2`. Private issue visibility is checked against the primary database before results are returned.
- Sentry: the authenticated dashboard contained the newly received owner-denial check (FIELDISSUE-9), earlier sanitized errors, Python inference spans, and Tinker evaluation spans. Inference trace `3dadecfcb9014fd79bdc2c0fbbfab9dd` contains an analyze span of 3.36 seconds, no linked issue, and no input text. Its status attribute is unknown; this is not a claim that every request was sampled or that all token/cost fields are available.

## Failure found and repaired

The first fresh Backboard comparison returned INVALID_MODEL_OUTPUT for Gemma 3, while Qwen 2.5 completed. A separate real Gemma retry passed strict validation. Claude Opus then independently reviewed the retry implementation and identified that JSON-escaped quotation marks and newlines could reject faithful evidence, together with avoidable retry-spend risks.

The final implementation supplies plain text that preserves quotes/newlines, validates evidence against exactly the bounded input sent, and versions the changed prompt contract. It retries schema/evidence failures once, charges both attempts against the provider allowance, does not retry unexpected provider identity or transport failures, bounds each call to 20 seconds, renews its own lease before spending, and imposes a one-minute failure cooldown. Invalid answers remain failures; no fabricated fallback was introduced.

Regression tests cover multiline quotations, evidence outside the sent input, retry exhaustion, budget exhaustion, lost leases and non-retryable provider failures. A real-database test verifies failure, cooldown without extra inference, recovery, and cache reuse.

## Explicitly separate capabilities

- Tinker: real completed Qwen3-8B fine-tuning and evaluation, 36 synthetic training examples and 18 held-out examples. Severity 14/18 to 16/18; not a field-accuracy benchmark. Its temporary checkpoint expired and is not serving production traffic.
- Entire: actual Codex/Claude checkpoint provenance is recorded locally and summarized publicly. Raw agent-session publication remains unfinished and no private transcript was uploaded in this check.
- TabPFN: remains disabled without genuine labeled revisit history and the approved runtime/weights. It is not counted as a live integration.
- Physical-device acceptance, genuine outdoor revisit evidence, the final DEV post and demo material remain separate from these synthetic browser/provider checks. No challenge submission was published by this work.
