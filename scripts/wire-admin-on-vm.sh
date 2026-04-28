#!/usr/bin/env bash
#
# wire-admin-on-vm.sh — one-shot script to swap the live VM from the Apr 20
# tarball to a fresh clone of feat/admin-merge with Supabase wired up.
#
# Run this from your LAPTOP after Phase 1 (schema + seed) is done.
# Reads three Supabase keys from a local file at ~/.selahkids-supabase.env
# (which you create manually — never committed):
#
#     NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
#     NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon>
#     SUPABASE_SERVICE_ROLE_KEY=<service>
#
# What it does on the VM:
#   1. Backs up the existing /srv/app/site as root-owned (rollback witness)
#   2. Fresh git clone of feat/admin-merge into /srv/app/site
#   3. Installs .env.local (NEXT_PUBLIC_* only) into /srv/app/site
#   4. Installs systemd drop-in (NEXT_PUBLIC_* — no service-role on VM)
#   5. bun install + bun run build
#   6. systemctl restart selahkids
#   7. Smoke-test /es and /admin
#
# Failure mode: if any step exits non-zero, prints a clear error. The Apr 20
# backup at /srv/app/site.apr20-backup-* stays in place for manual rollback.

set -euo pipefail

VM_HOST="${VM_HOST:-87.99.148.55}"
VM_USER="${VM_USER:-app}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/selahkids_deploy}"
ENV_FILE="${ENV_FILE:-$HOME/.selahkids-supabase.env}"
REPO_URL="${REPO_URL:-https://github.com/abhay1289/Selah-Kids-Antigravity.git}"
BRANCH="${BRANCH:-feat/admin-merge}"

[[ -f "$ENV_FILE" ]] || {
  echo "FATAL: $ENV_FILE not found. Create it with the three Supabase keys."
  exit 1
}

# Validate the three required keys are present without echoing them.
for key in NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY; do
  grep -q "^$key=" "$ENV_FILE" || { echo "FATAL: $ENV_FILE missing $key"; exit 1; }
done

# Build the two env files locally — public-only and runtime-full — without
# echoing values to terminal.
TMPDIR=$(mktemp -d)
trap 'shred -u "$TMPDIR"/* 2>/dev/null; rmdir "$TMPDIR"' EXIT

# .env.local for build-time NEXT_PUBLIC_* inlining (no service-role)
grep -E "^NEXT_PUBLIC_SUPABASE_(URL|ANON_KEY)=" "$ENV_FILE" > "$TMPDIR/dotenv.local"
chmod 600 "$TMPDIR/dotenv.local"

# Systemd drop-in for runtime: same two NEXT_PUBLIC_* keys (server reads via
# process.env at request time). Service-role NOT included — admin uses
# cookie-backed user-scoped client per cms-server.ts.
{
  echo "[Service]"
  grep -E "^NEXT_PUBLIC_SUPABASE_(URL|ANON_KEY)=" "$ENV_FILE" \
    | sed 's/^/Environment=/'
} > "$TMPDIR/override.conf"
chmod 600 "$TMPDIR/override.conf"

echo "==> Uploading env files to VM (mode 600, never echoed to logs)"
scp -i "$SSH_KEY" -q "$TMPDIR/dotenv.local" "$VM_USER@$VM_HOST:/tmp/dotenv.local"
scp -i "$SSH_KEY" -q "$TMPDIR/override.conf" "$VM_USER@$VM_HOST:/tmp/override.conf"

echo "==> Running deploy on VM"
ssh -i "$SSH_KEY" "$VM_USER@$VM_HOST" \
    REPO_URL="$REPO_URL" BRANCH="$BRANCH" bash -se <<'REMOTE'
set -euo pipefail

# 1. Stop the service (Apr 20 build) — do this first so the backup is
#    quiescent.
sudo systemctl stop selahkids

# 2. Move existing tree aside as root (mv preserves ownership; chown after).
TS=$(date +%s)
BACKUP_PATH="/srv/app/site.apr20-backup-${TS}"
sudo mv /srv/app/site "$BACKUP_PATH"
sudo chown -R root:root "$BACKUP_PATH"
echo "  ✓ backed up Apr 20 tree to $BACKUP_PATH (root-owned)"

# 3. Fresh clone of feat/admin-merge.
sudo -u app git clone --branch "$BRANCH" --depth 1 "$REPO_URL" /srv/app/site
echo "  ✓ cloned $BRANCH into /srv/app/site"

# 4. Install env files.
sudo install -m 600 -o app -g app /tmp/dotenv.local /srv/app/site/.env.local
sudo shred -u /tmp/dotenv.local

sudo install -d -m 700 /etc/systemd/system/selahkids.service.d
sudo install -m 600 -o root -g root /tmp/override.conf \
    /etc/systemd/system/selahkids.service.d/override.conf
sudo shred -u /tmp/override.conf
sudo systemctl daemon-reload
echo "  ✓ env files installed"

# 5. Install + build (this can take several minutes on CPX11).
cd /srv/app/site
sudo -u app bun install --frozen-lockfile
echo "  ✓ bun install complete"
sudo -u app bun run build
echo "  ✓ next build complete"

# 6. Belt-and-suspenders: confirm service-role key did NOT leak into bundles.
if sudo grep -ril SUPABASE_SERVICE_ROLE /srv/app/site/.next/ 2>/dev/null; then
  echo "FAIL: service-role key found in build artifacts — refusing to start"
  exit 1
fi

# 7. Start the new build.
sudo systemctl start selahkids
sleep 3

# 8. Smoke-test /es and /admin.
es_code=$(curl -fsS -o /dev/null -w "%{http_code}" --max-time 10 \
    -H "Host: selahkids.com" "http://127.0.0.1:3000/es")
[[ "$es_code" == "200" ]] || { echo "FAIL: /es returned $es_code"; exit 1; }

admin_code=$(curl -fsS -o /dev/null -w "%{http_code}" --max-time 10 \
    -H "Host: selahkids.com" "http://127.0.0.1:3000/admin")
# Unauth /admin should redirect to /admin/login (307) or render the login
# directly (200). Anything else means middleware / auth gate is broken.
case "$admin_code" in
  200|307|302) echo "  ✓ /admin returns $admin_code (auth gate OK)";;
  *) echo "FAIL: /admin returned unexpected $admin_code"; exit 1;;
esac

echo "✓ DEPLOY COMPLETE — admin panel wired, public site healthy"
echo "  Apr 20 backup at: $BACKUP_PATH"
echo "  To rollback: sudo systemctl stop selahkids && sudo mv /srv/app/site /srv/app/site.broken && sudo mv $BACKUP_PATH /srv/app/site && sudo systemctl start selahkids"
REMOTE

echo ""
echo "==> Done. Visit https://selahkids.com/admin/login to sign in."
