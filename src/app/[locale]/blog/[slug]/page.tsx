import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCollection } from '@/lib/cms-server';
import { INITIAL_BLOG_POSTS } from '@/data/cms-fallbacks';
import { resolveBlogPost, pairedBlogSlug, type BlogPost } from '@/data/blogPosts';
import { isLocale } from '@/lib/i18n';
import { SITE_ORIGIN } from '@/data/chrome-seo';
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

/**
 * Per-post metadata — titles, descriptions, canonical, hreflang, and OG
 * are all derived from the CMS row. Falls back to the bilingual fields
 * of the resolved post so a partial translation still produces valid
 * metadata instead of an empty `<title>`.
 */
export async function generateMetadata({ params }: BlogSlugPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const resolvedLocale = isLocale(locale) ? locale : 'en';
  const posts = await getCollection<BlogPost>('blog_posts', INITIAL_BLOG_POSTS);
  const post = resolveBlogPost(posts, slug, resolvedLocale);
  if (!post) return {};

  const title = resolvedLocale === 'es' ? (post.titleEs || post.titleEn) : (post.titleEn || post.titleEs);
  const rawBody = resolvedLocale === 'es' ? (post.contentEs[0] || post.contentEn[0]) : (post.contentEn[0] || post.contentEs[0]);
  // Strip markdown/HTML and cap at ~155 chars — Google truncates around
  // 160 on mobile SERPs, so staying just under that keeps the snippet
  // whole instead of ending mid-word.
  const description = (rawBody || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 155);

  const enSlug = post.slugEn || post.slug;
  const esSlug = post.slugEs || post.slug;
  const enUrl = `${SITE_ORIGIN}/en/blog/${enSlug}`;
  const esUrl = `${SITE_ORIGIN}/es/blog/${esSlug}`;
  const canonical = resolvedLocale === 'es' ? esUrl : enUrl;
  const ogImage = post.img.startsWith('http') ? post.img : `${SITE_ORIGIN}${post.img.startsWith('/') ? '' : '/'}${post.img}`;

  // Paired slug tells us whether a true translation exists. When it's
  // null we omit the opposite-locale alternate so Google doesn't index
  // a URL that 404s or renders the same language.
  const paired = pairedBlogSlug(posts, post.slug, resolvedLocale === 'es' ? 'en' : 'es');
  const languages: Record<string, string> = { [resolvedLocale]: canonical };
  if (paired) {
    const otherUrl = resolvedLocale === 'es' ? enUrl : esUrl;
    languages[resolvedLocale === 'es' ? 'en' : 'es'] = otherUrl;
    languages['x-default'] = esUrl;
  }

  return {
    title: { absolute: `${title} — Selah Kids` },
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonical,
      siteName: 'Selah Kids',
      images: [{ url: ogImage }],
      locale: resolvedLocale === 'es' ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogSlugPage({ params }: BlogSlugPageProps) {
  const { slug, locale } = await params;
  // Only EN/ES are supported; anything else falls back to EN so the
  // resolver treats the request as the default locale rather than
  // short-circuiting on a narrowed union type mismatch.
  const resolvedLocale = isLocale(locale) ? locale : 'en';
  const posts = await getCollection<BlogPost>('blog_posts', INITIAL_BLOG_POSTS);
  const post = resolveBlogPost(posts, slug, resolvedLocale);
  if (!post) notFound();

  // Article JSON-LD — lets Google surface this post in the top-stories
  // carousel and rich Article cards. headline/image/datePublished are
  // the required properties; author is recommended and anchors the
  // post to the Selah Kids brand entity.
  const postTitle = resolvedLocale === 'es' ? (post.titleEs || post.titleEn) : (post.titleEn || post.titleEs);
  const postImage = post.img.startsWith('http') ? post.img : `${SITE_ORIGIN}${post.img.startsWith('/') ? '' : '/'}${post.img}`;
  const postUrl = `${SITE_ORIGIN}/${resolvedLocale}/blog/${(resolvedLocale === 'es' ? post.slugEs : post.slugEn) || post.slug}`;
  const publishedRaw = resolvedLocale === 'es' ? post.dateEs : post.dateEn;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: postTitle,
    image: [postImage],
    datePublished: publishedRaw,
    author: { '@type': 'Organization', name: 'Selah Kids', url: SITE_ORIGIN },
    publisher: {
      '@type': 'Organization',
      name: 'Selah Kids',
      logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/SK_Logo_FN.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    inLanguage: resolvedLocale,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogPostClient post={post} allPosts={posts} />
    </>
  );
}
