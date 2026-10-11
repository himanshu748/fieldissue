# Independent Tinker evaluation, 11 October 2026

The rubric, protocol, 408 training notes, 66 validation notes, 204 synthetic test notes and 30 public Boston 311 reports were committed before inference. All public reports are unchanged English source text with assistant rubric labels. They are not the author's walks or independently human-labelled ground truth.

Validation selected learning rate 0.0001, two epochs and rank 16. Seed 42 was fixed as primary before inference. Seed 1729 repeated the selected configuration. Five few-shot examples came only from fixed training IDs. No test result selected a checkpoint, seed, prompt or label.

| Slice / model | Valid schema | Category | Severity [95% note-bootstrap CI] | More than one level or invalid | Severity macro F1 | Mean latency | Mean input / output tokens |
| --- | --- | --- | --- | --- | --- | --- | --- |
| synthetic / zero_shot (204) | 80.9% | 54.4% | 56.4% [49.5%, 63.2%] | 21.1% | 0.613 | 2.67 s | 386.5 / 65.5 |
| synthetic / few_shot (204) | 100.0% | 71.1% | 77.9% [72.5%, 83.8%] | 1.0% | 0.762 | 2.54 s | 914.5 / 51.7 |
| synthetic / fine_tuned_seed42 (204) | 100.0% | 83.3% | 87.3% [82.8%, 91.7%] | 0.0% | 0.871 | 2.85 s | 386.5 / 52.6 |
| synthetic / fine_tuned_seed1729 (204) | 99.0% | 84.3% | 87.7% [83.3%, 92.2%] | 1.0% | 0.880 | 2.69 s | 386.5 / 52.9 |
| public-source / zero_shot (30) | 93.3% | 73.3% | 53.3% [36.7%, 70.0%] | 6.7% | 0.283 | 2.56 s | 344.1 / 49.3 |
| public-source / few_shot (30) | 100.0% | 83.3% | 50.0% [33.3%, 66.7%] | 3.3% | 0.296 | 3.18 s | 872.1 / 46.5 |
| public-source / fine_tuned_seed42 (30) | 100.0% | 66.7% | 76.7% [60.0%, 90.0%] | 0.0% | 0.386 | 2.72 s | 344.1 / 48.4 |
| public-source / fine_tuned_seed1729 (30) | 96.7% | 66.7% | 73.3% [56.7%, 86.7%] | 3.3% | 0.390 | 2.61 s | 344.1 / 59.4 |

## Paired severity comparisons

| Slice / seed versus baseline | Accuracy difference [paired 95% CI] | Baseline-only / fine-tuned-only correct | Exact McNemar p |
| --- | --- | --- | --- |
| synthetic / fine_tuned_seed42 versus zero_shot | +30.9% [+23.0%, +37.8%] | 9 / 72 | 2.45574e-13 |
| synthetic / fine_tuned_seed42 versus few_shot | +9.3% [+3.4%, +15.2%] | 11 / 30 | 0.004324 |
| synthetic / fine_tuned_seed1729 versus zero_shot | +31.4% [+24.0%, +38.7%] | 10 / 74 | 3.28569e-13 |
| synthetic / fine_tuned_seed1729 versus few_shot | +9.8% [+3.9%, +15.7%] | 12 / 32 | 0.00365777 |
| public-source / fine_tuned_seed42 versus zero_shot | +23.3% [-3.3%, +46.7%] | 5 / 12 | 0.143463 |
| public-source / fine_tuned_seed42 versus few_shot | +26.7% [+3.3%, +50.0%] | 3 / 11 | 0.057373 |
| public-source / fine_tuned_seed1729 versus zero_shot | +20.0% [-3.3%, +43.3%] | 4 / 10 | 0.179565 |
| public-source / fine_tuned_seed1729 versus few_shot | +23.3% [+6.7%, +40.0%] | 1 / 8 | 0.0390625 |

## Interpretation

Primary seed beat the five-shot baseline on synthetic severity accuracy: 87.3% versus 77.9%.

Primary seed beat the five-shot baseline on public-source severity accuracy: 76.7% versus 50.0%.
Metrics worse than the five-shot baseline on public-source: categoryAccuracy.

An exploratory scenario-family bootstrap added after measurement resampled 18 synthetic object families. Primary versus five-shot severity difference interval: [+2.5%, +16.2%]. This diagnostic keeps related notes together and did not influence selection.

Read the slices separately. Public-source references have no LOW or CRITICAL labels, so the fixed four-label macro F1 has a maximum of 0.5 there. Synthetic notes share template structure. All 95% intervals use 1,000 paired note-index resamples and cannot establish field generalization. McNemar p values are unadjusted. Latency includes queue time under eight concurrent requests.

The selected checkpoint won against the previous checkpoint on validation severity accuracy using the same v3 prompt. That selection is separate from the final test results. The candidate was deployed after explicit approval. [Hosted proof](model-evaluation-hosted-2026-10-11.json) records one fresh call, including its unsupported HIGH / major obstruction claim on a sparse cut-tree note. Successful transport is separate from semantic correctness.

Provider-verified selected checkpoint expiry: `2026-11-06T23:58:59.818852+00:00`. New checkpoints were shortened to expire before the November 8 sponsor-credit expiry. Earlier evaluation artifacts and checkpoints were not changed.

Observed-operation token and storage upper estimate: $0.938356 in credits. Preflight maximum: $5.751388. Cash: $0. The cost record includes current provider usage events. They lag real time and are not a reconciled invoice.

[Every prediction and per-language metric](tinker-evaluation-2026-10-11.json) · [Validation outputs and training steps](tinker-training-2026-10-11.json) · [Cost accounting](tinker-cost-2026-10-11.json)

Earlier runs remain unchanged: [7 October](tinker-evaluation-2026-10-07.json) and [9 October](tinker-evaluation-2026-10-09.json). Their 18-note test is different, so percentages are not directly comparable.
