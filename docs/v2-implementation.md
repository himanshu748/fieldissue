# FieldIssue V2 implementation

The product specification is [fieldissue-v2-prd.md](fieldissue-v2-prd.md). The TLS-verified Tiger Data PostgreSQL service is authoritative for the hosted application. The existing Hono/Mastra/private Python boundaries, immutable observations, idempotent writes and explicit resolution are retained.

## Architecture

- `apps/web`: React, TypeScript, Vite, Tailwind, shadcn/ui, Motion and lazy Leaflet. Public landing and operational routes are distinct. The demo needs no token; optional accounts and signed guest cookies preserve ownership. Operator credentials are entered only for administrative access.
- Core `/ready`: database plus Gemma availability. Optional prediction, speech, model comparison and semantic retrieval do not block core readiness.
- Walk Queue: up to five unresolved issues, actual PostGIS distance then oldest observation. Optional Google Maps walking directions require explicit coordinate-sharing consent. Learned prioritization is not enabled. Account walks are private and use manual save/load with revision checks.
- Resolution: manual confirmation or a reference to the latest observation, verified while the issue is locked. A stale reference returns 409. Every status change remains auditable.
- Tiger Data: trusted TLS, 384-dimensional vectors and hybrid keyword/vector queries. A transactional outbox in the primary database retries failed index work. Search rechecks current primary records, so deleted or status-changed reports cannot be returned under stale status filters.
- Embeddings: pinned `Xenova/all-MiniLM-L6-v2` quantized ONNX conversion of `sentence-transformers/all-MiniLM-L6-v2`, revision `751bff37182d3f1213fa05d7196b954e230abad9`. Mean pooling and L2 normalization; maximum 256 tokens. CPU inference runs in a single short-lived subprocess to release memory. Model files are bundled during deployment; no report text goes to a remote embedding API. The model is English-oriented; cross-language quality is not established.
- Backboard: a consent-gated, cached text comparison of `google/gemma-3-27b-it` and `qwen/qwen-2.5-72b-instruct`. Exact model allowlist, strict output schema and verbatim text evidence validation. Memory, web search, image/video tools and automatic issue changes are disabled. Requests specify a provider price ceiling. Failed models remain independently visible.
- Tinker: real training/evaluation on 36 training and 18 held-out synthetic notes, plus live consent-gated serving from the October 9 trained checkpoint. The earlier expired checkpoint is not served. Small-sample classification counts and expiry are disclosed.

## Configuration

`DATABASE_URL` points to Tiger Data in the hosted application. `TIGER_DATABASE_URL` configures the semantic index connection; both remain server-only and certificate verified. Run `db/tiger-index.sql` on the secondary before enabling `SEMANTIC_SEARCH_ENABLED=true`. Apply all checked-in primary migrations in order, including 013 for accounts and community coordination. `BACKBOARD_API_KEY` enables the comparison adapter. No keys appear in frontend builds or source control.

A configured adapter is not proof of a successful provider request. Recorded provider evidence lives in `docs/verification`; synthetic integration controls are explicitly identified and excluded from genuine revisit training.

## Remaining human evidence

A real outdoor before/revisit demonstration must be captured by a person. Synthetic controls, unchanged Wikimedia photos and screenshots of a functioning UI do not establish a real-world repair or model accuracy. The DEV article and submission must preserve this distinction.

## Advanced workflows

Optional accounts, workspaces, assignments, two-reviewer evidence checks, durable offline capture, reminders, exports and public read API are covered by [the P1/P2 acceptance ledger](verification/p2-acceptance-2026-10-09.md). Review accounts are not verified people. Offline upload requires an explicit action; maps and AI still require a network connection. Municipal exports do not automatically file reports, and notifications are an in-app inbox plus downloadable calendar reminders.
