"""Opt-in instrumentation without notes, images, tokens, identities or locations."""

from contextlib import nullcontext

import sentry_sdk

from .config import Settings

_ALLOWED_TAGS = {
    "operation": {"analyze", "compare", "predict_revisit", "health", "ready"},
    "provider": {"gemma", "tabpfn"},
    "mode": {"mock", "real"},
    "error_code": {
        "invalid_request",
        "internal_token_not_configured",
        "invalid_internal_token",
        "unsupported_image_mime",
        "invalid_image_size",
        "image_mime_mismatch",
        "gemma_configuration_missing",
        "invalid_gemma_base_url",
        "production_gemma_requires_https",
        "invalid_structured_output",
        "provider_unavailable",
        "provider_http_error",
        "provider_model_mismatch",
        "provider_provenance_mismatch",
        "provider_timeout",
        "provider_connection_error",
        "gemma_runtime_not_ready",
        "gemma_model_not_available",
        "tabpfn_configuration_missing",
        "tabpfn_weights_missing",
        "tabpfn_training_data_invalid",
        "tabpfn_dependency_missing",
        "tabpfn_fit_failed",
        "tabpfn_invalid_output",
        "tabpfn_inference_failed",
        "tabpfn_busy",
        "tabpfn_timeout",
    },
}


def sanitize_event(event, hint):
    # Deny by default. Automatic integrations can otherwise include exception values,
    # frame locals, request bodies, auth headers and full model responses.
    return {
        **{
            key: event[key]
            for key in ("event_id", "timestamp", "level", "platform")
            if key in event
        },
        "message": "FieldIssue intelligence service event",
        "tags": {
            key: value
            for key, value in event.get("tags", {}).items()
            if key in _ALLOWED_TAGS and isinstance(value, str) and value in _ALLOWED_TAGS[key]
        },
    }


def sanitize_transaction(event, hint):
    """Preserve timings and trace linkage only; drop all descriptions and payloads."""
    operation = event.get("transaction")
    if operation not in _ALLOWED_TAGS["operation"]:
        return None
    trace = event.get("contexts", {}).get("trace", {})
    return {
        **{key: event[key] for key in ("event_id", "start_timestamp", "timestamp") if key in event},
        "type": "transaction",
        "transaction": operation,
        "contexts": {
            "trace": {
                key: trace[key]
                for key in ("trace_id", "span_id", "parent_span_id", "op", "status")
                if key in trace
            }
        },
        "tags": sanitize_event(event, hint)["tags"],
        "spans": [],
    }


def initialize(settings: Settings):
    if not settings.sentry_dsn:
        return False
    try:
        sentry_sdk.init(
            dsn=settings.sentry_dsn,
            environment=settings.environment,
            send_default_pii=False,
            default_integrations=False,
            auto_enabling_integrations=False,
            before_send=sanitize_event,
            before_send_transaction=sanitize_transaction,
            traces_sample_rate=settings.sentry_traces_sample_rate,
            max_breadcrumbs=0,
            include_local_variables=False,
        )
        return True
    except Exception:  # noqa: BLE001 - optional telemetry errors must not leak DSNs or block service
        return False


def span(operation: str, enabled: bool):
    if not enabled:
        return nullcontext()
    if sentry_sdk.get_current_span() is None:
        return sentry_sdk.start_transaction(op="ai.inference", name=operation)
    return sentry_sdk.start_span(op="ai.inference", name=operation)


def report_failure(error_code: str, operation: str, enabled: bool):
    if enabled:
        with sentry_sdk.new_scope() as scope:
            scope.set_tag("operation", operation)
            scope.set_tag("error_code", error_code.split(":")[0])
            sentry_sdk.capture_message("Intelligence provider operation failed", level="error")
