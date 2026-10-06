import base64
import importlib.util
import json

import httpx
import pytest

PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9ZkAAAAASUVORK5CYII="
)
ANALYSIS = {
    "objects": ["road"],
    "conditions": ["pothole"],
    "suggestedCategory": "INFRASTRUCTURE",
    "suggestedSeverity": "HIGH",
    "evidence": ["Visible hole in road"],
    "confidence": 0.8,
    "model": "google/gemma-3-4b-it",
    "modelVersion": "revision-1",
}


def test_service_module_exists():
    assert importlib.util.find_spec("fieldissue_intelligence") is not None


def modules():
    from fieldissue_intelligence.config import Settings
    from fieldissue_intelligence.providers import GemmaEvidenceProvider, ProviderError

    return Settings, GemmaEvidenceProvider, ProviderError


def settings(**kwargs):
    Settings, _, _ = modules()
    return Settings(
        internal_token="internal-test-token",
        gemma_base_url="http://gemma:8000/v1",
        gemma_model="google/gemma-3-4b-it",
        gemma_model_version="revision-1",
        retry_backoff_seconds=0,
        **kwargs,
    )


@pytest.mark.asyncio
async def test_real_analyze_sends_image_and_strict_schema():
    _, Provider, _ = modules()

    def handler(request):
        payload = json.loads(request.content)
        assert payload["model"] == "google/gemma-3-4b-it"
        assert payload["response_format"]["json_schema"]["strict"] is True
        assert payload["response_format"]["json_schema"]["schema"]["additionalProperties"] is False
        assert payload["messages"][1]["content"][1]["image_url"]["url"].startswith(
            "data:image/png;base64,"
        )
        return httpx.Response(
            200,
            json={
                "model": "google/gemma-3-4b-it",
                "choices": [{"message": {"content": json.dumps(ANALYSIS)}}],
            },
        )

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        result = await Provider(settings(), client).analyze_observation(
            PNG, "image/png", "big pothole"
        )
    assert result.suggestedCategory == "INFRASTRUCTURE"
    assert result.modelVersion == "revision-1"


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "content",
    [
        json.dumps({**ANALYSIS, "unexpected": 1}),
        json.dumps({**ANALYSIS, "confidence": 2}),
        json.dumps({**ANALYSIS, "suggestedSeverity": "bad"}),
        "```json\n{}\n```",
        "{bad json",
    ],
)
async def test_malformed_output_rejected(content):
    _, Provider, Error = modules()
    async with httpx.AsyncClient(
        transport=httpx.MockTransport(
            lambda _: httpx.Response(
                200,
                json={
                    "model": "google/gemma-3-4b-it",
                    "choices": [{"message": {"content": content}}],
                },
            )
        )
    ) as client:
        with pytest.raises(Error, match="invalid_structured_output"):
            await Provider(settings(), client).analyze_observation(PNG, "image/png", "note")


@pytest.mark.asyncio
async def test_timeout_is_bounded_and_never_returns_fixture():
    _, Provider, Error = modules()
    attempts = []

    def handler(request):
        attempts.append(request)
        raise httpx.ReadTimeout("secret request note", request=request)

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        with pytest.raises(Error, match="provider_timeout"):
            await Provider(settings(max_retries=2), client).analyze_observation(
                PNG, "image/png", "note"
            )
    assert len(attempts) == 3


def test_non_gemma_configuration_rejected():
    _, Provider, Error = modules()
    with pytest.raises(Error, match="Gemma"):
        Provider(settings().model_copy(update={"gemma_model": "gpt-4o"}))


def test_mock_disallowed_in_production():
    Settings, _, _ = modules()
    with pytest.raises(ValueError, match="production"):
        Settings(ai_mock_mode=True, environment="production", internal_token="token")


@pytest.mark.asyncio
async def test_explicit_mock_has_honest_provenance_and_no_visual_claims():
    Settings, Provider, _ = modules()
    provider = Provider(Settings(ai_mock_mode=True, internal_token="token"))
    result = await provider.analyze_observation(PNG, "image/png", "garbage near drain")
    assert result.model == "development-fixture"
    assert result.objects == []
    assert result.evidence == ["User note: garbage near drain"]


