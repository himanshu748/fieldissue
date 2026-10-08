# Genuine revisit labels for TabPFN

A model comparison is a suggestion, not a training label. In the dashboard,
review a new pair of observations and use **Your assessment** to record whether
the physical condition materially changed. Explain the visible evidence and
confirm that both visits are genuine, rather than staged or generated controls.
Gemma's suggestion is collapsed separately to reduce anchoring. This is a human
assertion, not automatic proof of authenticity.

The authenticated endpoint is `POST /v1/issues/:id/revisit-review`:

```json
{
  "beforeObservationId": "<previous observation UUID>",
  "afterObservationId": "<new observation UUID>",
  "materialChange": true,
  "note": "Describe the visible change in the two photographs.",
  "evidenceIsGenuine": true
}
```

The API stores a snapshot of the eight TabPFN predictors before it inserts the
new observation or persists its comparison. Only chronological observations
captured within five minutes before upload qualify. Older evidence remains
valid issue history but cannot reconstruct past severity, status or nearby
issues, so it is excluded from training. Future captures do not qualify either.
Reviews must refer to the snapshot's recorded predecessor. Any development
fixture in the issue history makes the review ineligible.

Reviews are protected by the existing workspace access token. This demo has a
shared workspace credential, not individual reviewer accounts. Changes are
recorded in the issue timeline; a correction replaces the exported label but
retains the earlier review event. Reviewing never resolves an issue.

`GET /v1/revisit-training-data`, using the same Authorization header, exports
CSV with exactly the eight required feature columns and
`material_change_since_last_visit`. It contains no photos, notes, identifiers or
coordinates. Until both changed and unchanged genuine reviews exist, it returns
409 `TRAINING_DATA_INCOMPLETE`, not an empty or fabricated training set.

Save the export on the intelligence host and configure `TABPFN_TRAINING_DATA`
with its path, together with licensed official weights, model version and the
TabPFN runtime. See the intelligence service README. Two classes are only a
technical minimum: they do not establish useful predictive accuracy. Collect
representative visits and evaluate a held-out set before relying on rankings.
The 512 MiB free Render instance does not have a local PyTorch/TabPFN runtime.
No heuristic substitutes for a missing model or training history.
