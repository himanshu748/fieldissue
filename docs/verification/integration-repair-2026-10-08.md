# October 8 integration repair

> V2 update: the temporary plan to use Tiger as the primary was reverted before deployment. Render remains primary; Tiger is now the secondary semantic index. See `tiger-semantic-2026-10-08.json` and `docs/v2-implementation.md`.

## Database

The authenticated Tiger console showed $1,000 in prepaid Performance Trial
credits, 28 days remaining and no payment method. The user explicitly approved
creating `fieldissue-live` at 0.5 CPU / 2 GiB in Virginia (~$31/month plus usage
storage), saving the credential locally and connecting FieldIssue.

The standard service initially supplied its temporary self-signed certificate.
After issuance completed, the native `pg` client connected with
`rejectUnauthorized: true` and hostname verification. Nothing disabled TLS
verification. PostGIS, pgvector and all four migrations passed; see
[tiger-live-2026-10-08.json](tiger-live-2026-10-08.json).

All five issue statuses were queried through the existing authenticated hosted
API before the connection change. There were no existing reports to migrate.
The old Render database is retained as a rollback source. Credentials remain in
ignored 0600 files. Render environment variables are configured for Tiger;
hosted acceptance will be appended after deployment.

## Product and training data

The landing page now has a native CSS scroll timeline with Observe, Revisit,
Compare and Confirm chapters, a pinned visual, camera framing, arriving records
and a progress line. The illustration is explicitly separated from field
evidence. Unsupported browsers, reduced motion and very short viewports receive
a static sequence. No animation package, scroll listener or continuous JS loop
was added. Desktop and narrow mobile layouts were checked in the browser.

The dashboard can record explicit human reviews of eligible chronological
revisits and export both-class CSV for TabPFN. Predictor snapshots precede the
new observation/comparison; old, future or fixture history cannot be silently
turned into training data. Existing labels are still absent. A working collection
path is not a live trained predictor. See [review contract](../revisit-reviews.md).

## Independent review and checks

Actual Claude Opus reviewed the diff and repository context. Its valid findings
led to stricter snapshot timing, fixture-history rejection, error responses
without CSV download headers, a separately collapsed Gemma suggestion, and
responsive scene sizing. The suggested missing-auth finding was checked against
the existing global token middleware: an unauthenticated review returns 401.
Individual reviewer identity is not implemented in this shared-token demo.

Four new integration tests passed against an isolated schema on the real Tiger
service, covering snapshot timing, backdated exclusion, auth, human assertion,
immutable issue status, audit correction, both-class CSV, error headers and
fixture-history rejection. Type checks and build passed. The earlier local unit
run passed 68 tests with database tests skipped; this is separate from live Tiger
and the full Docker CI gate.

## Remaining external prerequisites

ElevenLabs sign-in in the in-app browser reported “Unable to sign in.” Real audio
cannot be claimed until authentication, a free-quota API key and an official
voice are configured and a real speech response is tested. The user was offered
a local ignored env-file path or Chrome login as recovery.

TabPFN needs genuine reviewed field history and licensed official model/runtime
capacity. No labels were fabricated. S3 is still a configurable adapter; current
media storage is durable PostgreSQL. Tinker remains the previously verified
credit-funded offline experiment, separate from live Gemma vision.
