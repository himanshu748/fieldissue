# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN npm ci

# Complete local tooling, including TypeScript migration and integration tests.
FROM dependencies AS development
COPY --chown=node:node apps/api ./apps/api
COPY --chown=node:node packages/shared ./packages/shared
COPY --chown=node:node db ./db
COPY --chown=node:node scripts ./scripts
RUN npm run build && mkdir -p /app/.media && chown -R node:node /app
USER node
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM development AS build
RUN npm run build

FROM dependencies AS production-dependencies
RUN npm prune --omit=dev

# Test-only Python image. Production intelligence has its own Dockerfile.
FROM python:3.12-slim-bookworm AS intelligence-tooling
COPY --from=ghcr.io/astral-sh/uv:0.12.19 /uv /uvx /bin/
WORKDIR /app
ENV UV_LINK_MODE=copy UV_PYTHON_DOWNLOADS=never
COPY services/intelligence/pyproject.toml services/intelligence/uv.lock ./
COPY services/intelligence/src ./src
COPY services/intelligence/tests ./tests
COPY services/intelligence/training ./training
RUN uv sync --frozen --extra dev && useradd --create-home --uid 10001 fieldissue \
    && chown -R fieldissue:fieldissue /app
USER fieldissue
CMD ["uv", "run", "--frozen", "--extra", "dev", "pytest"]

# Default build target: production API, without tsx or test dependencies.
FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=production-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./package.json
COPY --chown=node:node apps/api/package.json ./apps/api/package.json
COPY --chown=node:node packages/shared/package.json ./packages/shared/package.json
COPY --from=build --chown=node:node /app/apps/api/dist ./apps/api/dist
COPY --from=build --chown=node:node /app/apps/api/public ./apps/api/public
COPY --from=build --chown=node:node /app/packages/shared/dist ./packages/shared/dist
COPY --chown=node:node db ./db
RUN mkdir -p /app/.media && chown node:node /app/.media
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/health',{signal:AbortSignal.timeout(4000)}).then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "apps/api/dist/index.js"]
