# Live acceptance test

Requires an existing quota allowance, a public control photograph, and a running
FieldIssue deployment. This writes an explicitly synthetic issue and revisit. It
uses real providers and does not delete the resulting audit history. Do not point
it at private field data. No credentials, photos or traces are recorded by default.

Set `FIELDISSUE_LIVE_E2E=1`, `FIELDISSUE_E2E_URL`, `FIELDISSUE_E2E_TOKEN` and
`FIELDISSUE_E2E_PHOTO` through your private environment, then run `npm run test:e2e`.
It is serial, with no automatic retries, to bound inference use. Without opt-in,
the suite skips. Install the Playwright Chromium runtime on the test runner first.

The repeated image is an intentional negative control, not a genuine revisit.
A separate Android Chrome test must use a fresh camera photo, a new revisit photo,
and permission denial/recovery on the physical device. Browser emulation cannot
prove camera, device GPS, thermal, or mobile-network behavior.
