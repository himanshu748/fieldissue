"""Environment configuration; explicit mocks are a development-only choice."""

import os
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


class Settings(BaseModel):
    model_config = ConfigDict(extra="forbid")
    environment: Literal["development", "test", "staging", "production"] = "development"
    ai_mock_mode: bool = False
    internal_token: str = ""
    gemma_base_url: str = ""
    gemma_model: str = ""
    gemma_model_version: str = ""
    gemma_api_key: str = ""
    provider_timeout_seconds: float = Field(default=30, gt=0, le=120)
    provider_total_timeout_seconds: float = Field(default=95, gt=0, le=100)
    max_retries: int = Field(default=2, ge=0, le=3)
    retry_backoff_seconds: float = Field(default=0.25, ge=0, le=5)
    sentry_dsn: str = ""
    sentry_traces_sample_rate: float = Field(default=0.05, ge=0, le=1)
    tabpfn_training_data: str = ""
    tabpfn_weights_path: str = ""
    tabpfn_model_version: str = ""
    tabpfn_device: Literal["cpu", "cuda", "auto"] = "cpu"

    @model_validator(mode="after")
    def forbid_production_mock(self):
        if self.ai_mock_mode and self.environment in {"production", "staging"}:
            raise ValueError("AI_MOCK_MODE is prohibited in production and staging")
        return self

    @classmethod
    def from_env(cls):
        return cls(
            environment=os.getenv("ENVIRONMENT", os.getenv("NODE_ENV", "development")),
            ai_mock_mode=os.getenv("AI_MOCK_MODE", "").lower() == "true",
            internal_token=os.getenv(
                "INTERNAL_SERVICE_TOKEN",
                os.getenv("INTERNAL_AI_TOKEN", os.getenv("INTERNAL_TOKEN", "")),
            ),
            gemma_base_url=os.getenv("GEMMA_BASE_URL", ""),
            gemma_model=os.getenv("GEMMA_MODEL", ""),
            gemma_model_version=os.getenv("GEMMA_MODEL_VERSION", ""),
            gemma_api_key=os.getenv("GEMMA_API_KEY", ""),
            provider_timeout_seconds=os.getenv("AI_TIMEOUT_SECONDS", "30"),
            provider_total_timeout_seconds=os.getenv("AI_TOTAL_TIMEOUT_SECONDS", "95"),
            max_retries=os.getenv("AI_MAX_RETRIES", "2"),
            retry_backoff_seconds=os.getenv("AI_RETRY_BACKOFF_SECONDS", "0.25"),
            sentry_dsn=os.getenv("SENTRY_DSN", ""),
            sentry_traces_sample_rate=os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.05"),
            tabpfn_training_data=os.getenv("TABPFN_TRAINING_DATA", ""),
            tabpfn_weights_path=os.getenv("TABPFN_WEIGHTS_PATH", ""),
            tabpfn_model_version=os.getenv("TABPFN_MODEL_VERSION", ""),
            tabpfn_device=os.getenv("TABPFN_DEVICE", "cpu"),
        )
