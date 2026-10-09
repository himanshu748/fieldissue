"""Reproducible synthetic scenarios, never real observations or human review labels."""

import csv
import hashlib
import json
import math
import random
from pathlib import Path

rng = random.Random(42)
out = Path(__file__).parent
columns = [
    "days_since_last_observation",
    "previous_observation_count",
    "issue_age_days",
    "severity",
    "category",
    "nearby_issue_count",
    "previous_change_count",
    "status",
]
rows = []
for i in range(120):
    days = rng.randint(1, 30)
    observations = rng.randint(1, 8)
    age = days + rng.randint(0, 90)
    severity = rng.randrange(4)
    category = rng.randrange(9)
    nearby = rng.randrange(15)
    changes = rng.randrange(observations)
    status = rng.randrange(3)
    # An explicitly invented relationship plus random noise for a software demo.
    probability = 1 / (
        1 + math.exp(-(-2.5 + 0.07 * days + 0.5 * status + 0.45 * changes + 0.1 * severity))
    )
    rows.append(
        [
            days,
            observations,
            age,
            severity,
            category,
            nearby,
            changes,
            status,
            int(rng.random() < probability),
        ]
    )
for split, data in [("train", rows[:96]), ("test", rows[96:])]:
    with (out / f"{split}.csv").open("w", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(columns + ["synthetic_material_change"])
        w.writerows(data)
metadata = {
    "source": "assistant-generated-synthetic",
    "seed": 42,
    "trainRows": 96,
    "heldOutRows": 24,
    "features": columns,
    "labels": "Invented stochastic scenario outcomes, not human-reviewed field history.",
    "purpose": "Exercise real TabPFN classification on synthetic data. Not calibrated for scheduling real visits.",
    "categoryEncoding": [
        "CLEANLINESS",
        "INFRASTRUCTURE",
        "ACCESSIBILITY",
        "SAFETY",
        "ENVIRONMENT",
        "SIGNAGE",
        "LIGHTING",
        "TRAIL",
        "OTHER",
    ],
    "severityEncoding": ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    "statusEncoding": ["OPEN", "ACKNOWLEDGED", "IN_PROGRESS"],
    "sha256": {
        n: hashlib.sha256((out / n).read_bytes()).hexdigest() for n in ["train.csv", "test.csv"]
    },
}
(out / "provenance.json").write_text(json.dumps(metadata, indent=2) + "\n")
