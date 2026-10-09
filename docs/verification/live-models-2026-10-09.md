# Live trained notes, synthetic TabPFN and Entire evidence

## Tinker

The October 7 checkpoint expired after one hour. On October 9 a new real Qwen3-8B LoRA run completed nine optimizer steps over the same 36 synthetic notes. Both base and trained models produced valid schema on all 18 held-out notes, with category 17/18 for both and severity 13/18 versus 17/18. This tiny synthetic evaluation is not real-world accuracy. Exact-string evidence agreement remains weak; paraphrased reporter claims are not visual facts.

A real API smoke test interpreted the PRD's Hinglish note as an overflowing waste bin in 1.349 seconds. The runtime uses the trained sampler checkpoint through Tinker's completion API, with the same Qwen3 non-thinking prompt template as training. No photos or coordinates are sent. Each result records model/checkpoint, provenance, time and token counts. A report owner must explicitly consent. The output is advisory and never updates issue status, category or severity.

The API persists results in PostgreSQL, uses a per-observation lease, enforces a failure cooldown, and reserves at most 200 lifetime attempts across restarts. Model budgets are separate from reporting and search: at most 20 daily calls per model, 10 public calls, 3 per guest, with 20 lifetime calls reserved for operators. Invalid inputs and expired checkpoints are rejected before reservation. Input is bounded to 4,096 UTF-8 bytes including prompt (an upper bound for this tokenizer's input tokens), output to 512 tokens, and there is no automatic paid retry. Checkpoints retain for 30 days. The conservative combined credit bound including the old run, new training/evaluation, storage reserve and live calls is $0.6462488 within the approved $1 grant budget. Provider billing may lag. No payment method was added.

## TabPFN

The user explicitly requested synthetic data. The separate Model Lab scenario tester calls the actual TabPFN-3.5 free API with 96 synthetic training rows and eight numeric features. It does not use the real-history adapter or invent human review labels. A 24-row held-out check yielded 16 correct versus 17 for a majority baseline; this is integration evidence, not predictive improvement. Live single-scenario inference also passed, returning a probability of 0.495164 in 5.567 seconds.

The account showed 5M daily and 20M monthly free tokens. The held-out call used 10,000. Server limits: 100 lifetime attempts, 50,000 quoted tokens per call, a separate 20-call daily budget (10 public calls, 3 per guest), strict feature ranges/chronology, per-scenario leases and saved results. It sends numeric scenarios only; results never rank actual walks or resolve reports.

## Entire

Nine actual messages were exported from checkpoint `01M4E6Z86663V6SMHF1YP4P6VG`, with private local paths replaced and tool/thinking content omitted. The reviewed JSON excerpt is available in the public repository; DEV session 648 was created as a private draft using the DevRelay sessions workflow. Full raw logs remain local.

## Sentry audit

Fresh dashboard inspection found nine issue groups. The newest were expected owner-denial and missing-report checks from acceptance testing. The older Python group FIELDISSUE-4 had `operation=ready` and `error_code=tabpfn_configuration_missing`; it was last seen about 12 hours earlier and does not mean the current core is down. FIELDISSUE-6 was one older generic REQUEST_FAILED with no stack or operation detail; its cause cannot be proved from that record.

This change adds fixed safe error kinds (such as TypeError and PostgreSQL SQLSTATE), operation group, HTTP status and release SHA. Expected 4xx responses are info events, not application errors. Tinker spans have a dedicated safe name. Exception messages, inputs, private paths, SQL, notes, photos, credentials and request bodies remain excluded. Existing issues were not marked resolved without evidence.

## Verification

Actual Claude Opus source review ran with tools disabled; its useful findings were addressed: preflight before budget reservation, expiry/provenance-aware availability, separate atomic daily/guest/lifetime budgets, chat-control-token rejection, explicit synthetic acknowledgment and nonduplicated diagnostics. Its schema/Backboard-filter/consent-default concerns were checked against the actual migration and queries and were not defects. Local build, typecheck/formatting and unit checks run before deployment. Real provider smoke responses and real database cache/allowance/guest-ownership tests accompany the code. Hosted release evidence is recorded after deployment, separately from these pre-deployment results.

### Hosted acceptance

Runtime commit `059523ba2ccf896f3bf8f4d7a4a404b7fe61ef4d` passed [CI 37887679416](https://github.com/himanshu748/fieldissue/actions/runs/37887679416): 153 API tests, 74 Python tests, types/formatting, PostGIS/pgvector, development and compiled HTTP workflows, and Render 512 MiB container isolation/embedding/lifecycle checks. Render deploy `dep-db47i0k9v7es73ac910g` became live at 2026-10-09T05:19:17Z.

The public browser, without an operator token, ran Tinker on its owned FI-000005 synthetic test report. The note contained no specific civic condition, so the actual trained model returned OTHER / LOW / unknown / unspecified, with no invented evidence, in 6.7 seconds. A second request and the issue-detail action both displayed the saved result. The issue remained OPEN / INFRASTRUCTURE / MEDIUM.

The deployed TabPFN tester returned 49.5% in 7.6 seconds for the default invented scenario. The repeat displayed Saved prediction. Prior Labs usage rose from 20,000 to 30,000 free tokens, with exactly one additional prediction and no provider-reported error. The account remained on 5M daily / 20M monthly free limits. These are integration results, not a claim of useful real-world prediction.

Both photos and four map tile images loaded on FI-000005. The existing ElevenLabs briefing loaded with duration 7.941224 seconds, media readyState 4 and no media error. The public issue retained its owner-only revisit and resolution controls. Browser error logs were empty. `/health` and `/ready` returned 200; `/app-config` enabled public access and Tinker, with mock mode off. The serving-checkpoint evaluation and reviewed Entire repository link were present.

The fresh Sentry readback showed no new inference failure. An unauthenticated verification probe to the unsupported `/v1/app-config` path produced an expected OWNER_REQUIRED event, now correctly classified as Info with HTTP 403, safe error kind and the deployed release SHA; the correct public endpoint is `/app-config`. Older unexplained errors remain unproven rather than marked fixed.
