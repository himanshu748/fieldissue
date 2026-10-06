import base64

import httpx
from test_gemma import PNG


def app(**kwargs):
    from fieldissue_intelligence.app import create_app
    from fieldissue_intelligence.config import Settings

    return create_app(Settings(internal_token="test-internal-token", ai_mock_mode=True, **kwargs))


def body(note="pothole"):
    return {"image_base64": base64.b64encode(PNG).decode(), "mime_type": "image/png", "note": note}


async def test_health_and_mock_readiness():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app()), base_url="http://test"
    ) as client:
        assert (await client.get("/health")).json() == {"status": "ok"}
        assert (await client.get("/ready")).json()["mode"] == "mock"


async def test_auth_required_for_internal_routes():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app()), base_url="http://test"
    ) as client:
        assert (await client.post("/internal/analyze", json=body())).status_code == 401
        assert (
            await client.post("/internal/analyze", json=body(), headers={"X-Internal-Token": "bad"})
        ).status_code == 401
        result = await client.post(
            "/internal/analyze", json=body(), headers={"X-Internal-Token": "test-internal-token"}
        )
        assert result.status_code == 200
        assert result.json()["suggestedCategory"] == "INFRASTRUCTURE"
        assert result.json()["model"] == "development-fixture"


async def test_compare_and_bad_base64():
    headers = {"X-Internal-Token": "test-internal-token"}
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app()), base_url="http://test"
    ) as client:
        result = await client.post(
            "/internal/compare",
            json={"before": body("garbage"), "after": body("clean")},
            headers=headers,
        )
        assert result.status_code == 200
        assert result.json()["removed"] == ["garbage"]
        malformed = body()
        malformed["image_base64"] = "private-invalid-base64"
        failure = await client.post("/internal/analyze", json=malformed, headers=headers)
        assert failure.status_code == 422
        assert "private-invalid" not in failure.text


async def test_input_extra_fields_rejected_without_echo():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app()), base_url="http://test"
    ) as client:
        failure = await client.post(
            "/internal/analyze",
            json={**body(), "secret-extra": "private"},
            headers={"X-Internal-Token": "test-internal-token"},
        )
        assert failure.status_code == 422
        assert "private" not in failure.text


async def test_missing_real_configuration_not_ready():
    from fieldissue_intelligence.app import create_app
    from fieldissue_intelligence.config import Settings

    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(
            app=create_app(Settings(internal_token="test-internal-token"))
        ),
        base_url="http://test",
    ) as client:
        assert (await client.get("/health")).status_code == 200
        assert (await client.get("/ready")).status_code == 503
        failure = await client.post(
            "/internal/analyze", json=body(), headers={"X-Internal-Token": "test-internal-token"}
        )
        assert failure.status_code == 503
        assert failure.json()["error"].startswith("gemma_configuration_missing")


async def test_missing_internal_token_cannot_be_bypassed():
    from fieldissue_intelligence.app import create_app
    from fieldissue_intelligence.config import Settings

    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=create_app(Settings(ai_mock_mode=True))),
        base_url="http://test",
    ) as client:
        assert (await client.get("/ready")).status_code == 503
        assert (
            await client.post("/internal/analyze", json=body(), headers={"X-Internal-Token": ""})
        ).status_code == 503


def test_sentry_sanitizer_removes_sensitive_context():
    from fieldissue_intelligence.telemetry import sanitize_event

    event = {
        "exception": {"values": [{"value": "private note"}]},
        "request": {"data": body("secret")},
        "user": {"email": "private@example.com"},
        "breadcrumbs": [{"message": "Bearer private"}],
        "tags": {"operation": "analyze", "private": "secret"},
    }
    sanitized = sanitize_event(event, {})
    assert "secret" not in str(sanitized)
    assert "private" not in str(sanitized)
    assert sanitized["tags"]["operation"] == "analyze"


def test_canonical_internal_service_token_from_environment(monkeypatch):
    from fieldissue_intelligence.config import Settings

    monkeypatch.setenv("INTERNAL_SERVICE_TOKEN", "canonical-token")
    assert Settings.from_env().internal_token == "canonical-token"


async def test_streaming_body_limit_before_json_parse():
    from fieldissue_intelligence.middleware import InternalBoundaryMiddleware

    called = []
    output = []

    async def downstream(scope, receive, send):
        called.append(True)

    middleware = InternalBoundaryMiddleware(downstream, token="token", max_body_bytes=16)
    chunks = iter([{"type": "http.request", "body": b"12345678", "more_body": True}] * 3)

    async def receive():
        return next(chunks)

    async def send(message):
        output.append(message)

    await middleware(
        {"type": "http", "path": "/internal/analyze", "headers": [(b"x-internal-token", b"token")]},
        receive,
        send,
    )
    assert not called
    assert output[0]["status"] == 413


