# Admin Panel Quickstart — When You Have Supabase Keys

Three keys needed (Supabase dashboard → Project Settings → API):
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

## Step 1 — Save keys locally (~30 s)

```sh
cat > ~/.selahkids-supabase.env <<'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://<your-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste anon key>
SUPABASE_SERVICE_ROLE_KEY=<paste service-role key>
EOF
chmod 600 ~/.selahkids-supabase.env
```

## Step 2 — Apply schema in Supabase SQL Editor (~3 min)

Open Supabase dashboard → SQL Editor → New query.
Paste the contents of `supabase-schema.sql` (whole file). Run.
Then: paste `migrations/2026-04-24-seo-pages-per-locale.sql`. Run.

Both are idempotent — safe to re-run.

## Step 3 — Add yourself to `admin_users` (~1 min)

In Supabase dashboard → Authentication → Users → invite yourself
(or sign up at the temporary `/admin/login` after step 5).

Copy your user UUID. Then in SQL Editor:
```sql
insert into admin_users (user_id, email, role)
values ('<your-uuid>', '<your-email>', 'admin')
on conflict (user_id) do update set role = 'admin';
```

## Step 4 — Seed CMS content from local fallbacks (~1 min)

```sh
cd ~/Downloads/Code/Selah-Kids-Antigravity
cp ~/.selahkids-supabase.env .env.local
bun install
bun run seed:cms
```

This populates `collections`, `page_content`, `site_settings`, etc. from
`src/data/cms-fallbacks.ts`. Idempotent.

## Step 5 — Wire admin onto the production VM (~5 min)

```sh
bash scripts/wire-admin-on-vm.sh
```

This:
- Backs up the Apr 20 tree as `/srv/app/site.apr20-backup-<ts>` (root-owned)
- Fresh-clones `feat/admin-merge` into `/srv/app/site`
- Installs `.env.local` (build-time) + systemd `Environment=` (runtime)
  with **only** the two `NEXT_PUBLIC_*` keys (service-role stays on laptop)
- `bun install` + `bun run build`
- Verifies no service-role leak in `.next/` bundles
- Restarts `selahkids` systemd service
- Smoke-tests `/es` (expect 200) and `/admin` (expect 200/307/302)

## Step 6 — Sign in

Visit https://selahkids.com/admin/login → sign in with your Supabase Auth
credentials. You should land on `/admin` and be able to edit content.

## Rollback if anything breaks

The `wire-admin-on-vm.sh` script prints the rollback command at the end:
```sh
ssh app@87.99.148.55 \
  'sudo systemctl stop selahkids && \
   sudo mv /srv/app/site /srv/app/site.broken && \
   sudo mv /srv/app/site.apr20-backup-<TS> /srv/app/site && \
   sudo rm -f /etc/systemd/system/selahkids.service.d/override.conf && \
   sudo systemctl daemon-reload && \
   sudo systemctl start selahkids'
```

After rollback the site serves the Apr 20 build with no admin (offline
mock mode). Public pages unaffected.

## What's already done

- ✅ `feat/admin-merge` code uses `@supabase/ssr` cookie auth with
  `is_admin()` RLS — no service-role on server, RLS is the boundary
- ✅ Schema with admin allow-list + secure `is_admin()` function
- ✅ Seed script for CMS content
- ✅ One-shot deploy script (`scripts/wire-admin-on-vm.sh`)
- ✅ Pushed to GitHub, ready to deploy

## What still needs you

- Supabase project credentials (steps 1, 3 require dashboard access)

That's it — once steps 1-3 are done, steps 4-6 take ~10 minutes total.
