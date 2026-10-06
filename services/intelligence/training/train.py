#!/usr/bin/env python3
"""Train a real Tinker LoRA note-to-JSON model; never a keyword stand-in."""

from __future__ import annotations

import argparse
import math
import random
import sys
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from training import common


@dataclass(frozen=True)
class TrainConfig:
    dataset: Path = common.DEFAULT_DATASET
    output: Path = Path("training/artifacts/training-run.json")
    base_model: str = common.DEFAULT_BASE_MODEL
    epochs: int = 1
    batch_size: int = 4
    rank: int = 16
    learning_rate: float = 1e-4
    seed: int = 42
    max_tokens: int = 4096
    checkpoint_name: str = "fieldissue-note-json-" + datetime.now(UTC).strftime("%Y%m%d-%H%M%S")
    checkpoint_ttl: int = 86400


def run_training(config: TrainConfig, *, tinker_sdk: Any = None) -> dict[str, Any]:
    if min(config.epochs, config.batch_size, config.rank, config.max_tokens) < 1:
        raise ValueError("epochs, batch_size, rank and max_tokens must be positive")
    if not math.isfinite(config.learning_rate) or config.learning_rate <= 0:
        raise ValueError("learning_rate must be finite and positive")
    if config.checkpoint_ttl < 3600:
        raise ValueError("checkpoint_ttl must be at least 3600 seconds")
    records = common.select_split(common.load_dataset(config.dataset), "train")
    tinker = tinker_sdk if tinker_sdk is not None else common.load_tinker()
    service = tinker.ServiceClient(
        user_metadata={"application": "FieldIssue", "data": "synthetic-demo"}
    )
    status = "errored"
    try:
        common.ensure_supported_model(service, config.base_model)
        client = service.create_lora_training_client(
            base_model=config.base_model, rank=config.rank, seed=config.seed
        )
        tokenizer = client.get_tokenizer()
        data = [
            (row, common.build_datum(row, tokenizer, tinker.types, config.max_tokens))
            for row in records
        ]
        rng = random.Random(config.seed)
        logs = []
        for epoch in range(config.epochs):
            rng.shuffle(data)
            for start in range(0, len(data), config.batch_size):
                batch = data[start : start + config.batch_size]
                # Server-side gradients and optimizer update. Wait for each future:
                # no loss values, checkpoint paths or training success are simulated.
                forward = client.forward_backward(
                    [datum for _, datum in batch], "cross_entropy"
                ).result()
                client.optim_step(
                    tinker.types.AdamParams(learning_rate=config.learning_rate)
                ).result()
                metrics = getattr(forward, "metrics", {})
                logs.append(
                    {
                        "step": len(logs) + 1,
                        "epoch": epoch + 1,
                        "exampleIds": [row["id"] for row, _ in batch],
                        "metrics": {
                            str(key): float(value)
                            for key, value in metrics.items()
                            if type(value) in (int, float) and math.isfinite(value)
                        },
                    }
                )
                print(f"epoch={epoch + 1} step={len(logs)} examples={len(batch)}", file=sys.stderr)
        metadata = {
            "application": "FieldIssue",
            "promptVersion": common.PROMPT_VERSION,
            "annotationVersion": common.ANNOTATION_VERSION,
        }
        state = client.save_state(
            config.checkpoint_name, ttl_seconds=config.checkpoint_ttl, user_metadata=metadata
        ).result()
        sampler = client.save_weights_for_sampler(
            config.checkpoint_name, ttl_seconds=config.checkpoint_ttl, user_metadata=metadata
        ).result()
        manifest = {
            "kind": "fieldissue-tinker-training",
            "dataStatus": "synthetic-annotation-demo",
            "createdAt": datetime.now(UTC).isoformat(),
            "baseModel": config.base_model,
            "modelVersion": sampler.path,
            "statePath": state.path,
            "samplerPath": sampler.path,
            "checkpointTtlSeconds": config.checkpoint_ttl,
            "promptVersion": common.PROMPT_VERSION,
            "annotationVersion": common.ANNOTATION_VERSION,
            "datasetSha256": common.dataset_sha256(config.dataset),
            "trainIds": [row["id"] for row in records],
            "trainNoteHashes": [common.note_sha256(row["note"]) for row in records],
            "epochs": config.epochs,
            "steps": len(logs),
            "batchSize": config.batch_size,
            "loraRank": config.rank,
            "learningRate": config.learning_rate,
            "seed": config.seed,
            "trainingMetrics": logs,
            "limitations": "Tiny synthetic demo. No generalization, safety, calibration, or improvement claims.",
        }
        common.write_json(config.output, manifest)
        status = "success"
        return manifest
    finally:
        common.finish_session(service, status)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset", type=Path, default=common.DEFAULT_DATASET)
    parser.add_argument("--output", type=Path, default=Path("training/artifacts/training-run.json"))
    parser.add_argument("--base-model", default=common.DEFAULT_BASE_MODEL)
    parser.add_argument("--epochs", type=int, default=1)
    parser.add_argument("--batch-size", type=int, default=4)
    parser.add_argument("--rank", type=int, default=16)
    parser.add_argument("--learning-rate", type=float, default=1e-4)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--max-tokens", type=int, default=4096)
    parser.add_argument("--checkpoint-name", default=TrainConfig.checkpoint_name)
    parser.add_argument(
        "--checkpoint-ttl",
        type=int,
        default=86400,
        help="Seconds until both checkpoints expire (minimum 3600, default 86400)",
    )
    args = parser.parse_args(argv)
    try:
        common.require_key()  # before optional SDK import or any network request
        config = TrainConfig(**vars(args))
        result = run_training(config)
    except (ValueError, OSError) as exc:
        print(f"Cannot train: {exc}", file=sys.stderr)
        return 2
    print(f"Training manifest: {config.output}\nSampler checkpoint: {result['samplerPath']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
