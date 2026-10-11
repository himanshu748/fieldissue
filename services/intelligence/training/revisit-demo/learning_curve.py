"""Measure frozen synthetic learning curves with real free-quota TabPFN calls."""

from __future__ import annotations

import argparse
import csv
import io
import json
import os
import random
import statistics
from datetime import UTC, datetime
from pathlib import Path
from urllib.parse import urlparse

import httpx

from training import common

ROOT = Path(__file__).parent
MODELS = ["majority", "logistic_regression", "hist_gradient_boosting", "tabpfn", "oracle"]
METRICS = ["accuracy", "rocAuc", "brierScore", "logLoss"]


def probability(row):
    import math

    return 1 / (1 + math.exp(-(-2.5 + 0.07 * row[0] + 0.5 * row[7] + 0.45 * row[6] + 0.1 * row[3])))


def scores(y, probabilities):
    from sklearn.metrics import accuracy_score, brier_score_loss, log_loss, roc_auc_score

    return {
        "accuracy": float(accuracy_score(y, [int(p >= 0.5) for p in probabilities])),
        "rocAuc": float(roc_auc_score(y, probabilities)),
        "brierScore": float(brier_score_loss(y, probabilities)),
        "logLoss": float(log_loss(y, probabilities, labels=[0, 1])),
    }


def interval(values):
    if len(values) != 5:
        raise ValueError("Every interval requires the five registered repeats")
    mean = statistics.mean(values)
    half = 2.7764451051977987 * statistics.stdev(values) / (len(values) ** 0.5)
    return {"mean": mean, "ci95": [mean - half, mean + half], "repeats": len(values)}


def parse_probabilities(body, expected_rows):
    metadata = body.get("metadata", {})
    if (
        metadata.get("billing_model_version") != "v3.5"
        or metadata.get("n_estimators") != 1
        or metadata.get("classes") != [0, 1]
    ):
        raise ValueError("Provider model, ensemble or class provenance changed")
    rows = body.get("prediction", [])
    if len(rows) != expected_rows:
        raise ValueError("Provider returned the wrong number of probabilities")
    import math

    if any(
        len(r) != 2
        or any(not isinstance(p, (int, float)) or not math.isfinite(p) or p < 0 or p > 1 for p in r)
        or abs(sum(r) - 1) > 0.001
        for r in rows
    ):
        raise ValueError("Provider returned invalid probabilities")
    return [r[1] for r in rows]


def csv_bytes(rows):
    stream = io.StringIO()
    csv.writer(stream, lineterminator="\n").writerows(rows)
    return stream.getvalue().encode()


