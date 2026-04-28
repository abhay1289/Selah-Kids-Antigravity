# Selah Kids — Admin Panel End-to-End Fix Plan

## Context

Production at `selahkids.com` runs on Hetzner CPX11 (87.99.148.55), serving the
**Apr 20 snapshot** from `/Users/codex/Downloads/ selah kids antigravity-1`,
extracted to `/srv/app/site` on the VM. The newer `feat/admin-merge` branch
has a hardened admin (SSR middleware gate, `@supabase/ssr` cookies, service-role
writes); the Apr 20 folder has only a client-side `useEffect` gate that flashes
before redirect and uses the browser-only Supabase SDK.

Currently the VM has **zero Supabase env vars** set, so the deployed admin
runs in offline-mock mode: login accepts any credentials and all writes silently
no-op. We need to fix this end-to-end.

## Goals

1. Production admin enforces real Supabase auth (no any-password bypass).
2. Auth is enforced on the **server**, not just the client (no flash, no SSR bypass).
3. Admin reads/writes hit the real Supabase DB with correct RLS posture.
4. Public site preserves the Apr 20 visual design that the user signed off on.
5. Zero downtime during the fix; one-command rollback if anything regresses.

## Strategy Decision: Switch to `feat/admin-merge` for the entire deployment

**Rejected: Port admin from newer code into Apr 20 folder.** Switching SDK
(`@supabase/supabase-js` → `@supabase/ssr`), adding middleware, and rewriting
30+ admin pages to be RSC-safe is multi-week work and would regress the Apr 20
visuals during merge conflicts.

**Rejected: Run admin and public as two separate apps.** Hetzner CPX11 has 2 GB
RAM. Two `next start` processes risk OOM under build. Caddy routing complexity
also doubles the failure surface.

**Chosen: Deploy `feat/admin-merge` (the GitHub-tracked code) as the single app.**
That branch already has both the public site and the hardened admin, written
together. The "Apr 20 design" the user liked is mostly the homepage hero and
playlist sections — we'll cherry-pick those into `feat/admin-merge` rather than
keeping the whole Apr 20 tree. Net effect: one codebase, one deploy, real auth.

## Phase 1 — Pre-flight (no production impact)

