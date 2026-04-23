'use client';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AnnouncementBanner } from './AnnouncementBanner';
import { MediaProvider } from '../contexts/MediaContext';
import VideoOverlay from './player/VideoOverlay';
import MiniPlayer from './player/MiniPlayer';
import { WorldProvider } from './world/WorldProvider';
import ShilohCompanion from './world/ShilohCompanion';
import { useWorld } from '../stores/world';
import type { NavLink, NavSettings } from '../data/chrome-navbar';
import type { FooterLink, SocialLink, FooterSettings } from '../data/chrome-footer';
import type { Banner } from '../data/chrome-announcements';

interface LayoutShellProps {
  children: React.ReactNode;
  navLinks: NavLink[];
  navSettings: NavSettings;
  footerLinks: FooterLink[];
  footerSocial: SocialLink[];
  footerSettings: FooterSettings;
  banners: Banner[];
}

/**
 * Public locale shell. Mounted by /[locale]/layout.tsx only — admin has its
 * own layout, so this no longer needs to branch on pathname. Chrome data
 * arrives already fetched from the server layout.
 */
export function LayoutShell({
  children,
  navLinks,
  navSettings,
  footerLinks,
  footerSocial,
  footerSettings,
  banners,
}: LayoutShellProps) {
  const shilohEnabled = useWorld((s) => s.shilohEnabled);

  return (
    <WorldProvider>
      <MediaProvider>
        <AnnouncementBanner banners={banners} />
        <Navbar navLinks={navLinks} navSettings={navSettings} />
        <main>{children}</main>
        <Footer footerLinks={footerLinks} footerSocial={footerSocial} footerSettings={footerSettings} />
        <VideoOverlay />
        {shilohEnabled && <ShilohCompanion />}
        <MiniPlayer />
      </MediaProvider>
    </WorldProvider>
  );
}
