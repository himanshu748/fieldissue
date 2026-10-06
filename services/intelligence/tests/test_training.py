"""Offline contract tests: no Tinker credentials, installation, or network required."""

from __future__ import annotations

import importlib
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

SERVICE = Path(__file__).resolve().parents[1]
if str(SERVICE) not in sys.path:
    sys.path.insert(0, str(SERVICE))


def module(name):
    path = SERVICE / "training" / f"{name}.py"
    if not path.exists():
        raise AssertionError(f"Missing training implementation: {path.name}")
    return importlib.import_module(f"training.{name}")


def label(**changes):
    value = {
        "category": "INFRASTRUCTURE",
        "object": "pothole",
        "condition": "deep",
        "severity": "HIGH",
        "evidence": ["deep pothole"],
    }
    value.update(changes)
    return value


def example():
    return {
        "id": "example-1",
        "split": "train",
        "style": "english",
        "note": "There is a deep pothole.",
        "target": label(),
        "supportedEvidence": [
            {"description": "deep pothole", "quote": "deep pothole", "source": "note"}
        ],
        "provenance": {
            "source": "assistant-authored-synthetic",
            "annotationVersion": "annotation-v2",
            "inputSource": "note",
        },
    }


class Future:
    def __init__(self, value):
        self.value = value

    def result(self):
        return self.value


class Tokenizer:
    eos_token_id = 0

    def apply_chat_template(self, messages, tokenize, add_generation_prompt, **kwargs):
        return (
            "SYSTEM:" + messages[0]["content"] + "\nUSER:" + messages[1]["content"] + "\nASSISTANT:"
        )

    def encode(self, text, add_special_tokens=False):
        return [ord(char) for char in text]

    def decode(self, tokens, skip_special_tokens=False):
        return "".join(chr(token) for token in tokens if token)


class FakeTypes:
    ModelInput = SimpleNamespace(from_ints=lambda tokens: SimpleNamespace(tokens=tokens))
    Datum = SimpleNamespace
    AdamParams = SimpleNamespace
    SamplingParams = SimpleNamespace


class TrainingClient:
    def __init__(self):
        self.batches = []
        self.optimizer_steps = []
        self.saved = []

    def get_tokenizer(self):
        return Tokenizer()

    def forward_backward(self, data, loss_fn):
        self.batches.append((data, loss_fn))
        return Future(SimpleNamespace(metrics={"loss:sum": 1.25}))

    def optim_step(self, params):
        self.optimizer_steps.append(params)
        return Future(SimpleNamespace())

    def save_state(self, name, **kwargs):
        self.saved.append(("state", name, kwargs))
        return Future(SimpleNamespace(path="tinker://run/weights/final"))

    def save_weights_for_sampler(self, name, **kwargs):
        self.saved.append(("sampler", name, kwargs))
        return Future(SimpleNamespace(path="tinker://run/sampler_weights/final"))


class SamplingClient:
    def __init__(self, text, base_model):
        self.text = text
        self.base_model = base_model
        self.calls = []

    def get_tokenizer(self):
        return Tokenizer()

    def get_base_model(self):
        return self.base_model

    def sample(self, **kwargs):
        self.calls.append(kwargs)
        return Future(
            SimpleNamespace(sequences=[SimpleNamespace(tokens=Tokenizer().encode(self.text))])
        )


class ServiceClient:
    def __init__(self):
        self.training = TrainingClient()
        self.creation = []
        self.samplers = []
        self.closed = []
        self.model = "Qwen/Qwen3-8B"

    def get_server_capabilities(self):
        return SimpleNamespace(supported_models=[SimpleNamespace(model_name=self.model)])

    def create_lora_training_client(self, **kwargs):
        self.creation.append(kwargs)
        return self.training

    def create_sampling_client(self, **kwargs):
        text = json.dumps(label()) if "model_path" in kwargs else "not JSON"
        client = SamplingClient(text, self.model)
        self.samplers.append((kwargs, client))
        return client

    def close(self, status, detail=None):
        self.closed.append(status)
        return Future(None)


