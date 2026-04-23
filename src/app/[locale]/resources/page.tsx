import React from 'react';
import type { Metadata } from 'next';
import { getPageContent, getSeoMetadata } from '@/lib/cms-server';
import { INITIAL_PAGE_RESOURCES } from '@/data/page-content-resources';
import { isLocale } from '@/lib/i18n';
import ResourcesPageClient from './ResourcesPageClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata('/resources', isLocale(locale) ? locale : 'en');
}

export default async function ResourcesPage() {
  const fields = await getPageContent('resources', INITIAL_PAGE_RESOURCES);
  return <ResourcesPageClient fields={fields} />;
}
