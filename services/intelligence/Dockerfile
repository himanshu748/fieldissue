FROM python:3.12-slim
COPY --from=ghcr.io/astral-sh/uv:0.12.19 /uv /uvx /bin/
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
ARG INSTALL_TABPFN=false
COPY pyproject.toml uv.lock ./
COPY src ./src
RUN if [ "$INSTALL_TABPFN" = "true" ]; then uv sync --frozen --no-dev --extra tabpfn; else uv sync --frozen --no-dev; fi \
    && useradd --create-home --uid 10001 fieldissue
USER fieldissue
EXPOSE 8000
CMD ["/app/.venv/bin/python", "-m", "uvicorn", "fieldissue_intelligence.app:app", "--host", "0.0.0.0", "--port", "8000"]