async def test_unauthorized_internal_request_not_read():
    from fieldissue_intelligence.middleware import InternalBoundaryMiddleware

    output = []

    async def downstream(scope, receive, send):
        raise AssertionError("must not call app")

    async def receive():
        raise AssertionError("must not read private body")

    async def send(message):
        output.append(message)

    middleware = InternalBoundaryMiddleware(downstream, token="token")
    await middleware({"type": "http", "path": "/internal/analyze", "headers": []}, receive, send)
    assert output[0]["status"] == 401


def test_sentry_tag_values_closed_to_safe_service_codes():
    from fieldissue_intelligence.telemetry import sanitize_event

    event = {
        "tags": {
            "operation": "private note",
            "provider": "secret key",
            "error_code": "Bearer secret",
            "mode": "personal location",
        }
    }
    assert sanitize_event(event, {})["tags"] == {}


async def test_bad_optional_sentry_dsn_does_not_break_service(monkeypatch):
    from fieldissue_intelligence import telemetry

    def bad_init(**kwargs):
        raise ValueError("private DSN content")

    monkeypatch.setattr(telemetry.sentry_sdk, "init", bad_init)
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app(sentry_dsn="private-dsn")), base_url="http://test"
    ) as client:
        assert (await client.get("/health")).status_code == 200


def test_sentry_tracing_uses_root_transaction_and_safe_payload(monkeypatch):
    from contextlib import nullcontext

    from fieldissue_intelligence import telemetry
    from fieldissue_intelligence.config import Settings

    captured = {}
    monkeypatch.setattr(telemetry.sentry_sdk, "init", lambda **kwargs: captured.update(kwargs))
    monkeypatch.setattr(telemetry.sentry_sdk, "get_current_span", lambda: None)
    monkeypatch.setattr(
        telemetry.sentry_sdk,
        "start_transaction",
        lambda **kwargs: captured.update(transaction=kwargs) or nullcontext(),
    )
    assert telemetry.initialize(Settings(sentry_dsn="test-dsn"))
    with telemetry.span("analyze", True):
        pass
    assert captured["traces_sample_rate"] > 0
    assert captured["transaction"] == {"op": "ai.inference", "name": "analyze"}
    sanitizer = captured["before_send_transaction"]
    trace = sanitizer(
        {
            "type": "transaction",
            "transaction": "analyze",
            "start_timestamp": 1.0,
            "timestamp": 2.0,
            "contexts": {
                "trace": {
                    "trace_id": "a" * 32,
                    "span_id": "b" * 16,
                    "op": "ai.inference",
                    "data": {"note": "private note"},
                }
            },
            "request": {"data": "private image"},
            "extra": {"key": "secret"},
            "spans": [{"description": "private note", "data": {"note": "secret"}}],
        },
        {},
    )
    assert "private" not in str(trace)
    assert "secret" not in str(trace)
    assert trace["transaction"] == "analyze"
    assert trace["timestamp"] - trace["start_timestamp"] == 1.0


def test_actual_sentry_sdk_exports_sanitized_timing_without_network():
    import sentry_sdk
    from sentry_sdk.transport import Transport

    from fieldissue_intelligence import telemetry

    class MemoryTransport(Transport):
        def __init__(self):
            super().__init__()
            self.events = []

        def capture_envelope(self, envelope):
            self.events.extend(
                item.get_transaction_event()
                for item in envelope.items
                if item.type == "transaction"
            )

    transport = MemoryTransport()
    client = sentry_sdk.Client(
        dsn="https://public@example.invalid/1",
        transport=transport,
        traces_sample_rate=1.0,
        default_integrations=False,
        auto_enabling_integrations=False,
        before_send_transaction=telemetry.sanitize_transaction,
        before_send=telemetry.sanitize_event,
        send_default_pii=False,
    )
    try:
        with sentry_sdk.isolation_scope() as scope:
            scope.set_client(client)
            with telemetry.span("analyze", True):
                sentry_sdk.set_context(
                    "private", {"note": "private note", "image": "private pixels"}
                )
            client.flush()
    finally:
        client.close()
    assert len(transport.events) == 1
    event = transport.events[0]
    assert event["transaction"] == "analyze"
    assert event["timestamp"] >= event["start_timestamp"]
    assert "private" not in str(event)
