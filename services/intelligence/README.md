# FieldIssue intelligence

Private FastAPI boundary for Gemma image evidence and local Prior Labs TabPFN revisit prioritization. Python 3.11+, managed with uv. The TypeScript API is the only public API. Do not expose this port to the internet.

## Run and test

```sh
uv sync --extra dev
cp .env.example .env
# Export values from your deployment secret manager or shell; uv does not read .env automatically.
AI_MOCK_MODE=true INTERNAL_SERVICE_TOKEN=local-dev-token uv run uvicorn fieldissue_intelligence.app:app --host 0.0.0.0 --port 8000
uv run --extra dev pytest
uv run --extra dev ruff check src tests training
```

`AI_MOCK_MODE=true` explicitly enables deterministic development fixtures. The service refuses mock mode in staging or production. Fixture analysis uses notes only, never pixels. Its provenance is `development-fixture`; confidence is zero. It cannot establish that an issue has been resolved. Revisit fixtures identify themselves as `development-fixture-v1`. No errors automatically fall back to mocks.

## Genuine Gemma vision runtime

Set `GEMMA_BASE_URL` to a trusted, OpenAI-compatible runtime with `/v1/chat/completions` and JSON Schema structured outputs. Set the exact `GEMMA_MODEL` served there and a pinned `GEMMA_MODEL_VERSION` (checkpoint revision or digest). A non-Gemma model is refused. Gemma 3 1B is refused because it is text-only. Provision a vision-capable Gemma checkpoint, for example Gemma 3 4B/12B/27B instruction-tuned, with the runtime's multimodal dependencies. The service never substitutes another model.

A separately provisioned vLLM deployment can serve `google/gemma-3-4b-it`; configure its image limit to at least two for comparison. Accept the model's license and provision model weights outside this service. The runtime's envelope model and structured provenance must match configuration. Set `GEMMA_API_KEY` only if your runtime requires it; do not commit keys. Production remote runtime URLs must use HTTPS; the `gemma` Docker hostname or loopback may use internal HTTP.

The adapter sends local bytes as image data URLs, so the runtime does not fetch arbitrary user URLs. MIME signatures, image size (10 MiB), base64, output schema, bounded lists, enums, provenance and confidence are checked. Notes and in-image text are treated as untrusted evidence. Positive visual evidence is required before recommending `RESOLVED`; that recommendation never changes issue status by itself.

Requests use a 30-second timeout by default and at most two exponential-backoff retries for transport failures, 429 and selected 5xx responses. An overall deadline defaults to 95 seconds and cannot exceed 100 seconds, below the API’s 120-second timeout. The public API must not retry this operation. Configure `AI_TOTAL_TIMEOUT_SECONDS`, `AI_TIMEOUT_SECONDS`, `AI_MAX_RETRIES` (maximum 3) and `AI_RETRY_BACKOFF_SECONDS`. Invalid structured responses, non-retryable errors and model mismatches fail visibly. Never treat unsuccessful inference as an analysis.

## TabPFN revisit prediction

Real mode requires all three settings:

- `TABPFN_WEIGHTS_PATH`: existing, trusted official local classification weights, after separately accepting the applicable Prior Labs model license
- `TABPFN_TRAINING_DATA`: UTF-8 CSV of genuine, labeled FieldIssue observation-history examples
- `TABPFN_MODEL_VERSION`: a pinned identifier linking the installed weights, training data version and feature encoding

Install the optional local runtime with `uv sync --extra tabpfn`. For the Docker image, build with `--build-arg INSTALL_TABPFN=true`; the default lightweight image omits the local model dependency and prediction capability remains unavailable without the optional runtime. This service uses `tabpfn.TabPFNClassifier(model_path=..., device=..., categorical_features_indices=[3,4,7])`, `fit(X,y)` and `predict_proba(X)`. It does not download weights, ask for provider login, call paid Prior Labs APIs, or load arbitrary pickled estimators. `TABPFN_DEVICE` defaults to `cpu`; use `cuda` for a provisioned GPU.

The CSV header must contain exactly:

```text
days_since_last_observation,previous_observation_count,issue_age_days,severity,category,nearby_issue_count,previous_change_count,status,material_change_since_last_visit
```

`material_change_since_last_visit` must be 0 or 1 for whether a paired follow-up observation materially differs from the preceding visit within a documented target window. All eight input features must be captured before that follow-up, so labels cannot leak into features. The legacy column alias `changed` is also accepted. Both classes are required. Do not fabricate labels or use a toy sample as production training data. Define the target window, annotation policy, deduplication and temporal/entity holdout in your data pipeline. The service provides no model-quality claim without a genuine held-out evaluation.

Numerical values are validated and the three categorical columns use fixed enums, encoded consistently in training and inference. Fitting is lazy on the first prediction. Missing dependencies, missing weights, bad data, fitting failures, invalid probabilities and timeouts are explicit errors. A single worker prevents concurrent GPU/CPU inference; after a timeout the native calculation may still finish, and the service returns `tabpfn_busy` until it does. There is no heuristic fallback in real mode.

