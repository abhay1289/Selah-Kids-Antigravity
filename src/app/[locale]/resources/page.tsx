import React from 'react';
import { getPageContent } from '@/lib/cms-server';
import { INITIAL_PAGE_RESOURCES } from '@/data/page-content-resources';
import ResourcesPageClient from './ResourcesPageClient';

export default async function ResourcesPage() {
  const fields = await getPageContent('resources', INITIAL_PAGE_RESOURCES);
  return <ResourcesPageClient fields={fields} />;
}
