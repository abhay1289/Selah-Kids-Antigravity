import type { Metadata } from 'next';
import HomeClient from "@/components/home/HomeClient";
import { getPageContent, getSeoMetadata } from "@/lib/cms-server";
import { INITIAL_PAGE_HOME } from "@/data/page-content-home";
import { isLocale } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/data/chrome-seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata('/', isLocale(locale) ? locale : 'en');
}

/**
 * Build Organization + WebSite JSON-LD for the homepage.
 *
 * - `Organization` anchors the brand in Google's Knowledge Graph (name,
 *   logo, social profiles). `sameAs` links to YouTube/Spotify etc. help
 *   Google associate our real accounts with the domain.
 * - `WebSite` declares the site identity and enables the sitelinks
 *   search box when Google chooses to surface it.
 *
 * Scoped to the homepage only — per Google's guidelines, these entities
 * are declared once per site.
 */
function buildHomepageJsonLd(locale: 'en' | 'es') {
  const url = `${SITE_ORIGIN}/${locale}/`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Selah Kids',
      url: SITE_ORIGIN,
      logo: `${SITE_ORIGIN}/SK_Logo_FN.png`,
      sameAs: [
        'https://www.youtube.com/@selahkidsworship',
        'https://www.youtube.com/@SelahKidsEspanol',
        'https://www.instagram.com/selahkids',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Selah Kids',
      url,
      inLanguage: locale === 'es' ? 'es' : 'en',
    },
  ];
}

export default async function Home({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : 'en';
  const fields = await getPageContent('home', INITIAL_PAGE_HOME);
  const jsonLd = buildHomepageJsonLd(locale);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient fields={fields} />
    </>
  );
}
