CREATE TABLE prediction_demo_cache (
  cache_key text PRIMARY KEY,
  status text NOT NULL CHECK(status IN ('pending','complete','failed')),
  result jsonb,
  lease_token uuid NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
