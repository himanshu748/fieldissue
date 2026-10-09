# Render deployment

## Current hosted service

`fieldissue-demo` runs the Node API and Python intelligence service in one free Render web service. Python binds only to loopback; the supervisor stops both processes if either exits. CI must pass before Render deploys `main`.

The authoritative database is free Render PostgreSQL on the private network. Media uses bounded PostgreSQL storage and survives web restarts. Render reports that this database expires on **7 November 2026 at 06:31 UTC**; export or migrate records before then. Tiger Data is a separate credit-backed semantic index using certificate-verified TLS and pgvector. Sponsor credit and service lifetime are finite; this is not archival storage.

The public demo requires no access token. Public issues are readable, guest cookies protect report ownership, and optional accounts preserve ownership across devices. Private reports remain protected. The operator bearer token is a server-side administrative credential and must not be distributed to judges. See [public access](public-guests.md) and [data lifecycle](data-lifecycle.md).

Core readiness (`/ready`) checks the database and real Gemma service. `/health` is process liveness only. Optional providers cannot be inferred from either endpoint: check their actual results and the dated evidence in `docs/verification/`.

The current integration set includes real Gemma, ElevenLabs, SerpApi, Backboard, Tinker and Prior Labs TabPFN APIs. Tinker uses a trained, expiring checkpoint. TabPFN is an explicitly synthetic scenario demo; real-history walk ranking remains disabled. Tiger semantic search uses bundled local embeddings and pgvector. Sentry records sanitized operation events. Entire evidence concerns development provenance, not a runtime service.

## Reproducible profiles

- `render.yaml` is the external TLS database/S3 profile. It requires configured secrets and provisioned storage before use.
- `render.demo.yaml` is the original smaller Render database/PostgreSQL-media profile. It does not replicate the current secondary Tiger index or the full provider configuration. Its generated administrative token is not a public demo credential. Do not apply it over the existing service to recreate the current deployment.

For a fresh service, supply only verified free or sponsor-credit providers, keep mock mode off, preserve certificate verification for external database connections (the Render private-network connection is separate), configure bounded provider quotas and media capacity, and add no paid plan or payment method. Use `/ready` as the deployment readiness gate. After deploy, verify the exact runtime commit, public/private access, report/revisit behavior and durable media. Preserve existing records when migrating databases.

## Secrets and limits

Store secrets in Render private environment settings and ignored local files. Never commit `.env`, provider keys, session cookies or recovery codes. Keep public and internal service credentials distinct.

The API bounds concurrent work and provider starts. Database-backed provider accounting survives restarts; actual provider calls reserve units, cached responses and committed idempotent retries do not. Failed provider calls consume units. Unit caps are not dollar budgets, so cash-free usage also depends on provider billing settings and available credit.

PostgreSQL media capacity is bounded; exhausting it rejects new media without deleting existing evidence. `DATABASE_CA_FILE` can supply an official CA where needed; TLS verification must remain enabled.

## Evidence

See [current P1/P2 acceptance](verification/p2-acceptance-2026-10-09.md), [live model evidence](verification/live-models-2026-10-09.md), and the dated JSON records in `docs/verification/`. Health checks, configuration flags and CI fixtures do not independently prove successful live inference.
