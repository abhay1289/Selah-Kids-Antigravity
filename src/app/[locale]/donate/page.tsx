import React from 'react';
import type { Metadata } from 'next';
import { getPageContent, getSeoMetadata } from '@/lib/cms-server';
import { INITIAL_PAGE_DONATE } from '@/data/page-content-donate';
import { isLocale } from '@/lib/i18n';
import DonatePageClient from './DonatePageClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata('/donate', isLocale(locale) ? locale : 'en');
}

export default async function DonatePage() {
  const fields = await getPageContent('donate', INITIAL_PAGE_DONATE);
  return <DonatePageClient fields={fields} />;
}
