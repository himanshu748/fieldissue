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
4. Genuine labeled revisit history and a provisioned TabPFN runtime.
   **This last gate is not satisfied by the lightweight free image.** It omits
   PyTorch/TabPFN and model weights. A paid, sufficiently sized private worker
   with the optional TabPFN dependency and mounted trusted weights/data, or an
   explicitly implemented remote TabPFN provider, is needed before full readiness.
   No synthetic labels or heuristic production predictions are substituted.

The Blueprint intentionally uses `/ready`, which requires **both** Gemma and
TabPFN plus database access. Missing providers return 503 and block deployment.
Do not change the health check to `/health` to present an incomplete backend as
ready. The Blueprint is a reviewed starting configuration, not a claim that
the free tier supports the full local TabPFN stack.

## Access and secrets

Render generates separate `API_ACCESS_TOKEN` and `INTERNAL_SERVICE_TOKEN` values.
Every public API and media request needs `Authorization: Bearer <API_ACCESS_TOKEN>`;
only GET `/health` and `/ready` are unauthenticated. Protected responses and media
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