def sdk(service):
    return SimpleNamespace(types=FakeTypes, ServiceClient=lambda **kwargs: service)


class TrainingTests(unittest.TestCase):
    def setUp(self):
        # Unit tests must never send opt-in telemetry from a host environment.
        environment = {
            key: value
            for key, value in os.environ.items()
            if key not in ("SENTRY_DSN", "SENTRY_TRACES_SAMPLE_RATE")
        }
        context = patch.dict(os.environ, environment, clear=True)
        context.start()
        self.addCleanup(context.stop)

    def test_scripts_stop_without_key_before_optional_import(self):
        env = dict(os.environ)
        env.pop("TINKER_API_KEY", None)
        for script in ["train.py", "evaluate.py"]:
            with self.subTest(script=script):
                self.assertTrue((SERVICE / "training" / script).exists(), f"Missing {script}")
                process = subprocess.run(
                    [sys.executable, "-S", str(SERVICE / "training" / script)],
                    env=env,
                    capture_output=True,
                    text=True,
                    check=False,
                )
                self.assertEqual(process.returncode, 2)
                self.assertIn("TINKER_API_KEY", process.stderr)
                self.assertNotIn("Traceback", process.stderr)
                self.assertNotIn("ModuleNotFoundError", process.stderr)

    def test_strict_prediction_schema_rejects_extras_coercion_and_non_json(self):
        common = module("common")
        self.assertEqual(common.parse_prediction(json.dumps(label())), label())
        for bad in [
            label(extra=True),
            label(confidence=True),
            label(confidence=1.1),
            label(confidence=float("nan")),
            label(severity="high"),
            label(evidence=[""]),
            label(object=["pothole"]),
        ]:
            with self.subTest(bad=bad), self.assertRaises(ValueError):
                common.parse_prediction(json.dumps(bad))
        for bad in ["```json\n{}\n```", '{"x":1,"x":2}', "[]", "{} trailing"]:
            with self.subTest(bad=bad), self.assertRaises(ValueError):
                common.parse_prediction(bad)

    def test_compact_prediction_bounds(self):
        common = module("common")
        for bad in [
            label(evidence=["x"] * 31),
            label(object="x" * 501),
            label(condition="x" * 501),
            label(condition=""),
        ]:
            with self.subTest(bad=bad), self.assertRaises(ValueError):
                common.parse_prediction(json.dumps(bad))
        parsed = common.parse_prediction(json.dumps(label(evidence=["  deep pothole  "])))
        self.assertEqual(parsed["evidence"], ["deep pothole"])

    def test_dataset_has_disjoint_annotated_styles_and_categories(self):
        common = module("common")
        records = common.load_dataset(common.DEFAULT_DATASET)
        self.assertGreaterEqual(len(records), 24)
        self.assertEqual(
            {row["style"] for row in records}, {"english", "short", "typos", "hinglish"}
        )
        self.assertEqual({row["target"]["category"] for row in records}, set(common.CATEGORIES))
        self.assertEqual({row["target"]["severity"] for row in records}, set(common.SEVERITIES))
        train = common.select_split(records, "train")
        test = common.select_split(records, "test")
        self.assertTrue(train and test)
        self.assertFalse(
            {row["note"].casefold() for row in train} & {row["note"].casefold() for row in test}
        )
        self.assertEqual(len({row["id"] for row in records}), len(records))
        for row in records:
            permitted = {item["description"] for item in row["supportedEvidence"]}
            self.assertTrue(set(row["target"]["evidence"]) <= permitted)
            for item in row["supportedEvidence"]:
                self.assertIn(item["quote"], row["note"])

    def test_targets_are_compact_and_do_not_learn_analysis_provenance(self):
        common = module("common")
        expected = {"category", "object", "condition", "severity", "evidence"}
        self.assertEqual(common.FIELDS, expected)
        self.assertNotIn("modelVersion", common.SYSTEM_PROMPT)
        self.assertNotIn("confidence", common.SYSTEM_PROMPT)
        for row in common.load_dataset(common.DEFAULT_DATASET):
            self.assertEqual(set(row["target"]), expected)
            self.assertIsInstance(row["target"]["object"], str)
            self.assertIsInstance(row["target"]["condition"], str)
            self.assertEqual(row["provenance"]["annotationVersion"], "annotation-v2")

    def test_exact_hinglish_dustbin_annotation_is_present_and_grounded(self):
        common = module("common")
        note = "bhai park gate ke paas wala dustbin full hai aur kachra bahar pada hai"
        matches = [
            row for row in common.load_dataset(common.DEFAULT_DATASET) if row["note"] == note
        ]
        self.assertEqual(len(matches), 1)
        row = matches[0]
        self.assertEqual(row["target"]["category"], "CLEANLINESS")
        self.assertEqual(row["target"]["object"], "waste_bin")
        self.assertEqual(row["target"]["condition"], "overflowing")
        self.assertEqual(row["target"]["severity"], "MEDIUM")
        self.assertEqual(row["target"]["evidence"], ["waste visible outside the bin"])
        self.assertTrue(row["target"]["evidence"])
        supported = {item["description"] for item in row["supportedEvidence"]}
        self.assertTrue(set(row["target"]["evidence"]) <= supported)
        for item in row["supportedEvidence"]:
            self.assertIn(item["quote"], note)
            self.assertEqual(item["source"], "note")

    def test_dataset_rejects_unsupported_annotation_and_duplicate_id(self):
        common = module("common")
        bad = example()
        bad["supportedEvidence"][0]["quote"] = "hospital evacuation"
        with tempfile.TemporaryDirectory() as directory:
            file = Path(directory) / "dataset.jsonl"
            file.write_text(json.dumps(bad) + "\n")
            with self.assertRaisesRegex(ValueError, "quote"):
                common.load_dataset(file)
            file.write_text("\n".join([json.dumps(example())] * 2))
            with self.assertRaisesRegex(ValueError, "duplicate"):
                common.load_dataset(file)

    def test_prompt_and_completion_mask_are_aligned(self):
        common = module("common")
        row = example()
        prompt = common.prompt_tokens(Tokenizer(), row["note"])
        completion = Tokenizer().encode(
            json.dumps(row["target"], separators=(",", ":"), ensure_ascii=False)
        ) + [0]
        datum = common.build_datum(row, Tokenizer(), FakeTypes, max_tokens=4096)
        full = prompt + completion
        self.assertEqual(datum.model_input.tokens, full[:-1])
        self.assertEqual(datum.loss_fn_inputs["target_tokens"], full[1:])
        weights = datum.loss_fn_inputs["weights"]
        self.assertEqual(weights, [0.0] * (len(prompt) - 1) + [1.0] * len(completion))
        self.assertEqual(len(weights), len(datum.model_input.tokens))
        with self.assertRaisesRegex(ValueError, "max"):
            common.build_datum(row, Tokenizer(), FakeTypes, max_tokens=2)

    def test_training_uses_actual_sdk_contract_and_records_checkpoints(self):
        train = module("train")
        service = ServiceClient()
        with tempfile.TemporaryDirectory() as directory:
            data = Path(directory) / "dataset.jsonl"
            data.write_text(json.dumps(example()) + "\n")
            config = train.TrainConfig(
                dataset=data,
                output=Path(directory) / "run.json",
                epochs=2,
                batch_size=1,
                checkpoint_name="test-final",
                max_tokens=4096,
            )
            manifest = train.run_training(config, tinker_sdk=sdk(service))
            self.assertEqual(manifest["baseModel"], service.model)
            self.assertEqual(manifest["steps"], 2)
            self.assertEqual(manifest["samplerPath"], "tinker://run/sampler_weights/final")
            self.assertEqual(manifest["statePath"], "tinker://run/weights/final")
            self.assertEqual(json.loads(config.output.read_text()), manifest)
            self.assertEqual([loss for _, loss in service.training.batches], ["cross_entropy"] * 2)
            self.assertEqual(len(service.training.optimizer_steps), 2)
            self.assertEqual(service.creation[0]["rank"], 16)
            self.assertEqual([kind for kind, *_ in service.training.saved], ["state", "sampler"])
            self.assertEqual(manifest["trainIds"], ["example-1"])
            self.assertEqual(len(manifest["datasetSha256"]), 64)
            self.assertEqual(service.closed, ["success"])

    def test_unsupported_model_is_rejected_before_training(self):
        train = module("train")
        service = ServiceClient()
        with tempfile.TemporaryDirectory() as directory:
            config = train.TrainConfig(
                base_model="retired/model", output=Path(directory) / "run.json"
            )
            with self.assertRaisesRegex(ValueError, "not.*supported"):
                train.run_training(config, tinker_sdk=sdk(service))
            self.assertFalse(service.creation)
            self.assertFalse(config.output.exists())

    def test_evidence_scoring_uses_annotations_and_conservative_normalization(self):
        evaluate = module("evaluate")
        row = example()
        valid = json.dumps(label(evidence=[" Deep   Pothole "]))
        invented = json.dumps(label(evidence=["deep pothole", "injured cyclist"]))
        result = evaluate.score_predictions([row, row, row], [valid, invented, "not JSON"])
        self.assertAlmostEqual(result["validJsonRate"], 2 / 3)
        self.assertAlmostEqual(result["strictSchemaRate"], 2 / 3)
        self.assertAlmostEqual(result["categoryAccuracy"], 2 / 3)
        self.assertAlmostEqual(result["severityAccuracy"], 2 / 3)
        self.assertAlmostEqual(result["evidenceHallucinationRate"], 1 / 3)
        self.assertEqual(result["unsupportedEvidenceCount"], 1)
        self.assertEqual(result["evidenceClaimCount"], 3)
        self.assertAlmostEqual(result["evidenceRecall"], 2 / 3)
        self.assertIsNone(
            evaluate.score_predictions([row], ["not JSON"])["evidenceHallucinationRate"]
        )
        with self.assertRaisesRegex(ValueError, "length"):
            evaluate.score_predictions([row], [])

    def test_evaluation_samples_base_and_checkpoint_without_invented_scores(self):
        evaluate = module("evaluate")
        service = ServiceClient()
        with tempfile.TemporaryDirectory() as directory:
            data = Path(directory) / "dataset.jsonl"
            row = example()
            row["split"] = "test"
            data.write_text(json.dumps(row) + "\n")
            config = evaluate.EvalConfig(
                dataset=data,
                output=Path(directory) / "eval.json",
                checkpoint="tinker://run/sampler_weights/final",
            )
            result = evaluate.evaluate_models(config, tinker_sdk=sdk(service))
            self.assertEqual(result["base"]["validJsonRate"], 0)
            self.assertEqual(result["fineTuned"]["validJsonRate"], 1)
            self.assertEqual(result["fineTuned"]["categoryAccuracy"], 1)
            self.assertEqual(len(service.samplers), 2)
            self.assertEqual(service.samplers[0][0], {"base_model": service.model})
            self.assertEqual(service.samplers[1][0], {"model_path": config.checkpoint})
            self.assertTrue(all(len(client.calls) == 1 for _, client in service.samplers))
            self.assertEqual(result["provenance"]["checkpoint"], config.checkpoint)
            self.assertEqual(result["samples"][0]["fineTunedRaw"], json.dumps(label()))
            self.assertEqual(result["samples"][0]["fineTunedPrediction"], label())
            self.assertEqual(
                result["provenance"]["models"]["fineTuned"]["modelVersion"], config.checkpoint
            )
            self.assertEqual(json.loads(config.output.read_text()), result)
            self.assertEqual(service.closed, ["success"])

    def test_invalid_manifest_fails_before_provider_access(self):
        evaluate = module("evaluate")
        service = ServiceClient()
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "manifest.json"
            path.write_text("[]")
            config = evaluate.EvalConfig(
                output=Path(directory) / "eval.json",
                manifest=path,
                checkpoint="tinker://run/sampler_weights/final",
            )
            with self.assertRaisesRegex(ValueError, "manifest"):
                evaluate.evaluate_models(config, tinker_sdk=sdk(service))
            self.assertFalse(service.samplers)

    def test_session_cleanup_cannot_hide_original_training_error(self):
        train = module("train")
        service = ServiceClient()

        def failing_forward(*args, **kwargs):
            raise RuntimeError("original training failure")

        def failing_close(*args, **kwargs):
            raise RuntimeError("secondary cleanup failure")

        service.training.forward_backward = failing_forward
        service.close = failing_close
        with tempfile.TemporaryDirectory() as directory:
            config = train.TrainConfig(output=Path(directory) / "run.json")
            with self.assertRaisesRegex(RuntimeError, "original training failure"):
                train.run_training(config, tinker_sdk=sdk(service))
            self.assertFalse(config.output.exists())

    def test_evaluation_telemetry_drops_notes_keys_predictions_and_exception_text(self):
        evaluate = module("evaluate")
        event = {
            "event_id": "test",
            "timestamp": "now",
            "level": "error",
            "message": "secret note",
            "exception": {"values": ["secret API key"]},
            "extra": {"prediction": label()},
            "request": {"headers": {"auth": "secret"}},
            "tags": {
                "operation": "evaluate",
                "provider": "tinker",
                "mode": "fine_tuned",
                "note": "private note",
                "model": "sensitive/path",
            },
        }
        result = evaluate.sanitize_evaluation_event(event, {})
        self.assertEqual(
            result["tags"], {"operation": "evaluate", "provider": "tinker", "mode": "fine_tuned"}
        )
        self.assertNotIn("secret", json.dumps(result))
        self.assertNotIn("prediction", json.dumps(result))
        self.assertNotIn("request", result)

    def test_telemetry_is_opt_in_and_emits_only_fixed_sanitized_events(self):
        evaluate = module("evaluate")

        class Scope:
            def __init__(self, sink):
                self.sink = sink

            def __enter__(self):
                self.sink.tags = {}
                return self

            def __exit__(self, *args):
                return False

            def set_tag(self, key, value):
                self.sink.tags[key] = value

        class Sentry:
            def __init__(self):
                self.config = None
                self.events = []
                self.flushed = None

            def init(self, **kwargs):
                self.config = kwargs

            def new_scope(self):
                return Scope(self)

            def capture_message(self, message, level):
                self.events.append(
                    self.config["before_send"](
                        {
                            "message": message,
                            "level": level,
                            "tags": self.tags,
                            "extra": {"note": "secret"},
                        },
                        {},
                    )
                )

            def flush(self, timeout):
                self.flushed = timeout

        sink = Sentry()
        disabled = evaluate.EvaluationTelemetry(dsn="", sentry_sdk=sink)
        disabled.report("base")
        self.assertIsNone(sink.config)
        self.assertEqual(sink.events, [])
        enabled = evaluate.EvaluationTelemetry(dsn="test-only-dsn", sentry_sdk=sink)
        enabled.report("fine_tuned", failed=True)
        enabled.flush()
        self.assertFalse(sink.config["send_default_pii"])
        self.assertFalse(sink.config["default_integrations"])
        self.assertFalse(sink.config["auto_enabling_integrations"])
        self.assertEqual(sink.config["max_breadcrumbs"], 0)
        self.assertEqual(sink.config["traces_sample_rate"], 0.05)
        self.assertEqual(
            sink.events[0]["tags"],
            {"operation": "evaluate", "provider": "tinker", "mode": "fine_tuned"},
        )
        self.assertNotIn("secret", json.dumps(sink.events))
        self.assertEqual(sink.flushed, 2)

    def test_transaction_sanitizer_retains_only_safe_timing_role_and_trace_ids(self):
        evaluate = module("evaluate")
        event = {
            "event_id": "a" * 32,
            "type": "transaction",
            "transaction": "secret note",
            "start_timestamp": 1.0,
            "timestamp": 3.0,
            "request": {"data": "secret prediction"},
            "extra": {"api_key": "secret"},
            "contexts": {
                "trace": {
                    "trace_id": "b" * 32,
                    "span_id": "c" * 16,
                    "op": "secret-path",
                    "status": "ok",
                    "data": {"note": "secret"},
                },
                "runtime": {"private": "secret"},
            },
            "spans": [
                {
                    "op": "tinker.sample.base",
                    "description": "secret output",
                    "span_id": "d" * 16,
                    "trace_id": "b" * 32,
                    "start_timestamp": 1.0,
                    "timestamp": 2.0,
                    "data": {"note": "secret"},
                    "status": "ok",
                },
                {"op": "other.secret", "description": "secret"},
            ],
        }
        result = evaluate.sanitize_evaluation_transaction(event, {})
        self.assertNotIn("secret", json.dumps(result))
        self.assertNotIn("request", result)
        self.assertNotIn("extra", result)
        self.assertEqual(result["transaction"], "FieldIssue Tinker evaluation")
        self.assertEqual(result["contexts"]["trace"]["op"], "fieldissue.evaluate")
        self.assertEqual(len(result["spans"]), 1)
        self.assertEqual(result["spans"][0]["op"], "tinker.sample.base")
        self.assertEqual(result["spans"][0]["start_timestamp"], 1.0)
        self.assertEqual(result["spans"][0]["timestamp"], 2.0)

    def test_configured_telemetry_creates_root_and_sampling_spans(self):
        evaluate = module("evaluate")
        events = []

        class Context:
            def __enter__(self):
                return self

            def __exit__(self, *args):
                return False

        sink = SimpleNamespace(
            init=lambda **kwargs: None,
            start_transaction=lambda **kwargs: (events.append(("transaction", kwargs)), Context())[
                1
            ],
            start_span=lambda **kwargs: (events.append(("span", kwargs)), Context())[1],
        )
        telemetry = evaluate.EvaluationTelemetry(dsn="test-only-dsn", sentry_sdk=sink)
        with telemetry.transaction(), telemetry.sampling_span("fine_tuned"):
            pass
        self.assertEqual(
            events[0][1], {"op": "fieldissue.evaluate", "name": "FieldIssue Tinker evaluation"}
        )
        self.assertEqual(
            events[1][1],
            {"op": "tinker.sample.fine_tuned", "description": "Tinker fine-tuned sample"},
        )

    def test_telemetry_rejects_unrecognized_and_nonstring_tag_values(self):
        evaluate = module("evaluate")
        result = evaluate.sanitize_evaluation_event(
            {
                "tags": {
                    "operation": ["private note"],
                    "provider": "private provider",
                    "mode": {"prediction": "secret"},
                }
            },
            {},
        )
        self.assertEqual(result["tags"], {})

    def test_manifest_requires_training_split_metadata(self):
        evaluate = module("evaluate")
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "manifest.json"
            path.write_text(
                json.dumps(
                    {
                        "baseModel": "Qwen/Qwen3-8B",
                        "samplerPath": "tinker://run/sampler_weights/final",
                        "promptVersion": "fieldissue-note-json-v2",
                    }
                )
            )
            with self.assertRaisesRegex(ValueError, "manifest"):
                evaluate.load_manifest(path)

    def test_evaluation_rejects_checkpoint_from_different_base_model(self):
        evaluate = module("evaluate")
        service = ServiceClient()
        original = service.create_sampling_client

        def create(**kwargs):
            client = original(**kwargs)
            if "model_path" in kwargs:
                client.base_model = "different/model"
            return client

        service.create_sampling_client = create
        with tempfile.TemporaryDirectory() as directory:
            config = evaluate.EvalConfig(
                output=Path(directory) / "eval.json",
                checkpoint="tinker://run/sampler_weights/final",
            )
            with self.assertRaisesRegex(ValueError, "base model"):
                evaluate.evaluate_models(config, tinker_sdk=sdk(service))
            self.assertFalse(config.output.exists())
            self.assertTrue(all(not client.calls for _, client in service.samplers))


if __name__ == "__main__":
    unittest.main()
