#!/usr/bin/env python3
"""Sample an actual Tinker base model and checkpoint on synthetic held-out notes."""

from __future__ import annotations

import argparse
import importlib
import json
import math
import os
import re
import sys
from contextlib import nullcontext
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from training import common


@dataclass(frozen=True)
class EvalConfig:
    dataset: Path = common.DEFAULT_DATASET
    output: Path = Path("training/artifacts/evaluation.json")
    checkpoint: str = ""
    base_model: str = common.DEFAULT_BASE_MODEL
    manifest: Path | None = None
    max_tokens: int = 512
    seed: int = 42


def sanitize_evaluation_event(event: dict[str, Any], hint: Any) -> dict[str, Any]:
    """Deny-by-default telemetry, with a closed set of non-sensitive tag values."""
    allowed = {
        "operation": {"evaluate"},
        "provider": {"tinker"},
        "mode": {"base", "fine_tuned", "compare"},
    }
    return {
        **{
            key: event[key]
            for key in ("event_id", "timestamp", "level", "platform")
            if key in event
        },
        "message": "FieldIssue Tinker evaluation event",
        "tags": {
            key: value
            for key, value in event.get("tags", {}).items()
            if key in allowed and isinstance(value, str) and value in allowed[key]
        },
    }


def _trace_metadata(value: dict[str, Any]) -> dict[str, Any]:
    result = {}
    for key, length in (("trace_id", 32), ("span_id", 16), ("parent_span_id", 16)):
        candidate = value.get(key)
        if isinstance(candidate, str) and re.fullmatch(f"[0-9a-fA-F]{{{length}}}", candidate):
            result[key] = candidate
    for key in ("start_timestamp", "timestamp"):
        candidate = value.get(key)
        # The real SDK serializes datetimes to ISO strings before this hook.
        # Parse only timezone-aware timestamps, then retain numeric time values.
        if isinstance(candidate, str):
            try:
                parsed = datetime.fromisoformat(candidate)
                candidate = parsed if parsed.tzinfo is not None else None
            except ValueError:
                candidate = None
        if isinstance(candidate, datetime):
            candidate = candidate.timestamp()
        if type(candidate) in (int, float) and math.isfinite(candidate):
            result[key] = candidate
    if value.get("status") in (
        "ok",
        "internal_error",
        "cancelled",
        "unknown_error",
        "deadline_exceeded",
    ):
        result["status"] = value["status"]
    return result


def sanitize_evaluation_transaction(event: dict[str, Any], hint: Any) -> dict[str, Any]:
    """Retain fixed span roles, numeric timing, and well-formed trace identifiers only."""
    trace = event.get("contexts", {}).get("trace", {})
    safe_trace = {**_trace_metadata(trace), "op": "fieldissue.evaluate"}
    descriptions = {
        "tinker.sample.base": "Tinker base sample",
        "tinker.sample.fine_tuned": "Tinker fine-tuned sample",
    }
    spans = []
    for span in event.get("spans", []):
        if isinstance(span, dict) and span.get("op") in descriptions:
            spans.append(
                {**_trace_metadata(span), "op": span["op"], "description": descriptions[span["op"]]}
            )
    result = {
        "type": "transaction",
        "transaction": "FieldIssue Tinker evaluation",
        "platform": "python",
        "contexts": {"trace": safe_trace},
        "spans": spans,
        "tags": {"operation": "evaluate", "provider": "tinker"},
    }
    for key in ("start_timestamp", "timestamp"):
        if key in (metadata := _trace_metadata(event)):
            result[key] = metadata[key]
    event_id = event.get("event_id")
    if isinstance(event_id, str) and re.fullmatch("[0-9a-fA-F]{32}", event_id):
        result["event_id"] = event_id
    return result


