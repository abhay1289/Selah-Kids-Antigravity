'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Eye, EyeOff, ChevronRight, Globe, Clock, FileText, Code } from 'lucide-react';

interface SitemapPage {
  path: string;
  label: string;
  icon: string;
  included: boolean;
  priority: string;
  changefreq: string;
  lastmod: string;
  children?: SitemapPage[];
}

const INITIAL_SITEMAP: SitemapPage[] = [
  { path: '/', label: 'Homepage', icon: '🏠', included: true, priority: '1.0', changefreq: 'weekly', lastmod: '2026-04-20' },
  { path: '/about', label: 'About', icon: '📖', included: true, priority: '0.8', changefreq: 'monthly', lastmod: '2026-04-15' },
  { path: '/watch', label: 'Watch', icon: '🎬', included: true, priority: '0.9', changefreq: 'weekly', lastmod: '2026-04-18' },
  { path: '/parents', label: 'Families', icon: '👨‍👩‍👧‍👦', included: true, priority: '0.7', changefreq: 'monthly', lastmod: '2026-04-10' },
  { path: '/blog', label: 'Blog', icon: '📝', included: true, priority: '0.8', changefreq: 'weekly', lastmod: '2026-04-20',
    children: [
      { path: '/blog/the-strong-tower-of-security', label: 'The Strong Tower of Security', icon: '📄', included: true, priority: '0.6', changefreq: 'yearly', lastmod: '2026-04-07' },
      { path: '/blog/are-we-repeating-patterns', label: 'Are We Repeating Patterns?', icon: '📄', included: true, priority: '0.6', changefreq: 'yearly', lastmod: '2026-04-02' },
      { path: '/blog/the-call-to-be-a-blessing', label: 'The Call to Be a Blessing', icon: '📄', included: true, priority: '0.6', changefreq: 'yearly', lastmod: '2026-04-15' },
    ]
  },
  { path: '/resources', label: 'Resources', icon: '📚', included: true, priority: '0.7', changefreq: 'monthly', lastmod: '2026-04-12' },
  { path: '/donate', label: 'Donate', icon: '💝', included: true, priority: '0.6', changefreq: 'monthly', lastmod: '2026-04-08' },
  { path: '/contact', label: 'Contact', icon: '📬', included: true, priority: '0.5', changefreq: 'yearly', lastmod: '2026-04-01' },
  { path: '/music', label: 'Music', icon: '🎵', included: true, priority: '0.7', changefreq: 'monthly', lastmod: '2026-04-14' },
  { path: '/privacy', label: 'Privacy Policy', icon: '🔒', included: true, priority: '0.2', changefreq: 'yearly', lastmod: '2026-01-01' },
  { path: '/terms', label: 'Terms of Service', icon: '📜', included: true, priority: '0.2', changefreq: 'yearly', lastmod: '2026-01-01' },
];

const INITIAL_ROBOTS = `# Selah Kids — robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

# Sitemaps
Sitemap: https://selahkids.com/sitemap.xml`;

