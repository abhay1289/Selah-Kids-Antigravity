'use client';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MediaProvider } from '../contexts/MediaContext';
import VideoOverlay from './player/VideoOverlay';
import MiniPlayer from './player/MiniPlayer';
import { WorldProvider } from './world/WorldProvider';
import ShilohCompanion from './world/ShilohCompanion';
import { useWorld } from '../stores/world';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shilohEnabled = useWorld((s) => s.shilohEnabled);

  // Admin owns its own shell (sidebar + header). Don't double-wrap with public chrome.
  if (pathname?.startsWith('/admin')) return <>{children}</>;

  return (
    <WorldProvider>
      <MediaProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <VideoOverlay />
        {shilohEnabled && <ShilohCompanion />}
        <MiniPlayer />
      </MediaProvider>
    </WorldProvider>
  );
}