`probabilityChanged` is the probability assigned to class 1. `priorityScore` is a transparent scheduling policy: probability × severity weight (`LOW=.4`, `MEDIUM=.6`, `HIGH=.8`, `CRITICAL=1`), rounded to six decimals. It is not a calibrated second prediction. Both are normalized to [0,1].

## Internal HTTP contract

All POST endpoints require `X-Internal-Token`, compared in constant time to `INTERNAL_SERVICE_TOKEN`. Unconfigured tokens disable all internal POST endpoints.

- `POST /internal/analyze`: `{image_base64, mime_type, note}`
- `POST /internal/compare`: `{before:{image_base64,mime_type,note,evidence?}, after:{image_base64,mime_type,note,evidence?}}`; evidence is a complete prior analysis
- `POST /internal/predict/revisit`: flat, snake_case eight-feature object matching the CSV without the target label
- `GET /health`: process liveness
- `GET /ready`: validates internal token and required settings; verifies the exact Gemma model in the runtime’s `/v1/models` catalog before reporting core readiness. Missing core dependencies and unreachable runtimes return explicit errors. Authenticated `/internal/capabilities` reports optional TabPFN readiness separately

Analyze responses contain exactly `objects`, `conditions`, `suggestedCategory`, `suggestedSeverity`, `evidence`, `confidence`, `model`, `modelVersion`. Compare contains exactly `summary`, `removed`, `added`, `unchanged`, `recommendedStatus`, `confidence`, `model`, `modelVersion`. Predict contains exactly `probabilityChanged`, `priorityScore`, `modelVersion`. Category/severity/status values and response bounds match `packages/shared/src/index.ts`. JSON inputs reject extra fields and type coercion. Validation responses never echo images or notes. A 30-MiB streaming request limit and early token validation run before JSON parsing. Legacy `INTERNAL_AI_TOKEN`/`INTERNAL_TOKEN` aliases are accepted only when the canonical token is absent.

## Sentry and privacy

`SENTRY_DSN` enables opt-in sanitized failure instrumentation. Automatic integrations, request bodies, headers, users, breadcrumbs, local variables and default PII are disabled or stripped. Only safe, closed-set operation/provider/error-code/mode tags and a generic service message are emitted. Sampled root transactions record operation timings, status and trace linkage; `SENTRY_TRACES_SAMPLE_RATE` defaults to 0.05 when Sentry is configured and accepts [0,1], with 0 disabling timing exports. A separate deny-by-default transaction sanitizer removes requests, arbitrary contexts, payloads, child-span descriptions and model data. Images, notes, locations, tokens, raw provider responses and exception messages must never enter telemetry. Tests verify real SDK transaction export into an in-memory transport; nothing is sent to Sentry over the network.

## Training and evaluation

See [training/README.md](training/README.md) for the runnable, opt-in Tinker note-to-JSON LoRA and actual base-versus-checkpoint evaluation. They refuse to run without `TINKER_API_KEY`. Training and inference incur provider costs when deliberately invoked; no paid provider calls or fabricated evaluation scores were made during implementation.

## Official sources checked

- [Official Sentry Python tracing source](https://github.com/getsentry/sentry-python/blob/master/sentry_sdk/tracing.py)
- [Official Sentry Python transaction hook](https://github.com/getsentry/sentry-python/blob/master/sentry_sdk/client.py)
- [uv Docker integration](https://docs.astral.sh/uv/guides/integration/docker/)
- [vLLM multimodal inputs](https://docs.vllm.ai/en/stable/features/multimodal_inputs/)
- [vLLM structured outputs](https://docs.vllm.ai/en/stable/features/structured_outputs/)
- [Prior Labs quickstart](https://docs.priorlabs.ai/quickstart)
- [Prior Labs classifier source](https://github.com/PriorLabs/TabPFN/blob/main/src/tabpfn/classifier.py)
- [Tinker SDK cheatsheet](https://tinker-docs.thinkingmachines.ai/tinker/sdk-cheatsheet/)

On October 7, 2026, real Gemma analysis and an identical-photo comparison passed through the production-configured Python HTTP boundary using Google's free-tier hosted `models/gemma-4-26b-a4b-it`, reported version `001`. The API base is `https://generativelanguage.googleapis.com/v1beta/openai`. This is a provider-reported version, not an immutable checkpoint digest. See [the live report](../../docs/verification/gemma-google-live-2026-10-07.json). A failed comparison before prompt clarification is recorded there too. Tinker was subsequently verified with a small synthetic-note evaluation (see the Model Lab). TabPFN remains experimental; missing labels and weights do not block core readiness.

Run an explicit live smoke check from this directory with an authorized photo:

```sh
uv run --no-sync --env-file ../../.env python ../../scripts/live-gemma.py \
  --image /absolute/path/to/photo.jpg --output /absolute/path/to/report.json
```

The script uses a local HTTP transport with real remote Gemma calls, checks internal authentication, and records full readiness separately. It compares the same photo twice as a negative control. The Google free tier may use inputs/outputs to improve products; use public or otherwise authorized test material and review the applicable data terms before private field uploads.
