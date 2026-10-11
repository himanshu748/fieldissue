"""Select Tinker hyperparameters on validation, then evaluate every frozen baseline."""

from __future__ import annotations

import argparse
import json
import random
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import UTC, datetime, timedelta
from pathlib import Path

from training import common
from training import independent as data
from training import statistics as stats


def sample(client, rows, sdk, examples=None):
    tokenizer = client.get_tokenizer()

    def one(row):
        tokens = data.prompt_tokens(tokenizer, row["note"], examples)
        if len(tokens) > 4096:
            raise ValueError("Inference prompt exceeds its registered token bound")
        start = time.monotonic()
        result = client.sample(
            prompt=sdk.types.ModelInput.from_ints(tokens),
            num_samples=1,
            sampling_params=sdk.types.SamplingParams(max_tokens=384, temperature=0, seed=42),
        ).result()
        elapsed = (time.monotonic() - start) * 1000
        if len(result.sequences) != 1:
            raise ValueError("Unexpected number of samples")
        generated = result.sequences[0].tokens
        raw = tokenizer.decode(generated, skip_special_tokens=True)
        return {
            "id": row["id"],
            "raw": raw,
            "prediction": stats.decode(raw),
            "latencyMs": elapsed,
            "inputTokens": len(tokens),
            "outputTokens": len(generated),
        }

    with ThreadPoolExecutor(max_workers=8) as pool:
        return list(pool.map(one, rows))


def complete_metrics(rows, outputs):
    result = {"overall": stats.metrics(rows, outputs), "byLanguage": {}}
    for language in ("english", "hindi", "hinglish"):
        indices = [i for i, r in enumerate(rows) if r["language"] == language]
        if indices:
            result["byLanguage"][language] = stats.metrics(
                [rows[i] for i in indices], [outputs[i] for i in indices]
            )
    return result


def verify_frozen():
    manifest = json.loads((data.DATASET / "manifest.json").read_text())
    for split, expected in manifest["sha256"].items():
        if common.dataset_sha256(data.DATASET / f"{split}.jsonl") != expected:
            raise ValueError("A frozen dataset hash changed")
    return manifest


def preflight(output):
    frozen = verify_frozen()
    protocol = json.loads((data.ROOT / "experiment_protocol.json").read_text())
    generations = (
        6 * frozen["counts"]["validation"]
        + 4 * (frozen["counts"]["test"] + 30)
        + 4 * frozen["counts"]["validation"]
    )
    training_tokens_bound = frozen["counts"]["train"] * 9 * 2048
    bound = (
        training_tokens_bound * 0.44 / 1e6 + generations * (4096 * 0.195 + 384 * 0.60) / 1e6 + 0.8
    )
    if bound > protocol["tinkerCreditBudgetUsd"] or bound > 10:
        raise ValueError("Cost bound exceeds approval; stop before training")
    result = {
        "pricingSource": "https://tinker-docs.thinkingmachines.ai/tinker/models.json",
        "pricingCheckedAt": "2026-10-11",
        "ratesUsdPerMillionTokens": {"train": 0.44, "prefill": 0.195, "output": 0.60},
        "counts": frozen["counts"],
        "maximumTrainingTokens": training_tokens_bound,
        "maximumSamplingGenerations": generations,
        "maximumOutputTokens": 384,
        "maximumInputTokens": 4096,
        "storageReserveUsd": 0.8,
        "storageAssumption": "At most eight 1 GB checkpoints retained for 30 days at $0.10 per GB month.",
        "maximumCreditSpendUsd": bound,
        "creditCapUsd": 6,
        "cashAuthorizedUsd": 0,
        "cashSpentUsd": 0,
        "billingStatus": "Preflight bound, not an invoice. Actual usage is read after the run.",
    }
    common.write_json(output / "preflight.json", result)
    return result


