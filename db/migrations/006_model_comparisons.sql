CREATE TABLE model_comparisons (
  observation_id uuid NOT NULL REFERENCES observations(id) ON DELETE CASCADE,
  model text NOT NULL,
  prompt_version text NOT NULL,
  status text NOT NULL CHECK(status IN ('pending','complete','failed')),
  result jsonb,
  error_code text,
  consented_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  lease_token uuid,
  PRIMARY KEY(observation_id,model,prompt_version)
);
