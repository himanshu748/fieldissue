# Integration repair and fresh checks — 9 October 2026

This pass checks provider behavior separately from configuration labels and cached results. The published submission article was not edited.

## Defects repaired

1. **Backboard ownership mismatch in the Lab.** A public visitor could consent and click Compare on someone else's report, only to receive the API's correct owner denial. The Lab now applies the same ownership condition as Tinker, provides report selection, and accepts a report-specific link from issue details. A report switch remounts the interpretation controls so consent and previous results cannot carry over to another report. API access controls remain enforced.
2. **Expired ElevenLabs credential.** Both the deployed key and local configuration referred to an expired key shared with another project. Fresh speech returned `401 invalid_api_key`, while cached MP3 playback still worked. The account UI confirmed expiration on 9 October at 12:56 PM. With explicit user approval, a dedicated `fieldissue-demo` key was created with text-to-speech and User access, a 10,000-credit refresh-period limit, expiry on 8 November at 4:03 PM IST and automatic leak disabling. Auto top-up was off; the new key's account response confirmed overage disabled. It was saved only in ignored local files and Render's private environment. No new payment or plan was configured.

## Executed provider checks

| Integration | Evidence in this pass |
| --- | --- |
| Render / database | Hosted readiness returned 200; real public report and media reads passed. |
| Gemma | Fresh real `models/gemma-4-26b-a4b-it` image analysis through the local production-configured Python HTTP adapter returned 200 in 7.97 seconds. The same-photo comparison exercised the intentional identity guard, not fresh comparison inference. |
| Mastra | Existing production workflow wiring and full API/database/HTTP CI checks; no new public report was created in this pass. |
| Tinker | Fresh synthetic-note inference through the actual adapter: Qwen3-8B, valid schema, 252 input / 35 output tokens, 7.79 seconds. Hosted saved-note retrieval also passed. |
| Backboard | Fresh synthetic-text calls to Gemma 3 and Qwen 2.5 both passed strict output validation, in 5.34 and 4.91 seconds. Hosted retrieval returned both completed cached results. |
| TabPFN | Fresh anonymous hosted synthetic-scenario request returned TabPFN-3.5, 49.99%, 10,000 estimated free-quota tokens, and `cached: false`. No real-history accuracy claim. |
| Tiger Data | Fresh hosted hybrid keyword/vector search returned the public sample using `sentence-transformers/all-MiniLM-L6-v2`. |
| SerpApi | Account endpoint confirmed remaining zero-price searches; one fresh public Cubbon Park lookup returned Sir Mark Cubbon Statue. No private location was sent. |
| ElevenLabs | Cached hosted MP3 returned 200 with 127,939 bytes. Old-key fresh speech failed; new-key subscription read returned 200. A fresh production-adapter call with the new deployed credential generated a 51,035-byte MP3 in 5.57 seconds, duration 3.111474 seconds. |
| Sentry | Authenticated dashboard query `level:error release_sha:fc47f62797ed38ea96e67c2f1395be895f7edd0b`, 24 hours, found no matching errors. An Info-level owner denial from this audit was ingested. Historical groups were not deleted or marked resolved. |
| Entire | Development-session evidence remains documented; it is not a runtime inference provider. |

## UI and release validation

Local production build and type/format checks passed. Read-only browser previews used actual anonymous and operator-authorized hosted data. Anonymous visitors saw ownership guidance with no doomed comparison button. Selecting a different existing report cleared both Tinker and Backboard consent. The report-specific Backboard hash landed 96px below the viewport top. Preview servers rejected writes; no model call was triggered by these UI checks.

[CI run 37917938117](https://github.com/himanshu748/fieldissue/actions/runs/37917938117) passed on `2cc065e5b5869a323c19690deda49a9144daa131`: 168 API and 74 Python tests, type/format checks, development/compiled HTTP journeys, PostGIS/pgvector and Render isolation/lifecycle checks.

Render deployment `dep-db4c6h3tqb8s73eq51mg` is live at that commit with the replacement ElevenLabs key. Hosted readiness returned 200. The hosted owner Lab flow loaded both actual Backboard results as recorded earlier, with no browser errors. The selected report was correctly identified as owned; the test consent was cleared afterwards. The hosted audio endpoint on an existing private synthetic control returned 200 and a valid cached 124,595-byte MP3. This route reused its cache, so the separate fresh adapter call above is the new-generation evidence; it is not mislabeled as fresh hosted inference.

Real outdoor evidence and physical Android camera/GPS acceptance remain separate from these synthetic/provider integration checks.
