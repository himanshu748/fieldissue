# Independent model evaluation verification, 11 October 2026

[PR 16](https://github.com/himanshu748/fieldissue/pull/16) is based on main `7b9e284`. Merge, deployment and published DEV edits require separate user approval. No hosted report or comparison was created. Original observations and issue statuses remain unchanged.

## Checks actually completed

Local build, API types, web types, Prettier and Ruff passed. Tests used a disposable PostgreSQL/PostGIS/vector database on loopback port 55439 and a test-only local server on 3190.

[GitHub Actions run 38124482114](https://github.com/himanshu748/fieldissue/actions/runs/38124482114) passed at `026a550`. Exact log totals after removing ANSI color escapes:

```text
Tests  199 passed (199)
93 passed in 6.26s
16 passed (26.8s)
```

The one live-mutation browser test was intentionally skipped. Render container lifecycle, the free-instance memory boundary, actual database extensions and compiled HTTP checks passed. CI does not invoke paid providers.

Manual local browser inspection showed all 234 Tinker notes, public-note mistakes, the category regression and all six TabPFN curve sizes. Language/source filters, empty states and raw outputs were exercised by browser tests. Console error list was empty.

## Provider and hosted scope

[Compiled provider call](tinker-note-candidate-live-2026-10-11.json): the validation-selected checkpoint returned valid LOW / ENVIRONMENT JSON from a synthetic training fixture through the actual Tinker endpoint in 8,123 ms. This is a local production-provider boundary call, not a hosted-demo call.

Existing hosted main was checked at 08:21 UTC. The first health request timed out after 30 seconds. One cold-start retry succeeded:

```json
{"health":{"status":200,"body":{"status":"ok","service":"fieldissue-api"}},"ready":{"status":200,"body":{"status":"ready"}}}
```

The selected checkpoint expires at `2026-11-06T23:58:59.818852+00:00`. Deploy both its model path and `TINKER_PROMPT_VERSION=fieldissue-note-json-v3` together after explicit merge approval. A hosted fresh note call and the new public Lab remain pending that rollout.

## Budget and preserved evidence

[Tinker accounting](tinker-cost-2026-10-11.json) gives $0.938267 as a full-rate token and 30-day storage upper estimate in credits. A second read-only billing check still found zero matching events with no cost-data watermark, so this is not a reconciled invoice. TabPFN reserved 300,000 free prediction tokens. Cash spent: $0.

The old notes dataset, original seed-42 revisit generator and October 7/9 evaluation files have no branch diff. Every new prediction remains published. Synthetic template dependence and assistant public-report labels are explicit limitations. No key, token, signed upload URL or account contact information was added to the branch diff.
