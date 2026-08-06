#!/usr/bin/env bash
# Deploy exness to the server. Run from your laptop, from the repo root.
#
#   HOST=1.2.3.4 KEY=~/Desktop/private.key bash deploy/deploy.sh
#
# No image build, no registry, no downtime beyond a service restart.
set -euo pipefail

HOST="${HOST:?set HOST=<server ip>}"
KEY="${KEY:-$HOME/Desktop/private.key}"
USER_="${SSH_USER:-ubuntu}"
PROJECT=exness
SERVICES=(http_server ws price_poller)

SSH_OPTS=(-i "$KEY" -o StrictHostKeyChecking=accept-new)
SSH=(ssh "${SSH_OPTS[@]}" "${USER_}@${HOST}")

echo "==> syncing source"
for s in "${SERVICES[@]}"; do
  rsync -az --delete \
    --exclude node_modules --exclude .env \
    -e "ssh ${SSH_OPTS[*]}" \
    "./${s}/" "${USER_}@${HOST}:/srv/${PROJECT}/${s}/"
done

echo "==> installing deps + migrating"
"${SSH[@]}" bash -euo pipefail <<EOF
  set -a; . /etc/${PROJECT}/${PROJECT}.env; set +a
  # Not --production: price_poller needs the prisma CLI, which is a devDependency.
  for s in ${SERVICES[*]}; do
    cd /srv/${PROJECT}/\$s && bun install --frozen-lockfile
  done
  cd /srv/${PROJECT}/price_poller
  bunx prisma migrate deploy
  bun seed.ts
EOF

echo "==> restarting services"
"${SSH[@]}" "sudo systemctl restart ${PROJECT}-http ${PROJECT}-ws ${PROJECT}-poller"
sleep 3
"${SSH[@]}" "systemctl is-active ${PROJECT}-http ${PROJECT}-ws ${PROJECT}-poller"

echo "==> done. logs: ssh ... 'journalctl -u ${PROJECT}-http -f'"
