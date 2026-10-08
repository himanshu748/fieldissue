-- Removal commits the primary record deletion and durable cleanup work together.
-- No report text, precise location or photo bytes enter this queue.
CREATE TABLE removal_jobs (
 issue_id uuid PRIMARY KEY,
 storage_keys text[] NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 attempts integer NOT NULL DEFAULT 0,
 available_at timestamptz NOT NULL DEFAULT now(),
 last_error text
);
ALTER TABLE idempotency_keys DROP CONSTRAINT idempotency_keys_issue_id_fkey;
ALTER TABLE idempotency_keys ADD CONSTRAINT idempotency_keys_issue_id_fkey
 FOREIGN KEY(issue_id) REFERENCES issues(id) ON DELETE CASCADE;
