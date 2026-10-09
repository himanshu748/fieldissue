# FieldIssue public read API

The hosted public deployment exposes an OpenAPI 3.1 document at `/v1/openapi`. GET requests require no access token for public reports. Private reports and their media return 404. Responses must not be cached as private account state. Rate limits return 429; clients should back off.

Examples (JSON):

- `GET /v1/issues?limit=20&search=bench` — public issues; follow the returned cursor.
- `GET /v1/issues/FI-000005` — public report with observations and provenance.
- `GET /v1/issues/FI-000005/timeline` — public lifecycle events.
- `GET /v1/issues/FI-000005/export` — redacted Open311-compatible field mapping, approximate coordinates, no photos/free text. Map the receiving jurisdiction's service codes before import.
- `GET /v1/integrations/status` — deployment capabilities, not an assurance that a provider will answer every request.

Browser writes use the same-origin app, a signed guest/account session and explicit processing/publication consent. Do not put the private operator token in external client applications. Accounts, workspace membership and saved walks are not public read endpoints. There is no general third-party OAuth/write API.
