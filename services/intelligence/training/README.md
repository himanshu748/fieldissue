# FieldIssue: real Tinker note → compact strict JSON demo

This runnable supervised fine-tuning/evaluation demonstration uses the actual Tinker SDK. A real credit-funded Qwen3-8B run completed on October 7, 2026: 36 training notes, one epoch, nine optimizer steps, and an 18-note held-out base-versus-checkpoint evaluation. The [training manifest](../../../docs/verification/tinker-training-2026-10-07.json), [raw evaluation](../../../docs/verification/tinker-evaluation-2026-10-07.json), and [cost evidence](../../../docs/verification/tinker-cost-2026-10-07.json) preserve the results. Both models passed strict JSON/schema validation on 18/18 notes; category accuracy stayed at 17/18, and severity accuracy changed from 14/18 to 16/18. This is a tiny synthetic plumbing demonstration, not real-world validation. Checkpoints have a one-hour TTL and are not permanent deployed models. Running with credentials uses Tinker's remote service and can incur training, sampling, and checkpoint-storage charges. Review [current models and pricing](https://tinker-docs.thinkingmachines.ai/tinker/models/models_and_pricing/) first.

## Canonical learned target

The learned JSON contains exactly five fields: `category`, `object`, `condition`, `severity`, `evidence`. Model names, checkpoint versions, annotation provenance, and confidence are not learned target fields. Authoritative provenance belongs to annotation rows and training/evaluation metadata.

The exact required Hinglish fixture is in `dataset/notes.jsonl`:

Input:

```text
bhai park gate ke paas wala dustbin full hai aur kachra bahar pada hai
```

Target:

```json
{
  "category": "CLEANLINESS",
  "object": "waste_bin",
  "condition": "overflowing",
  "severity": "MEDIUM",
  "evidence": ["waste visible outside the bin"]
}
```

Its supported evidence annotation quotes `kachra bahar pada hai` from the note and sets `source` to `note`. The exact user-requested English phrase “waste visible outside the bin” reflects **what the writer reports**. No image accompanies these notes; this fixture does not claim independent image inspection or verified visibility.

The strict local training-target validator requires:

- Categories: CLEANLINESS, INFRASTRUCTURE, ACCESSIBILITY, SAFETY, ENVIRONMENT, SIGNAGE, LIGHTING, TRAIL, OTHER
- Severities: LOW, MEDIUM, HIGH, CRITICAL
- Object and condition: strings, stripped, 1–500 characters; short snake_case identifiers are used in annotations
- Evidence: array of at most 30 stripped nonempty strings, each at most 500 characters
- Exactly those five fields; no extra fields, missing fields, or type coercion
- Vague OTHER notes use `object=unknown`, `condition=unspecified`, and empty evidence

This compact target is a separate note-normalization training artifact. The running service's Gemma AnalyzeResult API schema is defined separately and does not change with this training target.

## Synthetic annotations and limitations

`dataset/notes.jsonl` contains 54 assistant-authored fictional notes with illustrative labels: 36 train and 18 held-out test examples. Each of the nine categories has four training notes (English, short, misspelled, Hinglish) and two distinct test notes. All four note styles and severity levels occur in both splits. IDs and normalized note text are unique across the full dataset.

Each row has source/version metadata under `provenance`, outside its target. `supportedEvidence` stores each permitted description, an exact source-note `quote`, and `source=note`. The loader checks the quote occurs in the note and every target evidence claim has a permitted annotation. Supported descriptions are synthetic annotations, not independently adjudicated real reports.

Severity follows an illustrative rubric: minor/unclear → LOW; an issue without an explicit major hazard → MEDIUM; stated substantial obstruction/danger → HIGH; explicitly immediate life-threatening danger → CRITICAL. Human review remains necessary; these labels do not justify automated emergency or safety decisions.

**This tiny synthetic dataset cannot demonstrate real-world accuracy, safety, or generalization.** Near-semantic repetition also limits the strength of any observed improvement. Use independently collected, consented, realistically diverse reports and blind human adjudication before making such claims.

## Setup (Python ≥3.11)

From `services/intelligence`:

```bash
python -m venv .venv
. .venv/bin/activate
python -m pip install -e '.[dev,training]'
# Set TINKER_API_KEY securely in your local environment. Do not commit it.
```

Required training dependencies: `tinker>=0.30.4,<1` and `jinja2>=3.1.6,<4` for the official chat template. The SDK brings its tokenizer/Transformers dependency. This implementation does not require PyTorch or the Tinker Cookbook. Importing `training.common`, `training.train`, or `training.evaluate` does not import Tinker or contact a service.

Without `TINKER_API_KEY`, either executable exits with code 2 and a useful message **before importing the SDK or making a network request**. `--help` and offline unit tests work without a key or Tinker installation.

## Train

```bash
python training/train.py \
  --base-model Qwen/Qwen3-8B \
  --epochs 1 --batch-size 4 --rank 16 --learning-rate 0.0001 \
  --checkpoint-name fieldissue-note-json-demo \
  --checkpoint-ttl 86400 \
  --output training/artifacts/training-run.json
```

The script checks the chosen model is currently advertised by `get_server_capabilities()`; availability can change. It creates an actual LoRA client and uses the model tokenizer's official chat template with a system instruction and JSON-wrapped user note. Qwen3 uses `enable_thinking=False`. Alternative models need a compatible official chat template; no guessed chat format is used.

