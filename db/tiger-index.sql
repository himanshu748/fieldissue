-- Run only against the secondary Tiger database. Render remains authoritative.
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TABLE IF NOT EXISTS fieldissue_semantic_index (
  issue_id uuid PRIMARY KEY,
  title text NOT NULL,
  document text NOT NULL,
  category text NOT NULL,
  status text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  embedding vector(384) NOT NULL,
  model text NOT NULL,
  model_revision text NOT NULL,
  source_version bigint NOT NULL,
  indexed_at timestamptz NOT NULL DEFAULT now(),
  keywords tsvector GENERATED ALWAYS AS (to_tsvector('english',document)) STORED
);
CREATE INDEX IF NOT EXISTS fieldissue_semantic_keywords ON fieldissue_semantic_index USING gin(keywords);
