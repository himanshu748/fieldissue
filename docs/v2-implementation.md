# FieldIssue V2 implementation

The product specification is [fieldissue-v2-prd.md](fieldissue-v2-prd.md). Render PostgreSQL remains authoritative. The existing Hono/Mastra/private Python boundaries, immutable observations, idempotent writes and explicit resolution are retained.

## Architecture

- `apps/web`: React, TypeScript, Vite, Tailwind, shadcn/ui, Motion and lazy Leaflet. Public landing and authenticated operational routes are distinct. API credentials are entered interactively and kept only in session storage.
- Core `/ready`: database plus Gemma availability. Optional prediction, speech, model comparison and semantic retrieval do not block core readiness.
- Walk Queue: up to five unresolved issues, actual PostGIS distance then oldest observation. No road routing or learned prioritization is claimed.
- Resolution: manual confirmation or a reference to the latest observation, verified while the issue is locked. A stale reference returns 409. Every status change remains auditable.
- Tiger Data: separate secondary database with trusted TLS, 384-dimensional vectors and hybrid keyword/vector queries. A transactional outbox in Render retries failed index work. Search rechecks current primary records, so deleted or status-changed reports cannot be returned under stale status filters.
- Embeddings: pinned `Xenova/all-MiniLM-L6-v2` quantized ONNX conversion of `sentence-transformers/all-MiniLM-L6-v2`, revision `751bff37182d3f1213fa05d7196b954e230abad9`. Mean pooling and L2 normalization; maximum 256 tokens. CPU inference runs in a single short-lived subprocess to release memory. Model files are bundled during deployment; no report text goes to a remote embedding API. The model is English-oriented; cross-language quality is not established.
- Backboard: a consent-gated, cached text comparison of `google/gemma-3-27b-it` and `qwen/qwen-2.5-72b-instruct`. Exact model allowlist, strict output schema and verbatim text evidence validation. Memory, web search, image/video tools and automatic issue changes are disabled. Requests specify a provider price ceiling. Failed models remain independently visible.
- Tinker: recorded real training/evaluation on 36 training and 18 held-out synthetic notes. The expired checkpoint is not used for serving. Small-sample classification counts are shown with their limitations.

## Configuration

`DATABASE_URL` always points to Render for the hosted application. `TIGER_DATABASE_URL` is separate, server-only, and certificate verified. Run `db/tiger-index.sql` on the secondary before enabling `SEMANTIC_SEARCH_ENABLED=true`. Apply primary migrations 005–007 normally. `BACKBOARD_API_KEY` enables the comparison adapter. No keys appear in frontend builds or source control.

A configured adapter is not proof of a successful provider request. Recorded provider evidence lives in `docs/verification`; synthetic integration controls are explicitly identified and excluded from genuine revisit training.

## Remaining human evidence

A real outdoor before/revisit demonstration must be captured by a person. Synthetic controls, unchanged Wikimedia photos and screenshots of a functioning UI do not establish a real-world repair or model accuracy. The DEV article and submission must preserve this distinction.
