# Complete original stack, with a $0 cash budget

The user's October 7 constraint is **zero out-of-pocket spending**. Every technology
in the original brief stays in scope. Free quotas may be consumed. Promotional
credits are acceptable only after checking their applicability and preventing
cash overage or paid renewal. A credit balance alone is not a spending cap.
Do not add a payment method, buy credits, enable automatic top-ups, or upgrade a
plan to get around a blocker. This document records evidence, not a promise that
an unconfigured provider is already live.

## Frameworks and infrastructure

| Requirement | Implementation / evidence | Cash cost |
| --- | --- | --- |
| Node.js 22+, TypeScript | API runtime, compiler, pinned package lock; build passes | Local / included hosting |
| Hono | HTTP routes, errors, upload validation, health and readiness | Open source |
| Zod | Shared request, analysis, comparison and provider validation | Open source |
| Mastra | Create/revisit step orchestration, deterministic SQL writes outside the model | Open source |
| pg / thin SQL | Transactions, advisory locks, migrations, UUID and FI identifiers | Open source |
| Vitest | Unit and real PostgreSQL HTTP integration suites | Local / existing CI |
| Python 3.11+, FastAPI, Pydantic | Private intelligence HTTP service and strict model schemas | Open source |
| httpx, pytest, uv | Provider transport, tests, locked Python dependencies | Open source |
| PostgreSQL, PostGIS, pgvector | Spatial schema/indexes verified in CI; real Tiger vector/hybrid search verified with certificate-checked TLS | Render free primary / approved Tiger trial secondary |
| Docker, Docker Compose | Two-service application plus spatial development database; production images | Open source |
| LocalStorageProvider | Validated local media, tests; refused in production | Local disk |
| PostgresStorageProvider | Live durable media in Render PostgreSQL, verified byte-for-byte after web restart; 200 MiB cap | Included in free database, expires with database |
| S3CompatibleStorageProvider | SDK adapter implemented; **no durable hosted bucket provisioned** | Must verify a free/no-overage account before activation |
| Render | [Public landing/workspace](https://fieldissue-demo.onrender.com/) deployed; real Gemma/DB flow and post-restart evidence verified October 8 | Free web + free PostgreSQL 17; database expires 2026-11-07 |
| DigitalOcean | Standard portable images, PORT binding and health/readiness configuration retained; **not deployed** | No resource or billable inference key created |

The user accepted Render **or** DigitalOcean for hosting; both deployment paths
remain documented. Hosting code does not prove a sponsor deployment. The Render
free image does not include the local TabPFN/PyTorch runtime. TabPFN is optional in V2 and does not block core readiness. A standard Tiger Data instance is now provisioned under the verified $1,000 Performance Trial (28 days remaining on October 8, no payment method). Its certificate and hostname verification, PostGIS, pgvector and migrations passed. Render PostgreSQL remains the primary transaction database; Tiger is configured separately as the semantic index.

## Every named integration

| Integration | Current verified state | Remaining work / $0 constraint |
| --- | --- | --- |
| Gemma | Real Gemma 4 vision analysis and identical-image negative control passed through the Python HTTP boundary; report in `docs/verification/gemma-google-live-2026-10-07.json` | Google project is on free tier; quota errors must fail, never fall back to a paid provider. This is not a real revisit benchmark |
| Tiger Data | `fieldissue-live`: 0.5 CPU / 2 GiB, Virginia, created with explicit user approval using the $1,000 Performance Trial. Trusted TLS, PostGIS 3.6.4, vector 0.8.6 and all four migrations verified | No payment method. About $31/month plus storage deducted from credits. Trial has 28 days remaining as of October 8; export before expiry. The old free shared service remains separate |
| SerpApi | Existing Free Plan verified by Account API; production adapter returned a nearby Bengaluru landmark after fixing single-place and distance handling | 250 searches/month plan. `node scripts/live-serpapi.mjs` checks zero-price plan and remaining allowance before one public lookup |
| ElevenLabs | Real MP3, browser playback, hosted generation, authenticated media and cache reuse verified; see `verification/elevenlabs-live-2026-10-08.json` | User confirmed sufficient quota and authorized use. Account read still lacks permission, so remaining quota and overage state are not independently readable. No payment settings changed |
| Backboard | Two actual open-model comparisons persisted; see `verification/backboard-live-2026-10-08.json` | $5 promo credit, auto-reload off; user-approved $0.25 test cap and configured provider price ceiling |
| Sentry | Sanitized Node/Python and Tinker instrumentation implemented/tested. Existing Sponsored Team subscription has a **$0 pay-as-you-go limit** | Dedicated `fieldissue` Hono project created; controlled sanitized error verified as FIELDISSUE-1 and 37 actual Tinker evaluation events as FIELDISSUE-2 in the dashboard. See `docs/verification/sentry-live-2026-10-07.json` |
| Tinker | Live trained note interpretation, synthetic training data, saved results and strict validation | October 9 retraining and held-out evaluation completed; 30-day checkpoint, 200 lifetime calls, total conservative credit bound $0.6462488 including prior run and storage reserve. Cash $0. See `docs/verification/tinker-*-2026-10-09.json` |
| Prior Labs TabPFN | Live synthetic scenario tester using the real TabPFN-3.5 API | Free 5M daily / 20M monthly tokens. 96 invented training rows, 24 held-out; provenance and actual outputs published. Quoted request ceiling and 100-call lifetime cap. No real walk ranking or automatic resolution |
| Entire | Actual captured development sessions | [Public Codex checkpoint](https://entire.io/gh/himanshu748/fieldissue/commit/e5c5ec14baafdc25c40b364c9678f1c181b1e264), ID `01M4MS0B5PNB39JGA84HZTC0GH`, with reviewed excerpt and committed verifier. Signed-out session and diff checks passed. Historical Claude excerpt remains linked in Model Lab. Full original transcripts remain private |

## Verified boundaries

- No cash purchase or payment method was added. The approved Tiger Data standard instance uses trial credits only; it is a metered resource, not the free shared plan.
  Tinker training uses the redeemed MLH promotional grant only. Render's credit balance was
  previously verified as $50 and was not used by this work.
- Provider quotas and credit expiration can change. Recheck the account before
  activation; never treat a historical screenshot as unlimited free usage.
- Unit tests use explicitly identified fixtures. Real-mode readiness still fails
  when required Gemma/database dependencies are missing. TabPFN remains optional.
- A single repeated photo is only a no-change control. It is not a replacement
  for dated, labeled field revisits for TabPFN training.
- Local `.env` is ignored and mode 0600. Session transcripts and local Entire
  configuration are not published with source code.

## Official references

- [Gemma API](https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api) and
  [Gemma pricing](https://ai.google.dev/gemini-api/docs/pricing#gemma-4)
- [SerpApi pricing](https://serpapi.com/pricing),
  [free Account API](https://serpapi.com/account-api),
  [single-place response](https://serpapi.com/maps-place-results)
- [Tinker quickstart](https://tinker-docs.thinkingmachines.ai/tinker/quickstart/)
  and [pricing](https://tinker-docs.thinkingmachines.ai/tinker/models/)
- [Official TabPFN](https://github.com/PriorLabs/TabPFN)
- [Entire CLI](https://github.com/entireio/cli)
- [Render free instances](https://render.com/docs/free)

## October 8 hosted update

[Application and host acceptance](verification/product-repair-2026-10-08.md)
records actual Gemma calls through Render, durable PostgreSQL media, 97 passing
Node tests in CI, and the separate landing/workspace. Fresh SerpApi verification
confirmed the $0 Free Plan with 233 searches remaining before its one lookup.
Sentry observed a sanitized error from the deployed service. The test report
was removed after verifying restart persistence; no fictional issue is seeded
on the real deployment. Existing S3 abstraction is retained.

## V2 acceptance update

See the [PRD audit](verification/prd-audit-2026-10-08.md) for the October 8 release and evidence boundaries. That V2 CI run passed 107 API and 73 Python tests; later release checks are recorded in their dated verification notes. Hosted synthetic control FI-000002 is explicitly labeled as a public-photo integration test, not a field visit. Actual ElevenLabs audio generated and repeated requests reused its saved media. Entire V2 checkpoint metadata is recorded in [the provenance note](verification/entire-v2-2026-10-08.md); the full session remains private.
