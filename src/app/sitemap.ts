import type { MetadataRoute } from 'next';
import { getCollection } from '@/lib/cms-server';
import { INITIAL_BLOG_POSTS, INITIAL_CHARACTERS } from '@/data/cms-fallbacks';
import type { BlogPost } from '@/data/blogPosts';
import type { Character } from '@/data/characters';
import { SITE_ORIGIN } from '@/data/chrome-seo';

/**
 * Dynamic sitemap — one entry per logical page, with per-locale
 * `alternates.languages` so Google can group EN + ES variants as the
 * same document in different languages (hreflang equivalence).
 *
 * Static routes: hand-listed below. Dynamic routes (blog + character
 * slugs): fetched from the same CMS collections the public pages use,
 * so admin-published content shows up in the sitemap on the next
 * revalidate without a code change.
 *
 * Priorities are relative hints for crawlers, not absolute weights —
 * the homepage gets 1.0, primary content pages 0.8, detail pages 0.6,
 * utility pages (privacy/terms) 0.3.
 */

interface StaticRoute {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}

const STATIC_ROUTES: StaticRoute[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/watch', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/music', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/characters', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/resources', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/parents', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/sensory', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/donate', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
];

function localeUrl(locale: 'en' | 'es', path: string): string {
  return `${SITE_ORIGIN}${path === '/' ? `/${locale}/` : `/${locale}${path}`}`;
}

function buildEntry(path: string, priority: number, changeFrequency: StaticRoute['changeFrequency'], lastModified?: Date) {
  const enUrl = localeUrl('en', path);
  const esUrl = localeUrl('es', path);
  return [
    {
      url: enUrl,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          en: enUrl,
          es: esUrl,
          'x-default': esUrl,
        },
      },
    },
    {
      url: esUrl,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          en: enUrl,
          es: esUrl,
          'x-default': esUrl,
        },
      },
    },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, characters] = await Promise.all([
    getCollection<BlogPost>('blog_posts', INITIAL_BLOG_POSTS),
    getCollection<Character>('characters', INITIAL_CHARACTERS),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const route of STATIC_ROUTES) {
    entries.push(...buildEntry(route.path, route.priority, route.changeFrequency));
  }

  for (const post of blogPosts) {
    // Respect per-locale slug overrides when present; fall back to the
    // shared legacy slug so partially translated posts still index.
    const enSlug = post.slugEn || post.slug;
    const esSlug = post.slugEs || post.slug;
    const enUrl = `${SITE_ORIGIN}/en/blog/${enSlug}`;
    const esUrl = `${SITE_ORIGIN}/es/blog/${esSlug}`;
    const alternates = { languages: { en: enUrl, es: esUrl, 'x-default': enUrl } };
    entries.push(
      { url: enUrl, changeFrequency: 'monthly', priority: 0.6, alternates },
      { url: esUrl, changeFrequency: 'monthly', priority: 0.6, alternates },
    );
  }

  for (const char of characters) {
    const enSlug = char.slugEn || char.slug;
    const esSlug = char.slugEs || char.slug;
    const enUrl = `${SITE_ORIGIN}/en/characters/${enSlug}`;
    const esUrl = `${SITE_ORIGIN}/es/characters/${esSlug}`;
    const alternates = { languages: { en: enUrl, es: esUrl, 'x-default': enUrl } };
    entries.push(
      { url: enUrl, changeFrequency: 'monthly', priority: 0.6, alternates },
      { url: esUrl, changeFrequency: 'monthly', priority: 0.6, alternates },
    );
  }

  return entries;
}
