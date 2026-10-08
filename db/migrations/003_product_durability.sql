-- Bounded durable media for small deployments. S3 remains the scalable option.
CREATE TABLE media_objects (
  storage_key TEXT PRIMARY KEY,
  mime_type TEXT NOT NULL,
  bytes BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE provider_allowances (
  day DATE PRIMARY KEY,
  units INTEGER NOT NULL CHECK (units >= 0)
);
CREATE TABLE observation_requests (
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  observation_id UUID NOT NULL REFERENCES observations(id) ON DELETE CASCADE,
  PRIMARY KEY (issue_id, key)
);
ALTER TABLE issues ADD COLUMN place_context JSONB;
ALTER TABLE observations ADD COLUMN location_source TEXT NOT NULL DEFAULT 'unspecified'
  CHECK (location_source IN ('device','manual','inherited','unspecified'));
ALTER TABLE observations ADD COLUMN capture_time_source TEXT NOT NULL DEFAULT 'unspecified'
  CHECK (capture_time_source IN ('user','upload','unspecified'));
