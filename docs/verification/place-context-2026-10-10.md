# Lucknow place context diagnosis

At 05:52 UTC on 10 October 2026, two SerpApi HTTP calls were made: one free-account check and one Maps search. The account showed Free Plan, monthly price USD 0 and 218 searches remaining. No further SerpApi calls were made for this audit.

The search used the application's parameters: `engine=google_maps`, `q=landmarks`, `type=search` and zoom 16, centered on FI-000007. It returned HTTP 200, `Success`, no provider error and 20 candidates with coordinates. For the two reports about 35 m apart:

| Report | Candidates within 2000 m | Nearest returned candidate |
| --- | --- | --- |
| FI-000006 | 0 | 2017 m |
| FI-000007 | 0 | 2032 m |

`apps/api/src/place.ts` intentionally rejects results beyond 2000 m because the map center biases the search but does not constrain it. The current null context is consistent with the returned results. This does not prove there are no businesses or named places nearby; the configured landmark search did not verify one within its limit. The original request's full payload was not retained.

Sentry was inspected through the authenticated dashboard. [FIELDISSUE-3](https://himanshu-lj.sentry.io/issues/7780490896/) has one PLACE_CONTEXT_UNAVAILABLE event, `55a065bfc7b84068893437dd76ba5e68`, from 8 October 2026 at 06:53:16 UTC. It predates the real reports from 9 October. No newer occurrence was displayed. The Render error-level log query from 9 October onward returned no entries. Missing historical payloads mean the original lookup cannot be reconstructed conclusively.

No provider parameters or radius were changed. No place context was invented or backfilled. Reports, observations and issue statuses were left unchanged.