### 1.1 Confirm Supabase project
- Open the Supabase dashboard for `selahkids` project
- Capture: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY` (the user provides these — never echo to logs)
- Verify the `auth.users` table has at least one admin user with a known password,
  or create one via Supabase Auth UI

### 1.2 Replace service-role writes with RLS-enforced admin role

**Problem.** If admin write routes use `SUPABASE_SERVICE_ROLE_KEY`, RLS is
bypassed entirely. The only thing then protecting writes is whatever check
the route performs in code. Today the newer code's middleware checks "is
there a session" (any signed-in Supabase Auth user passes). If anyone can sign
up to Supabase Auth (default project setting), or if any non-admin user
already exists, they can hit `/admin/...` and the server will write with
DB-master credentials. This is a critical authz gap that no amount of
env-var hygiene will fix.

**Fix — RLS becomes the source of truth, not application code:**

(a) Establish admin role in Supabase. **This must happen BEFORE the RLS
policies in (b) are applied — otherwise the existing admin's writes start
failing with 403 and the panel goes dark.** Add `app_metadata.role = 'admin'`
on each admin user via the Supabase dashboard (Authentication → Users →
edit → "App Metadata" JSON: `{"role": "admin"}`), or programmatically via
the Admin API:
```sh
# From a developer machine — service-role key is held locally, not on the VM:
curl -X PUT "https://<ref>.supabase.co/auth/v1/admin/users/<USER_UUID>" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"app_metadata": {"role": "admin"}}'
```
Verify before proceeding to (b):
```sh
curl -s "https://<ref>.supabase.co/auth/v1/admin/users/<USER_UUID>" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  | jq '.app_metadata.role'
# Expect: "admin"
```
Have the admin user **sign out and sign in again** so a fresh JWT is minted
that carries the new claim. Stale JWTs from before the metadata change still
have empty `app_metadata.role` and will fail the policies.

(b) Write RLS policies that enforce admin on every writable table:
```sql
-- collections, page_content, seo_pages, site_settings, media, …
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon read"        ON collections FOR SELECT TO anon         USING (true);
CREATE POLICY "auth read"        ON collections FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin insert"     ON collections FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "admin update"     ON collections FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "admin delete"     ON collections FOR DELETE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
```
Repeat for every table the admin writes to.

(c) Audit `feat/admin-merge` admin write paths (server actions, route
handlers under `src/app/admin/**` and any `src/app/api/admin/**`). Replace
every use of `createAdminClient()` / `SUPABASE_SERVICE_ROLE_KEY` with the
**user-scoped server client** (`createServerClient(url, anon, { cookies })`
from `@supabase/ssr`). The user's JWT travels with the request; RLS
enforces admin on the DB side.

(d) After the swap, the service-role key is needed only for:
- Migrations / one-shot scripts (run from a developer machine, not the VM)
- Background jobs that run as nobody (none currently — Selah Kids has no
  cron beyond the deploy workflow)

We therefore **do not set `SUPABASE_SERVICE_ROLE_KEY` on the production VM
at all**. This eliminates the entire class of "service-role on server +
weak app-level auth" bypass risks. If a future feature genuinely needs it,
it goes on a separate, locked-down host.

(e) Defense-in-depth: in Supabase Auth settings, **disable public sign-ups**
(Authentication → Providers → Email → "Enable signups" off). Admins are
created by you in the dashboard; no one can self-onboard a non-admin user
that might later be elevated by mistake.

(f) Verification (in Phase 2 staging and Phase 4 hardening): run the same
PATCH against PostgREST (a) as `anon` → expect 401, (b) as a
non-admin authenticated JWT → expect 403, (c) as the admin user via the
admin UI → expect 200. (b) is the new check that proves RLS, not
application code, is enforcing authorization.

### 1.3 Cherry-pick Apr 20 visual changes into `feat/admin-merge`
Diff the Apr 20 homepage components (`TodaysEpisode.tsx`, etc.) against
`feat/admin-merge`'s versions. Apply only the visual changes the user signed off
on. Do NOT bring across structural changes (no LanguageContext rewrite, no
SDK swap). Land on a new branch `feat/admin-merge-apr20-visuals`.

## Phase 2 — Staging validation on the VM

We don't have a separate staging box, so we'll use a **second systemd unit on
a non-public port** as a temporary staging.

### 2.1 Build and run the new code on port 3001 under a dedicated systemd unit

Do **not** use a background `&` for staging — on a 2 GB CPX11 already running
prod, an orphaned process can OOM the box and the kernel OOM-killer may take
out prod, not staging. Use a one-shot systemd unit so we have explicit stop +
log + memory bounds.

```sh
ssh app@87.99.148.55
sudo install -d -o app -g app /srv/app/site-staging
sudo -u app git clone --branch feat/admin-merge-apr20-visuals \
  https://github.com/<repo> /srv/app/site-staging
cd /srv/app/site-staging
sudo -u app bun install --frozen-lockfile

# Build-time .env.local — ONLY the NEXT_PUBLIC_* keys.
# The service-role key must NEVER be in .env.local (build artifacts, backup
# tarballs, accidental git stash, .next/cache risk).
sudo -u app install -m 600 /dev/null .env.local
# scp the prepared file in (contents below) — never inline secrets on the cmdline.
#   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon>
sudo -u app bun run build
```

Stage as a transient systemd unit. **Env vars come from a drop-in file**, not
the systemd-run command line — `--property=Environment=...` puts the value in
`/proc/<pid>/cmdline` and `ps -ewww`, visible to any local user. Per Phase 1.2
the service-role key is not deployed to the VM at all, so staging only carries
the two `NEXT_PUBLIC_*` keys (which are public anyway):

```sh
# 1. Compose locally, scp in. Plain KEY=VALUE format ONLY (this is what
#    EnvironmentFile= parses — NOT systemd unit fragment syntax with
#    [Service] headers and Environment= prefixes).
#    selahkids-staging.env contents:
#      PORT=3001
#      NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
#      NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon>
scp -i ~/.ssh/selahkids_deploy selahkids-staging.env \
    app@87.99.148.55:/tmp/selahkids-staging.env

# 2. Move into a root-owned dir + mode 600, then start a transient unit
#    referencing the file via EnvironmentFile=:
ssh app@87.99.148.55 <<'REMOTE'
sudo install -d -m 700 /etc/selahkids
sudo install -m 600 -o root -g root /tmp/selahkids-staging.env \
  /etc/selahkids/staging.env
shred -u /tmp/selahkids-staging.env
sudo systemd-run --unit=selahkids-staging \
  --working-directory=/srv/app/site-staging \
  --uid=app --gid=app \
  --property=MemoryMax=600M \
  --property=EnvironmentFile=/etc/selahkids/staging.env \
  /usr/bin/bun run start --hostname 127.0.0.1 --port 3001

# Sanity-check that env vars actually loaded (caught a real bug in earlier
# plan iterations: unit-fragment syntax in an EnvironmentFile silently
# results in empty env):
sudo systemctl show selahkids-staging -p Environment | grep -q SUPABASE_URL \
  || { echo "FATAL: staging env not loaded"; sudo systemctl stop selahkids-staging; exit 1; }
REMOTE
```
The `--hostname 127.0.0.1` flag binds Next.js to loopback, so the staging
process is only reachable via SSH tunnel — even if ufw 3001 is accidentally
opened, the kernel won't accept connections on the public interface. Verify
post-start: `ss -lntp | grep 3001` should show `127.0.0.1:3001`, NOT `*:3001`.

RLS is also the security boundary in case the bind ever leaks: a non-admin
user could only read; admin writes require the `app_metadata.role = 'admin'`
JWT claim per Phase 1.2 policies.

To test against staging, tunnel from the operator's laptop:
```sh
# From operator laptop, after `systemd-run` has started:
ssh -L 3001:127.0.0.1:3001 app@87.99.148.55
# Then test against http://localhost:3001 in a local browser.
```
Staging logs: `journalctl -u selahkids-staging -f`.
**Mandatory teardown when Phase 2 ends** (success OR failure):
```sh
sudo systemctl stop selahkids-staging
sudo shred -u /etc/selahkids/staging.env || sudo rm -f /etc/selahkids/staging.env
sudo rm -rf /srv/app/site-staging
# Confirm port released:
ss -lntp | grep 3001 || echo "✓ port 3001 free"
```

### 2.2 Smoke test against :3001
- `/es` returns 200, `<html lang="es">` correct
- `/admin` redirects unauth'd to `/admin/login`
- Login with valid Supabase admin creds → reaches `/admin`
- Login with bad password → error message
- One admin write: edit a homepage `site_settings` row, reload public `/es`,
  confirm change visible (this proves the full read/write loop including RLS)

### 2.3 Run godspeed against the cherry-pick diff
Block on PASS verdict before promoting to production.

## Phase 3 — Production cutover

### 3.-1 Hard pre-flight gate (MUST PASS before Phase 3 begins)

The cutover swaps in code that uses the user-scoped anon client for admin
writes (per Phase 1.2(c)). This is only safe if the RLS policies (1.2b),
the admin role metadata (1.2a), and the disabled public sign-ups (1.2e) are
all in place. If any prerequisite is missing, the new build will accept
admin writes from ANY authenticated Supabase user (since the middleware only
checks "is there a session"). That regresses to a worse state than today.

Make this a script we run from the operator's laptop, NOT a checklist.
`scripts/preflight-check.sh`:
```sh
#!/usr/bin/env bash
set -euo pipefail
: "${SUPABASE_URL:?must be set}"
: "${SUPABASE_SERVICE_ROLE_KEY:?must be set, locally}"   # held on laptop only
: "${ADMIN_USER_UUID:?must be set}"

fail() { echo "❌ FAIL: $1"; exit 1; }
ok()   { echo "✓ $1"; }

# 1. Admin user has app_metadata.role = "admin" (1.2a)
role=$(curl -fsS "$SUPABASE_URL/auth/v1/admin/users/$ADMIN_USER_UUID" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  | jq -r '.app_metadata.role // empty')
[[ "$role" == "admin" ]] || fail "admin user $ADMIN_USER_UUID does not have app_metadata.role=admin"
ok "admin user has role claim"

# 2. RLS policies exist AND enforce admin role on every writable table (1.2b)
#
# Counting policies is not enough — three permissive `FOR ALL TO authenticated
# USING (true)` policies would pass a count check. We must verify each table
# has INSERT/UPDATE/DELETE policies whose qual or with-check expression
# references `app_metadata.role`. We do this via a security-definer SQL
# function the user creates once, that returns the policy DDL strings:
#
#   create or replace function admin_policy_audit(tbl text)
#     returns table(cmd text, qual text, with_check text)
#     language sql security definer set search_path = public, pg_catalog as $$
#     select cmd, qual, with_check
#       from pg_policies
#       where schemaname = 'public' and tablename = tbl;
#   $$;
#   revoke all on function admin_policy_audit(text) from public;
#   grant execute on function admin_policy_audit(text) to service_role;
#
# Then preflight queries it via PostgREST:

# Don't hardcode the table list — discover it. AND fail-closed if any public
# table has RLS disabled. A table without RLS in the public schema is wide
# open to PostgREST callers; preflight must refuse to deploy until every
# public table has RLS enabled, regardless of whether the admin code
# currently writes to it.
#
# Two SQL functions, created once:
#
#   create or replace function admin_writable_tables()
#     returns table(tablename text)
#     language sql security definer set search_path = public, pg_catalog as $$
#     select c.relname::text
#     from pg_class c
#     join pg_namespace n on n.oid = c.relnamespace
#     where n.nspname = 'public'
#       and c.relkind = 'r'
#       and c.relrowsecurity = true
#       and c.relname not in ('preflight_canary', 'schema_migrations');
#   $$;
#
#   create or replace function rls_disabled_tables()
#     returns table(tablename text)
#     language sql security definer set search_path = public, pg_catalog as $$
#     select c.relname::text
#     from pg_class c
#     join pg_namespace n on n.oid = c.relnamespace
#     where n.nspname = 'public'
#       and c.relkind = 'r'
#       and c.relrowsecurity = false;
#   $$;
#   revoke all on function admin_writable_tables() from public;
#   revoke all on function rls_disabled_tables() from public;
#   grant execute on function admin_writable_tables() to service_role;
#   grant execute on function rls_disabled_tables() to service_role;

# 2.0: NO public table may have RLS disabled — fail-closed.
rls_off=$(curl -fsS "$SUPABASE_URL/rest/v1/rpc/rls_disabled_tables" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" -d '{}' | jq -r '[.[].tablename] | join(",")')
[[ -z "$rls_off" ]] \
  || fail "tables in public schema without RLS: $rls_off — enable RLS before deploy"
ok "every public table has RLS enabled"

# 2.1: discover the set of admin-writable tables.
required_tables=($(curl -fsS "$SUPABASE_URL/rest/v1/rpc/admin_writable_tables" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" -d '{}' \
  | jq -r '.[].tablename'))
[[ "${#required_tables[@]}" -gt 0 ]] || fail "no RLS-enabled tables discovered (admin_writable_tables() function missing?)"
ok "discovered ${#required_tables[@]} RLS-enabled tables: ${required_tables[*]}"

required_cmds=(INSERT UPDATE DELETE)
admin_check_pattern='app_metadata.*role.*admin'

for tbl in "${required_tables[@]}"; do
  rows=$(curl -fsS "$SUPABASE_URL/rest/v1/rpc/admin_policy_audit" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"tbl\":\"$tbl\"}")

  for cmd in "${required_cmds[@]}"; do
    matched=$(jq -r --arg cmd "$cmd" --arg pat "$admin_check_pattern" '
      [.[] | select(.cmd == $cmd) | (.qual // "") + (.with_check // "")
       | select(test($pat))] | length' <<<"$rows")
    [[ "$matched" -ge 1 ]] || \
      fail "table $tbl has no $cmd policy referencing app_metadata.role"
  done
done
ok "RLS policies enforce admin role on INSERT/UPDATE/DELETE for all writable tables"

# 2b. Negative test with a real non-admin JWT — the authoritative check.
#     Postgres RLS policies are permissive by default (multiple policies are
#     OR'd), so static analysis of pg_policies in step 2 isn't enough: a
#     permissive `USING(true)` policy can coexist with an admin-role policy
#     and bypass it. The only way to be sure RLS is closed is to attempt the
#     writes with a real non-admin JWT against a real row, and confirm both
#     (a) PostgREST returns an error code, AND (b) the row didn't change.
#
#     Provision a throwaway non-admin user once (Supabase dashboard → invite
#     a noreply@ address, manually confirm, never grant app_metadata.role).
#     Store the refresh token in a laptop-local secrets file.
: "${NONADMIN_REFRESH_TOKEN:?must be set, locally}"
nonadmin_jwt=$(curl -fsS "$SUPABASE_URL/auth/v1/token?grant_type=refresh_token" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"refresh_token\":\"$NONADMIN_REFRESH_TOKEN\"}" | jq -r '.access_token')
[[ -n "$nonadmin_jwt" && "$nonadmin_jwt" != "null" ]] \
  || fail "could not obtain non-admin JWT for preflight"

# Each writable table needs one canary row whose schema is known to preflight.
# A `_preflight_canary` table created once for the test is cleanest:
#   create table public.preflight_canary(
#     id uuid primary key default gen_random_uuid(),
#     marker text not null default 'PREFLIGHT-CANARY-DO-NOT-EDIT'
#   );
# Apply the same RLS posture as the real admin tables (admin-only writes).
# Then preflight does INSERT/UPDATE/DELETE against this table using the
# non-admin JWT — every attempt must fail.
canary_id="${PREFLIGHT_CANARY_ID:?must be set: id of the canary row}"

# (a) UPDATE attempt as non-admin.
#
# We CANNOT trust the PATCH response body to detect bypass. PostgREST with
# `Prefer: return=representation` returns the modified row filtered by the
# READ policy — so an empty `[]` could mean either:
#   - UPDATE was denied by RLS (good), OR
#   - UPDATE succeeded but SELECT policy hides the row from this user (bypass)
# The only reliable check is: read the canary's value with service-role
# BEFORE and AFTER the PATCH, compare. If they differ, RLS write was
# bypassed even if PostgREST claimed nothing happened.

before=$(curl -fsS "$SUPABASE_URL/rest/v1/preflight_canary?id=eq.$canary_id&select=marker" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" | jq -r '.[0].marker')

curl -s -o /dev/null \
  -X PATCH "$SUPABASE_URL/rest/v1/preflight_canary?id=eq.$canary_id" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $nonadmin_jwt" \
  -H "Content-Type: application/json" \
  -d '{"marker":"PREFLIGHT-PROBE-MUTATION"}' || true

after=$(curl -fsS "$SUPABASE_URL/rest/v1/preflight_canary?id=eq.$canary_id&select=marker" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" | jq -r '.[0].marker')

[[ "$before" == "$after" ]] \
  || fail "non-admin JWT MUTATED canary row (before=$before after=$after) — RLS BYPASS"

# (b) INSERT attempt as non-admin. Same caveat as UPDATE: trust nothing in
# the response. Count canary rows before and after via service-role.
count_before=$(curl -fsS "$SUPABASE_URL/rest/v1/preflight_canary?select=id" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Prefer: count=exact" -I 2>/dev/null \
  | awk -F'/' '/content-range:/ {print $2}' | tr -d '\r' || echo 0)

curl -s -o /dev/null \
  -X POST "$SUPABASE_URL/rest/v1/preflight_canary" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $nonadmin_jwt" \
  -H "Content-Type: application/json" \
  -d '{"marker":"PREFLIGHT-PROBE-INSERT"}' || true

count_after=$(curl -fsS "$SUPABASE_URL/rest/v1/preflight_canary?select=id" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Prefer: count=exact" -I 2>/dev/null \
  | awk -F'/' '/content-range:/ {print $2}' | tr -d '\r' || echo 0)

[[ "$count_before" == "$count_after" ]] \
  || fail "non-admin JWT INSERTED a row (before=$count_before after=$count_after) — RLS BYPASS"

# (c) DELETE attempt as non-admin
delete_resp=$(curl -s -o /tmp/preflight.delete -w '%{http_code}' \
  -X DELETE "$SUPABASE_URL/rest/v1/preflight_canary?id=eq.$canary_id" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $nonadmin_jwt")
# Re-fetch the canary row to confirm it still exists.
still_there=$(curl -fsS "$SUPABASE_URL/rest/v1/preflight_canary?id=eq.$canary_id" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" | jq -r '. | length')
[[ "$still_there" -eq 1 ]] \
  || fail "non-admin JWT successfully DELETED canary row (RLS BYPASS DETECTED)"

ok "non-admin JWT blocked from INSERT/UPDATE/DELETE on canary table"

# (d) The canary table is the witness for the WHOLE family of admin tables,
# but only if RLS posture is uniform across them. Enforce that uniformity
# at policy creation time, NOT at probe time.
#
# Apply policies via a one-shot SQL migration (run from the operator's
# laptop using `psql` with the direct database URL — NOT a stored function
# callable via PostgREST). Stored DDL helpers create a privilege-escalation
# vector: PostgreSQL grants EXECUTE on new functions to PUBLIC by default,
# so a `SECURITY DEFINER` function that takes a table name and runs DDL
# would be reachable via `/rest/v1/rpc/apply_admin_rls` and would let any
# anon user rewrite RLS for any table. Inline the DDL in the migration
# instead — privileges flow from the connecting user, not a function:
#
#   -- migrations/0042_admin_rls.sql, run via:
#   --   psql "$SUPABASE_DB_URL" -f migrations/0042_admin_rls.sql
#   -- where $SUPABASE_DB_URL uses the project's postgres URL with the
#   -- service-role-equivalent password (held on the laptop, never on the VM).
#   begin;
#   do $$
#   declare t text;
#   begin
#     foreach t in array array['collections','page_content','seo_pages',
#                              'site_settings','media','preflight_canary'] loop
#       execute format('alter table %I enable row level security', t);
#       execute format('drop policy if exists "anon read" on %I', t);
#       execute format('drop policy if exists "auth read" on %I', t);
#       execute format('drop policy if exists "admin write" on %I', t);
#       execute format('create policy "anon read" on %I for select to anon using (true)', t);
#       execute format('create policy "auth read" on %I for select to authenticated using (true)', t);
#       execute format($f$create policy "admin write" on %I
#         for all to authenticated
#         using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
#         with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')$f$, t);
#     end loop;
#   end $$;
#   commit;
#
# This DO block runs as the connecting role, no SECURITY DEFINER, no PUBLIC
# EXECUTE grant, no PostgREST exposure. The privilege boundary is the DB
# password, which lives on the operator's laptop only.
# Static analysis in step 2 still validates the policies match
# `app_metadata.role = 'admin'`, and the canary probe in step 2b proves
# enforcement actually works.
#
# Skipping per-table probe: every admin table has the IDENTICAL RLS
# template, so the canary table is a sufficient witness. This avoids the
# real bug of assuming `id`+`updated_at` columns exist on every admin table
# (some have `slug` PKs, some have no `updated_at`).
ok "RLS posture is uniform across admin tables; canary is a sufficient witness"

# 3. Public sign-ups disabled (1.2e). The Auth admin endpoint exposes
#    auth.config. We need a fail-CLOSED check: any unexpected response
#    (HTTP error, missing field, key rotation) MUST fail preflight, not
#    silently pass or be ambiguous.
config_response=$(curl -fsS "$SUPABASE_URL/auth/v1/admin/config" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY") \
  || fail "could not fetch auth/v1/admin/config — service-role key valid? endpoint changed?"

disabled=$(jq -r '.SIGNUP_DISABLED // .disable_signup // .DISABLE_SIGNUP // empty' \
  <<<"$config_response")
[[ -n "$disabled" ]] \
  || fail "auth config response has no recognized signup-disabled field — Supabase API may have changed; verify manually then update preflight"
[[ "$disabled" == "true" ]] \
  || fail "public sign-ups are still enabled (signup-disabled=$disabled)"
ok "public sign-ups are disabled"

# 4. Negative test: anon client cannot write
http_code=$(curl -s -o /dev/null -w '%{http_code}' \
  -X PATCH "$SUPABASE_URL/rest/v1/site_settings?id=eq.1" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"site_title":"PREFLIGHT-PROBE-IGNORE"}')
[[ "$http_code" =~ ^4[0-9][0-9]$ ]] || fail "anon write returned $http_code (expected 401/403)"
ok "anon write blocked by RLS (HTTP $http_code)"

echo "✅ Pre-flight passed. Safe to proceed to Phase 3."
```

**Run order is enforced by tooling, not by operator memory:**
- `deploy-site.sh` (the prod deploy script) gains a guard at the top:
  ```sh
  if [[ ! -f /etc/selahkids/preflight-passed ]]; then
    echo "ABORT: /etc/selahkids/preflight-passed marker missing — run preflight-check.sh first"
    exit 1
  fi
  ```
- Operator workflow: run `preflight-check.sh` from laptop. If green, ssh in
  and `sudo touch /etc/selahkids/preflight-passed && sudo chmod 600 ...`. The
  marker is removed automatically by `rollback-to-apr20.sh` so a future
  re-cutover can't reuse a stale OK from before policy changes were reverted.

This makes "Phase 3 deploys before 1.2 is complete" technically impossible:
the deploy script refuses to run.

### 3.0 Install rollback script BEFORE touching prod

Per Phase 5: the rollback script `/usr/local/bin/rollback-to-apr20.sh` and
its sudoers entry must exist before we stop the running service. If we
discover during cutover that we need to roll back, the script must already
be in place — typing it under pressure is exactly the failure mode Phase 5
is engineered to prevent.

```sh
scp -i ~/.ssh/selahkids_deploy rollback-to-apr20.sh root@87.99.148.55:/tmp/
ssh root@87.99.148.55 \
  'install -m 700 -o root -g root /tmp/rollback-to-apr20.sh /usr/local/bin/ && \
   echo "app ALL=(root) NOPASSWD: /usr/local/bin/rollback-to-apr20.sh *" \
     > /etc/sudoers.d/selahkids-rollback && \
   chmod 440 /etc/sudoers.d/selahkids-rollback && \
   visudo -c -f /etc/sudoers.d/selahkids-rollback && \
   shred -u /tmp/rollback-to-apr20.sh'
```



### 3.1 Set Supabase env vars on the VM

Per Phase 1.2, **the service-role key is NOT deployed to the VM.** The only
keys on the VM are the two `NEXT_PUBLIC_*` keys, both of which are safe to
expose (the anon key is designed to be public; RLS is the security boundary).

(a) Systemd drop-in (runtime, for `next start`):
```sh
sudo install -d -m 700 /etc/systemd/system/selahkids.service.d
# Compose the file LOCALLY first (your laptop), then scp it in — never paste
# secrets into a remote shell where they'd land in bash history.
# Local file contents (selahkids.env):
#   [Service]
#   Environment=NEXT_PUBLIC_SUPABASE_URL=...
#   Environment=NEXT_PUBLIC_SUPABASE_ANON_KEY=...
scp -i ~/.ssh/selahkids_deploy selahkids.env \
    app@87.99.148.55:/tmp/selahkids.env
ssh app@87.99.148.55 \
    'sudo install -m 600 -o root -g root /tmp/selahkids.env \
       /etc/systemd/system/selahkids.service.d/override.conf && \
     shred -u /tmp/selahkids.env && \
     sudo systemctl daemon-reload'
```
Verify: `sudo stat -c '%a %U' /etc/systemd/system/selahkids.service.d/override.conf` → `600 root`.

(b) `.env.local` at the build path (build-time, for `NEXT_PUBLIC_*` inlining):
```sh
# Compose locally; scp in. Contents — exactly the two keys:
#   NEXT_PUBLIC_SUPABASE_URL=...
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
scp -i ~/.ssh/selahkids_deploy selahkids.env.local \
    app@87.99.148.55:/srv/app/site/.env.local
ssh app@87.99.148.55 'chmod 600 /srv/app/site/.env.local'
```
Next.js inlines `NEXT_PUBLIC_*` into the client bundle **at build time**, not
runtime. Without `.env.local` present during `bun run build`, the client-side
Supabase initialization will hold `undefined` and the public site will break.

These two keys are also in the systemd drop-in (3.1a) so the server-side
code can read them via `process.env` at request time. Both files are mode 600.

After build, sanity-check the bundle:
```sh
# Should find the URL (it's public anyway) but NOT the service-role key.
grep -r "SUPABASE_SERVICE_ROLE" /srv/app/site/.next/ || echo "✓ service key not in bundle"
```

### 3.2 Swap deploy source in `/usr/local/bin/deploy-site.sh`
Currently the script `git fetch + reset --hard origin/feat/admin-merge` against
a repo path that contains the **Apr 20 tarball-extracted code**, not a git
working tree. We need to either:
- Re-init `/srv/app/site` as a clone of the GitHub repo on `feat/admin-merge-apr20-visuals`, OR
- Move the Apr 20 tree aside and clone fresh

**Order matters.** Phase 3.1(b) wrote `.env.local` into the live tree at
`/srv/app/site/.env.local`. The first `mv` of that tree would carry it
away, leaving the freshly cloned tree with no `.env.local` and no source
to copy from. Two ways to avoid the trap — pick one:

The `mv` of the existing `/srv/app/site` to a backup path is performed as
root, which means the backup is **root-owned**. This is required by
`rollback-to-apr20.sh`'s ownership check (a compromised `app` account
must NOT be able to stage a malicious "backup" tree).

Option A (recommended): keep a canonical copy under `/etc`, scp once,
copy into each new build dir.
```sh
# One-time, BEFORE any cutover (do this in 3.1(b) instead of writing to
# /srv/app/site/.env.local):
scp -i ~/.ssh/selahkids_deploy selahkids.env.local \
    app@87.99.148.55:/tmp/selahkids.env.local
ssh app@87.99.148.55 \
    'sudo install -d -m 700 /etc/selahkids && \
     sudo install -m 600 -o root -g root /tmp/selahkids.env.local \
       /etc/selahkids/env.local && \
     shred -u /tmp/selahkids.env.local'

# Then in 3.2, install from the canonical /etc/selahkids/env.local — which
# is NOT inside the app tree and is unaffected by the mv-aside.
sudo systemctl stop selahkids
TS=$(date +%s)
sudo mv /srv/app/site "/srv/app/site.apr20-backup-${TS}"
# CRITICAL: mv preserves ownership. The live tree was app-owned, so the
# moved backup is app-owned. rollback-to-apr20.sh refuses any backup that
# is NOT root-owned (defense against compromised app account staging a
# malicious tree). Re-own the backup to root before continuing.
sudo chown -R root:root "/srv/app/site.apr20-backup-${TS}"
sudo -u app git clone --branch feat/admin-merge-apr20-visuals \
    https://github.com/<repo> /srv/app/site
sudo install -m 600 -o app -g app /etc/selahkids/env.local \
    /srv/app/site/.env.local
cd /srv/app/site
sudo -u app bun install --frozen-lockfile
sudo -u app bun run build
sudo systemctl start selahkids
```

Option B: copy the existing `.env.local` BEFORE the `mv`-aside.
```sh
sudo install -m 600 -o root -g root /srv/app/site/.env.local \
    /tmp/.env.local.preserved.$$
sudo systemctl stop selahkids
sudo mv /srv/app/site /srv/app/site.apr20-backup-$(date +%s)
sudo -u app git clone --branch feat/admin-merge-apr20-visuals \
    https://github.com/<repo> /srv/app/site
sudo install -m 600 -o app -g app /tmp/.env.local.preserved.$$ \
    /srv/app/site/.env.local
shred -u /tmp/.env.local.preserved.$$
cd /srv/app/site
sudo -u app bun install --frozen-lockfile
sudo -u app bun run build
sudo systemctl start selahkids
```

Use Option A — `/etc/selahkids/env.local` is also useful for the
`/usr/local/bin/deploy-site.sh` continuous-deploy flow (every redeploy can
re-copy from the canonical path without operator intervention). Update
`deploy-site.sh` accordingly so post-Phase-3 deploys don't re-introduce the
missing-env-file failure mode.

### 3.3 Smoke test production
```sh
curl -I https://selahkids.com/es           # 200, html lang=es
curl -I https://selahkids.com/admin        # 307 → /admin/login (proves middleware gate)
curl -I https://selahkids.com/admin/login  # 200
```
Plus a manual login + one CMS write through the UI.

### 3.4 Update GitHub Actions deploy workflow
Switch the trigger branch in `.github/workflows/deploy-hetzner.yml` from
`feat/admin-merge` to `feat/admin-merge-apr20-visuals` (or merge the latter
into `feat/admin-merge` and keep the trigger). Lock in auto-deploy going forward.

## Phase 4 — Hardening

### 4.1 Rotate the offline-mode default credentials
The Apr 20 mock client returned `admin@selahkids.com` for any password. Make
sure the mock branch is gone from the new build (it should be — `feat/admin-merge`
uses `@supabase/ssr` and has no such mock). Grep the deployed `dist/` to confirm
no `'admin@selahkids.com'` literal in admin auth paths.

### 4.2 Service-role key absence (post-Phase-1.2 architecture)

Per Phase 1.2, the production VM does **not** have
`SUPABASE_SERVICE_ROLE_KEY` set, and admin writes use the user's
RLS-scoped session — not service-role. Verify, don't trust:
```sh
ssh app@87.99.148.55 'sudo systemctl show selahkids | grep -i service_role || echo "✓ no service-role in unit env"'
ssh app@87.99.148.55 'sudo grep -ril SERVICE_ROLE /etc/systemd/ /srv/app/site/.env.local /srv/app/site/.env* 2>/dev/null || echo "✓ no service-role in any env file"'
ssh app@87.99.148.55 'sudo grep -ril SERVICE_ROLE /srv/app/site/.next/server/ 2>/dev/null && echo "FAIL: server bundle references service role — investigate" || echo "✓ no service-role in server bundle"'
ssh app@87.99.148.55 'sudo grep -ril SERVICE_ROLE /srv/app/site/.next/static/ 2>/dev/null && echo "FAIL: client bundle leaks service role" || echo "✓ no service-role in client bundle"'
```
If any check FAILs, halt and audit before exposing the deploy.

### 4.3 RLS regression test
After cutover, run the same write the admin UI does, but as `anon` via curl,
and confirm a 401. Otherwise RLS isn't actually protecting data.

### 4.4 Backup before any of this
```sh
ssh root@87.99.148.55 'tar -czf /root/site-backup-$(date +%s).tar.gz /srv/app/site'
```
Plus a Supabase snapshot from the dashboard (or `pg_dump` via the Supabase
direct connection). Without a DB backup, a botched RLS policy edit can corrupt
prod data with no recovery.

## Phase 5 — Rollback procedure (single atomic script)

Manual ordered steps are a footgun under incident pressure. Land a script on
the VM during Phase 3, BEFORE we cut over, that does rollback atomically.
The script is the only sanctioned rollback path; the runbook tells operators
to invoke it, never to run `mv` by hand.

`/usr/local/bin/rollback-to-apr20.sh` (root-owned, mode 700, installed in
Phase 3.0 BEFORE the cutover):
```sh
#!/usr/bin/env bash
# Atomic rollback to Apr 20 build. Designed to be safe under incident
# pressure: every step has set -e, ordering is enforced, the dangerous
# combination "Apr 20 build + Supabase env vars set" is technically
# impossible because we wipe env BEFORE swapping trees AND we add a
# Caddy block on /admin until an operator explicitly clears it.

set -euo pipefail
trap 'echo "ROLLBACK FAILED at line $LINENO — site may be in mixed state, investigate journalctl -u selahkids"; exit 2' ERR

BACKUP_TS=${1:?usage: rollback-to-apr20.sh <backup-timestamp>}

# CRITICAL: validate BACKUP_TS as a pure unsigned integer. Without this,
# `app` (which has NOPASSWD sudo on this script via the sudoers entry below)
# could pass `../../../etc` and the mv would relocate /etc as root.
[[ "$BACKUP_TS" =~ ^[0-9]+$ ]] || {
  echo "FATAL: BACKUP_TS must be a unix timestamp (digits only); got: $BACKUP_TS"
  exit 1
}

BACKUP_PATH=/srv/app/site.apr20-backup-${BACKUP_TS}

# Defense-in-depth: confirm BACKUP_PATH is exactly under /srv/app/ with no
# symlinks or .. components after canonicalization, and was created by `app`
# (not some attacker-controlled directory at the same name).
CANONICAL=$(readlink -f -- "$BACKUP_PATH" 2>/dev/null || true)
[[ "$CANONICAL" == "$BACKUP_PATH" ]] \
  || { echo "FATAL: $BACKUP_PATH does not canonicalize to itself (symlink/traversal)"; exit 1; }
[[ -d "$BACKUP_PATH" && ! -L "$BACKUP_PATH" ]] \
  || { echo "FATAL: $BACKUP_PATH is not a real directory"; exit 1; }
[[ "$(stat -c '%U' "$BACKUP_PATH")" == "root" ]] \
  || { echo "FATAL: $BACKUP_PATH not owned by root — refusing to restore (untrusted tree)"; exit 1; }
# CRITICAL: backup must be ROOT-owned, not app-owned. If we accepted app
# ownership, a compromised app account could pre-create a backup directory
# with malicious code, then invoke this script to have root install it as
# /srv/app/site (the new app root). By requiring root ownership, the only
# path to creating a valid backup is via deploy-site.sh (also root-only),
# which produces a clean snapshot before the cutover.

# Stop first — no point churning Caddy if app stays up serving stale tree.
systemctl stop selahkids

# Wipe runtime env. (In the post-Phase-1.2 plan there is no service-role
# key on the VM, but defense-in-depth: also wipe NEXT_PUBLIC_* so the Apr
# 20 build deterministically falls into offline-mock mode and cannot reach
# Supabase even if a future change re-introduces the service-role key on
# the VM.)
rm -f /etc/systemd/system/selahkids.service.d/override.conf
systemctl daemon-reload

# Block /admin at Caddy unconditionally during rollback. Apr 20's any-password
# mock auth means /admin must NOT be reachable until this is manually cleared.
ROLLBACK_CADDY_SNIPPET=/etc/caddy/conf.d/rollback-block.conf
mkdir -p /etc/caddy/conf.d
cat > "$ROLLBACK_CADDY_SNIPPET" <<'EOF'
# Auto-installed by rollback-to-apr20.sh. Remove this file and reload caddy
# only after re-cutting over to the hardened build.
@admin path /admin /admin/*
respond @admin 503 {
  body "Admin temporarily unavailable during rollback."
  close
}
EOF
systemctl reload caddy

# Swap trees AFTER env is clean and admin is sealed off.
TS=$(date +%s)
mv /srv/app/site "/srv/app/site.broken-${TS}"
mv "$BACKUP_PATH" /srv/app/site

# Clear the preflight marker — a future hardened cutover MUST re-run
# preflight before deploy-site.sh will run again.
rm -f /etc/selahkids/preflight-passed

# Restart app — now Apr 20 build, no Supabase env, /admin returns 503.
systemctl start selahkids

# Sanity probe (1s, no retry — runbook handles retries).
sleep 2
curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/es \
  || { echo "WARNING: /es did not return 2xx after rollback"; exit 3; }

echo "✓ rollback complete to Apr 20 backup ${BACKUP_TS}; /admin sealed (503)"
echo "  to re-enable /admin: rm $ROLLBACK_CADDY_SNIPPET && systemctl reload caddy"
echo "  but only AFTER the next hardened cutover. /admin on Apr 20 has any-password auth."
```

Sudoers entry. Sudoers globs are NOT regex — `[0-9]*` matches "starts with a
digit, then anything", which is too loose (`1; rm -rf /` matches by glob,
though sudo doesn't shell-expand the arg). The real security boundary is the
script's `^[0-9]+$` regex check. Sudo just needs to permit calls; we don't
try to enforce digit-only at the sudo layer.
```
app ALL=(root) NOPASSWD: /usr/local/bin/rollback-to-apr20.sh
app ALL=(root) NOPASSWD: /usr/local/bin/rollback-to-apr20.sh *
```
Defense-in-depth lives in the script:
1. `[[ "$BACKUP_TS" =~ ^[0-9]+$ ]]` — rejects anything non-numeric
2. `readlink -f` canonicalization that must equal the literal path
3. ownership check that the dir is owned by `app`
Even if an attacker compromises `app` and bypasses sudo restrictions, the
script's input validation makes path traversal impossible.

Documented usage:
```sh
sudo /usr/local/bin/rollback-to-apr20.sh <BACKUP_TIMESTAMP>
```
Operator looks up the timestamp via `ls /srv/app/site.apr20-backup-*` and
passes it as the only argument. Nothing else to remember.

If Supabase data is corrupted: restore from the dashboard snapshot. RTO ~30 min.

## Verification checklist

- [ ] `https://selahkids.com/es` returns 200 with `<html lang="es">`
- [ ] `https://selahkids.com/` 307-redirects to `/es`
- [ ] `https://selahkids.com/admin` 307-redirects to `/admin/login` for anon
- [ ] Bad password on `/admin/login` shows error, does not log in
- [ ] Valid admin login reaches `/admin` dashboard
- [ ] Editing a `site_settings` field in admin persists and shows on `/es`
- [ ] curl PATCH against PostgREST as `anon` returns 401 (RLS holds)
- [ ] No `SUPABASE_SERVICE_ROLE_KEY` literal in `.next/static/`
- [ ] GitHub Actions deploy workflow triggers on push and smoke-tests pass
- [ ] Backup tarball + Supabase snapshot exist before cutover

## Risks

1. **RLS policies missing on some tables.** Mitigation: phase 1.2 audit; fix
   policies in Supabase before phase 3.
2. **Schema drift between Apr 20 expectations and current Supabase schema.**
   `feat/admin-merge` was developed against current schema, so this risk is on
   the *cherry-pick* (Apr 20 visuals): if the homepage component reads
   `today.episode_id` and the schema renamed it, public site breaks. Mitigation:
   diff the schema use sites in the cherry-picked components against
   `lib/cms-server.ts` types.
3. **Service-role key leakage.** Mitigation: 4.2 grep + Next.js will refuse to
   inline server-only env vars into client bundles by default (no `NEXT_PUBLIC_`
   prefix on the service key).
4. **GitHub Actions secret stale.** `HETZNER_SSH_KEY` and `HETZNER_HOST` are
   already set; no change needed.
5. **DNS / cert disruption.** None expected — we're not touching Caddy or DNS.

## Effort estimate

- Phase 1 (pre-flight): 1-2 h, mostly Supabase clicking
- Phase 2 (staging on VM): 30 min build + 30 min testing + godspeed pass
- Phase 3 (cutover): 15 min if Phase 2 was clean
- Phase 4 (hardening checks): 30 min
- Total wall-clock: ~3-4 h, almost all on RLS/Supabase verification
