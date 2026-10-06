# FieldIssue Implementation Plan

> **For agentic workers:** execute this approved implementation using test-first isolated subsystem ownership.

**Goal:** Deliver an end-to-end backend for geotagged physical issues and real-world evidence diffs.
**Architecture:** Hono API owns deterministic transactions; private FastAPI service owns validated AI adapters. PostgreSQL/PostGIS/vector owns persistence; local or S3 storage owns media.
**Tech Stack:** Node >=22, TypeScript, Hono, Zod, pg, Vitest, Mastra, FastAPI, Pydantic, httpx, pytest, uv.
**Spec:** docs/superpowers/specs/2026-10-06-fieldissue-design.md plus user requirements.

## Global Constraints
- No frontend, credentials committed, paid provider calls, deployment or external publish
- AI_MOCK_MODE=true only in development; no fabricated production results
- Explicit deterministic action required for status changes
- UUID internal IDs; FI-000001 public IDs

## Review Focus
- Reject duplicate/conflicting concurrent idempotency replays and mismatched diff ownership
- Validate media signatures, traversal, oversized uploads and remote URL SSRF
- Validate geography ranges, stable pagination and antimeridian map bounds
- Persist timeline/observations atomically and reject illegal status transitions
- Bound provider timeout/retry; reject malformed model JSON and expose readiness misconfiguration

## Task 1: Core vertical slice
Files: packages/shared/src/index.ts, db/migrations/001_core.sql, apps/api/src/{config,errors,storage,intelligence,db,repository,service,app,index}.ts, apps/api/test/*.test.ts
Interfaces: StorageProvider.put/read/delete; IntelligenceProvider.analyze/compare; IssueService.create/addObservation/diff/patch/resolve/list/map/timeline.
- [ ] Write fixtures and failing domain/storage/provider/integration tests
- [ ] Run red tests; implement validated SQL/storage/API with transactional events
- [ ] Run migrations with actual PostGIS/vector and full tests
- [ ] Start API and intelligence; exercise HTTP E2E create, revisit, diff, resolve
- [ ] Commit vertical slice

## Task 2: Orchestration and intelligence integrations
Files: apps/api/src/workflows.ts; services/intelligence/{fieldissue,training,tests}
- [ ] Consult installed current Mastra docs; write failing workflow test
- [ ] Add create/revisit workflows with deterministic persistence callbacks
- [ ] Add real configured TabPFN adapter and dev-only fallback tests
- [ ] Add Tinker pipeline, annotated multilingual dataset and evaluation metrics; no-key setup tests
- [ ] Verify tests and commit

## Task 3: Optional providers and observability
Files: apps/api/src/{place,audio,telemetry}.ts
- [ ] Write failing optional provider/cache/timeout tests
- [ ] Implement current official SerpApi API, ElevenLabs API, Sentry spans
- [ ] Verify failed place provider does not fail issue creation; repeated audio reuses durable cache
- [ ] Verify full suites and commit

## Task 4: Developer handoff
Files: README.md, .env.example, Dockerfile, docker-compose.yml, Makefile, db/seeds/001_demo.sql, scripts/*
- [ ] Provide reproducible migrations, seed and test commands; seven realistic issues and resolved before/after diff
- [ ] Document provider credentials/configuration, API examples and integration mapping
- [ ] Run full lint/tests/build/E2E and independent review, fix discovered regressions
- [ ] Package sanitized source artifact and exact verification report
