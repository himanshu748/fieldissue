"""Strict wire schemas shared with the NestJS boundary."""

import base64
import binascii
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, field_validator

Category = Literal[
    "CLEANLINESS",
    "INFRASTRUCTURE",
    "ACCESSIBILITY",
    "SAFETY",
    "ENVIRONMENT",
    "SIGNAGE",
    "LIGHTING",
    "TRAIL",
    "OTHER",
]
Severity = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
Status = Literal["OPEN", "ACKNOWLEDGED", "IN_PROGRESS", "RESOLVED", "REJECTED"]
MIME = Literal["image/jpeg", "image/png", "image/webp"]
ShortText = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=500)]
Provenance = Annotated[str, Field(min_length=1, max_length=200)]
MAX_IMAGE_BYTES = 10 * 1024 * 1024


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True, allow_inf_nan=False)


class AnalyzeResult(StrictModel):
    objects: list[ShortText] = Field(max_length=30)
    conditions: list[ShortText] = Field(max_length=30)
    suggestedCategory: Category
    suggestedSeverity: Severity
    evidence: list[ShortText] = Field(max_length=30)
    confidence: float = Field(ge=0, le=1)
    model: Provenance
    modelVersion: Provenance


class CompareResult(StrictModel):
    summary: Annotated[str, Field(min_length=1, max_length=2000)]
    removed: list[ShortText] = Field(max_length=30)
    added: list[ShortText] = Field(max_length=30)
    unchanged: list[ShortText] = Field(max_length=30)
    recommendedStatus: Status
    confidence: float = Field(ge=0, le=1)
    model: Provenance
    modelVersion: Provenance


class AnalyzeInput(StrictModel):
    image_base64: str = Field(min_length=1, max_length=14_000_000)
    mime_type: MIME
    note: str = Field(default="", max_length=5000)

    @field_validator("image_base64")
    @classmethod
    def valid_base64(cls, value):
        try:
            image = base64.b64decode(value, validate=True)
        except (binascii.Error, ValueError):
            raise ValueError("invalid_image_base64") from None
        if not image or len(image) > MAX_IMAGE_BYTES:
            raise ValueError("invalid_image_size")
        return value

    def image_bytes(self) -> bytes:
        return base64.b64decode(self.image_base64, validate=True)


class ObservationInput(AnalyzeInput):
    evidence: AnalyzeResult | None = None


class CompareInput(StrictModel):
    before: ObservationInput
    after: ObservationInput


class RevisitFeatures(StrictModel):
    days_since_last_observation: float = Field(ge=0, le=36500)
    previous_observation_count: int = Field(ge=0, le=1_000_000)
    issue_age_days: float = Field(ge=0, le=36500)
    severity: Severity
    category: Category
    nearby_issue_count: int = Field(ge=0, le=1_000_000)
    previous_change_count: int = Field(ge=0, le=1_000_000)
    status: Status


class RevisitPrediction(StrictModel):
    probabilityChanged: float = Field(ge=0, le=1)
    priorityScore: float = Field(ge=0, le=1)
    modelVersion: Provenance