class EvaluationTelemetry:
    """Optional events only. Never include notes, outputs, paths, or SDK exceptions."""

    def __init__(self, *, dsn: str | None = None, sentry_sdk: Any = None):
        self.sdk = None
        dsn = os.environ.get("SENTRY_DSN", "") if dsn is None else dsn
        if not dsn:
            return
        try:
            sdk = sentry_sdk if sentry_sdk is not None else importlib.import_module("sentry_sdk")
            rate = float(os.environ.get("SENTRY_TRACES_SAMPLE_RATE", "0.05"))
            if not math.isfinite(rate) or not 0 <= rate <= 1:
                raise ValueError("SENTRY_TRACES_SAMPLE_RATE must be a finite number in 0..1")
            sdk.init(
                dsn=dsn,
                send_default_pii=False,
                default_integrations=False,
                auto_enabling_integrations=False,
                before_send=sanitize_evaluation_event,
                before_send_transaction=sanitize_evaluation_transaction,
                traces_sample_rate=rate,
                max_breadcrumbs=0,
                include_local_variables=False,
            )
            self.sdk = sdk
        except Exception:  # noqa: BLE001 - opt-in telemetry cannot break evaluation or leak DSN errors.
            print(
                "Sentry evaluation telemetry unavailable; evaluation can continue.", file=sys.stderr
            )

    def transaction(self):
        if self.sdk is None:
            return nullcontext()
        try:
            return self.sdk.start_transaction(
                op="fieldissue.evaluate", name="FieldIssue Tinker evaluation"
            )
        except Exception:  # noqa: BLE001 - optional instrumentation cannot block sampling.
            return nullcontext()

    def sampling_span(self, role: str):
        if self.sdk is None or role not in ("base", "fine_tuned"):
            return nullcontext()
        try:
            description = "Tinker base sample" if role == "base" else "Tinker fine-tuned sample"
            return self.sdk.start_span(op=f"tinker.sample.{role}", description=description)
        except Exception:  # noqa: BLE001 - optional instrumentation cannot block sampling.
            return nullcontext()

    def report(self, role: str, *, failed: bool = False) -> None:
        if self.sdk is None:
            return
        try:
            with self.sdk.new_scope() as scope:
                scope.set_tag("operation", "evaluate")
                scope.set_tag("provider", "tinker")
                scope.set_tag("mode", role)
                self.sdk.capture_message(
                    "FieldIssue Tinker evaluation event", level="error" if failed else "info"
                )
        except Exception:  # noqa: BLE001, S110 - telemetry errors are intentionally not captured or logged.
            pass

    def flush(self) -> None:
        if self.sdk is not None:
            try:
                self.sdk.flush(timeout=2)
            except Exception:  # noqa: BLE001, S110 - never log telemetry errors or replace provider results.
                pass


def load_manifest(path: Path) -> dict[str, Any]:
    manifest = common.parse_json(path.read_text(encoding="utf-8"))
    if not isinstance(manifest, dict):
        raise ValueError("Training manifest must be a JSON object")  # noqa: TRY004 - public input-validation error
    for key in ("baseModel", "samplerPath", "promptVersion"):
        if not isinstance(manifest.get(key), str) or not manifest[key]:
            raise ValueError(f"Training manifest is missing string field {key}")
    for key in ("trainIds", "trainNoteHashes"):
        if (
            not isinstance(manifest.get(key), list)
            or not manifest[key]
            or any(not isinstance(value, str) or not value for value in manifest[key])
        ):
            raise ValueError(f"Training manifest {key} must be an array of strings")
    if len(manifest["trainIds"]) != len(manifest["trainNoteHashes"]):
        raise ValueError("Training manifest training IDs and note hashes must have equal length")
    return manifest


