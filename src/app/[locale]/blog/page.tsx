import { getCollection } from '@/lib/cms-server';
import { INITIAL_BLOG_POSTS } from '@/data/cms-fallbacks';
import type { BlogPost } from '@/data/blogPosts';
import BlogPageClient from './BlogPageClient';

/**
 * Blog list — server component, Phase 3 CMS-driven.
 *
 * Public read path: cms-server.getCollection('blog_posts', INITIAL_BLOG_POSTS)
 * - offline mode (no Supabase env) → returns INITIAL_BLOG_POSTS unchanged
 * - online mode → tagged fetch against Supabase with 24h backstop, filtered
 *   to is_published=true by the public RLS policy
 * - admin preview mode → not plumbed here yet; Phase 4 adds preview routes
 *
 * Data shape: BlogPost from src/data/blogPosts.ts is the source-of-truth
 * shape during the Phase 3 transition. Collection rows store the same
 * shape in their JSONB `data` column and unpack back into BlogPost via
 * cms-server's generic.
 */
export default async function BlogPage() {
  const posts = await getCollection<BlogPost>('blog_posts', INITIAL_BLOG_POSTS);
  return <BlogPageClient posts={posts} />;
}