@pytest.mark.asyncio
async def test_real_compare_has_two_images_and_observation_evidence():
    _, Provider, _ = modules()
    from fieldissue_intelligence.schemas import AnalyzeResult, ObservationInput

    comparison = {
        "summary": "Hole remains",
        "removed": [],
        "added": [],
        "unchanged": ["pothole"],
        "recommendedStatus": "OPEN",
        "confidence": 0.7,
        "model": "google/gemma-3-4b-it",
        "modelVersion": "revision-1",
    }
    before = ObservationInput(
        image_base64=base64.b64encode(PNG).decode(),
        mime_type="image/png",
        note="before",
        evidence=AnalyzeResult(**ANALYSIS),
    )
    after = before.model_copy(update={"note": "after"})

    def handler(request):
        content = json.loads(request.content)["messages"][1]["content"]
        assert sum(c["type"] == "image_url" for c in content) == 2
        assert "Visible hole" in content[0]["text"]
        return httpx.Response(
            200,
            json={
                "model": "google/gemma-3-4b-it",
                "choices": [{"message": {"content": json.dumps(comparison)}}],
            },
        )

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        result = await Provider(settings(), client).compare_observations(before, after)
    assert result.recommendedStatus == "OPEN"


@pytest.mark.asyncio
async def test_real_mode_without_configuration_fails_visibly():
    Settings, Provider, Error = modules()
    with pytest.raises(Error, match="gemma_configuration_missing"):
        Provider(Settings(internal_token="token"))


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "envelope",
    [[], None, {"choices": []}, {"model": "google/gemma-3-4b-it", "choices": [{"message": None}]}],
)
async def test_malformed_provider_envelope_rejected_safely(envelope):
    _, Provider, Error = modules()
    async with httpx.AsyncClient(
        transport=httpx.MockTransport(lambda _: httpx.Response(200, json=envelope))
    ) as client:
        with pytest.raises(Error, match="invalid_structured_output"):
            await Provider(settings(), client).analyze_observation(PNG, "image/png", "secret note")


def test_result_limits_match_shared_typescript():
    from pydantic import ValidationError

    from fieldissue_intelligence.schemas import AnalyzeResult, CompareResult

    for changes in ({"objects": ["x"] * 31}, {"evidence": ["x" * 501]}, {"model": "x" * 201}):
        with pytest.raises(ValidationError):
            AnalyzeResult(**{**ANALYSIS, **changes})
    valid = {
        "summary": "x" * 2000,
        "removed": [],
        "added": [],
        "unchanged": [],
        "recommendedStatus": "OPEN",
        "confidence": 0.0,
        "model": "gemma",
        "modelVersion": "v1",
    }
    assert CompareResult(**valid).summary == "x" * 2000


@pytest.mark.asyncio
async def test_mock_long_note_does_not_fail_or_overstate_evidence():
    Settings, Provider, _ = modules()
    result = await Provider(Settings(ai_mock_mode=True)).analyze_observation(
        PNG, "image/png", "a" * 5000
    )
    assert len(result.conditions[0]) <= 500
    assert len(result.evidence[0]) <= 500


@pytest.mark.asyncio
async def test_overall_deadline_bounds_all_retries():
    _, Provider, Error = modules()
    import asyncio

    async def slow_handler(request):
        await asyncio.sleep(0.1)
        return httpx.Response(503)

    async with httpx.AsyncClient(transport=httpx.MockTransport(slow_handler)) as client:
        with pytest.raises(Error, match="provider_timeout"):
            await Provider(
                settings(provider_total_timeout_seconds=0.02), client
            ).analyze_observation(PNG, "image/png", "note")


@pytest.mark.asyncio
async def test_readiness_verifies_served_gemma_model():
    _, Provider, Error = modules()

    def handler(request):
        assert request.method == "GET"
        assert request.url.path == "/v1/models"
        return httpx.Response(200, json={"data": [{"id": "gpt-4o"}]})

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        with pytest.raises(Error, match="gemma_model_not_available"):
            await Provider(settings(), client).ready()
