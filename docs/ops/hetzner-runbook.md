# Hetzner Production — Operational Runbook

The public site at `selahkids.com` runs on a single Hetzner Cloud VM:

| | |
|---|---|
| Server name | `selahkids-prod` |
| Server type | CPX11 (2 vCPU, 2 GB RAM, 40 GB disk, 1 TB traffic) |
| Location | Ashburn (`ash-dc1`) |
| OS | Ubuntu 24.04 LTS |
| IP | `87.99.148.55` |
| Cost | ~$6.99/month |
| Provisioning | `docs/ops/hetzner-cloud-init.yaml` (cloud-config user-data) |

## Stack

```
┌─ :443 / :80 ─┐
│   Caddy      │ ← auto-issues + renews Let's Encrypt cert
└─────┬────────┘
      │ reverse_proxy
      ▼
┌─ :3000 ──────────┐
│  Next.js app     │ ← `bun run start` under systemd `selahkids`
└──────────────────┘
```

- App user: `app` (home `/home/app`, source at `/srv/app/site`)
- Caddy user: `caddy` (managed by the deb package; cloud-init pre-creates it because the post-install hook is unreliable on a fresh image)
- Firewall: `ufw` allows 22, 80, 443; everything else denied

## Deploy

Two paths:

### A. GitHub Actions (preferred — auto-deploy on push)

Workflow at `.github/workflows/deploy-hetzner.yml`. Triggers on push to `feat/admin-merge` or `main`, plus manual dispatch.

Required repo secrets (Settings → Secrets and variables → Actions):

- `HETZNER_HOST` — `87.99.148.55`
- `HETZNER_SSH_KEY` — private half of the deploy-only ed25519 key. The matching public key is already in `/home/app/.ssh/authorized_keys` on the VM and is the **only** key that can `sudo -n /usr/local/bin/deploy-site.sh` (no other sudo rights).

The workflow SSHes in as `app`, runs the deploy script, and smoke-tests `/es`.

### B. Manual (one-off)

```sh
ssh -i ~/.ssh/selahkids_hetzner root@87.99.148.55
sudo /usr/local/bin/deploy-site.sh
```

The script does: `git fetch + reset --hard origin/feat/admin-merge`, `bun install --frozen-lockfile`, `bun run build`, `systemctl restart selahkids`. Caddy is left alone so its cert state isn't churned.

## Diagnostics

| Symptom | Where to look |
|---|---|
| Site returns 502 | `journalctl -u selahkids -n 100` — app crash on :3000 |
| Site returns 200 from app but no SSL | `journalctl -u caddy -n 100` — ACME challenge failing |
| Build hangs | `top` — `bun install` or `next build` is RAM-bound on a CPX11; consider CPX21 if it gets worse |
| DNS not resolving | Verify NS at GoDaddy + A records at Vercel DNS (Vercel hosts the zone, even though the origin is now Hetzner) |

## DNS topology

- Registrar: GoDaddy (locked, status: PENDING_TRANSFER_IN_RELEASE)
- Nameservers: `ns1.vercel-dns.com`, `ns2.vercel-dns.com` — Vercel hosts the zone for free
- A `selahkids.com` → `87.99.148.55` (TTL 300s)
- A `www.selahkids.com` → `87.99.148.55`
- CAA → permits Let's Encrypt + Sectigo + pki.goog

If we ever fully decouple from Vercel, the cleanest swap is to switch NS at GoDaddy back to GoDaddy's defaults (`ns05.domaincontrol.com`, `ns06.domaincontrol.com`) and re-add the A records via the GoDaddy API. The locked status during the post-transfer period intermittently rejects NS changes — unlock first.

## Backups

Currently none. The site is stateless (CMS data lives in Supabase when env vars are set). For now the only thing that would need restoring is:

- The cloud-init script (in this repo)
- The GitHub Actions deploy workflow (in this repo)
- The deploy-only SSH keypair (regenerable; just rotate `~app/.ssh/authorized_keys` on the VM)

## Future toggles

- **Wire Supabase**: set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `/etc/systemd/system/selahkids.service.d/override.conf` (drop-in `[Service]` Environment= lines), then `systemctl daemon-reload && systemctl restart selahkids`. The build-time warning silences itself.
- **Bigger box**: `hcloud server change-type selahkids-prod cpx21` doubles RAM with a brief restart.
- **Backups**: enable Hetzner snapshot backups (~20% of monthly cost) under server settings.
- **Staging**: clone the cloud-init for a `selahkids-staging` VM and point a `staging.selahkids.com` A record at it.