def run(output: Path, old_checkpoint: str = ""):
    common.require_key()
    if (output / "run-started.json").exists():
        raise ValueError("This run already started. Review usage before authorizing any rerun.")
    frozen = verify_frozen()
    preflight(output)
    train = data.load(data.DATASET / "train.jsonl")
    validation = data.load(data.DATASET / "validation.jsonl")
    examples = [next(r for r in train if r["id"] == i) for i in frozen["fewShotIds"]]
    common.write_json(
        output / "run-started.json",
        {
            "startedAt": datetime.now(UTC).isoformat(),
            "manifestHash": common.dataset_sha256(data.DATASET / "manifest.json"),
            "protocolHash": common.dataset_sha256(data.ROOT / "experiment_protocol.json"),
        },
    )
    sdk = common.load_tinker()
    service = sdk.ServiceClient(
        user_metadata={"application": "FieldIssue", "experiment": "validation-selected-v3"}
    )
    status = "errored"
    candidates = []
    sessions = (
        {"serviceSession": service.holder.session_id}
        if hasattr(service, "holder") and hasattr(service.holder, "session_id")
        else {}
    )
    try:
        common.ensure_supported_model(service, common.DEFAULT_BASE_MODEL)
        base = service.create_sampling_client(base_model=common.DEFAULT_BASE_MODEL)
        validation_baselines = {
            "zero_shot": sample(base, validation, sdk),
            "few_shot": sample(base, validation, sdk, examples),
        }
        if old_checkpoint:
            old = service.create_sampling_client(model_path=old_checkpoint)
            validation_baselines["previous_checkpoint"] = sample(old, validation, sdk)
        common.write_json(output / "validation-baselines.json", validation_baselines)
        for lr in [5e-5, 1e-4]:
            client = service.create_lora_training_client(
                base_model=common.DEFAULT_BASE_MODEL, rank=16, seed=42
            )
            tokenizer = client.get_tokenizer()
            pairs = [(r, data.build_datum(r, tokenizer, sdk.types)) for r in train]
            rng = random.Random(42)
            logs = []
            for epoch in [1, 2, 3]:
                rng.shuffle(pairs)
                for offset in range(0, len(pairs), 16):
                    batch = pairs[offset : offset + 16]
                    forward = client.forward_backward(
                        [datum for _, datum in batch], "cross_entropy"
                    ).result()
                    client.optim_step(sdk.types.AdamParams(learning_rate=lr)).result()
                    logs.append(
                        {
                            "epoch": epoch,
                            "step": len(logs) + 1,
                            "ids": [r["id"] for r, _ in batch],
                            "metrics": {
                                str(k): float(v)
                                for k, v in forward.metrics.items()
                                if isinstance(v, (int, float))
                            },
                        }
                    )
                    print(f"lr={lr} epoch={epoch} step={len(logs)}", flush=True)
                checkpoint = client.save_weights_for_sampler(
                    f"fieldissue-v3-lr{lr}-e{epoch}", ttl_seconds=2592000
                ).result()
                predictor = service.create_sampling_client(model_path=checkpoint.path)
                outputs = sample(predictor, validation, sdk)
                metric = stats.metric_values(validation, outputs)
                candidate = {
                    "learningRate": lr,
                    "epochs": epoch,
                    "seed": 42,
                    "samplerPath": checkpoint.path,
                    "createdAt": datetime.now(UTC).isoformat(),
                    "checkpointTtlSeconds": 2592000,
                    "validation": metric,
                    "validationOutputs": outputs,
                    "trainingMetrics": list(logs),
                }
                candidates.append(candidate)
                common.write_json(output / "validation-candidates.json", candidates)
                print("VALIDATION", lr, epoch, metric["severityAccuracy"], flush=True)
        selected = max(
            candidates,
            key=lambda x: (
                x["validation"]["severityAccuracy"],
                x["validation"]["severityMacroF1"],
                x["validation"]["schemaRate"],
                -x["epochs"],
                -x["learningRate"],
            ),
        )
        # Commit this selection to disk before loading any held-out test rows.
        selection = {
            "selected": {
                k: v
                for k, v in selected.items()
                if k not in ["validationOutputs", "trainingMetrics"]
            },
            "selectedOn": "validation only",
            "primarySeed": 42,
            "rank": 16,
            "fewShotIds": frozen["fewShotIds"],
            "dataHashes": frozen["sha256"],
            "promptVersion": data.PROMPT_VERSION,
            "session": sessions,
        }
        common.write_json(output / "selection.json", selection)
        client = service.create_lora_training_client(
            base_model=common.DEFAULT_BASE_MODEL, rank=16, seed=1729
        )
        pairs = [(r, data.build_datum(r, client.get_tokenizer(), sdk.types)) for r in train]
        rng = random.Random(1729)
        second_logs = []
        for epoch in range(1, selected["epochs"] + 1):
            rng.shuffle(pairs)
            for offset in range(0, len(pairs), 16):
                batch = pairs[offset : offset + 16]
                forward = client.forward_backward([d for _, d in batch], "cross_entropy").result()
                client.optim_step(
                    sdk.types.AdamParams(learning_rate=selected["learningRate"])
                ).result()
                second_logs.append(
                    {
                        "epoch": epoch,
                        "ids": [r["id"] for r, _ in batch],
                        "metrics": {
                            str(k): float(v)
                            for k, v in forward.metrics.items()
                            if isinstance(v, (int, float))
                        },
                    }
                )
                print("SECOND_SEED", epoch, len(second_logs), flush=True)
        second = client.save_weights_for_sampler(
            "fieldissue-v3-seed1729", ttl_seconds=2592000
        ).result()
        secondary = service.create_sampling_client(model_path=second.path)
        second_validation = sample(secondary, validation, sdk)
        common.write_json(
            output / "second-seed.json",
            {
                "seed": 1729,
                "samplerPath": second.path,
                "trainingMetrics": second_logs,
                "validationOutputs": second_validation,
                "validation": stats.metric_values(validation, second_validation),
            },
        )
        primary = service.create_sampling_client(model_path=selected["samplerPath"])
        # No training or selection occurs after this point.
        rows = data.load(data.DATASET / "test.jsonl") + data.load(
            data.DATASET / "public-source.jsonl"
        )
        predictions = {}
        for name, sampler, shots in [
            ("zero_shot", base, None),
            ("few_shot", base, examples),
            ("fine_tuned_seed42", primary, None),
            ("fine_tuned_seed1729", secondary, None),
        ]:
            predictions[name] = sample(sampler, rows, sdk, shots)
            common.write_json(output / f"test-{name}.json", predictions[name])
            print("TEST_COMPLETE", name, len(rows), flush=True)
        metrics = {}
        comparisons = {}
        for slice_name in ["synthetic", "public-source"]:
            idx = [i for i, r in enumerate(rows) if r["source"] == slice_name]
            subset = [rows[i] for i in idx]
            metrics[slice_name] = {
                name: complete_metrics(subset, [out[i] for i in idx])
                for name, out in predictions.items()
            }
            comparisons[slice_name] = {
                seed: {
                    baseline: stats.paired_difference(
                        subset,
                        [predictions[baseline][i] for i in idx],
                        [predictions[seed][i] for i in idx],
                    )
                    for baseline in ["zero_shot", "few_shot"]
                }
                for seed in ["fine_tuned_seed42", "fine_tuned_seed1729"]
            }
        previous_metric = (
            stats.metric_values(validation, validation_baselines["previous_checkpoint"])
            if "previous_checkpoint" in validation_baselines
            else None
        )
        result = {
            "kind": "fieldissue-tinker-independent-evaluation",
            "createdAt": datetime.now(UTC).isoformat(),
            "provenance": {
                "baseModel": common.DEFAULT_BASE_MODEL,
                "checkpoint": selected["samplerPath"],
                "secondCheckpoint": second.path,
                "promptVersion": data.PROMPT_VERSION,
                "datasetManifestSha256": common.dataset_sha256(data.DATASET / "manifest.json"),
                "protocolSha256": common.dataset_sha256(data.ROOT / "experiment_protocol.json"),
            },
            "selection": selection,
            "previousCheckpointValidation": previous_metric,
            "newCheckpointWinsValidation": bool(
                previous_metric
                and selected["validation"]["severityAccuracy"] > previous_metric["severityAccuracy"]
            ),
            "checkpointExpiresAt": (
                datetime.fromisoformat(selected["createdAt"]) + timedelta(days=30)
            ).isoformat(),
            "metrics": metrics,
            "comparisons": comparisons,
            "samples": [
                {**row, "outputs": {k: out[i] for k, out in predictions.items()}}
                for i, row in enumerate(rows)
            ],
            "limitations": [
                "Template synthetic notes are correlated despite lexical deduplication.",
                "Public-source notes are English Boston 311 reports with assistant rubric labels. No independent human severity adjudication.",
                "Mean latency includes provider queue time under eight concurrent requests.",
                "Bootstrap intervals condition on the sampled notes and do not establish real-world deployment accuracy.",
                "All seeds and failures are published; the primary seed was fixed before inference.",
            ],
            "earlierRuns": [
                "tinker-evaluation-2026-10-07.json",
                "tinker-evaluation-2026-10-09.json",
            ],
        }
        common.write_json(output / "evaluation.json", result)
        status = "success"
        return result
    finally:
        common.finish_session(service, status)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--old-checkpoint", default="")
    parser.add_argument("--preflight-only", action="store_true")
    args = parser.parse_args()
    if args.preflight_only:
        print(json.dumps(preflight(args.output), indent=2))
    else:
        run(args.output, args.old_checkpoint)
