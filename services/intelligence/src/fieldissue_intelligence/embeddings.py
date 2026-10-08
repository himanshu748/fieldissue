import asyncio
import json
import os
import sys

from pydantic import BaseModel, Field

from .providers import ProviderError


class EmbeddingInput(BaseModel):
    texts: list[str] = Field(min_length=1, max_length=5)


class EmbeddingService:
    def __init__(self):
        self.lock = asyncio.Lock()

    async def embed(self, request: EmbeddingInput):
        if os.environ.get("SEMANTIC_SEARCH_ENABLED") != "true":
            raise ProviderError("semantic_search_not_configured")
        if any(not 1 <= len(t) <= 4000 for t in request.texts):
            raise ProviderError("invalid_embedding_input", 400)
        if self.lock.locked():
            raise ProviderError("embedding_busy", 429)
        async with self.lock:
            process = await asyncio.create_subprocess_exec(
                sys.executable,
                "-m",
                "fieldissue_intelligence.embedding_worker",
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.DEVNULL,
            )
            try:
                stdout, _ = await asyncio.wait_for(
                    process.communicate(json.dumps({"texts": request.texts}).encode()), timeout=60
                )
                if process.returncode != 0:
                    raise ProviderError("embedding_unavailable")
                return json.loads(stdout)
            except (TimeoutError, asyncio.CancelledError):
                if process.returncode is None:
                    process.kill()
                await process.wait()
                raise
            except (ValueError, KeyError):
                raise ProviderError("embedding_invalid_response") from None
