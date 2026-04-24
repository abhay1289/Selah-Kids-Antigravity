import type { Metadata } from 'next';
import { getPageContent, getSeoMetadata } from '@/lib/cms-server';
import { INITIAL_PAGE_CONTACT } from '@/data/page-content-contact';
import { isLocale } from '@/lib/i18n';
import ContactPageClient from './ContactPageClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata('/contact', isLocale(locale) ? locale : 'en');
}

export default async function ContactPage() {
  const fields = await getPageContent('contact', INITIAL_PAGE_CONTACT);
  return <ContactPageClient fields={fields} />;
}
