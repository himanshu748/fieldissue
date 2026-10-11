"""Publish complete predictions and a concise summary without changing labels or selection."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from training import common, independent, statistics


def confusion(rows, outputs):
    levels = [*common.SEVERITIES, "INVALID"]
    table = {a: {b: 0 for b in levels} for a in common.SEVERITIES}
    for row, output in zip(rows, outputs, strict=True):
        table[row["target"]["severity"]][
            output["prediction"]["severity"] if output["prediction"] else "INVALID"
        ] += 1
    return table


def publish(run_dir, destination):
    evaluation = json.loads((run_dir / "evaluation.json").read_text())
    evaluation["provenance"]["systemPrompt"] = independent.SYSTEM_PROMPT
    evaluation["execution"] = {
        "datasetCommit": "90bb813",
        "runnerCommitAtStart": "52b021b",
        "protocolFrozenBeforeInference": True,
        "postRunAnalysis": "Per-language paired tests and severity confusion counts were computed from the saved predictions. No model, label, selection or baseline changed.",
    }
    for slice_name, models in evaluation["metrics"].items():
        rows = [row for row in evaluation["samples"] if row["source"] == slice_name]
        for name, metrics in models.items():
            outputs = [r["outputs"][name] for r in rows]
            metrics["severityConfusion"] = confusion(rows, outputs)
            for language, detail in metrics["byLanguage"].items():
                subset = [r for r in rows if r["language"] == language]
                detail["severityConfusion"] = confusion(
                    subset, [r["outputs"][name] for r in subset]
                )
        for seed, comparisons in evaluation["comparisons"][slice_name].items():
            for baseline, comparison in comparisons.items():
                comparison["byLanguage"] = {}
                for language in ["english", "hindi", "hinglish"]:
                    subset = [r for r in rows if r["language"] == language]
                    if subset:
                        comparison["byLanguage"][language] = statistics.paired_difference(
                            subset,
                            [r["outputs"][baseline] for r in subset],
                            [r["outputs"][seed] for r in subset],
                        )
    evaluation["limitations"].append(
        "McNemar p values are exploratory and unadjusted for multiple comparisons. Note bootstraps do not remove shared-template correlation."
    )
    common.write_json(destination / "tinker-evaluation-2026-10-11.json", evaluation)
    training = {
        "kind": "fieldissue-tinker-validation-selection",
        "datasetManifest": json.loads((independent.DATASET / "manifest.json").read_text()),
        "protocol": json.loads((independent.ROOT / "experiment_protocol.json").read_text()),
        "validationBaselines": json.loads((run_dir / "validation-baselines.json").read_text()),
        "validationCandidates": json.loads((run_dir / "validation-candidates.json").read_text()),
        "selectionBeforeTest": json.loads((run_dir / "selection.json").read_text()),
        "secondSeed": json.loads((run_dir / "second-seed.json").read_text()),
        "retention": evaluation.get("retention"),
    }
    common.write_json(destination / "tinker-training-2026-10-11.json", training)
    cost = json.loads((run_dir / "cost.json").read_text())
    common.write_json(destination / "tinker-cost-2026-10-11.json", cost)
    lines = [
        "# Independent Tinker evaluation, 11 October 2026",
        "",
        "The rubric, protocol, 408 training notes, 66 validation notes, 204 synthetic test notes and 30 public Boston 311 reports were committed before inference. All public reports are unchanged English source text with assistant rubric labels. They are not the author's walks or independently human-labelled ground truth.",
        "",
        "Validation selected learning rate 0.0001, two epochs and rank 16. Seed 42 was fixed as primary before inference. Seed 1729 repeated the selected configuration. Five few-shot examples came only from fixed training IDs. No test result selected a checkpoint, seed, prompt or label.",
        "",
        "| Slice / model | Valid schema | Category | Severity [95% note-bootstrap CI] | More than one level or invalid | Severity macro F1 | Mean latency | Mean input / output tokens |",
        "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ]
    for slice_name, models in evaluation["metrics"].items():
        for name, model in models.items():
            detail = model["overall"]
            v = detail["values"]
            ci = detail["bootstrap95"]["severityAccuracy"]
            lines.append(
                f"| {slice_name} / {name} ({detail['n']}) | {v['schemaRate']:.1%} | {v['categoryAccuracy']:.1%} | {v['severityAccuracy']:.1%} [{ci[0]:.1%}, {ci[1]:.1%}] | {v['severityOffByMoreThanOneRate']:.1%} | {v['severityMacroF1']:.3f} | {v['meanLatencyMs'] / 1000:.2f} s | {v['meanInputTokens']:.1f} / {v['meanOutputTokens']:.1f} |"
            )
    lines += [
        "",
        "## Paired severity comparisons",
        "",
        "| Slice / seed versus baseline | Accuracy difference [paired 95% CI] | Baseline-only / fine-tuned-only correct | Exact McNemar p |",
        "| --- | --- | --- | --- |",
    ]
    for slice_name, seeds in evaluation["comparisons"].items():
        for seed, baselines in seeds.items():
            for baseline, comparison in baselines.items():
                d = comparison["severityAccuracyDifferenceSecondMinusFirst"]
                ci = comparison["pairedBootstrap95"]
                m = comparison["mcnemar"]
                lines.append(
                    f"| {slice_name} / {seed} versus {baseline} | {d:+.1%} [{ci[0]:+.1%}, {ci[1]:+.1%}] | {m['firstOnlyCorrect']} / {m['secondOnlyCorrect']} | {m['exactTwoSidedP']:.6g} |"
                )
    lines += ["", "## Interpretation", ""]
    for slice_name, models in evaluation["metrics"].items():
        tuned = models["fine_tuned_seed42"]["overall"]["values"]
        few = models["few_shot"]["overall"]["values"]
        better = tuned["severityAccuracy"] > few["severityAccuracy"]
        lines.append(
            f"Primary seed {'beat' if better else 'did not beat'} the five-shot baseline on {slice_name} severity accuracy: {tuned['severityAccuracy']:.1%} versus {few['severityAccuracy']:.1%}."
        )
        worse = [
            name
            for name in ["schemaRate", "categoryAccuracy", "severityMacroF1"]
            if tuned[name] < few[name]
        ]
        if tuned["severityOffByMoreThanOneRate"] > few["severityOffByMoreThanOneRate"]:
            worse.append("costly triage error rate")
        if worse:
            lines.append(
                f"Metrics worse than the five-shot baseline on {slice_name}: {', '.join(worse)}."
            )
        lines.append("")
    lines += [
        "Read the slices separately. Public-source references have no LOW or CRITICAL labels, so the fixed four-label macro F1 has a maximum of 0.5 there. Synthetic notes share template structure. All 95% intervals use 1,000 paired note-index resamples and cannot establish field generalization. McNemar p values are unadjusted. Latency includes queue time under eight concurrent requests.",
        "",
        f"The selected checkpoint {'won' if evaluation['newCheckpointWinsValidation'] else 'did not win'} against the previous checkpoint on validation severity accuracy using the same v3 prompt. That selection is separate from the final test results. Deployment and one hosted live note call require explicit merge approval and remain unverified in this PR.",
        "",
        f"Provider-verified selected checkpoint expiry: `{evaluation['checkpointExpiresAt']}`. New checkpoints were shortened to expire before the November 8 sponsor-credit expiry. Earlier evaluation artifacts and checkpoints were not changed.",
        "",
        f"Observed-operation token and storage upper estimate: ${cost['observedOperationAndStorageUpperEstimateUsd']:.6f} in credits. Preflight maximum: ${cost['preflight']['maximumCreditSpendUsd']:.6f}. Cash: $0. The cost record includes current provider usage events. They lag real time and are not a reconciled invoice.",
        "",
        "[Every prediction and per-language metric](tinker-evaluation-2026-10-11.json) · [Validation outputs and training steps](tinker-training-2026-10-11.json) · [Cost accounting](tinker-cost-2026-10-11.json)",
        "",
        "Earlier runs remain unchanged: [7 October](tinker-evaluation-2026-10-07.json) and [9 October](tinker-evaluation-2026-10-09.json). Their 18-note test is different, so percentages are not directly comparable.",
        "",
    ]
    (destination / "tinker-evaluation-2026-10-11.md").write_text("\n".join(lines))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("run_dir", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()
    publish(args.run_dir, args.destination)