def score_predictions(records: list[dict[str, Any]], predictions: list[str]) -> dict[str, Any]:
    if len(records) != len(predictions):
        raise ValueError("Prediction length must equal annotated example length")
    if not records:
        raise ValueError("Evaluation requires at least one annotated example")
    valid_json = schema_valid = category_correct = severity_correct = 0
    evidence_claims = unsupported_count = recalled = reference_claims = evaluable = 0
    details = []
    for row, raw in zip(records, predictions, strict=True):
        reference = {
            common.normalize_evidence(item["description"]) for item in row["supportedEvidence"]
        }
        reference_claims += len(reference)
        detail = {
            "id": row["id"],
            "validJson": False,
            "schemaValid": False,
            "categoryCorrect": False,
            "severityCorrect": False,
            "unsupportedEvidence": [],
            "evidenceClaimCount": 0,
        }
        try:
            value = common.parse_json(raw)
            valid_json += 1
            detail["validJson"] = True
            value = common.validate_prediction(value)
            schema_valid += 1
            detail["schemaValid"] = True
            detail["categoryCorrect"] = value["category"] == row["target"]["category"]
            detail["severityCorrect"] = value["severity"] == row["target"]["severity"]
            category_correct += int(detail["categoryCorrect"])
            severity_correct += int(detail["severityCorrect"])
            evaluable += 1
            detail["evidenceClaimCount"] = len(value["evidence"])
            detail["unsupportedEvidence"] = [
                item
                for item in value["evidence"]
                if common.normalize_evidence(item) not in reference
            ]
            evidence_claims += len(value["evidence"])
            unsupported_count += len(detail["unsupportedEvidence"])
            predicted = {common.normalize_evidence(item) for item in value["evidence"]}
            recalled += len(predicted & reference)
        except ValueError as exc:
            detail["validationError"] = str(exc)
        details.append(detail)
    count = len(records)
    return {
        "exampleCount": count,
        "validJsonCount": valid_json,
        "strictSchemaCount": schema_valid,
        "validJsonRate": valid_json / count,
        "strictSchemaRate": schema_valid / count,
        # Invalid outputs count as incorrect; accuracy does not hide malformed cases.
        "categoryAccuracy": category_correct / count,
        "severityAccuracy": severity_correct / count,
        "evidenceClaimCount": evidence_claims,
        "unsupportedEvidenceCount": unsupported_count,
        "evidenceEvaluableExamples": evaluable,
        "evidenceHallucinationRate": unsupported_count / evidence_claims
        if evidence_claims
        else None,
        "evidenceRecall": recalled / reference_claims if reference_claims else None,
        "perExample": details,
    }


def _sample(
    client: Any, tokenizer: Any, row: dict[str, Any], config: EvalConfig, types: Any
) -> str:
    result = client.sample(
        prompt=types.ModelInput.from_ints(common.prompt_tokens(tokenizer, row["note"])),
        num_samples=1,
        sampling_params=types.SamplingParams(
            max_tokens=config.max_tokens, temperature=0.0, seed=config.seed
        ),
    ).result()
    if len(result.sequences) != 1:
        raise ValueError("Tinker did not return exactly one generated sequence")
    return tokenizer.decode(result.sequences[0].tokens, skip_special_tokens=True)


def _prediction_or_none(raw: str) -> dict[str, Any] | None:
    try:
        return common.parse_prediction(raw)
    except ValueError:
        return None


