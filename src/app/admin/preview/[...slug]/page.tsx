/**
 * Admin preview catch-all. Renders the matching public page with
 * cms-server in 'preview' mode so drafts (is_published=false) are
 * visible. The middleware sets `x-selah-preview: 1` on every request
 * under /admin/preview/*; cms-server's `resolveMode` picks that up and
 * switches to the authenticated PostgREST path that bypasses the public
 * RLS gate.
 *
 * Slug routing (locale prefix optional — defaults to 'en'):
 *   /admin/preview/about               → <AboutPage> with preview reads
 *   /admin/preview/en/about            → same, explicit locale
 *   /admin/preview/es/watch            → <WatchPage> Spanish preview
 *   /admin/preview/blog/my-post        → <BlogSlugPage> with that slug
 *   /admin/preview/characters/shiloh   → <CharacterSlugPage> with slug
 *
 * Unmapped paths render a friendly "no preview handler" notice rather
 * than 404 so editors aren't stranded on an empty page while new routes
 * are being wired.
 *
 * Auth: gated by middleware.ts (admin cookie required for /admin/*).
 */

import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n';

import HomeClient from '@/components/home/HomeClient';
import AboutPageClient from '@/app/[locale]/about/AboutPageClient';
import WatchPageClient from '@/app/[locale]/watch/WatchPageClient';
import ParentsPageClient from '@/app/[locale]/parents/ParentsPageClient';
import DonatePageClient from '@/app/[locale]/donate/DonatePageClient';
import BlogPageClient from '@/app/[locale]/blog/BlogPageClient';
import ResourcesPageClient from '@/app/[locale]/resources/ResourcesPageClient';
import { PreviewProviders } from './PreviewProviders';

import { getCollection, getPageContent } from '@/lib/cms-server';
import { INITIAL_PAGE_HOME } from '@/data/page-content-home';
import { INITIAL_PAGE_ABOUT } from '@/data/page-content-about';
import { INITIAL_PAGE_WATCH } from '@/data/page-content-watch';
import { INITIAL_PAGE_PARENTS } from '@/data/page-content-parents';
import { INITIAL_PAGE_DONATE } from '@/data/page-content-donate';
import { INITIAL_PAGE_RESOURCES } from '@/data/page-content-resources';
import { INITIAL_VIDEOS, INITIAL_BLOG_POSTS } from '@/data/cms-fallbacks';
import type { Episode } from '@/data/catalog';
import type { BlogPost } from '@/data/blogPosts';

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

function parseSlug(slug: string[]): { locale: Locale; rest: string[] } {
  if (slug[0] && (SUPPORTED_LOCALES as readonly string[]).includes(slug[0])) {
    return { locale: slug[0] as Locale, rest: slug.slice(1) };
  }
  return { locale: 'en', rest: slug };
}

async function renderPreview(rest: string[]): Promise<React.ReactNode> {
  const opts = { mode: 'preview' as const };

  // Home (no additional segments)
  if (rest.length === 0) {
    const fields = await getPageContent('home', INITIAL_PAGE_HOME, opts);
    return <HomeClient fields={fields} />;
  }

  const [head, ...tail] = rest;

  switch (head) {
    case 'about': {
      const fields = await getPageContent('about', INITIAL_PAGE_ABOUT, opts);
      return <AboutPageClient fields={fields} />;
    }
    case 'watch': {
      const [episodes, fields] = await Promise.all([
        getCollection<Episode>('videos', INITIAL_VIDEOS, opts),
        getPageContent('watch', INITIAL_PAGE_WATCH, opts),
      ]);
      return <WatchPageClient episodes={episodes} fields={fields} />;
    }
    case 'parents': {
      const fields = await getPageContent('parents', INITIAL_PAGE_PARENTS, opts);
      return <ParentsPageClient fields={fields} />;
    }
    case 'donate': {
      const fields = await getPageContent('donate', INITIAL_PAGE_DONATE, opts);
      return <DonatePageClient fields={fields} />;
    }
    case 'resources': {
      const fields = await getPageContent('resources', INITIAL_PAGE_RESOURCES, opts);
      return <ResourcesPageClient fields={fields} />;
    }
    case 'blog': {
      if (tail.length === 0) {
        const posts = await getCollection<BlogPost>('blog_posts', INITIAL_BLOG_POSTS, opts);
        return <BlogPageClient posts={posts} />;
      }
      // Individual post preview needs rich-content sanitisation work before
      // we can safely render admin-authored bodies here. Signal that
      // specifically so editors aren't told to "add a case" when the real
      // blocker is content validation.
      return <BlogSlugNotice slug={tail[0] ?? ''} />;
    }
    default:
      return null;
  }
}

function BlogSlugNotice({ slug }: { slug: string }) {
  return (
    <div className="max-w-[760px] mx-auto p-10 space-y-5">
      <h1
        className="text-[26px] font-bold text-[#3a6b44]"
        style={{ fontFamily: 'var(--font-fredoka), system-ui, sans-serif' }}
      >
        Blog post preview not yet available
      </h1>
      <p className="text-[15px] leading-relaxed text-[#5a7d62]">
        Draft preview for individual blog posts is pending rich-content
        validation work — admin-authored post bodies need sanitisation before
        we can safely render them here. For now, draft posts (
        <code className="mx-1 px-1.5 py-0.5 rounded bg-[#3a6b44]/10 font-mono text-[13px]">
          {slug || '(no slug)'}
        </code>
        ) can be previewed by toggling publish in the editor and visiting the
        public URL directly.
      </p>
    </div>
  );
}

function UnmappedNotice({ target }: { target: string }) {
  return (
    <div className="max-w-[760px] mx-auto p-10 space-y-5">
      <h1
        className="text-[26px] font-bold text-[#3a6b44]"
        style={{ fontFamily: 'var(--font-fredoka), system-ui, sans-serif' }}
      >
        No preview handler for {target}
      </h1>
      <p className="text-[15px] leading-relaxed text-[#5a7d62]">
        The preview dispatcher doesn&apos;t have a mapping for this route yet. Add a case in{' '}
        <code className="mx-1 px-1.5 py-0.5 rounded bg-[#3a6b44]/10 font-mono text-[13px]">
          src/app/admin/preview/[...slug]/page.tsx::renderPreview
        </code>{' '}
        to wire it. In the meantime, the draft banner above confirms auth + preview mode is active.
      </p>
    </div>
  );
}

interface PreviewPageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function PreviewCatchAll({ params }: PreviewPageProps) {
  const admin = await requireAdmin();
  if (!admin) notFound();

  const { slug = [] } = await params;
  const { locale, rest } = parseSlug(slug);
  const target = '/' + [locale, ...rest].join('/');
  const rendered = await renderPreview(rest);

  return (
    <div className="min-h-screen bg-[#fafdf6]">
      <div
        className="sticky top-0 z-50 bg-[#ff5c00] text-white text-[13px] font-bold px-6 py-2.5 flex items-center gap-3 shadow-lg"
        style={{ fontFamily: 'var(--font-fredoka), system-ui, sans-serif' }}
      >
        <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
        <span>DRAFT PREVIEW</span>
        <span className="text-white/80 font-medium">· {target}</span>
        <span className="text-white/70 font-medium ml-auto">Editor: {admin.email}</span>
      </div>

      <PreviewProviders>{rendered ?? <UnmappedNotice target={target} />}</PreviewProviders>
    </div>
  );
}
