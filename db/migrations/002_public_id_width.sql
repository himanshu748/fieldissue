CREATE FUNCTION next_issue_public_id() RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE n TEXT := nextval('issue_public_seq')::text;
BEGIN
 RETURN 'FI-' || lpad(n,greatest(6,length(n)),'0');
END;
$$;
ALTER TABLE issues ALTER COLUMN public_id SET DEFAULT next_issue_public_id();
