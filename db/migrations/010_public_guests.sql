-- Existing evidence stays private. Only explicit guest publications are public.
ALTER TABLE issues ADD COLUMN is_public boolean NOT NULL DEFAULT false;
ALTER TABLE issues ADD COLUMN guest_owner uuid;
CREATE INDEX issues_public_created ON issues(created_at DESC,id DESC) WHERE is_public;
CREATE TABLE guest_allowances (
 day date NOT NULL, guest_id uuid NOT NULL, writes integer NOT NULL DEFAULT 0,
 uploads integer NOT NULL DEFAULT 0, PRIMARY KEY(day,guest_id)
);
