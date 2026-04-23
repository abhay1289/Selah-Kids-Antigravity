import { notFound } from 'next/navigation';
import { getCollection } from '@/lib/cms-server';
import { INITIAL_BLOG_POSTS } from '@/data/cms-fallbacks';
import type { BlogPost } from '@/data/blogPosts';
import BlogPostClient from './BlogPostClient';

/**
 * Blog detail — server component, Phase 3 CMS-driven.
 *
 * Reads the full collection once per render and picks the post by slug.
 * We do NOT query by slug on the server because PostgREST's anon key
 * doesn't have a cheap "find one" helper that works with the tagged
 * fetch cache — so we reuse the same tagged list response the blog list
 * page already primes, getting it free out of the cache on subsequent
 * detail views. The 24h ISR backstop applies the same way.
 *
 * dynamicParams defaults to true — slugs not in the fallback still
 * render (SSR on demand) once the admin adds them in the CMS.
 */

interface BlogSlugPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function BlogSlugPage({ params }: BlogSlugPageProps) {
  const { slug } = await params;
  const posts = await getCollection<BlogPost>('blog_posts', INITIAL_BLOG_POSTS);
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  return <BlogPostClient post={post} allPosts={posts} />;
}
