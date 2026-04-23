import type { Metadata } from 'next';
import { getPageContent, getSeoMetadata } from '@/lib/cms-server';
import { INITIAL_PAGE_ABOUT } from '@/data/page-content-about';
import { isLocale } from '@/lib/i18n';
import AboutPageClient from './AboutPageClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata('/about', isLocale(locale) ? locale : 'en');
}

export default async function AboutPage() {
  const fields = await getPageContent('about', INITIAL_PAGE_ABOUT);
  return <AboutPageClient fields={fields} />;
}
