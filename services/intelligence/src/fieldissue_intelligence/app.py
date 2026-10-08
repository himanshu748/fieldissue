"""Private HTTP boundary. Expose only on an internal network behind the TypeScript API."""

import hmac
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI, Header
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from . import telemetry
from .config import Settings
from .embeddings import EmbeddingInput, EmbeddingService
from .middleware import InternalBoundaryMiddleware
from .providers import GemmaEvidenceProvider, ProviderError
from .revisit import TabPFNRevisitProvider
from .schemas import (
    AnalyzeInput,
    AnalyzeResult,
    CompareInput,
    CompareResult,
    RevisitFeatures,
    RevisitPrediction,
)


def create_app(settings: Settings | None = None, evidence_provider=None, revisit_provider=None):
    settings = settings or Settings.from_env()

    @asynccontextmanager
    async def lifespan(app):
        yield
        if revisit_provider is not None:
            revisit_provider.close()

    app = FastAPI(
        title="FieldIssue Intelligence",
        version="0.1.0",
        docs_url=None,
        redoc_url=None,
        lifespan=lifespan,
    )
    app.add_middleware(InternalBoundaryMiddleware, token=settings.internal_token)
    telemetry_enabled = telemetry.initialize(settings)
    provider_error = None
    if evidence_provider is None:
        try:
            evidence_provider = GemmaEvidenceProvider(settings)
        except ProviderError as error:
            provider_error = error
    revisit_error = None
    if revisit_provider is None:
        try:
            revisit_provider = TabPFNRevisitProvider(settings)
        except ProviderError as error:
            revisit_error = error
    app.state.settings = settings
    app.state.evidence_provider = evidence_provider
    app.state.revisit_provider = revisit_provider

    async def authenticate(x_internal_token: Annotated[str | None, Header()] = None):
        if not settings.internal_token:
            raise ProviderError("internal_token_not_configured")
        if not x_internal_token or not hmac.compare_digest(
            x_internal_token, settings.internal_token
        ):
            raise ProviderError("invalid_internal_token", 401)

    @app.exception_handler(ProviderError)
    async def provider_failure(request, error):
        operation = request.url.path.rsplit("/", 1)[-1]
        telemetry.report_failure(error.code, operation, telemetry_enabled)
        return JSONResponse(status_code=error.status_code, content={"error": error.code})

    @app.exception_handler(RequestValidationError)
    async def invalid_input(request, error):
        # Do not serialize Pydantic's input values; these may contain private images.
        return JSONResponse(
            status_code=422,
            content={
                "error": "invalid_request",
                "fields": [".".join(str(part) for part in item["loc"]) for item in error.errors()],
            },
        )

    @app.get("/health")
    async def health():
        return {"status": "ok"}

    @app.get("/ready")
    async def ready():
        if not settings.internal_token:
            raise ProviderError("internal_token_not_configured")
        if provider_error:
            raise provider_error
        await evidence_provider.ready()
        return {"status": "ready", "mode": "mock" if settings.ai_mock_mode else "real"}

    @app.get("/internal/capabilities", dependencies=[Depends(authenticate)])
    async def capabilities():
        # Optional experiments must not gate the report/revisit evidence workflow.
        revisit_available = revisit_error is None
        if revisit_available:
            try:
                await revisit_provider.ready()
            except ProviderError:
                revisit_available = False
        return {"revisit_prediction": {"available": revisit_available, "experimental": True}}

    embeddings = EmbeddingService()

    @app.post("/internal/embed", dependencies=[Depends(authenticate)])
    async def embed(request: EmbeddingInput):
        return await embeddings.embed(request)

    @app.post(
        "/internal/analyze", response_model=AnalyzeResult, dependencies=[Depends(authenticate)]
    )
    async def analyze(observation: AnalyzeInput):
        if provider_error:
            raise provider_error
        with telemetry.span("analyze", telemetry_enabled):
            return await evidence_provider.analyze_observation(
                observation.image_bytes(), observation.mime_type, observation.note
            )

    @app.post(
        "/internal/compare", response_model=CompareResult, dependencies=[Depends(authenticate)]
    )
    async def compare(observations: CompareInput):
        if provider_error:
            raise provider_error
        with telemetry.span("compare", telemetry_enabled):
            return await evidence_provider.compare_observations(
                observations.before, observations.after
            )

    @app.post(
        "/internal/predict/revisit",
        response_model=RevisitPrediction,
        dependencies=[Depends(authenticate)],
    )
    async def predict_revisit(features: RevisitFeatures):
        if revisit_error:
            raise revisit_error
        with telemetry.span("predict_revisit", telemetry_enabled):
            return await revisit_provider.predict(features)

    return app


app = create_app()
