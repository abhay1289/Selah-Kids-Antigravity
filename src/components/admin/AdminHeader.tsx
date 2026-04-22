'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Bell, Search, Globe, Eye } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/pages/home': 'Homepage Editor',
  '/admin/pages/about': 'About Page Editor',
  '/admin/pages/watch': 'Watch Page Editor',
  '/admin/pages/parents': 'Families Page Editor',
  '/admin/pages/donate': 'Donate Page Editor',
  '/admin/pages/contact': 'Contact Page Editor',
  '/admin/pages/resources': 'Resources Page Editor',
  '/admin/content/blog': 'Blog Manager',
  '/admin/content/videos': 'Video Library',
  '/admin/content/characters': 'Characters Manager',
  '/admin/content/testimonials': 'Testimonials Manager',
  '/admin/content/team': 'Team Manager',
  '/admin/media': 'Media Library',
  '/admin/settings': 'Global Settings',
};

export function AdminHeader() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] || 'Dashboard';

  return (
    <header className="h-[72px] bg-white/60 backdrop-blur-2xl border-b border-[#3a6b44]/10 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30">
      {/* Left: Page Title */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="lg:hidden w-12" /> {/* Spacer for mobile hamburger */}
        <div>
          <motion.h1
            key={title}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[18px] font-bold text-[#3a6b44] tracking-tight"
            style={{ fontFamily: 'var(--font-fredoka), "Fredoka", sans-serif' }}
          >
            {title}
          </motion.h1>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Preview Site */}
        <motion.a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#93d35c]/10 text-[#3a6b44] text-[13px] font-semibold hover:bg-[#93d35c]/20 transition-all border border-[#93d35c]/20"
        >
          <Eye size={15} />
          <span>Preview Site</span>
        </motion.a>

        {/* Publish status pill — replaces the non-functional "Publish All"
            button. The CMS wiring layer is deferred until Supabase is live,
            so this indicates state rather than claiming an action. */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#feb835]/15 text-[#8a6b00] text-[12px] font-semibold border border-[#feb835]/25">
          <Globe size={14} />
          <span className="hidden sm:inline">CMS preview mode</span>
        </div>
      </div>
    </header>
  );
}