class Provider:
    def __init__(self, output, cap):
        key = os.environ.get("TABPFN_TOKEN", "").strip()
        if not key:
            raise ValueError("TABPFN_TOKEN is missing")
        self.client = httpx.Client(timeout=120, follow_redirects=False)
        self.headers = {"Authorization": f"Bearer {key}"}
        self.output, self.cap = output, cap
        self.ledger_path = output / "quota-ledger.json"
        self.ledger = json.loads(self.ledger_path.read_text()) if self.ledger_path.exists() else []

    def post(self, path, data):
        response = self.client.post(
            "https://api.priorlabs.ai/tabpfn/" + path, headers=self.headers, json=data
        )
        if response.status_code != 200:
            (self.output / "provider-error.txt").write_text(response.text)
            raise RuntimeError(
                f"TabPFN {path}: HTTP {response.status_code}; response saved privately"
            )
        return response.json()

    def upload(self, payload, info):
        url = info["signed_urls"][0]
        parsed = urlparse(url)
        if (
            parsed.scheme != "https"
            or parsed.username
            or parsed.password
            or not (
                parsed.hostname == "storage.googleapis.com"
                or (parsed.hostname or "").endswith(".storage.googleapis.com")
            )
        ):
            raise ValueError("Unexpected signed upload host")
        response = self.client.put(url, content=payload, headers=info.get("required_headers", {}))
        if response.status_code not in (200, 201):
            raise RuntimeError(f"Synthetic upload: HTTP {response.status_code}")

    def predict(self, rows, test, columns, run_id):
        quote = self.post(
            "estimate_cost",
            {
                "model_version": "v3.5",
                "operation": "predict",
                "train_rows": len(rows),
                "test_rows": len(test),
                "raw_columns": 8,
                "n_estimators": 1,
            },
        )
        tokens = quote.get("estimated_cost")
        if (
            not isinstance(tokens, (int, float))
            or tokens < 0
            or tokens > 50000
            or sum(x["reservedTokens"] for x in self.ledger) + tokens > self.cap
        ):
            raise ValueError("Quoted run exceeds the registered free-quota bound")
        # Reserve the quote before inference. Failed calls keep their reservation.
        self.ledger.append(
            {"runId": run_id, "reservedTokens": tokens, "quote": quote, "status": "reserved"}
        )
        common.write_json(self.ledger_path, self.ledger)
        config = {
            "task": "classification",
            "tabpfn_config": {"model_path": "v3.5_default", "n_estimators": 1},
        }
        prep = self.post(
            "prepare_train_set_upload",
            {"x_train_info": {"format": "csv"}, "y_train_info": {"format": "csv"}},
        )
        self.upload(csv_bytes([columns] + [r[:-1] for r in rows]), prep["x_train_info"])
        self.upload(
            csv_bytes([["synthetic_material_change"]] + [[r[-1]] for r in rows]),
            prep["y_train_info"],
        )
        fit = self.post(
            "fit", {"train_set_upload_id": prep["train_set_upload_id"], "task_config": config}
        )
        fid = fit["fitted_train_set_id"]
        prep = self.post(
            "prepare_test_set_upload",
            {"fitted_train_set_id": fid, "x_test_info": {"format": "csv"}},
        )
        self.upload(csv_bytes([columns] + [r[:-1] for r in test]), prep["x_test_info"])
        result = self.post(
            "predict",
            {
                "fitted_train_set_id": fid,
                "test_set_upload_id": prep["test_set_upload_id"],
                "task_config": {**config, "predict_params": {"output_type": "probas"}},
            },
        )
        probabilities = parse_probabilities(result, len(test))
        self.ledger[-1]["status"] = "completed"
        common.write_json(self.ledger_path, self.ledger)
        return probabilities, {
            "quotedTokens": tokens,
            "providerMetadata": result["metadata"],
            "fittedModelId": fid,
        }


