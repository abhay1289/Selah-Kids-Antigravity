'use client';

import { MediaProvider } from '../../../../contexts/MediaContext';
import { WorldProvider } from '../../../../components/world/WorldProvider';

/**
 * Minimal provider stack for preview renders. Public pages expect
 * MediaProvider (`useMedia` inside TodaysEpisode, WatchGrid, etc.) and
 * WorldProvider (the scroll/world store backing CSS vars). LanguageProvider
 * is already supplied by the root layout so it isn't duplicated here.
 *
 * Navbar / Footer / MiniPlayer are intentionally omitted — the preview
 * surface focuses on the page body so editors can QA content edits
 * without competing chrome.
 */
export function PreviewProviders({ children }: { children: React.ReactNode }) {
  return (
    <WorldProvider>
      <MediaProvider>{children}</MediaProvider>
    </WorldProvider>
  );
}
