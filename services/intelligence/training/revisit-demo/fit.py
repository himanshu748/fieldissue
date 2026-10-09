"""Explicit free-quota REST setup for the synthetic demo; requires TABPFN_TOKEN."""

import csv
import io
import json
import os
from pathlib import Path

import httpx

base = "https://api.priorlabs.ai"
key = os.environ["TABPFN_TOKEN"]
headers = {"Authorization": f"Bearer {key}"}
out = Path(os.environ.get("TABPFN_ARTIFACT_DIR", ".local/tabpfn-live"))
out.mkdir(parents=True, exist_ok=True)
root = Path(__file__).parent
config = {
    "task": "classification",
    "tabpfn_config": {"model_path": "v3.5_default", "n_estimators": 8},
}


def post(path, data):
    r = httpx.post(base + path, headers=headers, json=data, timeout=90)
    if not r.is_success:
        (out / "error.json").write_text(r.text)
        raise RuntimeError(f"{path}: HTTP {r.status_code}; details stored privately")
    return r.json()


def upload(data, info):
    from urllib.parse import urlparse

    u = info["signed_urls"][0]
    p = urlparse(u)
    assert p.scheme == "https" and (
        p.hostname == "storage.googleapis.com" or p.hostname.endswith(".storage.googleapis.com")
    )
    r = httpx.put(u, content=data, headers=info.get("required_headers", {}), timeout=60)
    if not r.is_success:
        raise RuntimeError(f"Signed upload failed: HTTP {r.status_code}")


def csvdata(rows):
    s = io.StringIO()
    csv.writer(s).writerows(rows)
    return s.getvalue().encode()


train = list(csv.reader((root / "train.csv").open()))
test = list(csv.reader((root / "test.csv").open()))
quote = post(
    "/tabpfn/estimate_cost",
    {
        "model_version": "v3.5",
        "operation": "predict",
        "train_rows": 96,
        "test_rows": 24,
        "raw_columns": 8,
        "n_estimators": 8,
    },
)
(out / "quote.json").write_text(json.dumps(quote, indent=2))
assert quote["estimated_cost"] < 1000000
prep = post(
    "/tabpfn/prepare_train_set_upload",
    {"x_train_info": {"format": "csv"}, "y_train_info": {"format": "csv"}},
)
upload(csvdata([r[:-1] for r in train]), prep["x_train_info"])
upload(csvdata([[r[-1]] for r in train]), prep["y_train_info"])
fit = post(
    "/tabpfn/fit", {"train_set_upload_id": prep["train_set_upload_id"], "task_config": config}
)
(out / "fit.json").write_text(json.dumps(fit, indent=2))
fid = fit["fitted_train_set_id"]
print("FIT_COMPLETE", flush=True)
prep = post(
    "/tabpfn/prepare_test_set_upload",
    {"fitted_train_set_id": fid, "x_test_info": {"format": "csv"}},
)
upload(csvdata([r[:-1] for r in test]), prep["x_test_info"])
result = post(
    "/tabpfn/predict",
    {
        "test_set_upload_id": prep["test_set_upload_id"],
        "fitted_train_set_id": fid,
        "task_config": {
            "task": "classification",
            "tabpfn_config": {"model_path": "v3.5_default", "n_estimators": 8},
            "predict_params": {"output_type": "probas"},
        },
    },
)
(out / "evaluation.json").write_text(json.dumps(result, indent=2))
print("PREDICT_COMPLETE", len(result["prediction"]), flush=True)
