import json

import pytest

from training import independent as data
from training import statistics as stats
from training.common import dataset_sha256


def test_frozen_splits_do_not_overlap_and_cover_languages():
    manifest = json.loads((data.DATASET / "manifest.json").read_text())
    for split, digest in manifest["sha256"].items():
        assert dataset_sha256(data.DATASET / f"{split}.jsonl") == digest
    train = data.load(data.DATASET / "train.jsonl")
    validation = data.load(data.DATASET / "validation.jsonl")
    test = data.load(data.DATASET / "test.jsonl")
    assert len(train) >= 400
    assert len(validation) >= 60
    assert len(test) >= 150
    assert {r["language"] for r in test} == {"english", "hindi", "hinglish"}
    assert {r["target"]["category"] for r in test} == set(data.common.CATEGORIES)
    assert {r["target"]["severity"] for r in test} == set(data.common.SEVERITIES)
    for r in test:
        assert all(data.similarity(r["note"], t["note"]) < 0.6 for t in train + validation)
    assert set(manifest["fewShotIds"]) <= {r["id"] for r in train}


def test_public_reports_have_separate_assistant_label_provenance():
    rows = data.load(data.DATASET / "public-source.jsonl")
    assert len(rows) == 30
    assert all(r["source"] == "public-source" for r in rows)
    assert all(
        r["provenance"]["labelSource"] == "assistant-rubric-v3-before-inference" for r in rows
    )
    assert all(
        r["provenance"]["apiUrl"].startswith("https://311.boston.gov/open311/") for r in rows
    )


def test_invalid_schema_is_incorrect_and_a_costly_triage_failure():
    rows = [{"target": {"category": "SAFETY", "severity": "CRITICAL"}}] * 2
    good = {
        "prediction": {"category": "SAFETY", "severity": "CRITICAL"},
        "latencyMs": 1,
        "inputTokens": 10,
        "outputTokens": 5,
    }
    bad = {**good, "prediction": None}
    result = stats.metric_values(rows, [good, bad])
    assert result["schemaRate"] == 0.5
    assert result["categoryAccuracy"] == 0.5
    assert result["severityAccuracy"] == 0.5
    assert result["severityOffByMoreThanOneRate"] == 0.5
    assert stats.decode('{"severity":"CRITICAL"}') is None


def test_exact_mcnemar_uses_discordant_pairs():
    assert stats.mcnemar([True] * 5, [False] * 5)["exactTwoSidedP"] == 0.0625
    assert stats.mcnemar([True, False], [True, False])["exactTwoSidedP"] == 1
    assert stats.macro_f1(list(data.common.SEVERITIES), list(data.common.SEVERITIES)) == 1


def test_metrics_reject_misaligned_predictions():
    with pytest.raises(ValueError):
        stats.metric_values([{"target": {}}], [])


def test_large_revisit_generator_preserves_old_files_and_probability_formula(tmp_path):
    import importlib.util

    path = data.ROOT / "revisit-demo" / "generate_v2.py"
    spec = importlib.util.spec_from_file_location("revisit_v2", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    old = data.ROOT / "revisit-demo" / "train.csv"
    before = dataset_sha256(old)
    metadata = module.generate(tmp_path)
    assert metadata["testRows"] == 500
    assert metadata["poolRows"] == 2000
    assert dataset_sha256(old) == before
    assert module.probability([10, 2, 30, 1, 0, 0, 1, 0]) == pytest.approx(0.2227001388)


def test_checkpoint_retention_is_bounded_before_credit_expiry():
    from datetime import UTC, datetime, timedelta

    from training.run_independent import retention_seconds

    assert retention_seconds(None) == 2592000
    deadline = datetime.now(UTC) + timedelta(days=2)
    assert 3600 < retention_seconds(deadline.isoformat()) < 2 * 86400
    with pytest.raises(ValueError, match="time zone"):
        retention_seconds("2026-11-07T00:00:00")
    with pytest.raises(ValueError, match="passed"):
        retention_seconds("2000-01-01T00:00:00Z")


def test_family_bootstrap_preserves_grouped_errors():
    from training.statistics import clustered_difference

    rows = [{"scenarioFamily": "same-family", "target": {"severity": "LOW"}}] * 4
    a = [{"prediction": {"severity": "LOW"}}] * 4
    b = [{"prediction": {"severity": "HIGH"}}] * 4
    result = clustered_difference(rows, a, b)
    assert result["families"] == 1
    assert result["ci95"] == [-1, -1]
    assert result["resamples"] == 1000
