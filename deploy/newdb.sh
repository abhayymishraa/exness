#!/usr/bin/env bash
# Create an isolated Postgres role+database for one project on the shared server.
# Usage: sudo bash newdb.sh <project>
# Prints the DATABASE_URL to paste into that project's env file.
set -euo pipefail

PROJECT="${1:?usage: newdb.sh <project>}"
# /+= stripped so the password needs no URL-encoding in the connection string
PASSWORD="$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)"
DB="${PROJECT}_db"
ROLE="${PROJECT}"

# createuser/createdb already no-op on re-run; ALTER sets the password either way
sudo -u postgres createuser "${ROLE}" 2>/dev/null || true
sudo -u postgres psql -qc "ALTER ROLE ${ROLE} LOGIN PASSWORD '${PASSWORD}';"
sudo -u postgres createdb -O "${ROLE}" "${DB}" 2>/dev/null || true
sudo -u postgres psql -qd "${DB}" -c "CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;"

echo
echo "DATABASE_URL=postgresql://${ROLE}:${PASSWORD}@localhost:5432/${DB}"
echo "REDIS_URL=redis://localhost:6379/0   # pick an unused index per project"
echo
echo "^ paste into /etc/<project>/<service>.env"
