# Deploy

One Oracle Ampere A1 box, no Docker. Reached over plain IPv4 for now.

```
http://<IP>/api/v1/...          ws://<IP>/ws
        │                              │
        ▼                              ▼
     Caddy :80  ── single entry point, one open port
        ├── /api/*  → 127.0.0.1:5000   exness-http    (systemd)
        └── /ws*    → 127.0.0.1:8080   exness-ws      (systemd)
                                       exness-poller  (systemd, no port)
                                          │
                   shared PostgreSQL 17 + TimescaleDB, shared Redis
```

No TLS: there is no domain, and a cert cannot be issued for a bare IP. The
day a domain exists, swap the `:80 {` line in `exness.caddy` for the real
hostname and Caddy fetches and renews the cert itself. Nothing else changes.

Consequence to know: a browser page served over HTTPS (e.g. Vercel) **cannot**
call `http://<IP>` — mixed content is a hard block. IP access works from curl,
Postman, native apps, and a local dev frontend.

## Why not Docker

Image builds are the biggest RAM and disk consumer on a VM, and they buy
nothing here: these are interpreted TypeScript services with no compile step.
`rsync && bun install && systemctl restart` is the whole deploy. systemd
already gives restart-on-crash, boot ordering, log capture and memory caps —
most of what the Docker daemon was doing.

## Layout — adding project #2

```
/srv/<project>/<service>/           code (rsync target)
/etc/<project>/<project>.env        secrets, 0600 root
/etc/systemd/system/<project>-*.service
/etc/caddy/sites/<project>.caddy    auto-imported by the main Caddyfile
```

Project #2 is: `newdb.sh proj2`, copy `apps/exness/` → `apps/proj2/`, change the
ports, `systemctl enable --now`, `systemctl reload caddy`. Nothing else on the
box is touched, and no service restarts but that project's own.

<!-- ponytail: no scaffolding script for this. It is a 5-minute copy done every
     few months; a generator would be more code than it saves. -->

## First run

1. `sudo bash deploy/bootstrap.sh` — installs the shared platform. Once per host.
2. `sudo bash deploy/newdb.sh exness` — prints `DATABASE_URL`.
3. Copy `apps/exness/exness.env.example` to `/etc/exness/exness.env`, fill it
   in, `chmod 600`.
4. Copy the three `.service` files to `/etc/systemd/system/`, `exness.caddy` to
   `/etc/caddy/sites/`, then
   `systemctl daemon-reload && systemctl enable --now exness-http exness-ws exness-poller`
   and `systemctl reload caddy`.
5. `HOST=<ip> bash deploy/deploy.sh` for every deploy after that.

## CI

`.github/workflows/deploy.yml` runs step 5 on every push to `main`.
Repo secrets required:

| Secret | Value |
|---|---|
| `SSH_HOST` | server public IPv4 |
| `SSH_KEY` | contents of `~/Desktop/private.key` |

## Checks

```bash
curl http://<IP>/                       # -> exness ok
curl http://<IP>/api/v1/asset           # -> asset list
websocat ws://<IP>/ws                   # -> price stream after SUBSCRIBE
journalctl -u exness-poller -f          # -> batches writing to timescale
```
