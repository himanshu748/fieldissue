-- Extend the existing observation, comparison and event ledger; never delete evidence.
ALTER TABLE issues ADD COLUMN evidence_revision integer NOT NULL DEFAULT 0;
ALTER TABLE observations ADD COLUMN exclusion_type text
 CHECK (exclusion_type IN ('WRONG_LOCATION','WRONG_PHOTOGRAPH','NOT_SUITABLE'));
ALTER TABLE observations ADD COLUMN correction_reason text NOT NULL DEFAULT '';
ALTER TABLE observations ADD COLUMN corrected_at timestamptz;
ALTER TABLE evidence_diffs ADD COLUMN outcome text NOT NULL DEFAULT 'INSUFFICIENT_EVIDENCE'
 CHECK (outcome IN ('UNCHANGED','CHANGED','NOT_COMPARABLE','INSUFFICIENT_EVIDENCE'));
ALTER TABLE evidence_diffs ADD COLUMN comparability_reason text NOT NULL DEFAULT 'Legacy comparison has no explicit comparability assessment. Recompare eligible evidence.';
ALTER TABLE evidence_diffs ADD COLUMN same_subject_evidence jsonb NOT NULL DEFAULT '[]';
ALTER TABLE evidence_diffs ADD COLUMN selection_mode text NOT NULL DEFAULT 'manual'
 CHECK (selection_mode IN ('manual','latest_eligible','original_latest','identity'));
ALTER TABLE evidence_diffs ADD COLUMN evidence_revision integer NOT NULL DEFAULT 0;
ALTER TABLE evidence_diffs ADD COLUMN superseded_at timestamptz;
ALTER TABLE evidence_diffs ADD COLUMN superseded_reason text;
-- Preserve all old model fields verbatim, but never serve unassessed legacy claims as current evidence.
UPDATE evidence_diffs SET superseded_at=clock_timestamp(),superseded_reason='Legacy comparison requires an explicit comparability assessment';
DO $$ DECLARE constraint_name text; BEGIN
 SELECT conname INTO constraint_name FROM pg_constraint
 WHERE conrelid='evidence_diffs'::regclass AND contype='u';
 EXECUTE format('ALTER TABLE evidence_diffs DROP CONSTRAINT %I',constraint_name);
END $$;
CREATE UNIQUE INDEX evidence_diffs_current_pair ON evidence_diffs(issue_id,before_observation_id,after_observation_id) WHERE superseded_at IS NULL;
ALTER TABLE issue_events DROP CONSTRAINT issue_events_event_type_check;
ALTER TABLE issue_events ADD CONSTRAINT issue_events_event_type_check CHECK(event_type IN (
 'ISSUE_CREATED','OBSERVATION_ADDED','CLASSIFICATION_UPDATED','STATUS_CHANGED',
 'DIFF_GENERATED','ISSUE_RESOLVED','REVISIT_REVIEWED','ISSUE_UPDATED','OBSERVATION_CORRECTED','COMPARISON_SUPERSEDED'));

INSERT INTO issue_events(issue_id,event_type,payload)
SELECT issue_id,'COMPARISON_SUPERSEDED',jsonb_build_object('diffId',id,'reason',superseded_reason,'actor',jsonb_build_object('kind','migration','id','014_observation_corrections'))
FROM evidence_diffs WHERE superseded_reason='Legacy comparison requires an explicit comparability assessment';
