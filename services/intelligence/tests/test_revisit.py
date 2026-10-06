import math

import httpx
import pytest
from test_app import app

FEATURES = {
    "days_since_last_observation": 8.0,
    "previous_observation_count": 3,
    "issue_age_days": 20.0,
    "severity": "HIGH",
    "category": "INFRASTRUCTURE",
    "nearby_issue_count": 4,
    "previous_change_count": 2,
    "status": "OPEN",
}


def modules():
    from fieldissue_intelligence.config import Settings
    from fieldissue_intelligence.providers import ProviderError
    from fieldissue_intelligence.revisit import TabPFNRevisitProvider
    from fieldissue_intelligence.schemas import RevisitFeatures

    return (TabPFNRevisitProvider, RevisitFeatures, Settings, ProviderError)


def test_real_missing_training_data_does_not_predict():
    Provider, _, Settings, Error = modules()
    with pytest.raises(Error, match="tabpfn_configuration_missing"):
        Provider(Settings(internal_token="token"))


@pytest.mark.asyncio
async def test_explicit_mock_prediction_is_deterministic():
    Provider, Features, Settings, _ = modules()
    provider = Provider(Settings(ai_mock_mode=True))
    first = await provider.predict(Features(**FEATURES))
    second = await provider.predict(Features(**FEATURES))
    assert first == second
    assert first.modelVersion == "development-fixture-v1"
    assert 0 <= first.probabilityChanged <= 1
    assert 0 <= first.priorityScore <= 100


def test_feature_contract_rejects_extra_bad_enum_and_coercion():
    _, Features, _, _ = modules()
    for changes in (
        {"secret": 1},
        {"status": "deleted"},
        {"severity": "high"},
        {"days_since_last_observation": -1},
        {"nearby_issue_count": "4"},
    ):
        with pytest.raises(ValueError):
            Features(**{**FEATURES, **changes})


def configured(tmp_path):
    _, _, Settings, _ = modules()
    import csv

    dataset = tmp_path / "labeled.csv"
    with dataset.open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=[*FEATURES, "changed"])
        writer.writeheader()
        writer.writerows(
            [
                {**FEATURES, "changed": 0},
                {**FEATURES, "days_since_last_observation": 20, "changed": 1},
            ]
        )
    weights = tmp_path / "tabpfn.ckpt"
    weights.write_bytes(b"local-test-weights")
    return Settings(
        tabpfn_training_data=str(dataset),
        tabpfn_weights_path=str(weights),
        tabpfn_model_version="local-tabpfn-revisit-v1",
        provider_timeout_seconds=0.02,
        max_retries=0,
    )


@pytest.mark.asyncio
async def test_real_fit_uses_labels_and_positive_class_column(tmp_path):
    Provider, Features, _, _ = modules()
    captured = {}

    class Classifier:
        classes_ = (1, 0)

        def fit(self, x, y):
            captured["fit"] = (x, y)
            return self

        def predict_proba(self, x):
            captured["prediction"] = x
            return [[0.8, 0.2]]

    provider = Provider(configured(tmp_path), classifier_factory=lambda **kw: Classifier())
    result = await provider.predict(Features(**FEATURES))
    assert captured["fit"][1] == [0, 1]
    assert len(captured["fit"][0][0]) == 8
    assert result.probabilityChanged == 0.8
    assert result.modelVersion == "local-tabpfn-revisit-v1"


@pytest.mark.asyncio
@pytest.mark.parametrize("probabilities", [[[math.nan, 0.2]], [[1.1, -0.1]], [[0.8]], [[0.8, 0.4]]])
async def test_malformed_tabpfn_probability_rejected(tmp_path, probabilities):
    Provider, Features, _, Error = modules()

    class Classifier:
        classes_ = (0, 1)

        def fit(self, x, y):
            return self

        def predict_proba(self, x):
            return probabilities

    provider = Provider(configured(tmp_path), classifier_factory=lambda **kw: Classifier())
    with pytest.raises(Error, match="tabpfn_invalid_output"):
        await provider.predict(Features(**FEATURES))


@pytest.mark.asyncio
async def test_tabpfn_timeout_fails_visibly(tmp_path):
    Provider, Features, _, Error = modules()
    import time

    class Classifier:
        classes_ = (0, 1)

        def fit(self, x, y):
            return self

        def predict_proba(self, x):
            time.sleep(0.1)
            return [[0.2, 0.8]]

    provider = Provider(configured(tmp_path), classifier_factory=lambda **kw: Classifier())
    with pytest.raises(Error, match="tabpfn_timeout"):
        await provider.predict(Features(**FEATURES))


def test_tabpfn_labeled_data_requires_both_classes(tmp_path):
    Provider, _, _, Error = modules()
    settings = configured(tmp_path)
    path = tmp_path / "labeled.csv"
    path.write_text(path.read_text().replace(",1\n", ",0\n"))
    with pytest.raises(Error, match="tabpfn_training_data_invalid"):
        Provider(settings)


async def test_internal_predict_route_requires_token_and_matches_wire_contract():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app()), base_url="http://test"
    ) as client:
        assert (await client.post("/internal/predict/revisit", json=FEATURES)).status_code == 401
        result = await client.post(
            "/internal/predict/revisit",
            json=FEATURES,
            headers={"X-Internal-Token": "test-internal-token"},
        )
        assert result.status_code == 200
        assert set(result.json()) == {"probabilityChanged", "priorityScore", "modelVersion"}


def test_priority_score_normalized_to_shared_contract():
    from fieldissue_intelligence.revisit import priority_score

    assert priority_score(0.8, "CRITICAL") == 0.8


@pytest.mark.asyncio
async def test_tabpfn_readiness_fails_when_dependency_missing(tmp_path, monkeypatch):
    Provider, _, _, Error = modules()
    from fieldissue_intelligence import revisit

    def missing(_):
        raise ImportError("missing private traceback")

    monkeypatch.setattr(revisit.importlib, "import_module", missing)
    provider = Provider(configured(tmp_path))
    with pytest.raises(Error, match="tabpfn_dependency_missing"):
        await provider.ready()


def test_canonical_material_change_label_supported(tmp_path):
    Provider, _, _, _ = modules()
    settings = configured(tmp_path)
    path = tmp_path / "labeled.csv"
    path.write_text(path.read_text().replace(",changed\n", ",material_change_since_last_visit\n"))
    provider = Provider(settings, classifier_factory=lambda **kw: None)
    assert provider._y == [0, 1]
    provider.close()


def test_duplicate_training_header_rejected(tmp_path):
    Provider, _, _, Error = modules()
    settings = configured(tmp_path)
    path = tmp_path / "labeled.csv"
    lines = path.read_text().splitlines()
    path.write_text(
        "\n".join(
            [lines[0] + ",changed", *[line + "," + line.rsplit(",", 1)[-1] for line in lines[1:]]]
        )
        + "\n"
    )
    with pytest.raises(Error, match="tabpfn_training_data_invalid"):
        Provider(settings)
