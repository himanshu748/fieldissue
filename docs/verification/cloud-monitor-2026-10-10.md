# Cloud demo monitoring

The `Demo availability` GitHub Actions workflow runs on standard public-repository runners without a laptop or Codex session. These runners are [free for public repositories](https://docs.github.com/en/actions/concepts/billing-and-usage).

- Every five minutes, offset from the top of the hour, on 10–19 October.
- Only GET `https://fieldissue-demo.onrender.com/health` and `/ready`.
- Require HTTP 200 and the expected `ok` / `ready` JSON status.
- At most two attempts per endpoint, 25 seconds per request and a five-second retry delay. A persistent failure marks the Actions run failed; GitHub notification delivery depends on the account's Actions notification preferences.
- No credentials, AI inference, report changes, service configuration changes, deployment, or payment changes.
- Before every request, enforce the absolute cutoff: **19 October 2026 at 06:59 UTC / 12:29 PM IST**. A run at/after this time makes no probes and disables this workflow using its temporary GitHub token. The cutoff also prevents requests in later years if disabling fails.
- Application code freezes **12 October 2026 at 06:59 UTC / 12:29 PM IST**; scheduled checks continue without code changes.

The workflow is manually dispatchable for verification. Pull requests run only isolated monitor tests. After the first successful cloud probe, pause the previous Codex heartbeat to avoid duplicate monitoring.

GitHub [scheduled workflows can be delayed or dropped under load](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule). This provides best-effort availability checks, not guaranteed uptime. Failures require inspection; this workflow deliberately does not attempt automatic recovery or spend money.
