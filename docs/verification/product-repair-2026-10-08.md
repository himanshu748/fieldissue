# Product repair verification — 2026-10-08

## Changes

Separate public landing and `/app` workspace, report route and stable issue links.
Saved comparisons remain visible after resolution and reload; all statuses,
search, cursor pagination, opt-in OpenStreetMap and reopening are available.
Capture-time/location provenance is retained. SerpApi context is persisted.

Production requires distinct access credentials and durable media storage. The
free judge profile now stores media in PostgreSQL with an atomic 200 MiB cap.
Writes have global rate/concurrency bounds and actual provider operations have
a durable daily allowance. Cached results and committed idempotent replays do
not consume that allowance. Revisit retries use a stable request key.

## Independent review

Actual Claude CLI `--model opus` returned model `claude-opus-5-5`. Opus drafted
the marketing page and independently reviewed source. Its two P2 findings were
corrected: definitively rejected revisits can be edited, and usage limits no
longer charge before cache/idempotency checks. Codex verified those changes
and added regression coverage. No review model is represented as a runtime
provider or a judge-facing feature.

## Fresh checks

- TypeScript build and lint/format checks passed.
- Node suite without database: 68 passed, 29 database tests skipped.
- Real Render PostgreSQL 17 with PostGIS/vector, certificate-verified external
  connection: 94 passed, 3 local timing tests excluded. This suite uses fixture
  intelligence, not live Gemma, and was run before any real reports were added.
- Initial remote run: 93 passed, 4 failed due the local 500 ms connection bound
  and 15-second test timeout. The functional rerun used 60-second test timeouts;
  the original local timing assertions were not weakened in source.
- Local PostgreSQL boundary suite: all 12 passed, including those three
  concurrency cases. Local harness substitutes only spatial feature queries
  because local PostgreSQL lacks PostGIS; remote suite covers real spatial SQL.
- Python: 72 passed, 20 subtests passed.
- Browser: separate routes, saved comparison on direct load/reload, resolution,
  closed history, map tiles, responsive report/landing at 390 px, theme switch
  and no console errors. Browser dataset was an isolated explicit fixture.
- Fresh actual SerpApi free-account lookup is recorded alongside this report.

## Boundaries still open

Physical phone camera/geolocation testing and a genuine changed revisit pair
are not established. Tiger Data direct TLS, ElevenLabs key/voice, and genuine
TabPFN labels/weights remain unavailable. Tinker is the previously documented
real credit-funded offline experiment on synthetic notes; it is not an active
vision endpoint. Free Render database retention is only 30 days.

Generated park artwork is labeled illustration and never used as report
evidence. Production rejects mock AI; tests remain explicitly fixture-based.
