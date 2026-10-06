"""Local Prior Labs TabPFN inference fit against configured real labeled observations.

No implicit downloads, arbitrary pickle loading or remote billed calls. Install and
license TabPFN separately, then provision official weights and trustworthy labels.
"""

import asyncio
import csv
import importlib
import math
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from .config import Settings
from .providers import ProviderError
from .schemas import RevisitFeatures, RevisitPrediction

FEATURE_NAMES = (
    "days_since_last_observation",
    "previous_observation_count",
    "issue_age_days",
    "severity",
    "category",
    "nearby_issue_count",
    "previous_change_count",
    "status",
)
SEVERITIES = {"LOW": 0, "MEDIUM": 1, "HIGH": 2, "CRITICAL": 3}
CATEGORIES = {
    name: index
    for index, name in enumerate(
        (
            "CLEANLINESS",
            "INFRASTRUCTURE",
            "ACCESSIBILITY",
            "SAFETY",
            "ENVIRONMENT",
            "SIGNAGE",
            "LIGHTING",
            "TRAIL",
            "OTHER",
        )
    )
}
STATUSES = {"OPEN": 0, "ACKNOWLEDGED": 1, "IN_PROGRESS": 2, "RESOLVED": 3, "REJECTED": 4}


def feature_vector(features: RevisitFeatures) -> list[float | int]:
    return [
        features.days_since_last_observation,
        features.previous_observation_count,
        features.issue_age_days,
        SEVERITIES[features.severity],
        CATEGORIES[features.category],
        features.nearby_issue_count,
        features.previous_change_count,
        STATUSES[features.status],
    ]


def priority_score(probability: float, severity: str) -> float:
    # This transparent scheduling score is policy, not a second model prediction.
    return round(probability * (0.4 + 0.2 * SEVERITIES[severity]), 6)


