"""Explicit live-provider smoke test using an authorized photo; no database writes."""

import argparse
import asyncio
import base64
import json
import time
from datetime import UTC, datetime
from pathlib import Path

import httpx

from fieldissue_intelligence.app import create_app
from fieldissue_intelligence.config import Settings


async def run(args):
    settings = Settings.from_env()
    if settings.ai_mock_mode:
        raise SystemExit("Refusing a live check with AI_MOCK_MODE=true")
    app = create_app(settings.model_copy(update={"environment": "production"}))
    observation = {
        "image_base64": base64.b64encode(args.image.read_bytes()).decode(),
        "mime_type": args.mime,
        "note": "Describe visible civic maintenance issues, if any.",
    }
    report = {
        "checkedAt": datetime.now(UTC).isoformat(),
        "boundary": "production-configured Python HTTP API, local ASGI transport, real remote Gemma",
        "comparisonControl": "Identical photo used twice. Not a real revisit or accuracy evaluation.",
        "model": settings.gemma_model,
        "configuredModelVersion": settings.gemma_model_version,
        "checks": {},
    }
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app), base_url="http://test"
    ) as client:
        denied = await client.post("/internal/analyze", json=observation)
        report["anonymousStatus"] = denied.status_code
        for name, path, body in [
            ("analysis", "/internal/analyze", observation),
            ("comparison", "/internal/compare", {"before": observation, "after": observation}),
        ]:
            started = time.monotonic()
            response = await client.post(
                path, json=body, headers={"X-Internal-Token": settings.internal_token}
            )
            report["checks"][name] = {
                "status": response.status_code,
                "seconds": round(time.monotonic() - started, 3),
                "response": response.json(),
            }
        ready = await client.get("/ready")
        report["fullReadiness"] = {"status": ready.status_code, "response": ready.json()}
    args.output.write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))
    if denied.status_code != 401 or any(x["status"] != 200 for x in report["checks"].values()):
        raise SystemExit(
            "Live Gemma HTTP check failed; report preserves the actual provider failure"
        )
    comparison = report["checks"]["comparison"]["response"]
    if (
        comparison["added"]
        or comparison["removed"]
        or comparison["recommendedStatus"] == "RESOLVED"
    ):
        raise SystemExit("Identical-image control failed; do not claim comparison quality")


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--image", type=Path, required=True, help="An authorized real photograph")
parser.add_argument("--mime", default="image/jpeg")
parser.add_argument(
    "--output",
    type=Path,
    required=True,
    help="JSON evidence file; may contain image-derived descriptions",
)
asyncio.run(run(parser.parse_args()))
