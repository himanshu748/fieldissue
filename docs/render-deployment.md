# Render deployment

`render.yaml` describes one **free** Docker web service. The Node API and Python
intelligence boundary run together; Python binds only `127.0.0.1:8000`. Node
listens on Render's `PORT`. If either process exits, the supervisor terminates
the other. No model weights are included in this lightweight image.

The API runs the existing Mastra workflows and calls real Gemma from Python.
This makes Render part of the actual AI request path. No hosted deployment or
prize eligibility is implied by a validated Blueprint alone.

## Deployment gates

Do not apply the Blueprint until all of these are satisfied:

1. A PostgreSQL service with PostGIS and pgvector, migrated using the checked-in
   migrations and reachable with certificate-verified TLS. `DATABASE_SSL=true`
   never disables certificate checks. The current Tiger free service's direct
   connection still fails certificate verification as of October 7, 2026.
2. A durable S3-compatible bucket and narrowly scoped credentials. Set
   `MEDIA_BASE_URL` to the deployed API's `/media` URL. The free instance has no
   persistent disk; the supervisor deliberately refuses local media storage.
3. Real Gemma configuration. The verified Google free-tier endpoint is
   `https://generativelanguage.googleapis.com/v1beta/openai`, exact advertised
   model `models/gemma-4-26b-a4b-it`, reported version `001`. This is a hosted
   provider version, **not** a cryptographic checkpoint pin. Recheck metadata
   when upgrading. Free-tier content is subject to Google's data-use terms;
   the live smoke test used a public CC0 photograph.
4. Optional only: genuine labeled revisit history and a provisioned TabPFN runtime.
   **This last gate is not satisfied by the lightweight free image.** It omits
   PyTorch/TabPFN and model weights. A paid, sufficiently sized private worker
   with the optional TabPFN dependency and mounted trusted weights/data, or an
   explicitly implemented remote TabPFN provider, is needed before enabling the optional prediction capability.
   No synthetic labels or heuristic production predictions are substituted.

The Blueprint uses `/ready`, which requires Gemma and database access. Missing core providers return 503. TabPFN is optional and does not gate core readiness.
Do not change the health check to `/health` to present an incomplete backend as
ready. The Blueprint is a reviewed starting configuration, not a claim that
the free tier supports the full local TabPFN stack.

## Judge demo profile (`render.demo.yaml`)

The production Blueprint above stays gated. For a short-lived hackathon demo,
`render.demo.yaml` describes a smaller, clearly labelled profile:

| | Production (`render.yaml`) | Judge demo (`render.demo.yaml`) |
| --- | --- | --- |
| Vision | Real Gemma | Real Gemma (mocks are still refused) |
| TabPFN | Optional experimental capability | Not configured; revisit predictions return `available=false` |
| Database | External PostGIS/pgvector, verified TLS | Free Render Postgres 17 on the private network; migrations run at start |
| Media | S3-compatible bucket | PostgreSQL byte storage, retained across web restarts; 200 MiB capacity cap (or use S3) |
| Health check | `/ready` | `/ready` for core readiness; `/health` is liveness only |
| Access | Shared bearer token | Same shared bearer token, pasted into the demo page |

What a judge gets: the public landing page at `/` and a separate workspace at
`/app`, with report capture, real Gemma comparisons, saved issue links, filters,
map, persistent comparison history, manual resolution and reopening. Photos
survive web service restarts because they are in the database. The database
itself expires after 30 days: this is a time-limited demo, not archival storage.
TabPFN predictions remain unavailable until genuine history, weights and runtime are validated. Core readiness is independent.

Steps:

1. Get a Gemma API key from Google AI Studio (free tier). Free-tier content is
   subject to Google's data-use terms, so only upload photos you are happy to
   share.
2. Merge the branch to `main` (the Blueprint deploys from `main`).
3. Render dashboard → **New → Blueprint** → pick `himanshu748/fieldissue`, set
   **Blueprint Path** to `render.demo.yaml`. It creates `fieldissue-demo-db`
   (free Postgres) and the `fieldissue-demo` free web service.
4. When prompted, paste `GEMMA_API_KEY`. Leave everything else as generated.
5. After the deploy: open the service → **Environment** → copy `API_ACCESS_TOKEN`.
   Open `https://<service>.onrender.com/app`, paste the token, and run the full
   flow once with a real photo. `/health` passing proves only that the process
   is up; this manual run is the real check.
6. Share the URL publicly and provide the shared access token privately to judges.
   Anyone with the token can upload, so rotate or delete the service after
   judging.

Free-tier facts that affect the demo ([Render free limits](https://render.com/docs/free)):
the web service sleeps after 15 minutes without traffic and takes about a minute
to wake; local files are lost when it sleeps; the free database expires 30 days
after creation; only one free database per workspace. PostGIS and pgvector are
enabled with `CREATE EXTENSION`, which the first migration does
([Render Postgres extensions](https://render.com/docs/postgresql-extensions)).

Before the October 8 durability update, the demo profile was exercised locally: `scripts/render-start.mjs`
with `FIELDISSUE_DEMO_PROFILE=true` against a fresh PostGIS database and a local
OpenAI-compatible stub in place of Gemma (plumbing, not model quality). See the latest dated verification record for hosted deployment status.

## Access and secrets

Render generates separate `API_ACCESS_TOKEN` and `INTERNAL_SERVICE_TOKEN` values.
Every public API and media request needs `Authorization: Bearer <API_ACCESS_TOKEN>`;
the landing/workspace shell, static assets, safe `/app-config`, `/health` and
`/ready` are public. Issue data and media remain protected. Protected responses and media
use private/no-store caching. This is a shared demo gateway, not user accounts,
tenant isolation, or reporter authentication. Keep the token server-side and
out of public frontend bundles and URLs.

Other secrets are `sync: false`; store them in Render's environment settings.
Never commit `.env` or downloaded provider credentials. The API rejects mock
mode in production. The combined supervisor also refuses missing credentials,
shared gateway/internal tokens, non-TLS database configuration, or local uploads.

## Validation and deployment

```sh
render whoami -o json
render blueprints validate render.yaml -o json
```

After satisfying the gates, push the reviewed configuration and use
<https://dashboard.render.com/blueprint/new?repo=https://github.com/himanshu748/fieldissue>.
Fill the secrets, review the **free** service plan, and apply. Automatic deploys
wait for repository checks. Verify `/ready`, rejected anonymous requests,
authenticated upload/retrieval/comparison, durable media across a restart, and
provider failure responses before calling the deployment complete.

Official references:
[Render free limits](https://render.com/docs/free),
[Blueprint schema](https://render.com/docs/blueprint-spec),
[Gemma API and images](https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api),
[Google API pricing](https://ai.google.dev/gemini-api/docs/pricing), and
[Week 1 challenge](https://dev.to/challenges/hacktoberfest-week1-2026-10-05).

## Capacity and provider limits

The production entrypoint bounds writes globally to 30 starts per minute and
two concurrent operations. PostgreSQL atomically records at most 60 provider
operations per UTC day across restarts. Each actual analysis, comparison,
place lookup, prediction or new audio generation reserves one unit immediately
before the call; committed idempotent replays and cached results reserve none.
Failed provider attempts consume units. This is an application safety limit,
not a dollar budget: configure only verified free accounts or credit-only
accounts without top-up, and leave provider retries disabled in the free profile.

PostgreSQL media storage rejects additions beyond 200 MiB without deleting
existing evidence. Free database expiry still removes all records and media.
`DATABASE_CA_FILE` can supply an official provider CA when system trust is not
sufficient; certificate verification is never disabled.
