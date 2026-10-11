"""A larger version of the same invented stochastic formula, separate from seed 42."""

from __future__ import annotations

import csv
import hashlib
import json
import math
import random
from pathlib import Path

COLUMNS = [
    "days_since_last_observation",
    "previous_observation_count",
    "issue_age_days",
    "severity",
    "category",
    "nearby_issue_count",
    "previous_change_count",
    "status",
]


def probability(row: list[float]) -> float:
    return 1 / (1 + math.exp(-(-2.5 + 0.07 * row[0] + 0.5 * row[7] + 0.45 * row[6] + 0.1 * row[3])))


def generate(output: Path, seed: int = 20261011, count: int = 2500) -> dict:
    if count < 2000:
        raise ValueError("The learning curve needs at least 2,000 rows")
    rng = random.Random(seed)
    rows = []
    for _ in range(count):
        days, observations = rng.randint(1, 30), rng.randint(1, 8)
        row = [
            days,
            observations,
            days + rng.randint(0, 90),
            rng.randrange(4),
            rng.randrange(9),
            rng.randrange(15),
            rng.randrange(observations),
            rng.randrange(3),
        ]
        rows.append(row + [int(rng.random() < probability(row))])
    output.mkdir(parents=True, exist_ok=True)
    for name, data in [("train_pool", rows[:-500]), ("test", rows[-500:])]:
        with (output / f"{name}.csv").open("w", newline="") as file:
            writer = csv.writer(file, lineterminator="\n")
            writer.writerow(COLUMNS + ["synthetic_material_change"])
            writer.writerows(data)
    metadata = {
        "seed": seed,
        "rows": count,
        "poolRows": count - 500,
        "testRows": 500,
        "source": "invented-stochastic-formula",
        "formula": "sigmoid(-2.5 + 0.07*days + 0.5*status + 0.45*previous_change_count + 0.1*severity)",
        "labels": "Independent Bernoulli draws. Not real revisit outcomes.",
        "sha256": {
            n: hashlib.sha256((output / n).read_bytes()).hexdigest()
            for n in ["train_pool.csv", "test.csv"]
        },
    }
    (output / "provenance.json").write_text(json.dumps(metadata, indent=2) + "\n")
    return metadata


if __name__ == "__main__":
    print(json.dumps(generate(Path(__file__).parent / "v2")))
