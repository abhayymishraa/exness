# Deploy

Frontend on Vercel. Everything else on one Oracle Ampere A1 box, no Docker.

```
exness.abhayymishraa.us (Vercel)
        │ https
        ▼
 api.exness.abhayymishraa.us      ws.exness.abhayymishraa.us
        │                                  │
        └────────────► Caddy :443 ◄────────┘
             TLS terminates here, certs auto-renew
        ├── → 127.0.0.1:5000   exness-http    (systemd)
        └── → 127.0.0.1:8080   exness-ws      (systemd)
                               exness-poller  (systemd, no port)
                                  │
           shared PostgreSQL 17 + TimescaleDB, shared Redis
```

DNS records must stay grey-cloud in Cloudflare — an orange-cloud proxy
intercepts the HTTP-01 challenge and Caddy cannot renew.

## Why not Docker

Image builds are the biggest RAM and disk consumer on a VM, and they buy
nothing here: these are interpreted TypeScript services with no compile step.
`rsync && bun install && systemctl restart` is the whole deploy. systemd
already gives restart-on-crash, boot ordering, log capture and memory caps —
most of what the Docker daemon was doing.

## Layout — adding project #2

```
/srv/<project>/<service>/           code (rsync target)
/etc/<project>/<project>.env        secrets, 640 root:<app user>
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
   in, `chown root:ubuntu && chmod 640`.
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
curl https://api.exness.abhayymishraa.us/api/v1/asset   # -> asset list
websocat wss://ws.exness.abhayymishraa.us              # -> stream after SUBSCRIBE
journalctl -u exness-poller -f                         # -> batches writing to timescale
```
