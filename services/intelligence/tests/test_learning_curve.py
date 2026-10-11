"""Guard provider provenance and repeat uncertainty without calling the network."""

import importlib.util
from pathlib import Path

import pytest

path = Path(__file__).parents[1] / "training/revisit-demo/learning_curve.py"
spec = importlib.util.spec_from_file_location("learning_curve", path)
curve = importlib.util.module_from_spec(spec)
spec.loader.exec_module(curve)


def response(rows, classes=None):
    return {
        "metadata": {
            "billing_model_version": "v3.5",
            "n_estimators": 1,
            "classes": classes or [0, 1],
        },
        "prediction": rows,
    }


def test_positive_class_mapping_is_fixed_before_measurement():
    assert curve.parse_probabilities(response([[0.2, 0.8]]), 1) == [0.8]
    with pytest.raises(ValueError, match="provenance"):
        curve.parse_probabilities(response([[0.8, 0.2]], [1, 0]), 1)


@pytest.mark.parametrize("rows", [[[0.2, 0.7]], [[float("nan"), 0.8]], [[-0.1, 1.1]]])
def test_invalid_provider_probabilities_are_never_scored(rows):
    with pytest.raises(ValueError, match="probabilities"):
        curve.parse_probabilities(response(rows), 1)


def test_probability_row_count_must_match_the_fixed_test_set():
    with pytest.raises(ValueError, match="number"):
        curve.parse_probabilities(response([[0.2, 0.8]]), 500)


def test_intervals_refuse_incomplete_repeats_and_preserve_negative_paired_gains():
    with pytest.raises(ValueError, match="five"):
        curve.interval([0.6, 0.7])
    assert curve.interval([-0.05] * 5) == {"mean": -0.05, "ci95": [-0.05, -0.05], "repeats": 5}