Targets are compact five-field JSON plus EOS. For prompt tokens P and completion tokens C, input is `(P+C)[:-1]`, target tokens are `(P+C)[1:]`, and loss weights are 0 for the first `len(P)-1` positions and 1 for the entire completion, including EOS. Prompt tokens contribute no cross-entropy loss. Examples over `--max-tokens` (default 4096) are rejected without silent truncation.

Every batch calls actual `forward_backward(..., 'cross_entropy').result()` and Adam `optim_step(...).result()`. Only returned Tinker metrics are recorded. Training saves resumable state and sampler weights, then writes the **returned** `tinker://` paths, base model, dataset SHA-256, training IDs/normalized-note hashes, prompt/annotation versions, hyperparameters, and actual step metrics. Checkpoints expire after 24 hours by default (minimum TTL: one hour); retaining them can incur storage charges.

The compact format is prompt/annotation version 2. A manifest from the earlier full AnalyzeResult target is rejected by this evaluator; retrain for the compact target.

## Evaluate actual base versus fine-tuned weights

```bash
python training/evaluate.py \
  --manifest training/artifacts/training-run.json \
  --output training/artifacts/evaluation.json
```

Or supply an actual sampler path and its matching base:

```bash
python training/evaluate.py \
  --base-model Qwen/Qwen3-8B \
  --checkpoint 'tinker://YOUR_RUN/sampler_weights/YOUR_CHECKPOINT' \
  --output training/artifacts/evaluation.json
```

The evaluator creates separate actual base and checkpoint sampling clients, verifies both server-reported base models match, and samples **both** for each held-out note with the same prompt, temperature 0, seed, and token budget. There is no fallback classifier, simulated live evaluation, JSON repair, LLM judge, or additional model provider. Sampling failure aborts instead of substituting a score.

With `--manifest`, it additionally rejects prompt/model/checkpoint mismatches and test IDs or normalized note hashes found in training. Direct-checkpoint evaluation can verify split disjointness within this dataset, but cannot independently establish that checkpoint's training data; provenance records this limitation.

Reports preserve raw outputs, compact parsed predictions, source annotations, per-example errors, and authoritative run metadata. Server-verified base/checkpoint provenance is under report `provenance.models`; predictions remain exactly five-field JSON. The scripts release Tinker resources with `close('success').result()` or `close('errored').result()`. A secondary cleanup error cannot replace the original provider error.

Metrics use explicit denominators:

- `validJsonRate`: outputs parsing as one strict JSON value / all test examples. Duplicate keys, NaN/Infinity, fences, and trailing prose fail
- `strictSchemaRate`: outputs passing the compact five-field schema / all test examples
- `categoryAccuracy`, `severityAccuracy`: correctly labeled strict-schema outputs / all examples; invalid outputs count as incorrect
- `evidenceHallucinationRate`: unsupported predicted evidence strings / predicted evidence strings in strict-schema-valid outputs. Support means matching an annotated permitted description after Unicode NFKC, casefolding, and whitespace normalization. This is a **conservative exact-match proxy**, not semantic entailment; correct paraphrases can be false positives. Reports retain unsupported strings and claim counts
- `evidenceRecall`: matched permitted descriptions / annotated supported descriptions across all examples. Invalid outputs contribute zero recall; duplicate predictions do not increase recall
- A zero denominator yields `null`, never a fabricated zero hallucination or perfect accuracy. Read schema rate, `evidenceEvaluableExamples`, claim counts, and recall together

If the key or checkpoint is unavailable, no measured model scores exist to report.

## Offline verification

```bash
python -m unittest discover -s tests -p test_training.py -v
# Full service suite, after dev dependencies are installed:
python -m pytest
```

Tests cover compact target boundaries, the exact Hinglish example, note-grounded annotations, split disjointness, shifted completion-only masking, no-key exits under Python `-S`, actual SDK orchestration via test-only fakes, base/checkpoint identity, manifest/provenance, evidence denominators, and sanitized opt-in telemetry. Fake outputs test plumbing; they are not benchmark results.

## Optional sanitized Sentry evaluation timing

Instrumentation is disabled unless `SENTRY_DSN` is set. When configured, evaluation has a fixed-name root transaction and fixed-role base/fine-tuned sampling spans. Trace sampling defaults to 0.05; `SENTRY_TRACES_SAMPLE_RATE` can set a finite rate in [0, 1], including zero to disable traces.

A deny-by-default `before_send_transaction` sanitizer retains only fixed operation/role names, allowed status, numeric timing, and well-formed trace IDs. A separate event sanitizer permits fixed messages with `operation=evaluate`, `provider=tinker`, and `mode=base|fine_tuned|compare`. Requests, notes, predictions, paths, model/checkpoint IDs, frame locals, SDK exception values, keys, and other event context are removed. Automatic integrations, breadcrumbs, and default personal-information collection are disabled. Tests inject a fake SDK and never contact Sentry.

## Official API references

Checked against current documented SDK APIs (reference generated from 0.30.4) and official 0.32.0 source signatures. Credentialed execution remains unverified:

- [TrainingClient](https://tinker-docs.thinkingmachines.ai/tinker/api-reference/trainingclient/)
- [SamplingClient](https://tinker-docs.thinkingmachines.ai/tinker/api-reference/samplingclient/)
- [ServiceClient](https://tinker-docs.thinkingmachines.ai/tinker/api-reference/serviceclient/)
- [SDK cheatsheet](https://tinker-docs.thinkingmachines.ai/tinker/sdk-cheatsheet/)
- [Official SDK dependencies](https://github.com/thinking-machines-lab/tinker/blob/main/pyproject.toml)