export default function SitemapManager() {
  const [pages, setPages] = useState<SitemapPage[]>(INITIAL_SITEMAP);
  const [robotsTxt, setRobotsTxt] = useState(INITIAL_ROBOTS);
  const [activeTab, setActiveTab] = useState<'sitemap' | 'robots'>('sitemap');
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<string[]>(['/blog']);

  const toggleInclude = (path: string) => {
    setPages(pages.map(p => {
      if (p.path === path) return { ...p, included: !p.included };
      if (p.children) return { ...p, children: p.children.map(c => c.path === path ? { ...c, included: !c.included } : c) };
      return p;
    }));
  };

  const updateField = (path: string, field: 'priority' | 'changefreq', value: string) => {
    setPages(pages.map(p => {
      if (p.path === path) return { ...p, [field]: value };
      if (p.children) return { ...p, children: p.children.map(c => c.path === path ? { ...c, [field]: value } : c) };
      return p;
    }));
  };

  const toggleExpand = (path: string) => setExpandedPaths(p => p.includes(path) ? p.filter(x => x !== path) : [...p, path]);
  const handleSave = async () => { setIsSaving(true); await new Promise(r => setTimeout(r, 1500)); setIsSaving(false); };
  const includedCount = pages.reduce((acc, p) => acc + (p.included ? 1 : 0) + (p.children?.filter(c => c.included).length || 0), 0);

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm sticky top-[72px] z-20">
        <div>
          <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Sitemap & Robots</h2>
          <p className="text-[12px] text-[#5a7d62]/50">{includedCount} pages in sitemap</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Save size={15} /> {isSaving ? 'Saving...' : 'Save'}</motion.button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/80 backdrop-blur-xl rounded-xl p-1 border border-white/60 shadow-sm">
        {[
          { id: 'sitemap' as const, label: 'Sitemap', icon: Globe },
          { id: 'robots' as const, label: 'Robots.txt', icon: Code },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[13px] font-bold transition-all ${activeTab === tab.id ? 'bg-white text-[#ff5c00] shadow-sm' : 'text-[#5a7d62]/50 hover:text-[#3a6b44]'}`}>
            <tab.icon size={15} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'sitemap' && (
        <div className="space-y-3">
          {/* Auto Generate Toggle */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[13px] font-bold text-[#3a6b44]">Auto-generate sitemap</p>
              <p className="text-[12px] text-[#5a7d62]/40">Regenerate XML sitemap when content changes</p>
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setAutoGenerate(!autoGenerate)} className={`w-12 h-7 rounded-full relative transition-colors ${autoGenerate ? 'bg-[#93d35c]' : 'bg-[#3a6b44]/10'}`}>
              <motion.div animate={{ x: autoGenerate ? 22 : 2 }} className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm" />
            </motion.button>
          </motion.div>

          {/* Page Header Row */}
          <div className="grid grid-cols-[1fr_80px_100px_100px_60px] gap-2 px-5 text-[10px] font-bold text-[#5a7d62]/30 uppercase tracking-wider">
            <span>Page</span><span className="text-center">Include</span><span className="text-center">Priority</span><span className="text-center">Frequency</span><span></span>
          </div>

          {/* Page Rows */}
          {pages.map(page => (
            <div key={page.path}>
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-[1fr_80px_100px_100px_60px] gap-2 items-center bg-white/80 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/60 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  {page.children ? (
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleExpand(page.path)} className="w-6 h-6 rounded-md bg-[#3a6b44]/5 flex items-center justify-center flex-shrink-0">
                      <motion.div animate={{ rotate: expandedPaths.includes(page.path) ? 90 : 0 }}><ChevronRight size={12} className="text-[#3a6b44]" /></motion.div>
                    </motion.button>
                  ) : <div className="w-6" />}
                  <span className="text-sm">{page.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#3a6b44] truncate">{page.label}</p>
                    <p className="text-[10px] text-[#5a7d62]/30 font-mono truncate">{page.path}</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleInclude(page.path)} className={`w-8 h-8 rounded-lg flex items-center justify-center ${page.included ? 'bg-[#93d35c]/10 text-[#93d35c]' : 'bg-red-500/10 text-red-500'}`}>
                    {page.included ? <Eye size={14} /> : <EyeOff size={14} />}
                  </motion.button>
                </div>
                <select value={page.priority} onChange={e => updateField(page.path, 'priority', e.target.value)} className="h-[32px] px-2 rounded-lg bg-[#3a6b44]/[0.03] text-[#3a6b44] text-[12px] font-medium outline-none appearance-none cursor-pointer text-center">
                  {['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <select value={page.changefreq} onChange={e => updateField(page.path, 'changefreq', e.target.value)} className="h-[32px] px-2 rounded-lg bg-[#3a6b44]/[0.03] text-[#3a6b44] text-[12px] font-medium outline-none appearance-none cursor-pointer text-center">
                  {['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <span className="text-[10px] text-[#5a7d62]/30 text-center">{page.lastmod.slice(5)}</span>
              </motion.div>
              {/* Children */}
              {page.children && expandedPaths.includes(page.path) && (
                <div className="ml-10 mt-1 space-y-1">
                  {page.children.map(child => (
                    <div key={child.path} className="grid grid-cols-[1fr_80px_100px_100px_60px] gap-2 items-center bg-white/60 rounded-xl px-5 py-2.5 border border-[#3a6b44]/5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-6" />
                        <span className="text-sm">{child.icon}</span>
                        <div className="min-w-0">
                          <p className="text-[12px] font-medium text-[#3a6b44] truncate">{child.label}</p>
                          <p className="text-[9px] text-[#5a7d62]/25 font-mono truncate">{child.path}</p>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleInclude(child.path)} className={`w-7 h-7 rounded-lg flex items-center justify-center ${child.included ? 'bg-[#93d35c]/10 text-[#93d35c]' : 'bg-red-500/10 text-red-500'}`}>
                          {child.included ? <Eye size={12} /> : <EyeOff size={12} />}
                        </motion.button>
                      </div>
                      <select value={child.priority} onChange={e => updateField(child.path, 'priority', e.target.value)} className="h-[28px] px-2 rounded-lg bg-[#3a6b44]/[0.03] text-[#3a6b44] text-[11px] font-medium outline-none appearance-none cursor-pointer text-center">
                        {['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                      <select value={child.changefreq} onChange={e => updateField(child.path, 'changefreq', e.target.value)} className="h-[28px] px-2 rounded-lg bg-[#3a6b44]/[0.03] text-[#3a6b44] text-[11px] font-medium outline-none appearance-none cursor-pointer text-center">
                        {['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                      <span className="text-[10px] text-[#5a7d62]/30 text-center">{child.lastmod.slice(5)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'robots' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6">
          <label className="text-[12px] font-semibold text-[#3a6b44] mb-2 block">robots.txt Content</label>
          <textarea value={robotsTxt} onChange={e => setRobotsTxt(e.target.value)} rows={12} className="w-full px-5 py-4 rounded-xl bg-[#1e1e2e] text-[#c6d0f5] text-[13px] font-mono outline-none resize-none leading-relaxed border-2 border-transparent focus:border-[#ff5c00]/20 transition-all" />
          <p className="text-[11px] text-[#5a7d62]/40 mt-3">⚠️ Changes to robots.txt affect how search engines crawl your site. Be careful with Disallow rules.</p>
        </motion.div>
      )}
    </div>
  );
}
