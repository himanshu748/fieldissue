# Official PostgreSQL Debian image already configures the signed PGDG repository.
# Both extensions are installed for the SAME server major; a PostGIS-only image
# does not implicitly supply pgvector.
FROM postgres:17-bookworm
RUN set -eux; \
    test "$PG_MAJOR" = 17; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
      postgresql-17-postgis-3 \
      postgresql-17-postgis-3-scripts \
      postgresql-17-pgvector; \
    test -f /usr/share/postgresql/17/extension/postgis.control; \
    test -f /usr/share/postgresql/17/extension/vector.control; \
    test -f /usr/lib/postgresql/17/lib/vector.so; \
    rm -rf /var/lib/apt/lists/*