def run(output):
    import sklearn
    from sklearn.ensemble import HistGradientBoostingClassifier
    from sklearn.linear_model import LogisticRegression
    from sklearn.pipeline import make_pipeline
    from sklearn.preprocessing import StandardScaler

    output.mkdir(parents=True, exist_ok=True)
    protocol = json.loads((ROOT.parent / "experiment_protocol.json").read_text())
    provenance = json.loads((ROOT / "v2/provenance.json").read_text())
    for name, expected in provenance["sha256"].items():
        if common.dataset_sha256(ROOT / "v2" / name) != expected:
            raise ValueError("Frozen synthetic rows changed")
    files = {}
    for name in ["train_pool", "test"]:
        with (ROOT / "v2" / f"{name}.csv").open() as file:
            reader = csv.reader(file)
            columns = next(reader)[:-1]
            files[name] = [[float(x) for x in row] for row in reader]
    pool, test = files["train_pool"], files["test"]
    x_test, y_test = [r[:-1] for r in test], [int(r[-1]) for r in test]
    if len(test) != protocol["tabpfnTestRows"]:
        raise ValueError("Registered test size changed")
    provider = Provider(output, protocol["tabpfnFreeTokenBudget"])
    points = []
    try:
        for n in protocol["tabpfnSizes"]:
            runs = []
            for repeat in range(5):
                seed = 71000 + repeat
                # Nested training subsets within each repeat make size comparisons paired.
                indices = list(range(len(pool)))
                random.Random(seed).shuffle(indices)
                indices = indices[:n]
                train = [pool[i] for i in indices]
                run_id = f"n{n}-r{repeat}"
                path = output / f"{run_id}.json"
                signature = {
                    "trainIndices": indices,
                    "dataHashes": provenance["sha256"],
                    "protocolHash": common.dataset_sha256(ROOT.parent / "experiment_protocol.json"),
                }
                if path.exists():
                    item = json.loads(path.read_text())
                    if item["signature"] != signature:
                        raise ValueError("A cached run has different data or protocol")
                else:
                    x_train, y_train = [r[:-1] for r in train], [int(r[-1]) for r in train]
                    lr = make_pipeline(StandardScaler(), LogisticRegression())
                    lr.fit(x_train, y_train)
                    hgb = HistGradientBoostingClassifier(random_state=seed)
                    hgb.fit(x_train, y_train)
                    probabilities = {
                        "majority": [statistics.mean(y_train)] * len(test),
                        "logistic_regression": lr.predict_proba(x_test)[:, 1].tolist(),
                        "hist_gradient_boosting": hgb.predict_proba(x_test)[:, 1].tolist(),
                        "oracle": [probability(row) for row in x_test],
                    }
                    probabilities["tabpfn"], metadata = provider.predict(
                        train, test, columns, run_id
                    )
                    item = {
                        "seed": seed,
                        "repeat": repeat,
                        "signature": signature,
                        "metrics": {m: scores(y_test, p) for m, p in probabilities.items()},
                        "probabilities": probabilities,
                        "provider": metadata,
                    }
                    common.write_json(path, item)
                runs.append(item)
                print("CURVE", n, repeat, item["metrics"]["tabpfn"]["rocAuc"], flush=True)
            summary = {
                model: {
                    metric: interval([r["metrics"][model][metric] for r in runs])
                    for metric in METRICS
                }
                for model in MODELS
            }
            paired = interval(
                [
                    r["metrics"]["tabpfn"]["rocAuc"] - r["metrics"]["logistic_regression"]["rocAuc"]
                    for r in runs
                ]
            )
            points.append(
                {
                    "trainRows": n,
                    "runs": runs,
                    "summary": summary,
                    "pairedAucDifferenceVsLogistic": paired,
                }
            )
            common.write_json(output / "points.json", points)
        useful = all(
            p["pairedAucDifferenceVsLogistic"]["mean"] > 0 for p in points if p["trainRows"] <= 128
        )
        result = {
            "kind": "fieldissue-tabpfn-synthetic-learning-curve",
            "createdAt": datetime.now(UTC).isoformat(),
            "provenance": provenance,
            "protocolSha256": common.dataset_sha256(ROOT.parent / "experiment_protocol.json"),
            "sklearnVersion": sklearn.__version__,
            "model": "TabPFN-3.5",
            "nEstimators": 1,
            "decisionRule": protocol["tabpfnDecisionRule"],
            "decisionImplementation": protocol["tabpfnDecisionImplementation"],
            "tabpfnUsefulUnderRule": useful,
            "confidenceIntervalMethod": protocol["tabpfnConfidenceInterval"],
            "quotedFreeQuotaTokens": sum(x["reservedTokens"] for x in provider.ledger),
            "cashSpentUsd": 0,
            "points": points,
            "testLabels": y_test,
            "oracleExpectedBayesAccuracy": statistics.mean(
                max(probability(r), 1 - probability(r)) for r in x_test
            ),
            "limitations": [
                "All rows and outcomes come from an invented Bernoulli formula, not real revisits.",
                "The logistic model matches the generator's functional form. Irrelevant features and sampling noise can affect finite-sample performance.",
                "Intervals measure training-repeat variation on one fixed test set, not test-population uncertainty.",
                "Oracle probabilities are the Bayes rule in expectation, not a guaranteed finite-sample maximum.",
                "Quote reservations bound free-quota consumption. They are not an independently verified invoice.",
                "The existing live 96-row scenario model and real walk ranking are unchanged.",
            ],
            "earlierRun": "tabpfn-synthetic-evaluation-2026-10-09.json",
        }
        common.write_json(output / "evaluation.json", result)
        return result
    finally:
        provider.client.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    run(args.output)
