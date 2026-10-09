-- Lifetime reservation, not a daily limit: retries and failures consume budget.
-- Independent of reports so deleting an issue cannot replenish paid calls.
CREATE TABLE integration_allowances (
  provider text PRIMARY KEY,
  units integer NOT NULL CHECK (units >= 0)
);
