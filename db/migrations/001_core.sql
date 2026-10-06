CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TYPE issue_status AS ENUM ('OPEN','ACKNOWLEDGED','IN_PROGRESS','RESOLVED','REJECTED');
CREATE TYPE issue_category AS ENUM ('CLEANLINESS','INFRASTRUCTURE','ACCESSIBILITY','SAFETY','ENVIRONMENT','SIGNAGE','LIGHTING','TRAIL','OTHER');
CREATE TYPE issue_severity AS ENUM ('LOW','MEDIUM','HIGH','CRITICAL');
CREATE SEQUENCE issue_public_seq;
CREATE TABLE issues (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 public_id TEXT UNIQUE NOT NULL DEFAULT ('FI-' || lpad(nextval('issue_public_seq')::text,6,'0')),
 title TEXT NOT NULL CHECK(length(title) BETWEEN 1 AND 200),description TEXT NOT NULL DEFAULT '',
 category issue_category NOT NULL,severity issue_severity NOT NULL,status issue_status NOT NULL DEFAULT 'OPEN',
 latitude DOUBLE PRECISION NOT NULL CHECK(latitude BETWEEN -90 AND 90),longitude DOUBLE PRECISION NOT NULL CHECK(longitude BETWEEN -180 AND 180),
 geom geometry(Point,4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude,latitude),4326)) STORED,
 reporter_id UUID,created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),resolved_at TIMESTAMPTZ,
 CHECK ((status='RESOLVED')=(resolved_at IS NOT NULL))
);
CREATE TABLE observations (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
 note TEXT NOT NULL DEFAULT '',media_url TEXT NOT NULL,storage_key TEXT NOT NULL,mime_type TEXT NOT NULL,
 latitude DOUBLE PRECISION NOT NULL CHECK(latitude BETWEEN -90 AND 90),longitude DOUBLE PRECISION NOT NULL CHECK(longitude BETWEEN -180 AND 180),
 captured_at TIMESTAMPTZ NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT now(),ai_analysis JSONB NOT NULL DEFAULT '{}'::jsonb,
 UNIQUE(id,issue_id)
);
CREATE TABLE issue_events (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
 event_type TEXT NOT NULL CHECK(event_type IN ('ISSUE_CREATED','OBSERVATION_ADDED','CLASSIFICATION_UPDATED','STATUS_CHANGED','DIFF_GENERATED','ISSUE_RESOLVED')),
 payload JSONB NOT NULL DEFAULT '{}'::jsonb,created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);
CREATE TABLE evidence_diffs (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
 before_observation_id UUID NOT NULL,after_observation_id UUID NOT NULL,summary TEXT NOT NULL,
 removed JSONB NOT NULL CHECK(jsonb_typeof(removed)='array'),added JSONB NOT NULL CHECK(jsonb_typeof(added)='array'),unchanged JSONB NOT NULL CHECK(jsonb_typeof(unchanged)='array'),
 recommended_status issue_status NOT NULL,confidence DOUBLE PRECISION NOT NULL CHECK(confidence BETWEEN 0 AND 1),model TEXT NOT NULL,model_version TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 FOREIGN KEY(before_observation_id,issue_id) REFERENCES observations(id,issue_id),FOREIGN KEY(after_observation_id,issue_id) REFERENCES observations(id,issue_id),
 CHECK(before_observation_id<>after_observation_id),UNIQUE(issue_id,before_observation_id,after_observation_id)
);
CREATE TABLE revisit_predictions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
 probability_changed DOUBLE PRECISION NOT NULL CHECK(probability_changed BETWEEN 0 AND 1),priority_score DOUBLE PRECISION NOT NULL CHECK(priority_score BETWEEN 0 AND 1),features JSONB NOT NULL,model_version TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE idempotency_keys (key TEXT PRIMARY KEY,request_hash TEXT NOT NULL,issue_id UUID NOT NULL REFERENCES issues(id),created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE audio_summaries (cache_key TEXT PRIMARY KEY,issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,media_url TEXT NOT NULL,storage_key TEXT NOT NULL,voice_id TEXT NOT NULL,model TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX issues_status_idx ON issues(status);
CREATE INDEX issues_category_idx ON issues(category);
CREATE INDEX issues_created_idx ON issues(created_at DESC,id DESC);
CREATE INDEX issues_severity_idx ON issues(severity);
CREATE INDEX issues_geom_idx ON issues USING GIST(geom);
CREATE INDEX issues_geography_idx ON issues USING GIST((geom::geography));
CREATE INDEX events_timeline_idx ON issue_events(issue_id,created_at,id);
CREATE INDEX observations_issue_idx ON observations(issue_id,captured_at,created_at,id);
CREATE INDEX diffs_issue_idx ON evidence_diffs(issue_id,created_at DESC);
CREATE INDEX predictions_issue_idx ON revisit_predictions(issue_id,created_at DESC);