class TabPFNRevisitProvider:
    def __init__(self, settings: Settings, classifier_factory=None):
        self.settings = settings
        self._factory = classifier_factory
        self._classifier = None
        self._pending = None
        self._executor = None
        self._numpy = None
        self._x, self._y = [], []
        if settings.ai_mock_mode:
            return
        if not all(
            (
                settings.tabpfn_training_data,
                settings.tabpfn_weights_path,
                settings.tabpfn_model_version,
            )
        ):
            raise ProviderError(
                "tabpfn_configuration_missing: configure TABPFN_TRAINING_DATA, TABPFN_WEIGHTS_PATH and TABPFN_MODEL_VERSION"
            )
        weights = Path(settings.tabpfn_weights_path)
        if not weights.is_file():
            raise ProviderError("tabpfn_weights_missing: provision official local TabPFN weights")
        self._load_training_data(Path(settings.tabpfn_training_data))
        self._executor = ThreadPoolExecutor(max_workers=1, thread_name_prefix="tabpfn")

    def _load_training_data(self, path: Path):
        try:
            if path.stat().st_size > 10_000_000:
                raise ValueError("oversized")
            with path.open(newline="", encoding="utf-8") as handle:
                reader = csv.DictReader(handle)
                fields = reader.fieldnames or []
                label_name = (
                    "material_change_since_last_visit"
                    if "material_change_since_last_visit" in fields
                    else "changed"
                )
                if len(fields) != 9 or set(fields) != {*FEATURE_NAMES, label_name}:
                    raise ValueError("invalid columns")
                for row in reader:
                    if set(row) != {*FEATURE_NAMES, label_name} or any(
                        v is None for v in row.values()
                    ):
                        raise ValueError("malformed row")
                    if len(self._y) >= 10_000:
                        raise ValueError("too many rows")
                    numeric = {
                        "days_since_last_observation": float(row["days_since_last_observation"]),
                        "previous_observation_count": int(row["previous_observation_count"]),
                        "issue_age_days": float(row["issue_age_days"]),
                        "nearby_issue_count": int(row["nearby_issue_count"]),
                        "previous_change_count": int(row["previous_change_count"]),
                    }
                    features = RevisitFeatures(
                        **numeric, **{k: row[k] for k in ("severity", "category", "status")}
                    )
                    if row[label_name] not in {"0", "1"}:
                        raise ValueError("labels must be 0 or 1")
                    self._x.append(feature_vector(features))
                    self._y.append(int(row[label_name]))
            if len(self._y) < 2 or set(self._y) != {0, 1}:
                raise ValueError("both classes required")
        except (OSError, ValueError, KeyError, TypeError):
            raise ProviderError(
                "tabpfn_training_data_invalid: require validated labeled CSV with both target classes 0 and 1"
            ) from None

    def _fit(self):
        if self._classifier is not None:
            return
        try:
            factory = self._factory
            if factory is None:
                factory = importlib.import_module("tabpfn").TabPFNClassifier
                self._numpy = importlib.import_module("numpy")
            classifier = factory(
                device=self.settings.tabpfn_device,
                model_path=self.settings.tabpfn_weights_path,
                categorical_features_indices=[3, 4, 7],
                random_state=42,
            )
            x, y = self._x, self._y
            if self._numpy is not None:
                x = self._numpy.asarray(x, dtype="float64")
                y = self._numpy.asarray(y, dtype="int64")
            classifier.fit(x, y)
            self._classifier = classifier
        except ImportError:
            raise ProviderError(
                "tabpfn_dependency_missing: install the tabpfn optional dependency"
            ) from None
        except ProviderError:
            raise
        except Exception:  # noqa: BLE001 - third-party runtime errors must not leak private labels
            raise ProviderError(
                "tabpfn_fit_failed: verify local weights, license and labeled data"
            ) from None

    def _predict_sync(self, features):
        self._fit()
        try:
            x = [feature_vector(features)]
            if self._numpy is not None:
                x = self._numpy.asarray(x, dtype="float64")
            values = self._classifier.predict_proba(x)
            classes = list(self._classifier.classes_)
            row = list(values[0])
            if len(values) != 1 or len(row) != 2 or set(classes) != {0, 1} or len(classes) != 2:
                raise ValueError("shape")
            if any(not math.isfinite(float(p)) or not 0 <= float(p) <= 1 for p in row):
                raise ValueError("range")
            if not math.isclose(sum(float(p) for p in row), 1.0, abs_tol=1e-5):
                raise ValueError("normalization")
            probability = float(row[classes.index(1)])
            return RevisitPrediction(
                probabilityChanged=probability,
                priorityScore=priority_score(probability, features.severity),
                modelVersion=self.settings.tabpfn_model_version,
            )
        except (ValueError, TypeError, IndexError, AttributeError):
            raise ProviderError("tabpfn_invalid_output", 502) from None
        except Exception:  # noqa: BLE001 - third-party runtime errors must not leak private labels
            raise ProviderError("tabpfn_inference_failed", 503) from None

    async def predict(self, features: RevisitFeatures) -> RevisitPrediction:
        if self.settings.ai_mock_mode:
            probability = round(
                min(
                    0.95,
                    0.1
                    + min(features.days_since_last_observation, 30) / 60
                    + min(features.previous_change_count, 10) / 50,
                ),
                6,
            )
            return RevisitPrediction(
                probabilityChanged=probability,
                priorityScore=priority_score(probability, features.severity),
                modelVersion="development-fixture-v1",
            )
        # One worker bounds CPU/GPU work. Timeout cannot cancel native inference;
        # refuse further work while that calculation is still running.
        if self._pending is not None and not self._pending.done():
            raise ProviderError("tabpfn_busy", 503)
        self._pending = self._executor.submit(self._predict_sync, features)
        try:
            return await asyncio.wait_for(
                asyncio.shield(asyncio.wrap_future(self._pending)),
                timeout=self.settings.provider_timeout_seconds,
            )
        except TimeoutError:
            raise ProviderError("tabpfn_timeout", 504) from None

    async def ready(self) -> None:
        if self.settings.ai_mock_mode or self._classifier is not None:
            return
        if self._pending is not None and not self._pending.done():
            raise ProviderError("tabpfn_busy", 503)
        self._pending = self._executor.submit(self._fit)
        try:
            await asyncio.wait_for(
                asyncio.shield(asyncio.wrap_future(self._pending)),
                timeout=min(
                    self.settings.provider_timeout_seconds,
                    self.settings.provider_total_timeout_seconds,
                ),
            )
        except TimeoutError:
            raise ProviderError("tabpfn_timeout", 504) from None

    def close(self):
        if self._executor is not None:
            self._executor.shutdown(wait=False, cancel_futures=True)
