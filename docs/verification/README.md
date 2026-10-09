# Final verification

Current release evidence: [9 October integration recheck](integration-recheck-2026-10-09.md). Older logs below retain their original scope and limitations.

## Result

The complete local backend vertical slice passes against genuine PostgreSQL 17.11, PostGIS 3.5.2 and pgvector 0.8.0. The API runtime was compiled to JavaScript and started alongside the private Python service. Its real HTTP exercise created a geotagged issue and first observation, retrieved it, added a revisit, persisted a real-world diff and timeline, and explicitly resolved the issue. Mock evidence was clearly marked development-fixture, confidence zero, and interpreted notes only; this does not demonstrate real Gemma visual understanding.

## Executed checks

- Database migrations and demo seed applied successfully
- TypeScript: 40 tests passed across 11 files, including real-database integration tests, with no skips
- Python: 71 tests and 17 subtests passed, with no warnings
- TypeScript build, strict type check and Prettier check passed
- Python Ruff lint, formatting check and uv lock check passed
- Compiled API + Python service HTTP end-to-end result: PASS
- Real PostGIS geography distance, vector similarity and HNSW index checks passed
- Separate fresh seed validation: 7 issues, 8 observations, 1 manually authored resolved bench diff, 14 timeline events; all eight actual media routes returned valid labeled 640×240 PNGs; reapplication was idempotent
- Independent code review and independent rerun found no remaining critical local-slice defect
- Production npm audit: zero high/critical, one moderate underlying advisory propagated across five dependency nodes; no patched sprintf-js release is listed. npm suggests a Mastra 1.0.4 replacement flagged as a breaking change, which was not applied

The actual command output is in [final-verification.log](final-verification.log); database version/query evidence is in [spatial-database.txt](spatial-database.txt). Tests cover concurrent idempotency, rollback, malformed output, status/observation ownership, timeout, storage, exact cursor precision, antimeridian maps, audio cache concurrency, and hosted database TLS option consistency.

## Reproduce

With dependencies installed, on the supported Debian-compatible Linux workspace:

```sh
scripts/local-db.sh run scripts/verify-vertical-slice.sh
```

This provisions a separate disposable fieldissue_test database and rejects a test database with the same name as the development database. Database tests are destructive only to that dedicated test fixture. The command starts both services in one process/network lifetime and stops them after verification. For ordinary local Docker development use the README's make dev/test/migrate/seed/lint commands.

## Original implementation verification limits (historical)

The bullets below describe the initial implementation snapshot. Subsequent CI, live Gemma, SerpApi, Sentry, Tinker, Tiger Data console, and Entire evidence supersede the relevant bullets; see [the current stack ledger](../zero-cost-stack.md). No full hosted readiness is claimed.

- Docker is absent from this execution workspace. Dockerfiles/Compose passed static review; image builds and Compose startup were not executed
- Node 24.19.0 and Python 3.12.14 were used here; Docker targets Node 22 and Python 3.12
- Real Gemma requires a genuine vision-capable runtime, pinned model/version and any runtime credentials
- Real TabPFN requires the optional package, trusted official weights and real labeled material-change history; a credential alone is insufficient
- Paid Tinker training/evaluation requires a Tinker API key; no live training/checkpoint run or evaluation scores were produced
- Optional SerpApi, ElevenLabs, S3 and Sentry live calls were not executed; configured credentials/runtime are required. Offline adapters and failure/cache/telemetry contracts were tested
- Tiger Data and DigitalOcean were not provisioned, contacted or deployed
- Entire CLI was unavailable; no initialization or capture was claimed
- Authentication is deliberately out of scope. Keep this backend private until an authenticated boundary and operational rate limits are added

## Dependency warning

GHSA-hp3w-g68c-fv3c affects sprintf-js@1.0.3 through Mastra's gray-matter/js-yaml/argparse chain. Its trigger is attacker-controlled sprintf format strings, which these routes do not accept or execute. Workflow import loads gray-matter/js-yaml but did not load argparse/sprintf-js in the inspected CommonJS cache. This is a residual advisory, not evidence that all transitive code is unreachable or a claim of zero vulnerabilities. No incompatible override or unverified Mastra downgrade was introduced.

## Publication note

Verification logs preserve their command results; local workspace and home-directory prefixes have been replaced with `<project-root>` and `<user-home>` for publication. `commits.txt` records the original local implementation commits. Publishing through the authenticated GitHub connector reproduces those logical changes with new commit identifiers.