def evaluate_models(config: EvalConfig, *, tinker_sdk: Any = None) -> dict[str, Any]:
    if config.max_tokens < 1:
        raise ValueError("max_tokens must be positive")
    rows = common.select_split(common.load_dataset(config.dataset), "test")
    if not config.checkpoint.startswith("tinker://"):
        raise ValueError("Provide an actual tinker:// sampler checkpoint or a training --manifest")
    if config.manifest:
        manifest = load_manifest(config.manifest)
        if manifest.get("promptVersion") != common.PROMPT_VERSION:
            raise ValueError("Training manifest prompt version differs from evaluator prompt")
        if (
            manifest.get("baseModel") != config.base_model
            or manifest.get("samplerPath") != config.checkpoint
        ):
            raise ValueError(
                "Training manifest base model/checkpoint differs from evaluation configuration"
            )
        train_ids = set(manifest.get("trainIds", []))
        train_notes = set(manifest.get("trainNoteHashes", []))
        if any(
            row["id"] in train_ids or common.note_sha256(row["note"]) in train_notes for row in rows
        ):
            raise ValueError("Held-out examples overlap the training manifest")
    tinker = tinker_sdk if tinker_sdk is not None else common.load_tinker()
    service = tinker.ServiceClient(
        user_metadata={"application": "FieldIssue", "data": "synthetic-demo"}
    )
    status = "errored"
    telemetry = EvaluationTelemetry()
    try:
        with telemetry.transaction():
            common.ensure_supported_model(service, config.base_model)
            base = service.create_sampling_client(base_model=config.base_model)
            fine = service.create_sampling_client(model_path=config.checkpoint)
            if (
                base.get_base_model() != config.base_model
                or fine.get_base_model() != config.base_model
            ):
                raise ValueError(
                    "Checkpoint base model must match the actual base model comparison"
                )
            base_tokenizer, fine_tokenizer = base.get_tokenizer(), fine.get_tokenizer()
            base_raw, fine_raw, samples = [], [], []
            for row in rows:
                try:
                    with telemetry.sampling_span("base"):
                        original = _sample(base, base_tokenizer, row, config, tinker.types)
                except Exception:
                    telemetry.report("base", failed=True)
                    raise
                telemetry.report("base")
                try:
                    with telemetry.sampling_span("fine_tuned"):
                        trained = _sample(fine, fine_tokenizer, row, config, tinker.types)
                except Exception:
                    telemetry.report("fine_tuned", failed=True)
                    raise
                telemetry.report("fine_tuned")
                base_raw.append(original)
                fine_raw.append(trained)
                samples.append(
                    {
                        "id": row["id"],
                        "style": row["style"],
                        "note": row["note"],
                        "target": row["target"],
                        "supportedEvidence": row["supportedEvidence"],
                        "baseRaw": original,
                        "fineTunedRaw": trained,
                        "basePrediction": _prediction_or_none(original),
                        "fineTunedPrediction": _prediction_or_none(trained),
                        "annotationProvenance": row["provenance"],
                    }
                )
            result = {
                "kind": "fieldissue-tinker-evaluation",
                "dataStatus": "synthetic-annotation-demo",
                "createdAt": datetime.now(UTC).isoformat(),
                "provenance": {
                    "baseModel": config.base_model,
                    "models": {
                        "base": {"model": base.get_base_model(), "modelVersion": "base"},
                        "fineTuned": {
                            "model": fine.get_base_model(),
                            "modelVersion": config.checkpoint,
                        },
                    },
                    "checkpoint": config.checkpoint,
                    "promptVersion": common.PROMPT_VERSION,
                    "annotationVersion": common.ANNOTATION_VERSION,
                    "datasetSha256": common.dataset_sha256(config.dataset),
                    "testIds": [row["id"] for row in rows],
                    "temperature": 0.0,
                    "maxTokens": config.max_tokens,
                    "seed": config.seed,
                    "splitLeakageCheck": "training-manifest" if config.manifest else "dataset-only",
                },
                "base": score_predictions(rows, base_raw),
                "fineTuned": score_predictions(rows, fine_raw),
                "samples": samples,
                "limitations": (
                    "Tiny synthetic held-out demo, not an independent real-world benchmark. "
                    "No generalization, improvement, safety, or calibration claims. "
                    "Evidence hallucination is conservative exact matching after NFKC, casefold, "
                    "and whitespace normalization against synthetic annotated supported descriptions; "
                    "supported paraphrases can be marked unsupported. Invalid schema outputs are "
                    "excluded from evidence-claim denominators, count as wrong for accuracy, and "
                    "contribute zero evidence recall. Null hallucination rate means no evaluable claims. "
                    "Targets and predictions contain only the compact five fields; authoritative "
                    "model/checkpoint provenance is report metadata from verified clients. "
                    "All fixture evidence is a note-based report, never independent image inspection."
                ),
            }
            common.write_json(config.output, result)
            status = "success"
            telemetry.report("compare")
            return result
    finally:
        common.finish_session(service, status)
        telemetry.flush()


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset", type=Path, default=common.DEFAULT_DATASET)
    parser.add_argument("--output", type=Path, default=Path("training/artifacts/evaluation.json"))
    parser.add_argument("--checkpoint", default="")
    parser.add_argument("--manifest", type=Path)
    parser.add_argument("--base-model", default=None)
    parser.add_argument("--max-tokens", type=int, default=512)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args(argv)
    try:
        common.require_key()  # before SDK import, manifest processing or network access
        if args.manifest:
            manifest = load_manifest(args.manifest)
            args.checkpoint = args.checkpoint or manifest["samplerPath"]
            args.base_model = args.base_model or manifest["baseModel"]
        args.base_model = args.base_model or common.DEFAULT_BASE_MODEL
        config = EvalConfig(**vars(args))
        result = evaluate_models(config)
    except (ValueError, OSError, KeyError) as exc:
        print(f"Cannot evaluate: {exc}", file=sys.stderr)
        return 2
    summary = {
        name: {key: value for key, value in result[name].items() if key != "perExample"}
        for name in ("base", "fineTuned")
    }
    print(json.dumps(summary, indent=2, allow_nan=False))
    print(f"Evaluation samples and provenance: {config.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
