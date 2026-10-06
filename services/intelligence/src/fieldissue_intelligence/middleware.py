"""Reject unauthorized/oversized internal bodies before JSON decoding."""

import hmac
import json

MAX_BODY_BYTES = 30 * 1024 * 1024  # Two 10-MiB images after base64, plus bounded context.


class InternalBoundaryMiddleware:
    def __init__(self, app, token: str, max_body_bytes: int = MAX_BODY_BYTES):
        self.app = app
        self.token = token.encode("utf-8")
        self.max_body_bytes = max_body_bytes

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http" or not scope.get("path", "").startswith("/internal/"):
            return await self.app(scope, receive, send)
        headers = {key.lower(): value for key, value in scope.get("headers", [])}
        if not self.token:
            return await self._reject(send, 503, "internal_token_not_configured")
        token = headers.get(b"x-internal-token", b"")
        if not token or not hmac.compare_digest(token, self.token):
            return await self._reject(send, 401, "invalid_internal_token")
        if b"content-length" in headers:
            try:
                length = int(headers[b"content-length"])
            except ValueError:
                return await self._reject(send, 400, "invalid_content_length")
            if length < 0 or length > self.max_body_bytes:
                return await self._reject(send, 413, "request_body_too_large")
        chunks = []
        size = 0
        while True:
            message = await receive()
            if message["type"] == "http.disconnect":
                return
            chunk = message.get("body", b"")
            size += len(chunk)
            if size > self.max_body_bytes:
                return await self._reject(send, 413, "request_body_too_large")
            chunks.append(chunk)
            if not message.get("more_body", False):
                break
        body = b"".join(chunks)
        delivered = False

        async def replay():
            nonlocal delivered
            if not delivered:
                delivered = True
                return {"type": "http.request", "body": body, "more_body": False}
            return await receive()

        return await self.app(scope, replay, send)

    @staticmethod
    async def _reject(send, status, code):
        body = json.dumps({"error": code}).encode("utf-8")
        await send(
            {
                "type": "http.response.start",
                "status": status,
                "headers": [
                    (b"content-type", b"application/json"),
                    (b"content-length", str(len(body)).encode()),
                ],
            }
        )
        await send({"type": "http.response.body", "body": body})
