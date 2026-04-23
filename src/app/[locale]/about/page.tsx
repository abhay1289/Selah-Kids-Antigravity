import { getPageContent } from '@/lib/cms-server';
import { INITIAL_PAGE_ABOUT } from '@/data/page-content-about';
import AboutPageClient from './AboutPageClient';

export default async function AboutPage() {
  const fields = await getPageContent('about', INITIAL_PAGE_ABOUT);
  return <AboutPageClient fields={fields} />;
}
