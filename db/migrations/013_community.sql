CREATE TABLE accounts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), username text UNIQUE NOT NULL CHECK(username ~ '^[a-z0-9_]{3,32}$'),
 password_hash text NOT NULL, recovery_hash text NOT NULL,
 guest_id uuid UNIQUE NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE account_guest_links (guest_id uuid PRIMARY KEY, account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE);
CREATE TABLE account_sessions (
 token_hash text PRIMARY KEY, account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
 expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX account_sessions_account ON account_sessions(account_id);
CREATE TABLE auth_failures (username_hash text PRIMARY KEY, failures integer NOT NULL, reset_at timestamptz NOT NULL);
CREATE TABLE auth_attempts (bucket text PRIMARY KEY, attempts integer NOT NULL DEFAULT 0);
CREATE TABLE communities (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL CHECK(length(name) BETWEEN 1 AND 80),
 area text NOT NULL DEFAULT '' CHECK(length(area)<=160), owner_id uuid NOT NULL REFERENCES accounts(id),created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE community_members (
 community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
 account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE, joined_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(community_id,account_id)
);
CREATE TABLE community_invites (
 token_hash text PRIMARY KEY, community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
 expires_at timestamptz NOT NULL, used_by uuid REFERENCES accounts(id), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE community_issues (
 community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
 issue_id uuid NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
 assignee_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
 PRIMARY KEY(community_id,issue_id)
);
CREATE TABLE resolution_proposals (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),community_id uuid NOT NULL,issue_id uuid NOT NULL,
 proposer_id uuid NOT NULL REFERENCES accounts(id),observation_id uuid NOT NULL,
 note text NOT NULL CHECK(length(note) BETWEEN 1 AND 1000),status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','resolved','rejected','stale')),
 created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(community_id,issue_id) REFERENCES community_issues(community_id,issue_id) ON DELETE CASCADE,
 FOREIGN KEY(observation_id,issue_id) REFERENCES observations(id,issue_id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX one_pending_proposal ON resolution_proposals(community_id,issue_id) WHERE status='pending';
CREATE TABLE resolution_votes (
 proposal_id uuid NOT NULL REFERENCES resolution_proposals(id) ON DELETE CASCADE,
 account_id uuid NOT NULL REFERENCES accounts(id),approve boolean NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(proposal_id,account_id)
);
CREATE TABLE saved_walks (
 account_id uuid PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
 revision integer NOT NULL DEFAULT 1, data jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE account_notifications (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
 issue_id uuid REFERENCES issues(id) ON DELETE CASCADE,message text NOT NULL CHECK(length(message)<=240),
 due_at timestamptz NOT NULL DEFAULT now(),read_at timestamptz,created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notification_due ON account_notifications(account_id,due_at DESC);
CREATE TABLE issue_subscriptions (
 account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,issue_id uuid NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
 PRIMARY KEY(account_id,issue_id)
);
CREATE FUNCTION notify_issue_subscribers() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.event_type IN ('OBSERVATION_ADDED','STATUS_CHANGED') THEN
  INSERT INTO account_notifications(account_id,issue_id,message)
  SELECT s.account_id,NEW.issue_id,CASE WHEN NEW.event_type='OBSERVATION_ADDED' THEN 'A new observation was added.' ELSE 'The issue status changed.' END
  FROM issue_subscriptions s WHERE s.issue_id=NEW.issue_id;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER issue_subscription_updates AFTER INSERT ON issue_events FOR EACH ROW EXECUTE FUNCTION notify_issue_subscribers();

CREATE FUNCTION stale_issue_reviews() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.status<>OLD.status THEN
  UPDATE resolution_proposals SET status='stale' WHERE issue_id=NEW.id AND status='pending';
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER invalidate_status_reviews AFTER UPDATE OF status ON issues FOR EACH ROW EXECUTE FUNCTION stale_issue_reviews();
