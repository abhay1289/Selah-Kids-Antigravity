/**
 * Admin preview route (catch-all).
 *
 * `/admin/preview/blog/my-post` → renders the public `/blog/my-post` page
 * with cms-server.ts operating in 'preview' mode, so drafts (is_published =
 * false) are visible. Lets editors QA unpublished content without flipping
 * the publish toggle.
 *
 * Why catch-all [...slug] instead of [page]: paths can be nested
 * (`/blog/[slug]`, `/characters/[slug]`), so a single-segment param would
 * miss detail routes. Gemini v3 flagged this as CRITICAL.
 *
 * Auth: gated by middleware.ts (admin cookie required for /admin/*).
 * Runtime: cache: 'no-store' — admins should see their most recent save
 * immediately, never a stale tagged cache entry.
 *
 * Scope in Phase 1: this page renders a placeholder announcing the route
 * is wired but not yet pointing at the real public page tree. Phase 4
 * replaces the placeholder with a dynamic import of the actual public
 * component tree, passing `mode: 'preview'` down to cms-server reads.
 */

import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function requireAdmin(): Promise<{ email: string } | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    // Offline: let any caller in (dev demo). No drafts to hide offline.
    return { email: 'offline@selahkids.local' };
  }
  const store = await cookies();
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (refreshed) => {
        for (const { name, value, options } of refreshed) {
          try {
            store.set(name, value, options);
          } catch {
            /* read-only */
          }
        }
      },
    },
  });
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;
  const { data: adminRow } = await supabase
    .from('admin_users')
    .select('email')
    .eq('user_id', userData.user.id)
    .maybeSingle();
  if (!adminRow) return null;
  return { email: adminRow.email };
}

interface PreviewPageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function PreviewCatchAll({ params }: PreviewPageProps) {
  const admin = await requireAdmin();
  if (!admin) notFound();

  const { slug = [] } = await params;
  const target = '/' + slug.join('/');

  return (
    <div className="min-h-screen bg-[#fafdf6]">
      {/* Draft banner — visible on every preview render */}
      <div
        className="sticky top-0 z-50 bg-[#ff5c00] text-white text-[13px] font-bold px-6 py-2.5 flex items-center gap-3 shadow-lg"
        style={{ fontFamily: 'var(--font-fredoka), system-ui, sans-serif' }}
      >
        <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
        <span>DRAFT PREVIEW</span>
        <span className="text-white/80 font-medium">· {target}</span>
        <span className="text-white/70 font-medium ml-auto">Editor: {admin.email}</span>
      </div>

      {/* Phase 1 placeholder. Phase 4 replaces this with a dispatcher that
          dynamically imports the matching public page component and passes
          { mode: 'preview' } to every cms-server read it performs. */}
      <div className="max-w-[760px] mx-auto p-10 space-y-5">
        <h1
          className="text-[26px] font-bold text-[#3a6b44]"
          style={{ fontFamily: 'var(--font-fredoka), system-ui, sans-serif' }}
        >
          Preview route wired
        </h1>
        <p className="text-[15px] leading-relaxed text-[#5a7d62]">
          This catch-all is ready. It validates admin auth and renders the draft banner for
          <code className="mx-1.5 px-1.5 py-0.5 rounded bg-[#3a6b44]/10 font-mono text-[13px]">{target}</code>.
          Rendering the actual public page tree happens in Phase 4 once each route is converted
          to read from <code className="mx-1.5 px-1.5 py-0.5 rounded bg-[#3a6b44]/10 font-mono text-[13px]">cms-server.ts</code>.
        </p>
        <p className="text-[14px] leading-relaxed text-[#5a7d62]/70">
          Until then, admins can check drafts by visiting the corresponding public URL directly after
          toggling publish in the editor. Nothing on the public site changes.
        </p>
      </div>
    </div>
  );
}
