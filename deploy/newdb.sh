#!/usr/bin/env bash
# Create an isolated Postgres role+database for one project on the shared server.
# Usage: sudo bash newdb.sh <project> [password]
# Prints the DATABASE_URL to paste into that project's env file.
set -euo pipefail

PROJECT="${1:?usage: newdb.sh <project> [password]}"
PASSWORD="${2:-$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)}"
DB="${PROJECT}_db"
ROLE="${PROJECT}"

sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${ROLE}') THEN
    CREATE ROLE ${ROLE} LOGIN PASSWORD '${PASSWORD}';
  ELSE
    ALTER ROLE ${ROLE} PASSWORD '${PASSWORD}';
  END IF;
END \$\$;
SQL
sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB}'" | grep -q 1 \
  || sudo -u postgres createdb -O "${ROLE}" "${DB}"
sudo -u postgres psql -d "${DB}" -c "CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;"

# URL-encode the password for the connection string
ENC=$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=""))' "$PASSWORD")
echo
echo "DATABASE_URL=postgresql://${ROLE}:${ENC}@localhost:5432/${DB}"
echo "REDIS_URL=redis://localhost:6379/$(( $(sudo -u postgres psql -tAc "SELECT count(*) FROM pg_database WHERE datname NOT IN ('postgres','template0','template1')") - 1 ))"
echo
echo "^ paste into /etc/<project>/<service>.env"
