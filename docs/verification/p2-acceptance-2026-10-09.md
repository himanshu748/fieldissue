# P1/P2 implementation and acceptance — 9 October 2026

This expands the active V2 PRD, without replacing the public report/revisit journey. It is a verification ledger, not a submission article.

## Implemented capabilities

- Optional nickname/password accounts, salted scrypt hashes, hashed 30-day sessions, recovery-code rotation and all-device sign-out. Guest-owned reports attach to the account; guest cookies cannot bypass linked ownership. In-flight guest uploads resolve account ownership inside the persistence transaction. No email or verified identity is claimed.
- Private community coordination around public issues: workspace membership, single-use expiring invites, invite revocation, member removal/leave, assignments and an account inbox.
- Fresh compared evidence and two eligible member accounts for community resolution. Proposer and report owner cannot vote. Votes are immutable, repeated photos are rejected, evidence changes require a new review, and any status change invalidates pending approvals. Private review notes and voter IDs remain in workspace tables. Public history records a generic confirmation and count. This is not Sybil-resistant identity verification or municipal certification.
- Private account walks with optimistic revision checks, manual save/load/delete, and existing guest tab walks. Google Maps walking directions open after explicit location-sharing consent. Internal dotted lines remain straight-line connections.
- Installable PWA shell with durable IndexedDB capture storage (10 photos, 5 MB each, seven-day expiry checked on access). Static assets only are cached; no API responses or report media. New reports and offline revisits can be prepared without a server connection. Each queued upload needs review/consent. Exact retries reuse their original key and photo fingerprint. No automatic background upload, offline map cache or offline AI is claimed.
- Duplicate guidance using public active reports within 300 m, category and keyword matching; no automatic merging or claim of semantic deduplication.
- Redacted downloadable PNG cards, calendar reminders, opt-in in-app subscriptions/reminders, Open311 field-mapping JSON exports, and a public read OpenAPI document linked from the Lab. Export is not government submission: destination service codes/jurisdiction still require mapping.

## Review and verification

Actual Claude Opus performed two read-only reviews of this patch. Codex independently implemented and tested fixes for auth isolation, guest ownership migration, review lock order, membership revocation, private review metadata, stale approvals, logout exemptions and offline-account recovery. The subscription CLI reviewed supplied source only; it did not execute tests or independently verify hosting.

Local browser acceptance used an isolated database schema and explicitly synthetic coordinates/sample photo, not existing production records. Successful checks observed so far:

- Account sign-in, workspace creation and adding an owned public report.
- 390-pixel mobile layout without horizontal overflow.
- Server stopped: the app reloaded from the service worker, restored a photo draft, saved it to IndexedDB, navigated to its queue and survived another reload.
- The first upload failed because the local test harness targeted an unrelated local service. The capture remained intact. After correcting the harness, retry created one issue using real `models/gemma-4-26b-a4b-it`, version `001`, and removed the queued item. Synthetic location and sample-photo origin were explicit in the record.

Browser testing also caught and fixed a walk-save contract mismatch: location-picker metadata is now stripped before sending the strict private walk payload. Saving the corrected walk returned a persisted account copy. Directions stay hidden until explicit consent; the generated URL contains the two selected coordinates and walking mode. Synthetic 0,0 test coordinates do not establish a routable outdoor journey.

Additional browser checks passed: PNG summary download, redacted Open311 JSON download, calendar download with valid CRLF framing, and a persisted in-app reminder. The native date input needed a committed keyboard change before its action enabled.

Local validation: type/format checks and production build passed. The final focused suite passed 13/13 against a fresh isolated Tiger schema. A broader earlier run passed 160/163; the three failures were the existing service-boundary readiness checks exceeding their 500 ms database connection timeout over remote TLS. CI uses local PostGIS and remains the release gate for those checks. No timeout assertion was weakened.

Sentry was inspected read-only in its authenticated dashboard. Historical NOT_FOUND and provider-related groups remain visible; this does not establish a clean production release. CI and hosted results will be appended after deployment.

## Remaining evidence boundaries

TabPFN is a real free API integration demonstrated on synthetic data. Its current held-out result is below the majority baseline; real-history walk ranking remains disabled until genuine labels and evaluation support it. Physical Android camera/GPS and real outdoor before/after evidence cannot be inferred from desktop emulation. Accounts identify nicknames, not independently verified people. Calendar delivery depends on the calendar application, and the inbox does not send email/push notifications. Maps and AI require connectivity. No paid plan or payment method is added by this release.
