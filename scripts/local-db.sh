#!/usr/bin/env bash
# A real, user-space PostgreSQL 17 + PostGIS + pgvector development cluster.
# No Docker, root install, system configuration change, or public listener.
#
# Usage:
#   scripts/local-db.sh install
#   scripts/local-db.sh run npm run migrate
#   scripts/local-db.sh run bash -lc 'npm run migrate && npm run seed && npm test'
#   scripts/local-db.sh verify
#   scripts/local-db.sh psql -c 'SELECT PostGIS_Full_Version();'
#
# This execution workspace isolates localhost and PIDs per shell command. Run
# the database, API, worker, and E2E clients inside ONE `run` invocation. A
# standalone background server is not reachable from a subsequent tool call.
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ROOT="$REPO/.local"
PREFIX="$ROOT/pg"
BIN="$PREFIX/usr/lib/postgresql/17/bin"
DATA="$ROOT/data"
PORT="${FIELDISSUE_PGPORT:-55432}"
export PATH="$BIN:$PATH"
export LD_LIBRARY_PATH="$PREFIX/usr/lib/x86_64-linux-gnu${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
export DATABASE_URL="postgresql://fieldissue@127.0.0.1:$PORT/fieldissue"

install_packages() {
  if [[ -x "$BIN/postgres" && -f "$BIN/../lib/vector.so" && -f "$BIN/../lib/postgis-3.so" ]]; then
    return
  fi
  [[ "$(uname -m)" == x86_64 ]] || { echo 'This local package bootstrap requires Linux x86_64' >&2; return 1; }
  command -v dpkg-deb >/dev/null
  [[ -x /usr/bin/apt-get && -f /usr/share/keyrings/debian-archive-keyring.gpg ]] || {
    echo 'Debian apt and archive signing key are required; use the Docker setup on other systems' >&2
    return 1
  }
  mkdir -p "$ROOT/apt/lists/partial" "$ROOT/apt/archives/partial" "$ROOT/packages" "$PREFIX"
  printf '%s\n' 'deb [signed-by=/usr/share/keyrings/debian-archive-keyring.gpg] https://deb.debian.org/debian trixie main' > "$ROOT/apt/sources.list"
  cat > "$ROOT/apt/apt.conf" <<EOF
Dir::Etc::parts "-";
Dir::Etc::sourcelist "$ROOT/apt/sources.list";
Dir::Etc::sourceparts "-";
Dir::State::lists "$ROOT/apt/lists";
Dir::Cache::archives "$ROOT/apt/archives";
Dir::State::status "$ROOT/apt/status";
Dir::Cache::pkgcache "$ROOT/apt/pkgcache.bin";
Dir::Cache::srcpkgcache "$ROOT/apt/srcpkgcache.bin";
APT::Sandbox::User "$(id -un)";
Acquire::Retries "3";
EOF
  touch "$ROOT/apt/status"
  APT_CONFIG="$ROOT/apt/apt.conf" /usr/bin/apt-get update
  (
    cd "$ROOT/packages"
    APT_CONFIG="$ROOT/apt/apt.conf" /usr/bin/apt-get download \
      postgresql-17 postgresql-client-17 libpq5 \
      postgresql-17-postgis-3 postgresql-17-postgis-3-scripts \
      postgresql-17-pgvector libsfcgal2 libprotobuf-c1
    sha256sum ./*.deb > SHA256SUMS.local
    for package in ./*.deb; do dpkg-deb -x "$package" "$PREFIX"; done
  )
}

initialize() {
  install_packages
  local extension_dir="$PREFIX/usr/share/postgresql/17/extension"
  # Debian normally provides this name through update-alternatives. Extracting
  # packages without running root maintainer scripts requires the local link.
  ln -sf postgis-3.control "$extension_dir/postgis.control"
  if [[ ! -f "$DATA/PG_VERSION" ]]; then
    "$BIN/initdb" -D "$DATA" -U fieldissue --encoding=UTF8 --locale=C.UTF-8 --auth=trust
    cat >> "$DATA/postgresql.conf" <<EOF
listen_addresses = '127.0.0.1'
port = $PORT
unix_socket_directories = ''
timezone = 'UTC'
log_timezone = 'UTC'
jit = off
EOF
  fi
}

run_with_database() {
  mkdir -p "$ROOT"
  # Serialize this shared data directory, including across tool namespaces.
  exec 9>"$ROOT/cluster.lock"
  flock 9
  initialize
  if [[ -f "$DATA/postmaster.pid" ]]; then
    local previous_pid previous_comm=''
    previous_pid="$(head -n 1 "$DATA/postmaster.pid")"
    if [[ -r "/proc/$previous_pid/comm" ]]; then
      previous_comm="$(cat "/proc/$previous_pid/comm")"
    fi
    if [[ "$previous_comm" == postgres ]]; then
      echo "An existing PostgreSQL process owns $DATA; stop it before running this isolated wrapper" >&2
      return 1
    fi
    # A previous command's PID namespace has ended. No wrapper can still own
    # the cluster because this process holds the exclusive cluster lock.
    rm -f "$DATA/postmaster.pid"
  fi
  "$BIN/pg_ctl" -D "$DATA" -l "$ROOT/postgres.log" -o "-p $PORT" -w start
  trap '"$BIN/pg_ctl" -D "$DATA" -m fast -w stop >/dev/null 2>&1 || true' EXIT
  if [[ "$("$BIN/psql" "postgresql://fieldissue@127.0.0.1:$PORT/postgres" -At -c "SELECT 1 FROM pg_database WHERE datname = 'fieldissue'")" != 1 ]]; then
    "$BIN/createdb" -h 127.0.0.1 -p "$PORT" -U fieldissue fieldissue
  fi
  "$BIN/psql" "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c 'CREATE EXTENSION IF NOT EXISTS postgis; CREATE EXTENSION IF NOT EXISTS vector;'
  "$@"
}

case "${1:-verify}" in
  install)
    initialize
    "$BIN/postgres" --version
    ;;
  run)
    shift
    [[ $# -gt 0 ]] || { echo 'Usage: scripts/local-db.sh run <command> [args...]' >&2; exit 2; }
    run_with_database "$@"
    ;;
  psql)
    shift
    run_with_database "$BIN/psql" "$DATABASE_URL" "$@"
    ;;
  verify)
    run_with_database "$BIN/psql" "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
SELECT version();
SELECT extname, extversion FROM pg_extension ORDER BY extname;
SELECT current_database(), inet_server_addr(), inet_server_port();
SELECT PostGIS_Full_Version();
SELECT '[1,2,3]'::vector <-> '[1,2,4]'::vector AS vector_distance;
SELECT ST_Distance(
  ST_SetSRID(ST_MakePoint(77.5946,12.9716),4326)::geography,
  ST_SetSRID(ST_MakePoint(77.5946,12.9726),4326)::geography
) AS meters;
CREATE TEMP TABLE local_vector_smoke (id integer, embedding vector(3));
INSERT INTO local_vector_smoke VALUES (1, '[1,2,3]'), (2, '[2,3,4]');
CREATE INDEX ON local_vector_smoke USING hnsw (embedding vector_cosine_ops);
SELECT id FROM local_vector_smoke ORDER BY embedding <=> '[1,2,3]'::vector LIMIT 1;
SQL
    ;;
  url)
    printf '%s\n' "$DATABASE_URL"
    ;;
  *)
    echo 'Usage: scripts/local-db.sh {install|run <command>|psql [args...]|verify|url}' >&2
    exit 2
    ;;
esac
