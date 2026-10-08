# Data removal and retention

This is an operator-managed, shared-token demo. Possessing a workspace token does
not grant permission to erase everyone's evidence. Removal requires database
operator access; there is deliberately no shared-token DELETE endpoint.

Run with the deployment's private environment (never paste credentials):

```sh
node apps/api/dist/retention.js preview
node apps/api/dist/retention.js remove FI-000123 --confirm=FI-000123
```

The first command is read-only. The second permanently removes that complete
issue, including observations, comparisons, decisions, idempotency records,
predictions and model-lab results. It queues photo/audio and secondary Tiger-index
cleanup in the same transaction. Cleanup retries on failure. The command supports
the current PostgreSQL media profile; the server worker also supports S3.

`DATA_RETENTION_DAYS=0` disables automatic expiry (the default). A positive value
from 1 to 3650 deletes records that have not been updated for that many days.
The worker checks every minute, in batches of 20, and rechecks expiry under a row
lock to preserve concurrently updated evidence. Deploy a policy deliberately;
changing this value is not a database backup or a provider billing control.
The active policy is shown before submission and on the privacy page.

No expiry policy was enabled merely by this code update. Existing reports stay
until the operator explicitly removes them or configures an expiry policy.
Provider backups and external inference logs follow those providers' retention
policies; deleting FieldIssue records cannot promise deletion of provider backups.

Browser drafts expire on access after 24 hours and are scoped to session storage.
Locking synchronously clears drafts, remembered locations and walk data. The UI
warns if storage is unavailable or a photo exceeds the 2 MiB draft-storage ceiling;
current inputs are still kept in memory. Nothing is submitted automatically.

Share summaries use a separate allowlist: issue ID, status, category, severity,
and coordinates rounded to 0.01 degrees. They omit photos, free text and place
addresses. The summary endpoint remains authenticated; copying a preview never
publishes the issue or grants access to the exact location.
