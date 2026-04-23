import type { Metadata } from 'next';
import { getPageContent, getSeoMetadata } from '@/lib/cms-server';
import { INITIAL_PAGE_PARENTS } from '@/data/page-content-parents';
import { isLocale } from '@/lib/i18n';
import ParentsPageClient from './ParentsPageClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata('/parents', isLocale(locale) ? locale : 'en');
}

/**
 * Parents (Families) — server component, Phase 4 CMS-driven.
 *
 * Hero copy is fetched via getPageContent('parents', …) so admin edits land on
 * the live site without a deploy. When the DB has no row yet, the in-repo
 * INITIAL_PAGE_PARENTS fallback keeps the page rendering identical to
 * pre-migration output.
 */
export default async function ParentsPage() {
  const fields = await getPageContent('parents', INITIAL_PAGE_PARENTS);
  return <ParentsPageClient fields={fields} />;
}
