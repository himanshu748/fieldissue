# Public hackathon demo

The Render judge profile enables PUBLIC_GUEST_ACCESS by default (explicit false
opts out). Other profiles default to private access. API_ACCESS_TOKEN remains
required and is an operator secret; never embed it in the frontend.

- Visitors browse public reports and attached media without a token.
- GET /app-config starts a signed, HttpOnly, SameSite=Strict browser cookie.
  Production cookies are Secure. Ownership expires after 30 days; clearing
  cookies or changing browser loses guest management access.
- Publishing requires publicConsent=true in the upload form. The UI explains
  that the photo, note and exact location will be public, alongside AI consent.
- The server assigns ownership at creation; clients cannot choose an owner.
- Other guests can contribute revisits, but only the reporting browser or an
  operator can edit classification/status, resolve, or reopen. Training labels and exports remain operator-only. Operators retain their private-token access and removal controls.
- Existing rows default to private. List, map, walks, nearby warnings, semantic
  results, detail/history endpoints and media enforce visibility server-side.
- Guest writes require a same-origin Origin header, a valid cookie, and a durable
  daily allowance: at most 6 upload attempts and 20 write attempts per browser.
  Failed attempts count. The existing global provider allowance, concurrency,
  upload-size and storage limits remain enforced. New cookies do not reset the
  global provider allowance. Public reads have a separate global burst guard.
- Idempotency keys are scoped to the signed guest session, so guessed/reused keys
  cannot reveal another visitor's created report.

This is a bounded hackathon guest flow, not identity verification, a moderation
service, or an unlimited anonymous inference endpoint. Operators handle removal
requests by issue ID; a general public launch still needs an abuse-reporting and
moderation process. No previous private evidence is automatically published.
