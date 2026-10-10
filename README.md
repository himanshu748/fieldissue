# FieldIssue

**Walk your street, photograph what's broken, and come back to prove it got fixed.** FieldIssue turns a neighbourhood walk into evidence: a geotagged photo and a short note open an issue (a broken bench, a pothole, a dead streetlight), an open-weight Gemma vision model describes what it sees, and a later revisit photo produces a before/after diff of what was removed, added or unchanged. A person, never the model, marks the issue resolved.

Built for the DEV **Hacktoberfest Open-Source AI Challenge, Week 1: Touch Grass** (repository started 6 October 2026, inside the 5–11 October window).

## Demo and links

| What | Link |
| --- | --- |
| Try it in a browser | Open `/` for the landing page and `/app` for the separate workspace on any running FieldIssue API (local: <http://127.0.0.1:3000/>). Walkthrough and video shot list: [DEMO.md](DEMO.md) |
| Hosted demo | [Landing](https://fieldissue-demo.onrender.com/) · [Workspace](https://fieldissue-demo.onrender.com/app), public guest access, with optional accounts for report ownership and saved walks across devices |
| DEV entry | [Published challenge submission](https://dev.to/himanshu_748/fieldissue-take-a-walk-report-a-problem-come-back-with-evidence-e40) |
| Demo video | Not yet recorded; the live demo and [walkthrough](DEMO.md) are available |
| Verified live provider runs | [docs/zero-cost-stack.md](docs/zero-cost-stack.md) and [docs/verification/](docs/verification/) |

## How it gets people outside

- **The phone is a camera, not a feed.** You only open it to take a photo and type one sentence. The model does the describing; the walk is the point.
- **Revisits are the hook.** Every open issue near you is a reason to walk back past it. `POST /v1/issues/:id/observations` adds the new photo and `POST /v1/issues/:id/diff` shows what actually changed.
- **Nearby and map queries** (`GET /v1/issues?near_lat=…&near_lon=…&radius_meters=500`, `GET /v1/issues/map?bbox=…`) let a walking group plan a route past open issues.

## Open-source AI at the core

| Piece | Role | Status |
| --- | --- | --- |
| Gemma (open-weight, vision) | Describes each observation photo and compares before/after photos as structured JSON | Live run verified 7 Oct ([report](docs/verification/gemma-google-live-2026-10-07.json)); the client speaks the OpenAI-compatible `chat/completions` API, so `GEMMA_BASE_URL` can point at any Gemma server |
| Mastra | Typed create-issue and revisit workflows; database writes stay deterministic outside the model | In the API |
| Tinker (Qwen3-8B fine-tune) | Live, opt-in structured interpretation of a report owner’s note | Trained on 36 synthetic notes; severity 13/18 → 17/18 on 18 held-out notes ([evaluation](docs/verification/tinker-evaluation-2026-10-09.json)). Saved results and bounded credit use; separate from vision |
| TabPFN | Live synthetic revisit scenario tester through the free Prior Labs API | 96 invented training rows; held-out 16/24 versus 17/24 majority baseline. Demonstrates integration, not real-world accuracy. Real-history ranking remains gated on genuine labels |

Other integrations: SerpApi place context, Sentry error/evaluation traces, real ElevenLabs audio briefings, Backboard two-model comparison, and Tiger Data semantic search. Provider-specific proof and remaining acceptance gaps are recorded in the [V2 PRD audit](docs/verification/prd-audit-2026-10-08.md). Render PostgreSQL remains the primary database; Tiger is a certificate-verified secondary index.

## Quick start (mock AI, no keys needed)

```sh
cp .env.example .env
make dev                                   # Docker: API, intelligence service, PostGIS; migrates and seeds 7 demo issues
curl http://127.0.0.1:3000/health
# then open http://127.0.0.1:3000/ then `/app` for report → revisit → compare → resolve
```

In mock mode the page shows a banner: analysis and comparison come from your notes, not the photo, with confidence 0.

No Docker? See [Native development](#native-development-and-docker-free-verification). Set `AI_MOCK_MODE=false` and the `GEMMA_*` variables in `.env` for real vision inference.

## Hackathon disclosures

- **Window:** first commit 6 October 2026; all work is inside the challenge window. **Commits after the 11 October 23:59 PDT deadline:** none so far. Any later commit will be listed here, as the challenge rules require.
- **AI tools:** the October 8 redesign and reliability fixes used Codex; Claude Opus 5.5 drafted the landing page and independently reviewed the changes. The marketing park illustration was generated with Codex and is visibly labeled as illustration, never field evidence. Built with AI coding assistance (Codex sessions, checkpointed with the Entire CLI per [docs/zero-cost-stack.md](docs/zero-cost-stack.md)). The browser demo page, the Render judge-demo profile and DEMO.md (8 October) were drafted with an AI assistant (Hark) and checked with the test suite and a headless-browser run. _Author: confirm or complete this list._
- **Demo data:** seeded fixtures are labeled `DEMO FIXTURE`. Public integration control FI-000005 instead uses a CC0 sample photo, a `DEMO TEST` title and an explicit synthetic 0,0 location note; it is not a real field report.
- **License:** MIT, see [LICENSE](LICENSE).

---

## Backend reference

A backend for geotagged field observations, chronological evidence, explicit issue resolution, and before/after real-world diffs. This repository contains the TypeScript API, private Python intelligence service, database migrations, local tooling, and live opt-in Tinker note interpretation plus a synthetic TabPFN scenario tester. The V2 frontend in `apps/web` uses React, Vite, Tailwind, shadcn/ui, Motion and Leaflet. The API serves its build at `/` with distinct workspace routes under `/app`; the judge demo supports public guest access with browser-owned reports, optional nickname/password accounts, and separate private operator access. Accounts support ownership and private walks across devices; nicknames are not verified identities. See [V2 architecture](docs/v2-implementation.md) and [DEMO.md](DEMO.md). A validated Render deployment scaffold and its remaining gates are documented in [docs/render-deployment.md](docs/render-deployment.md).

### Architecture

```text
Client → TypeScript / Hono API → PostgreSQL 17 + PostGIS + pgvector
                     │                    ↑
                     ├── local or S3 media storage
                     ├── Mastra typed observation/revisit workflows
                     └── private FastAPI intelligence
                          ├── vision-capable Gemma runtime
                          └── local Prior Labs TabPFN classifier

Optional API integrations: SerpApi place context, ElevenLabs audio, Sentry
Live opt-in API tools: Tinker trained note interpretation, TabPFN synthetic scenarios
```

- Issues have UUIDs plus stable human-readable `FI-000001` identifiers
- Observations keep image bytes, coordinates, capture time, notes, and structured model provenance
- PostGIS powers map bounding boxes and proximity queries; a separate Tiger Data pgvector index serves semantic search using local embeddings
- Transactional writes preserve issue/observation/events together. Keyset pagination and idempotency keys are supported
- A comparison records removed, added, and unchanged conditions. A model's recommended status never resolves an issue by itself
- Resolution is an explicit API operation recorded in the timeline
- Image URLs are not accepted as upload input. The API accepts local PNG/JPEG/WebP bytes, with matching MIME signatures and a default 10 MiB limit

### Local Docker setup

Prerequisites: Docker Engine/Desktop with Compose v2 supporting `run --build` and `up --wait`, plus GNU Make. Native commands require Node.js **22 or newer**, Python **3.11 or newer**, and [uv](https://docs.astral.sh/uv/getting-started/installation/).

```sh
cp .env.example .env
make dev
curl --fail http://127.0.0.1:3000/health
curl --fail http://127.0.0.1:3000/ready
make verify-db
make logs
```

`make dev` creates `.env` if absent, builds the local services, waits for database and intelligence readiness, applies migrations, then writes and seeds demo media/data. The API is published only on `127.0.0.1:${PORT}`. Database and intelligence ports are not published. The database is on an internal network; API/intelligence also have outbound access for deliberately configured providers. Open `http://127.0.0.1:${PORT}/` for the demo page.

The DB image derives from the official `postgres:17-bookworm` image and installs **both** `postgresql-17-postgis-3` and `postgresql-17-pgvector` from the image's signed package repository. Its build verifies extension control files and the vector library. Migrations run `CREATE EXTENSION` for PostGIS and vector. No assumption is made that a PostGIS image includes vector.

The local API uses the Dockerfile's `development` stage, with Node's watch mode and an API-source bind mount. API source edits reload; package, shared-contract, Python, or configuration edits require rebuilding/restarting with `make dev`. PostgreSQL and media use persistent named volumes. `make stop` stops containers and retains these volumes. Deleting volumes destroys local data; do so only when you intend to reset it.

| Command | Purpose |
| --- | --- |
| `make dev` | Build, start, migrate, seed, and wait for local readiness |
| `make test` | API tests against a separate disposable PostGIS/vector test DB, then Python tests |
| `make lint` | TypeScript type checks and Python Ruff checks |
| `make build` | Build the production API, intelligence, and database images |
| `make migrate` | Apply unapplied, ordered migrations transactionally |
| `make seed` | Generate valid demo PNGs, migrate, and apply the recorded demo seed |
| `make seed-media` | Restore deterministic fixture image files without touching SQL |
| `make db-shell` | Open `psql` inside the private database container |
| `make verify-db` | Check extensions, PostGIS version, and an actual vector distance |
| `make stop` / `make logs` | Stop without deleting volumes / follow service logs |

The default API Dockerfile target is a non-root **production** image. It runs `node apps/api/dist/index.js` with compiled shared-contract exports and no TypeScript runtime or test dependencies. It binds `0.0.0.0` on `PORT` inside the container. The Compose configuration is specifically for local development, not a production configuration. npm and uv dependency locks are checked in; the base image tags and trusted apt extension packages may receive updates. Pin reviewed image digests/package snapshots in your production build process if immutable image reproduction is required.

### Optional host database access

Use `make db-shell` by default. Native tools can publish the DB on loopback through an explicit local override:

```sh
cat > /tmp/fieldissue-host-db.yml <<'YAML'
services:
  db:
    ports:
      - "127.0.0.1:5432:5432"
YAML
COMPOSE='docker compose -f docker-compose.yml -f /tmp/fieldissue-host-db.yml' make dev
```

Keep using that same `COMPOSE` value for subsequent Make commands while this override is in use. The host `DATABASE_URL` in `.env.example` matches this optional mapping; Compose itself overrides the URL to the private `db` hostname. The sample database password is development-only.

### Native development and Docker-free verification

From the repository root, with a genuine PostgreSQL instance that supports both extensions:

```sh
npm ci
npm run build
cp .env.example .env
# Edit DATABASE_URL to your reachable development database.
npm run migrate
node scripts/seed-media.mjs
npm run seed
npm run dev
```

In a second terminal, start the intelligence service with the same token and explicit development mocks:

```sh
cd services/intelligence
uv sync --frozen --extra dev
ENVIRONMENT=development AI_MOCK_MODE=true \
  INTERNAL_SERVICE_TOKEN=development-only-change-me \
  uv run --frozen uvicorn fieldissue_intelligence.app:app --host 127.0.0.1 --port 8000
```

The API reads the root `.env`; uv does not automatically read it. Export service settings explicitly or use your approved environment/secret configuration. Mock mode extracts fixture conditions from notes, never image pixels, and identifies outputs as development fixtures with confidence zero. There is no automatic fallback to mocks after provider errors.

For Debian-compatible Linux x86_64 without Docker, `scripts/local-db.sh` installs a **user-space** PostgreSQL 17/PostGIS/pgvector cluster using signed Debian packages. It does not install system services or expose a public listener:

```sh
scripts/local-db.sh install
scripts/local-db.sh verify
scripts/local-db.sh run sh -c 'npm run migrate && node scripts/seed-media.mjs && npm run seed'
scripts/local-db.sh run scripts/verify-vertical-slice.sh
```

The wrapper's `run` command keeps the database and its child command in one process/network lifetime and serializes access to its data directory. The vertical-slice script automatically provisions a separate disposable `fieldissue_test` database when no test URL is supplied; its tests destroy that test database's issue data. In isolated executors, launch the DB, API, intelligence, and HTTP client together; a background service may not survive or be reachable in another command invocation. See the vertical-slice script for this pattern. The Linux package bootstrap is not a replacement for the Docker setup on macOS or other architectures.

### Tests and verification limits

On 10 October 2026, [main CI run 38029824732](https://github.com/himanshu748/fieldissue/actions/runs/38029824732) passed with **184 API tests** and **78 Python tests**. These totals come from the run logs for commit `0f00a01`; they include the coordinate privacy and reporter assessment regressions. The run also checks Docker startup, HTTP behavior and the mobile browser journeys. Provider calls in CI use isolated fixtures.

The `Backend CI` GitHub Actions workflow runs `make test` against a disposable real PostGIS/pgvector database, runs lint, starts/migrates/seeds the Docker stack, verifies both extensions, and exercises the HTTP vertical slice. It then rebuilds the API with the compiled runtime target and repeats the HTTP checks without the source bind mount. Both HTTP runs explicitly use development AI fixtures. CI requires no provider secrets and retains diagnostic logs as a workflow artifact; a passing run is not evidence of live AI quality or deployment.

```sh
npm run lint
npm run build
npm test
cd services/intelligence
uv sync --frozen --extra dev
uv run --frozen --extra dev ruff check src tests training
uv run --frozen --extra dev pytest
```

`npm test` skips the real-database integration suite when `TEST_DATABASE_URL` is missing. **The integration suite truncates issue tables and resets the public-ID sequence. Never point it at a valuable development or production database.** `make test` supplies an isolated `fieldissue_test` database in the `test-db` service, leaving the demo database untouched, and removes the disposable test container after success or failure. Native integration testing must likewise use a dedicated disposable database:

```sh
TEST_DATABASE_URL=postgresql://your-user:your-password@127.0.0.1:5432/fieldissue_test npm test
```

The test database must already exist, and its test user must be allowed to create PostGIS/vector extensions. Tests apply the schema. Providers are dependency-injected test fixtures or local HTTP doubles; these tests check contracts, boundaries, failure handling, and transactional behavior, not real-model quality.

Real PostgreSQL/PostGIS/vector checks and an HTTP vertical slice have been run in this workspace; records are in [docs/verification](docs/verification/). The demo seed was separately checked on a fresh real database: seven issues, eight observations, one diff, fourteen events, idempotent reapplication, and all eight valid PNGs served by the real `/media` route. **Docker is not installed in the implementation workspace, so the Docker images and Compose startup have not been executed here.** CI subsequently verified the Docker/PostGIS/HTTP and Render container lifecycle boundaries. Live Google Gemma, free SerpApi, sanitized Sentry delivery, and an MLH-credit-funded Tinker training/evaluation run are now recorded in [the zero-cash stack ledger](docs/zero-cost-stack.md). The [October 8 repair and hosted verification](docs/verification/product-repair-2026-10-08.md) adds a real Render/Gemma deployment with bounded PostgreSQL media persistence. The subsequent V2 checks verified Tiger TLS/semantic retrieval, Backboard comparisons, and hosted ElevenLabs audio with caching. A separate S3 bucket and genuine labeled revisit history are not configured; durable PostgreSQL media and the core workflow operate without them. The free TabPFN API now powers the explicitly synthetic scenario tester, and Tinker serves trained note interpretations; see [October 9 live models](docs/verification/live-models-2026-10-09.md). See the [current PRD audit](docs/verification/prd-audit-2026-10-08.md) for remaining product acceptance gaps.

### Demo data

The seven fictional issues are a broken bench, pothole, overflowing litter bin, graffiti, damaged sign, blocked dropped-kerb approach, and streetlight outage. They use deterministic UUIDs and `FI-900001` through `FI-900007`. The bench is manually resolved and has two observations, a before/after diff, and creation/observation/diff/status/resolution timeline events.

All PNGs visibly say **DEMO FIXTURE / NOT A FIELD PHOTO**. Seed notes and comparison provenance are manually authored `seed-fixture`, version `manually-authored-demo-v1`, confidence **0**. These are not Gemma analyses or claims of real field repairs. The bench diff intentionally keeps its recommendation `OPEN`; resolution is a separate manual demo record. Seed image URLs are relative `/media/{uuid}.png` paths and match the actual storage keys.

`make seed` stores PNGs in the shared Docker media volume. For host-side curl upload examples, also run `node scripts/seed-media.mjs` after `npm ci`; this creates the same fixtures in host `.media`. SQL seeds are recorded in `schema_migrations`, so repeated `make seed` does not duplicate records or overwrite later manual changes. Fixture IDs and media keys are defined in `db/seeds/001_demo.sql` and `scripts/seed-media.mjs`.

### API examples

The examples use the default port. They upload labeled placeholders to exercise the API and do not demonstrate visual inference. In real mode use actual authorized photos, with notes describing only supported observations.

```sh
BASE=http://127.0.0.1:3000
node scripts/seed-media.mjs
curl --fail-with-body -sS "$BASE/v1/issues" \
  -H 'Idempotency-Key: curl-bench-demo-v1' \
  -F 'title=Broken bench on the walking loop' \
  -F 'note=DEMO FIXTURE: two missing bench slats and a splintered seat edge' \
  -F 'latitude=12.9762' -F 'longitude=77.5929' \
  -F 'capturedAt=2026-10-01T09:00:00Z' \
  -F 'image=@.media/30000000-0000-4000-8000-000000000001.png;type=image/png' \
  > /tmp/fieldissue-created.json
ISSUE_ID=$(node -p "JSON.parse(require('fs').readFileSync('/tmp/fieldissue-created.json')).id")
BEFORE_ID=$(node -p "JSON.parse(require('fs').readFileSync('/tmp/fieldissue-created.json')).observations[0].id")

curl --fail-with-body -sS "$BASE/v1/issues/$ISSUE_ID/observations" \
  -F 'note=DEMO FIXTURE: seat slats replaced; frame still upright' \
  -F 'capturedAt=2026-10-02T09:00:00Z' \
  -F 'image=@.media/30000000-0000-4000-8000-000000000008.png;type=image/png' \
  > /tmp/fieldissue-after.json
AFTER_ID=$(node -p "JSON.parse(require('fs').readFileSync('/tmp/fieldissue-after.json')).observation.id")

curl --fail-with-body -sS "$BASE/v1/issues/$ISSUE_ID/diff" \
  -H 'Content-Type: application/json' \
  -d "{\"beforeObservationId\":\"$BEFORE_ID\",\"afterObservationId\":\"$AFTER_ID\"}"
curl --fail-with-body -sS "$BASE/v1/issues/$ISSUE_ID/resolve" \
  -H 'Content-Type: application/json' \
  -d '{"note":"Explicit manual resolution of this fictional demo issue"}'
curl --fail-with-body -sS "$BASE/v1/issues/$ISSUE_ID/timeline"
curl --fail-with-body -sS "$BASE/v1/issues?status=OPEN&limit=20"
curl --fail-with-body -sS "$BASE/v1/issues?near_lat=12.9762&near_lon=77.5929&radius_meters=500"
curl --fail-with-body -sS "$BASE/v1/issues/map?bbox=77.58,12.96,77.61,12.99"
curl --fail-with-body -sS -X POST "$BASE/v1/issues/$ISSUE_ID/revisit-prediction"
```

An idempotent replay returns the same issue; reusing a key with different evidence is a conflict. Observations may inherit the issue's coordinates if omitted. Comparisons require two distinct observations from the same issue in chronological order. Use `GET /v1/issues/{id}/observations` and `GET /v1/issues/{id}/diffs` for evidence history. `PATCH /v1/issues/{id}` updates allowed issue fields/status, subject to transition rules. Both UUID and `FI-...` routes are supported. Lists expose `items` and `nextCursor`; pass that cursor to retrieve the next page. Map output is GeoJSON with bounded `limit`; bounding boxes can cross the antimeridian.

Issue creation runs inference and media uploads outside the database transaction. A short transaction rechecks the idempotency key under a lock and commits the issue, first observation, timeline events and key together. Already committed replays bypass inference and uploads. Concurrent first attempts can perform duplicate inference/uploads, but only one issue commits and unused uploads are cleaned up. Optional revisit metadata runs after commit; feature, prediction or prediction-write failures return `revisitMetadata.available=false` without rolling back the issue or deleting its evidence.

`GET /health` is liveness; `GET /ready` checks database schema availability and intelligence readiness. Errors contain a stable code and request ID, without echoing notes, images, credentials, or raw provider responses. The API returns an `X-Request-ID` header.

### Environment and genuine provider configuration

| Setting | Meaning |
| --- | --- |
| `DATABASE_URL`, `DATABASE_SSL` | PostgreSQL connection; opt-in verified TLS for hosted DBs |
| `PORT` | API listener port; Compose maps this host port to container port 3000 |
| `INTELLIGENCE_URL` | Private FastAPI origin; Compose uses `http://intelligence:8000` |
| `INTERNAL_SERVICE_TOKEN` | Same private token in both services; development example is rejected by the production API |
| `AI_MOCK_MODE` | Explicit development-only fixtures; production/staging intelligence rejects `true` |
| `PROVIDER_TIMEOUT_MS` | API's one intelligence attempt, default/max 120000 ms; API HTTP retries are disabled |
| `AI_TIMEOUT_SECONDS`, `AI_MAX_RETRIES` | Python provider attempt timeout 30 s and at most two retries by default |
| `AI_TOTAL_TIMEOUT_SECONDS` | Overall Python deadline, default 95 s and at most 100 s, below API timeout |
| `STORAGE_PROVIDER`, `LOCAL_STORAGE_PATH`, `MEDIA_BASE_URL` | `local` media directory and returned URL origin, or `s3` storage |
| `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | S3-compatible storage settings; bucket and credentials required for `s3` |
| `MAX_UPLOAD_BYTES` | Maximum accepted image bytes, up to 10 MiB |

Leave unused URL settings such as `SENTRY_DSN` and `S3_ENDPOINT` unset, rather than assigning an empty string. Never commit keys, model credentials, real observation data, or private training labels.

When changing the host API `PORT`, also update `MEDIA_BASE_URL` so newly uploaded objects point to the reachable `/media` origin. The seeded relative URLs need no host/port change.

### Integration mapping

| Integration | Actual role and setup |
| --- | --- |
| Gemma | Structured, vision-based analysis/comparison via an OpenAI-compatible Gemma runtime. Set `GEMMA_BASE_URL`, exact `GEMMA_MODEL`, pinned `GEMMA_MODEL_VERSION`, and optional `GEMMA_API_KEY`; disable mocks. A vision-capable checkpoint is required; text-only Gemma 3 1B is refused |
| Mastra | Typed multi-step create/revisit workflows in `apps/api/src/workflows.ts`; image bytes stay outside workflow state |
| Prior Labs TabPFN | Live TabPFN-3.5 synthetic scenario tester in Model Lab through the free Prior Labs API. Set `TABPFN_API_KEY` and `TABPFN_FITTED_MODEL_ID`. Clearly labeled invented data; no effect on real walk ranking or issue resolution. Separate local real-history adapter remains gated on genuine labels |
| PostgreSQL / PostGIS / pgvector | Durable transactions, spatial queries and vector search; primary Render database plus a separate Tiger semantic index |
| Tiger Data | Certificate-verified trial-credit PostgreSQL semantic index with PostGIS/pgvector and all-MiniLM-L6-v2 embeddings; durable indexing retry queue |
| SerpApi | Real nearby landmark context verified on the Free Plan. Handles list and single-place results, requires coordinates within 2 km and selects the closest candidate. Set `SERPAPI_API_KEY`; failure does not block creation |
| ElevenLabs | Optional concise MP3 briefing via `POST /v1/issues/{id}/audio-summary`. Set key and an authorized public voice ID; optional model ID defaults to `eleven_multilingual_v2`. Sends the issue title/status/age/revisit recommendation text, caches audio in storage, and fails explicitly when unavailable |
| Sentry | Opt-in sanitized API/Python diagnostics with `SENTRY_DSN`; no image bytes, notes, raw model output, credentials, or request bodies are intentionally collected |
| Tinker | Live fine-tuned Qwen3 field-note interpretation on issue pages and Model Lab, with explicit consent, provenance and saved results. Set `TINKER_API_KEY`, `TINKER_MODEL_PATH`, `TINKER_CHECKPOINT_EXPIRES_AT`. Synthetic training; Gemma remains the vision model |
| DigitalOcean | Portable production Docker image and standard `PORT`, `0.0.0.0`, health/readiness interfaces; no DigitalOcean resources or deployment were created |
| Entire | Actual Claude implementation checkpoint, reviewed nine-message excerpt linked from Model Lab, plus private DEV session 648 prepared for submission. Full transcript remains local |

These names describe implemented interfaces, not partnerships or endorsements. Optional integrations can incur provider charges when enabled. Confirm data-sharing, licenses, credentials, and budget in your own deployment before making live calls.

This project's current budget is **$0 out of pocket**, with every originally requested technology retained. See the [complete stack and activation ledger](docs/zero-cost-stack.md) for verified free plans, live checks and unresolved dependencies. Never activate paid overage to satisfy a readiness check.

For real mode, core readiness requires Gemma and the database. Real-history TabPFN prioritization remains unavailable without genuine labels and evaluation. The separate Model Lab synthetic demo uses the Prior Labs API without local PyTorch. The default service image installs base dependencies only; set `INSTALL_TABPFN=true` before rebuilding with `make dev`, or use native `uv sync --frozen --extra tabpfn`, to install the optional TabPFN runtime. Mount trusted weights/history into your chosen service runtime and configure their container-visible paths. Such model/data mounts are deliberately not present in the demo Compose file. Detailed contracts, vision-runtime requirements, timeouts, privacy controls, and TabPFN features are in [services/intelligence/README.md](services/intelligence/README.md).

The small Tinker dataset is synthetic, manually annotated, and intended to test supervised note-to-JSON plumbing. It is not training for image analysis or evidence of production accuracy. The runnable SDK training and actual base-versus-checkpoint evaluation, provenance checks, metrics, checkpoint retention, and costs are documented in [training/README.md](services/intelligence/training/README.md). Missing credentials yield no fabricated checkpoint or model score.

### Security and production boundaries

This backend uses signed browser cookies for guest ownership, request and provider limits, and an operator token for moderation. It does not implement personal accounts, tenant workspaces, or operational emergency response. `API_ACCESS_TOKEN` is required by the Render supervisor and whenever public guest access is enabled. Public reports are visible to everyone; existing private reports and media remain operator-only. Reporter IDs are metadata, not verified identity. S3 credentials need only the minimum permissions for the selected bucket; telemetry is opt-in. Do not expose the private intelligence service.

Production must use `NODE_ENV=production` / `ENVIRONMENT=production`, `AI_MOCK_MODE=false`, a fresh strong internal token, actual configured providers, TLS where appropriate, managed credentials, verified database access, controlled media sharing, and backups. The demo token and mock mode are not production settings. Local Compose is not a deployment recipe.

### Hosted PostgreSQL, including Tiger Data

Use the service's actual credentialed PostgreSQL URL as `DATABASE_URL` and set `DATABASE_SSL=true` for verified TLS. Keep SSL query options out of that URL because [node-postgres replaces explicit SSL configuration when those options are present](https://node-postgres.com/features/ssl). Use the provider's supported certificate trust configuration; never disable certificate verification to work around a failure.

[Tiger Data documents PostGIS and pgvector availability](https://docs.tigerdata.com/use-timescale/latest/extensions). Before migrating, check your specific database supports both `postgis` and `vector` and that the migration role can enable them and create schema objects. Have an authorized database owner pre-enable the extensions if the ordinary migration role lacks that permission. The provisioned free service's SQL console has verified both extensions and migrations; a direct, certificate-verified application connection is still pending. Use a distinct disposable database for integration tests, never the hosted production service.

### Portable image, including DigitalOcean

The production API image uses the supplied `PORT` and listens on `0.0.0.0`; `/health` is process liveness and `/ready` is dependency readiness. Configure your host's HTTP port to match the supplied `PORT`. DigitalOcean App Platform exposes these through its documented [port configuration](https://docs.digitalocean.com/products/app-platform/reference/api/) and [health checks](https://docs.digitalocean.com/products/app-platform/how-to/manage-health-checks/). Keep intelligence private and provide persistent/object media storage. The separate [Render scaffold](docs/render-deployment.md) combines the two processes with loopback isolation and a shared access gateway. The free judge profile is [deployed](https://fieldissue-demo.onrender.com/) with real Gemma and PostgreSQL media; see [hosted evidence](docs/verification/render-hosted-2026-10-08.json). Tiger now uses a separate certificate-verified secondary search database. Hosted verification of each release is recorded separately; optional speech still requires verified quota, and TabPFN now has a live synthetic scenario tester separate from real revisit prioritization.

### Live Gemma evidence, October 7, 2026

The production-configured Python HTTP boundary successfully called Google's free-tier Gemma 4 endpoint for a public CC0 pothole photo: analysis 4.392 seconds, identical-photo comparison 4.198 seconds. Anonymous access returned 401. The comparison returned no added/removed conditions and recommended `OPEN`. An earlier comparison was rejected for empty-string list entries; the prompt was clarified and strict validation retained. See [the actual report](docs/verification/gemma-google-live-2026-10-07.json). This is a bounded live-provider smoke check, not a real revisit, accuracy benchmark, Node/database end-to-end test, or hosted deployment. That historical run did not establish hosted readiness. V2 core readiness no longer depends on optional TabPFN.

### Official implementation references

- [Official PostgreSQL image and extension installation](https://hub.docker.com/_/postgres)
- [Official PostgreSQL 17 Debian image Dockerfile](https://github.com/docker-library/postgres/blob/master/17/bookworm/Dockerfile)
- [pgvector installation and matching PostgreSQL-major packages](https://github.com/pgvector/pgvector#apt)
- [Compose readiness and one-shot dependency ordering](https://docs.docker.com/compose/how-tos/startup-order/)
- [Compose one-off commands](https://docs.docker.com/reference/cli/docker/compose/run/)
- [uv Docker integration](https://docs.astral.sh/uv/guides/integration/docker/)

### Residual dependency advisory

The production dependency audit reports one **moderate** [sprintf-js denial-of-service advisory, GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c), propagated across five dependency nodes: `@mastra/core@1.74.0 → gray-matter@4.0.3 → js-yaml@3.15.2 → argparse@1.0.10 → sprintf-js@1.0.3`. No patched sprintf-js release is listed in the advisory, and the audit reports no high/critical findings. npm suggests replacing Mastra with version 1.0.4 and marks that suggestion `isSemVerMajor: true`; this is not a verified compatible in-place patch for the current 1.74.0 workflow API, so it was not applied. This is a residual dependency warning, not a demonstrated remote exploit in FieldIssue: these routes do not expose frontmatter parsing or attacker-controlled sprintf format strings. A workflow-only import loads gray-matter/js-yaml but did not load argparse/sprintf-js in the inspected CommonJS module cache. Review upstream updates before adding document/frontmatter or formatting features; no unsupported dependency override was applied. See [the audit record](docs/verification/dependency-audit.json).

### Evidence lifecycle and acceptance

[Operator removal and retention controls](docs/data-lifecycle.md) cover reports, stored media and secondary search cleanup. Automatic expiry is off until explicitly configured. [Live browser acceptance](tests/e2e/README.md) is opt-in and consumes existing provider quota; it never substitutes mock inference.

### Public hackathon access

The judge demo supports token-free browsing and guest reporting. Guests can resolve and reopen reports created in their browser; operators keep moderation access. Existing private reports stay private. See [guest access and limits](docs/public-guests.md).
