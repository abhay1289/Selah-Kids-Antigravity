'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Home, Info, Play, Users, BookOpen,
  Download, Heart, Mail, Settings, LogOut, Menu, X,
  ChevronRight, Sparkles, Image as ImageIcon, FileText,
  Globe, Search, BarChart3, Zap, Calendar, ArrowRightLeft,
  ClipboardList, Accessibility, Map, Navigation, PanelBottom,
  Palette, Megaphone, Shield, Code, FormInput, Target,
  Link2, Languages, FileCheck, Activity, Lock, Archive
} from 'lucide-react';
import { signOut, getUser } from '../../lib/auth';

import type { LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  divider?: string;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  {
    label: 'Pages', href: '/admin/pages', icon: FileText,
    children: [
      { label: 'Homepage', href: '/admin/pages/home' },
      { label: 'About', href: '/admin/pages/about' },
      { label: 'Watch', href: '/admin/pages/watch' },
      { label: 'Families', href: '/admin/pages/parents' },
      { label: 'Donate', href: '/admin/pages/donate' },
      { label: 'Contact', href: '/admin/pages/contact' },
      { label: 'Resources', href: '/admin/pages/resources' },
      { label: 'Blog', href: '/admin/pages/blog' },
    ]
  },
  {
    label: 'Content', href: '/admin/content', icon: BookOpen,
    children: [
      { label: 'Blog Posts', href: '/admin/content/blog' },
      { label: 'Videos', href: '/admin/content/videos' },
      { label: 'Characters', href: '/admin/content/characters' },
      { label: 'Testimonials', href: '/admin/content/testimonials' },
      { label: 'Team Members', href: '/admin/content/team' },
    ]
  },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  // Website Controls
  { label: 'Navigation Bar', href: '/admin/navbar', icon: Navigation, divider: 'Website' },
  { label: 'Footer', href: '/admin/footer', icon: PanelBottom },
  { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { label: 'Forms', href: '/admin/forms', icon: FormInput },
  { label: 'Translations', href: '/admin/translations', icon: Languages },
  // Marketing & SEO
  { label: 'SEO Manager', href: '/admin/seo', icon: Search, divider: 'Marketing' },
  { label: 'Keywords', href: '/admin/keywords', icon: Target },
  { label: 'Content Quality', href: '/admin/content-quality', icon: FileCheck },
  { label: 'Link Checker', href: '/admin/links', icon: Link2 },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Scheduler', href: '/admin/scheduler', icon: Calendar },
  // Technical
  { label: 'Performance', href: '/admin/performance', icon: Zap, divider: 'Technical' },
  { label: 'Uptime Monitor', href: '/admin/uptime', icon: Activity },
  { label: 'Security', href: '/admin/security', icon: Lock },
  { label: 'Redirects', href: '/admin/redirects', icon: ArrowRightLeft },
  { label: 'Accessibility', href: '/admin/accessibility', icon: Accessibility },
  { label: 'Sitemap & Robots', href: '/admin/sitemap', icon: Map },
  { label: 'Activity Log', href: '/admin/activity', icon: ClipboardList },
  { label: 'Custom Code', href: '/admin/code', icon: Code },
  // System
  { label: 'Theme & Design', href: '/admin/theme', icon: Palette, divider: 'System' },
  { label: 'Users & Roles', href: '/admin/users', icon: Shield },
  { label: 'Backup & Export', href: '/admin/backups', icon: Archive },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Pages', 'Content']);
  const [userName, setUserName] = useState('Admin');

  useEffect(() => {
    getUser()
      .then(({ user }) => {
        if (user?.email) setUserName(user.email.split('@')[0]);
      })
      .catch(() => {
        // Leave the default 'Admin' label if the lookup fails; not worth
        // interrupting the sidebar render over a display-name fetch.
      });
  }, []);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

  const handleLogout = async () => {
    await signOut();
    // refresh() forces a server round-trip so middleware observes the cleared
    // cookies on the next request. Without this, fast client navigation
    // can race and still see the user as signed-in for one request.
    router.refresh();
    router.push('/admin/login');
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (item: NavItem) => item.children?.some(c => pathname === c.href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Header */}
      <div className="px-6 py-6 border-b border-[#3a6b44]/10">
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => router.push('/admin')}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff5c00] to-[#feb835] flex items-center justify-center shadow-lg shadow-[#ff5c00]/20">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-display text-[15px] font-bold text-[#3a6b44] tracking-tight leading-none">Selah Kids</h1>
            <span className="text-[11px] font-medium text-[#5a7d62]/60 tracking-wider uppercase">Dashboard</span>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href) || isParentActive(item);
          const isExpanded = expandedItems.includes(item.label);

          return (
            <div key={item.label}>
              {/* Section Divider */}
              {item.divider && (
                <div className="mt-4 mb-2 px-4">
                  <span className="text-[10px] font-bold text-[#5a7d62]/30 uppercase tracking-[0.2em]">{item.divider}</span>
                </div>
              )}
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (item.children) {
                    toggleExpanded(item.label);
                  } else {
                    router.push(item.href);
                    setIsMobileOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-medium transition-all duration-300 group ${
                  active
                    ? 'bg-[#ff5c00]/10 text-[#ff5c00]'
                    : 'text-[#5a7d62] hover:bg-[#3a6b44]/5 hover:text-[#3a6b44]'
                }`}
              >
                <item.icon size={18} className={`transition-colors ${active ? 'text-[#ff5c00]' : 'text-[#5a7d62]/50 group-hover:text-[#3a6b44]'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.children && (
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight size={14} className="text-[#5a7d62]/40" />
                  </motion.div>
                )}
              </motion.button>

              {/* Children */}
              <AnimatePresence>
                {item.children && isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="ml-6 pl-4 border-l-2 border-[#3a6b44]/10 space-y-1 py-1">
                      {item.children.map((child) => (
                        <motion.button
                          key={child.href}
                          whileHover={{ x: 4 }}
                          onClick={() => {
                            router.push(child.href);
                            setIsMobileOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                            isActive(child.href)
                              ? 'text-[#ff5c00] bg-[#ff5c00]/5'
                              : 'text-[#5a7d62]/70 hover:text-[#3a6b44] hover:bg-[#3a6b44]/5'
                          }`}
                        >
                          {child.label}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="px-4 py-4 border-t border-[#3a6b44]/10">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-[#3a6b44]/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#93d35c] to-[#3a6b44] flex items-center justify-center text-white text-[13px] font-bold uppercase">
            {userName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#3a6b44] truncate capitalize">{userName}</p>
            <p className="text-[11px] text-[#5a7d62]/60">Editor</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={14} />
          </motion.button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[280px] h-screen bg-white/80 backdrop-blur-2xl border-r border-[#3a6b44]/10 flex-col fixed left-0 top-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Toggle */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-white/90 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg border border-[#3a6b44]/10"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </motion.button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-white z-50 shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
