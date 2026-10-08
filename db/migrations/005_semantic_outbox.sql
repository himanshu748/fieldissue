-- The primary database records work atomically. It never calls the secondary index.
CREATE TABLE semantic_index_jobs (
  issue_id uuid PRIMARY KEY REFERENCES issues(id) ON DELETE CASCADE,
  version bigint NOT NULL DEFAULT 1,
  completed_version bigint NOT NULL DEFAULT 0,
  attempts integer NOT NULL DEFAULT 0,
  available_at timestamptz NOT NULL DEFAULT now(),
  locked_until timestamptz NOT NULL DEFAULT '-infinity',
  lease_token uuid,
  last_error text
);
CREATE INDEX semantic_jobs_pending ON semantic_index_jobs(available_at)
  WHERE completed_version < version;
CREATE FUNCTION enqueue_semantic_issue() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE target_id uuid;
BEGIN
  IF TG_TABLE_NAME='issues' THEN target_id:=NEW.id; ELSE target_id:=NEW.issue_id; END IF;
  INSERT INTO semantic_index_jobs(issue_id) VALUES(target_id)
  ON CONFLICT(issue_id) DO UPDATE SET version=semantic_index_jobs.version+1,
    available_at=now(),attempts=0,last_error=NULL;
  RETURN NEW;
END; $$;
CREATE TRIGGER semantic_issue_changed AFTER INSERT OR UPDATE OF title,description,category,severity,status ON issues
  FOR EACH ROW EXECUTE FUNCTION enqueue_semantic_issue();
CREATE TRIGGER semantic_observation_added AFTER INSERT ON observations
  FOR EACH ROW EXECUTE FUNCTION enqueue_semantic_issue();
INSERT INTO semantic_index_jobs(issue_id) SELECT id FROM issues ON CONFLICT DO NOTHING;
