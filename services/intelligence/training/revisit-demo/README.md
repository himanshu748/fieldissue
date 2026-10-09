# Synthetic revisit scenario demo

These 120 rows are **invented data**, requested by the project owner to exercise real TabPFN inference. They are not FieldIssue observations or human-reviewed labels. `generate.py` deterministically generates 96 training and 24 held-out rows with seed 42. Its stochastic label formula is illustrative, not a claim about repair rates. Numeric category/severity/status encodings and SHA-256 digests are in `provenance.json`.

`fit.py` uses the official Prior Labs REST API: quote, signed CSV upload, standard fit, test upload and prediction. Set `TABPFN_TOKEN` only in an ignored environment; run with a Python environment containing httpx. It requests TabPFN-3.5 with eight estimators. Standard fits do not consume prediction tokens. Re-running consumes free prediction quota and creates provider-side uploaded datasets; never run implicitly on deployment.

The October 9 account has a free allowance of 5M daily / 20M monthly tokens and no added payment method. The 24-row evaluation used 10,000 tokens. The live app caps each quoted scenario at 50,000 tokens and reserves at most 100 calls in PostgreSQL, across deployments, including failures. Results are cached. Provider quota enforcement remains authoritative.

Configure `TABPFN_API_KEY` and the returned `TABPFN_FITTED_MODEL_ID` only on the API server. The Model Lab sends eight numeric scenario values; no issue IDs, photos, notes or coordinates. Results always say synthetic, never change issue status and never rank real walks. The separate local real-history TabPFN adapter and human-review export remain available for future genuine data.

[Held-out evaluation](../../../../docs/verification/tabpfn-synthetic-evaluation-2026-10-09.json) · [live API result](../../../../docs/verification/tabpfn-live-2026-10-09.json) · [official REST contract](https://docs.priorlabs.ai/api/rest-quickstart)
