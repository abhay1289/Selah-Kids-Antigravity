import React from 'react';
import { getPageContent } from '@/lib/cms-server';
import { INITIAL_PAGE_DONATE } from '@/data/page-content-donate';
import DonatePageClient from './DonatePageClient';

export default async function DonatePage() {
  const fields = await getPageContent('donate', INITIAL_PAGE_DONATE);
  return <DonatePageClient fields={fields} />;
}
