COMPOSE ?= docker compose

.PHONY: dev stop logs test lint build migrate seed seed-media db-shell verify-db help

.env:
	cp .env.example .env

dev: .env
	$(COMPOSE) up --build --wait api
	$(MAKE) seed
	@echo 'API is ready on the loopback PORT configured in .env (default 3000); use make logs to follow it'

stop:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f api intelligence db

test: .env
	@set -eu; \
	trap '$(COMPOSE) --profile tools rm --stop --force test-db >/dev/null 2>&1 || true' 0; \
	$(COMPOSE) --profile tools up --build --wait test-db; \
	$(COMPOSE) --profile tools run --build --rm api-tests; \
	$(COMPOSE) --profile tools run --build --rm python-tools

lint: .env
	$(COMPOSE) --profile tools run --build --rm --no-deps api-tools npm run lint
	$(COMPOSE) --profile tools run --build --rm python-tools uv run --frozen --extra dev ruff check src tests training

build:
	docker build --target runtime -t fieldissue-api:local .
	docker build -t fieldissue-intelligence:local services/intelligence
	docker build -t fieldissue-db:local db

migrate: .env
	$(COMPOSE) run --build --rm migrate

seed: .env
	$(COMPOSE) --profile tools run --build --rm api-tools sh -c 'node scripts/seed-media.mjs && npm run migrate && npm run seed'

seed-media: .env
	$(COMPOSE) --profile tools run --build --rm --no-deps api-tools node scripts/seed-media.mjs

db-shell: .env
	$(COMPOSE) exec db sh -c 'exec psql -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"'

verify-db: .env
	$(COMPOSE) exec db sh -c 'psql -v ON_ERROR_STOP=1 -U "$$POSTGRES_USER" -d "$$POSTGRES_DB" -c "SELECT extname,extversion FROM pg_extension ORDER BY extname; SELECT PostGIS_Full_Version(); SELECT '\''[1,2,3]'\''::vector <-> '\''[1,2,4]'\''::vector AS vector_distance;"'

help:
	@echo 'make dev | stop | logs | test | lint | build | migrate | seed | seed-media | db-shell | verify-db'
