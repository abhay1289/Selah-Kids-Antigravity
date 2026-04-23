import { getCollection, getPageContent } from '@/lib/cms-server';
import { INITIAL_VIDEOS } from '@/data/cms-fallbacks';
import { INITIAL_PAGE_WATCH } from '@/data/page-content-watch';
import type { Episode } from '@/data/catalog';
import WatchPageClient from './WatchPageClient';

/**
 * Watch — server component, Phase 3 CMS-driven.
 *
 * Fetches the full episode catalog via getCollection('videos', INITIAL_VIDEOS).
 * Client half filters by active language + category; the full list is
 * small enough (~tens of items) that sending all of it down and filtering
 * client-side is cheaper than per-filter round-trips, and preserves the
 * existing instant UX when the user toggles categories.
 *
 * Page copy (hero section) is fetched via getPageContent('watch', …) so admin
 * edits land on the live site without a deploy.
 */
export default async function WatchPage() {
  const [episodes, pageFields] = await Promise.all([
    getCollection<Episode>('videos', INITIAL_VIDEOS),
    getPageContent('watch', INITIAL_PAGE_WATCH),
  ]);
  return <WatchPageClient episodes={episodes} fields={pageFields} />;
}
