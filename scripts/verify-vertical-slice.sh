#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
export TEST_DATABASE_URL="${TEST_DATABASE_URL:-$DATABASE_URL}" AI_MOCK_MODE=true NODE_ENV=development ENVIRONMENT=development INTERNAL_SERVICE_TOKEN=development-only-change-me
export PORT=3000 INTELLIGENCE_URL=http://127.0.0.1:8000 MEDIA_BASE_URL=http://127.0.0.1:3000/media
npm run migrate
npm test
services/intelligence/.venv/bin/python -m pytest services/intelligence/tests -q
PYTHONPATH=services/intelligence/src services/intelligence/.venv/bin/python -m uvicorn fieldissue_intelligence.app:app --host 127.0.0.1 --port 8000 > /tmp/fieldissue-intelligence.log 2>&1 & intelligence_pid=$!
node --import tsx apps/api/src/index.ts > /tmp/fieldissue-api.log 2>&1 & api_pid=$!
trap 'kill "$api_pid" "$intelligence_pid" 2>/dev/null || true' EXIT
node scripts/e2e.mjs
