-- Network speech generation runs outside database transactions.
CREATE TABLE audio_generation_leases (
  cache_key TEXT PRIMARY KEY,
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  owner UUID NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX audio_generation_leases_issue ON audio_generation_leases(issue_id);
