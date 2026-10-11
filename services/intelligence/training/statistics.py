"""Paired note metrics with explicit invalid-output handling."""

from __future__ import annotations

import math
import random
from statistics import mean

from training.common import SEVERITIES, parse_prediction


def macro_f1(expected: list[str], predicted: list[str | None]) -> float:
    scores = []
    for level in SEVERITIES:
        tp = sum(a == level and b == level for a, b in zip(expected, predicted, strict=True))
        fp = sum(a != level and b == level for a, b in zip(expected, predicted, strict=True))
        fn = sum(a == level and b != level for a, b in zip(expected, predicted, strict=True))
        scores.append(2 * tp / (2 * tp + fp + fn) if 2 * tp + fp + fn else 0.0)
    return mean(scores)


def mcnemar(first: list[bool], second: list[bool]) -> dict:
    b = sum(a and not c for a, c in zip(first, second, strict=True))
    c = sum(not a and d for a, d in zip(first, second, strict=True))
    n = b + c
    p = min(1.0, 2 * sum(math.comb(n, i) for i in range(min(b, c) + 1)) / 2**n) if n else 1.0
    return {"firstOnlyCorrect": b, "secondOnlyCorrect": c, "discordant": n, "exactTwoSidedP": p}


def metric_values(rows: list[dict], outputs: list[dict]) -> dict:
    if not rows or len(rows) != len(outputs):
        raise ValueError("Metrics need paired nonempty notes and outputs")
    predicted = [o.get("prediction") for o in outputs]
    n = len(rows)
    expected = [r["target"]["severity"] for r in rows]
    severities = [p.get("severity") if p else None for p in predicted]
    costly = [
        p is None or abs(SEVERITIES.index(a) - SEVERITIES.index(p["severity"])) > 1
        for a, p in zip(expected, predicted, strict=True)
    ]
    return {
        "schemaRate": sum(p is not None for p in predicted) / n,
        "categoryAccuracy": sum(
            p is not None and p["category"] == r["target"]["category"]
            for r, p in zip(rows, predicted, strict=True)
        )
        / n,
        "severityAccuracy": sum(a == b for a, b in zip(expected, severities, strict=True)) / n,
        "severityOffByMoreThanOneRate": sum(costly) / n,
        "severityMacroF1": macro_f1(expected, severities),
        "meanLatencyMs": mean(o["latencyMs"] for o in outputs),
        "meanInputTokens": mean(o["inputTokens"] for o in outputs),
        "meanOutputTokens": mean(o["outputTokens"] for o in outputs),
    }


def quantile(values: list[float], fraction: float) -> float:
    values = sorted(values)
    position = (len(values) - 1) * fraction
    low = int(position)
    high = math.ceil(position)
    return values[low] + (values[high] - values[low]) * (position - low)


def metrics(
    rows: list[dict], outputs: list[dict], resamples: int = 1000, seed: int = 11026
) -> dict:
    point = metric_values(rows, outputs)
    values = {k: [] for k in point}
    rng = random.Random(seed)
    for _ in range(resamples):
        indices = rng.choices(range(len(rows)), k=len(rows))
        sample = metric_values([rows[i] for i in indices], [outputs[i] for i in indices])
        for key in point:
            values[key].append(sample[key])
    return {
        "n": len(rows),
        "values": point,
        "bootstrap95": {k: [quantile(v, 0.025), quantile(v, 0.975)] for k, v in values.items()},
        "bootstrapResamples": resamples,
        "bootstrapSeed": seed,
    }


def decode(raw: str) -> dict | None:
    try:
        return parse_prediction(raw)
    except ValueError:
        return None


def paired_difference(rows: list[dict], first: list[dict], second: list[dict]) -> dict:
    a = [
        o.get("prediction") is not None and o["prediction"]["severity"] == r["target"]["severity"]
        for r, o in zip(rows, first, strict=True)
    ]
    b = [
        o.get("prediction") is not None and o["prediction"]["severity"] == r["target"]["severity"]
        for r, o in zip(rows, second, strict=True)
    ]
    difference = [int(y) - int(x) for x, y in zip(a, b, strict=True)]
    rng = random.Random(11026)
    boot = [mean(rng.choices(difference, k=len(difference))) for _ in range(1000)]
    return {
        "severityAccuracyDifferenceSecondMinusFirst": mean(difference),
        "pairedBootstrap95": [quantile(boot, 0.025), quantile(boot, 0.975)],
        "mcnemar": mcnemar(a, b),
    }


def clustered_difference(rows: list[dict], first: list[dict], second: list[dict]) -> dict:
    """Exploratory family resampling exposes shared-template dependence."""
    groups = {}
    for row, a, b in zip(rows, first, second, strict=True):
        score_a = (
            a["prediction"] is not None and a["prediction"]["severity"] == row["target"]["severity"]
        )
        score_b = (
            b["prediction"] is not None and b["prediction"]["severity"] == row["target"]["severity"]
        )
        groups.setdefault(row["scenarioFamily"], []).append(int(score_b) - int(score_a))
    rng = random.Random(11026)
    names = list(groups)
    samples = [
        mean([v for name in rng.choices(names, k=len(names)) for v in groups[name]])
        for _ in range(1000)
    ]
    return {
        "families": len(groups),
        "resamples": 1000,
        "seed": 11026,
        "ci95": [quantile(samples, 0.025), quantile(samples, 0.975)],
        "method": "Exploratory scenario-family bootstrap added after measurement. All rows within each resampled family are kept. No model selection uses this diagnostic.",
    }
