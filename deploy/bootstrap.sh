#!/usr/bin/env bash
# One-time host setup. Idempotent — safe to re-run.
# Target: Ubuntu 24.04 LTS on Oracle Ampere A1 (arm64). Also works on x86_64.
#
# Installs the shared platform every project on this box uses:
#   Caddy (TLS + reverse proxy) | PostgreSQL + TimescaleDB | Redis | Bun | Node LTS
#
# Usage:  sudo bash bootstrap.sh
set -euo pipefail

BUN_VERSION="1.3.14"
NODE_MAJOR="24" # Krypton, Active LTS
PG_MAJOR="17"

log() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }

[[ $EUID -eq 0 ]] || { echo "run with sudo"; exit 1; }
. /etc/os-release
[[ "$ID" == "ubuntu" ]] || { echo "this script targets Ubuntu; found $ID $VERSION_ID"; exit 1; }

log "Swap"
# Oracle images ship with none. On a 1 GB shape, Postgres + Redis + three
# services will OOM-kill without it. Harmless on the 24 GB A1.
if ! swapon --show | grep -q swapfile; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile >/dev/null
  swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
# Prefer reclaiming cache over swapping out a live service.
sysctl -qw vm.swappiness=10
grep -q '^vm.swappiness' /etc/sysctl.conf || echo 'vm.swappiness=10' >> /etc/sysctl.conf

log "Base packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl gnupg ca-certificates lsb-release unzip git \
  debian-keyring debian-archive-keyring apt-transport-https \
  iptables-persistent netfilter-persistent

# --- Repositories -------------------------------------------------------------
install -d -m 0755 /etc/apt/keyrings

log "Repos: Caddy, PostgreSQL, TimescaleDB, Redis, Node ${NODE_MAJOR}"
# add_repo names its list file after $1; hosts bootstrapped before that used
# these two names. Drop them so a re-run doesn't leave apt with duplicate sources.
rm -f /etc/apt/sources.list.d/caddy-stable.list /etc/apt/sources.list.d/timescaledb.list

add_repo() { # name  key_url  deb_suffix
  [[ -f "/etc/apt/keyrings/$1.gpg" ]] \
    || curl -fsSL "$2" | gpg --dearmor -o "/etc/apt/keyrings/$1.gpg"
  echo "deb [signed-by=/etc/apt/keyrings/$1.gpg] $3" > "/etc/apt/sources.list.d/$1.list"
}
add_repo caddy      'https://dl.cloudsmith.io/public/caddy/stable/gpg.key'       "https://dl.cloudsmith.io/public/caddy/stable/deb/debian any-version main"
add_repo pgdg       https://www.postgresql.org/media/keys/ACCC4CF8.asc           "http://apt.postgresql.org/pub/repos/apt ${VERSION_CODENAME}-pgdg main"
add_repo timescale  https://packagecloud.io/timescale/timescaledb/gpgkey         "https://packagecloud.io/timescale/timescaledb/ubuntu/ ${VERSION_CODENAME} main"
add_repo redis      https://packages.redis.io/gpg                                "https://packages.redis.io/deb ${VERSION_CODENAME} main"
add_repo nodesource https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key    "https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main"

apt-get update -qq

# --- Packages -----------------------------------------------------------------
log "Installing Caddy, PostgreSQL ${PG_MAJOR} + TimescaleDB, Redis, Node ${NODE_MAJOR}"
apt-get install -y -qq caddy redis nodejs \
  "postgresql-${PG_MAJOR}" "postgresql-client-${PG_MAJOR}" \
  "timescaledb-2-postgresql-${PG_MAJOR}"

log "Bun ${BUN_VERSION} (system-wide, so systemd units need no PATH tricks)"
if [[ "$(/usr/local/bin/bun --version 2>/dev/null || true)" != "$BUN_VERSION" ]]; then
  export BUN_INSTALL=/usr/local/bun
  curl -fsSL https://bun.sh/install | bash -s "bun-v${BUN_VERSION}"
  ln -sf /usr/local/bun/bin/bun /usr/local/bin/bun
  ln -sf /usr/local/bun/bin/bunx /usr/local/bin/bunx
fi

# --- PostgreSQL ---------------------------------------------------------------
log "Tuning PostgreSQL for this host"
PGCONF="/etc/postgresql/${PG_MAJOR}/main/conf.d/00-platform.conf"
TOTAL_MB=$(awk '/MemTotal/ {print int($2/1024)}' /proc/meminfo)
cat > "$PGCONF" <<EOF
# managed by deploy/bootstrap.sh — do not edit by hand
shared_preload_libraries = 'timescaledb'
shared_buffers = $((TOTAL_MB / 4))MB
effective_cache_size = $((TOTAL_MB / 2))MB
listen_addresses = 'localhost'
EOF
# ponytail: shared_buffers + effective_cache_size are ~90% of the tuning win.
# Add work_mem/max_connections only if you actually see contention.
systemctl enable postgresql
systemctl restart postgresql

log "Redis"
systemctl enable --now redis-server

# --- Firewall -----------------------------------------------------------------
# Oracle's Ubuntu images DROP everything except 22; ufw/firewalld alone is not
# enough. Insert at position 1 — the REJECT rules sit at an image-dependent
# index, and assuming one silently leaves the port closed.
log "Opening 80/443 in iptables"
for p in 80 443; do
  iptables -C INPUT -p tcp --dport "$p" -j ACCEPT 2>/dev/null \
    || iptables -I INPUT 1 -p tcp --dport "$p" -j ACCEPT
done
netfilter-persistent save

# --- App directory ------------------------------------------------------------
# Services run as the same unprivileged user that rsync writes as, so a deploy
# needs no chown step and no sudo. Single-tenant box; systemd's ProtectSystem
# and NoNewPrivileges still confine each unit.
APP_USER="${SUDO_USER:-ubuntu}"
log "App root /srv owned by ${APP_USER}"
install -d -m 0755 -o "$APP_USER" -g "$APP_USER" /srv

# --- Caddy multi-project layout ----------------------------------------------
log "Caddy layout for many projects"
install -d -m 0755 /etc/caddy/sites
if ! grep -q 'import sites' /etc/caddy/Caddyfile 2>/dev/null; then
  cat > /etc/caddy/Caddyfile <<'EOF'
# One file per project in /etc/caddy/sites/. Adding a project = drop in a file
# + `systemctl reload caddy`. No rebuild, no restart of anything else.
{
    email admin@example.com
}
import /etc/caddy/sites/*.caddy
EOF
fi
systemctl enable caddy
# reload, not `enable --now`: apt already started Caddy with its stock
# Caddyfile, so --now is a no-op and the config above would never take effect.
systemctl reload caddy 2>/dev/null || systemctl restart caddy

log "Done"
printf '  caddy   %s\n' "$(caddy version | head -1)"
printf '  bun     %s\n' "$(bun --version)"
printf '  node    %s\n' "$(node --version)"
printf '  psql    %s\n' "$(psql --version)"
printf '  redis   %s\n' "$(redis-server --version | awk '{print $3}')"
echo
echo "Next: sudo bash deploy/newdb.sh <project>   then   bash deploy/deploy.sh"
