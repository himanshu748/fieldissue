#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [[ -z "${TEST_DATABASE_URL:-}" ]]; then
  export TEST_DATABASE_URL="$(node --input-type=module -e 'const u=new URL(process.env.DATABASE_URL);u.pathname="/fieldissue_test";console.log(u.href)')"
  node --input-type=module <<'JS'
import {Pool} from 'pg';
const pool=new Pool({connectionString:process.env.DATABASE_URL});
try {if(!(await pool.query("SELECT 1 FROM pg_database WHERE datname='fieldissue_test'")).rowCount)await pool.query('CREATE DATABASE fieldissue_test');}finally{await pool.end();}
JS
fi
node --input-type=module <<'JS'
const main=new URL(process.env.DATABASE_URL),test=new URL(process.env.TEST_DATABASE_URL);
if(main.pathname===test.pathname){console.error('Use a different disposable test database name');process.exit(2);}
JS
export AI_MOCK_MODE=true NODE_ENV=development ENVIRONMENT=development INTERNAL_SERVICE_TOKEN=development-only-change-me
export PORT=3000 INTELLIGENCE_URL=http://127.0.0.1:8000 MEDIA_BASE_URL=http://127.0.0.1:3000/media
npm run migrate
npm run build
npm test
services/intelligence/.venv/bin/python -m pytest services/intelligence/tests -q
PYTHONPATH=services/intelligence/src services/intelligence/.venv/bin/python -m uvicorn fieldissue_intelligence.app:app --host 127.0.0.1 --port 8000 > /tmp/fieldissue-intelligence.log 2>&1 & intelligence_pid=$!
node apps/api/dist/index.js > /tmp/fieldissue-api.log 2>&1 & api_pid=$!
trap 'kill "$api_pid" "$intelligence_pid" 2>/dev/null || true' EXIT
node scripts/e2e.mjs
