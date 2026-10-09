# Public guest access review — 9 October 2026

Independent source review was performed with the local Claude CLI using `--model opus` and tools disabled. No credentials were supplied to the reviewer. This was a source review, not independent runtime testing.

The reviewer found that nearby-issue feature counts included private reports. Public issues now count only public neighbors, including stored revisit features. The database regression suite checks the feature calculation and public detail/observation responses with a private report at the same coordinates.

The reviewer also noted a conditional fail-open construction path when no operator token was supplied. Configuration already rejected that combination; `createApp` now independently rejects it before serving requests. A regression test checks that construction fails.

Other reviewed boundaries included signed cookie expiry, same-origin writes, owner-only resolution and reopening, visibility filtering, private media, and guest-scoped idempotency. Browser ownership is not personal identity. Existing private reports are not published by this change.
