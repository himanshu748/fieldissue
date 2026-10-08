-- Capture predictors before new evidence or its AI comparison is persisted.
ALTER TABLE observations ADD COLUMN revisit_features JSONB;
ALTER TABLE observations ADD COLUMN previous_observation_id UUID;
ALTER TABLE observations ADD CONSTRAINT observation_previous_same_issue
  FOREIGN KEY(previous_observation_id,issue_id) REFERENCES observations(id,issue_id);
CREATE TABLE revisit_reviews (
  after_observation_id UUID PRIMARY KEY REFERENCES observations(id) ON DELETE CASCADE,
  before_observation_id UUID NOT NULL REFERENCES observations(id),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  material_change BOOLEAN NOT NULL,
  note TEXT NOT NULL CHECK(length(note) BETWEEN 10 AND 2000),
  evidence_is_genuine BOOLEAN NOT NULL CHECK(evidence_is_genuine),
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  FOREIGN KEY(before_observation_id,issue_id) REFERENCES observations(id,issue_id),
  FOREIGN KEY(after_observation_id,issue_id) REFERENCES observations(id,issue_id)
);
ALTER TABLE issue_events DROP CONSTRAINT issue_events_event_type_check;
ALTER TABLE issue_events ADD CONSTRAINT issue_events_event_type_check CHECK(event_type IN (
  'ISSUE_CREATED','OBSERVATION_ADDED','CLASSIFICATION_UPDATED','STATUS_CHANGED',
  'DIFF_GENERATED','ISSUE_RESOLVED','REVISIT_REVIEWED'));
