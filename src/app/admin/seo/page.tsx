'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Search, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Code, Share2 } from 'lucide-react';
import { useCmsCollection } from '../../../lib/useCms';
import { INITIAL_SEO_PAGES, type PageSEO } from '../../../data/chrome-seo';

function CharCounter({ value, max, warn }: { value: number; max: number; warn: number }) {
  const color = value === 0 ? 'text-[#5a7d62]/30' : value <= warn ? 'text-[#93d35c]' : value <= max ? 'text-[#feb835]' : 'text-red-500';
  const icon = value === 0 ? null : value <= max ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />;
  return <span className={`flex items-center gap-1 text-[11px] font-bold ${color}`}>{icon} {value}/{max}</span>;
}

function SeoScore({ page }: { page: PageSEO }) {
  let score = 0;
  if (page.metaTitle.length > 10 && page.metaTitle.length <= 60) score += 20;
  else if (page.metaTitle.length > 0) score += 10;
  if (page.metaDescription.length > 50 && page.metaDescription.length <= 160) score += 20;
  else if (page.metaDescription.length > 0) score += 10;
  if (page.ogTitle) score += 15;
  if (page.ogDescription) score += 10;
  if (page.ogImage) score += 10;
  if (page.focusKeyword) score += 10;
  if (page.canonical) score += 10;
  if (page.robots === 'index,follow') score += 5;
  const color = score >= 85 ? 'text-[#93d35c] bg-[#93d35c]/10' : score >= 60 ? 'text-[#feb835] bg-[#feb835]/10' : 'text-red-500 bg-red-500/10';
  return <span className={`text-[12px] font-bold px-2.5 py-1 rounded-lg ${color}`}>{score}/100</span>;
}

function GooglePreview({ title, description, path }: { title: string; description: string; path: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-[#3a6b44]/10 space-y-1">
      <p className="text-[11px] text-[#5a7d62]/40 font-medium mb-2 uppercase tracking-wider">Google Search Preview</p>
      <p className="text-[14px] text-[#1a0dab] font-medium leading-snug truncate hover:underline cursor-default">{title || 'Page Title'}</p>
      <p className="text-[12px] text-[#006621]">selahkids.com{path}</p>
      <p className="text-[13px] text-[#545454] leading-relaxed line-clamp-2">{description || 'Add a meta description...'}</p>
    </div>
  );
}

function SocialPreview({ title, description, image }: { title: string; description: string; image: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#3a6b44]/10 overflow-hidden">
      <p className="text-[11px] text-[#5a7d62]/40 font-medium px-4 pt-3 uppercase tracking-wider">Social Share Preview</p>
      <div className="p-4">
        <div className="border border-[#dadce0] rounded-xl overflow-hidden">
          <div className="w-full h-32 bg-[#f1f3f4] flex items-center justify-center">
            {image ? <img src={image} alt="" className="w-full h-full object-cover" /> : <Share2 className="text-[#5a7d62]/20" size={32} />}
          </div>
          <div className="p-3 bg-[#f8f9fa] border-t border-[#dadce0]">
            <p className="text-[11px] text-[#5a7d62]/50 uppercase">selahkids.com</p>
            <p className="text-[13px] font-semibold text-[#3a6b44] truncate">{title || 'OG Title'}</p>
            <p className="text-[12px] text-[#5a7d62]/60 line-clamp-1">{description || 'OG Description'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SEOManager() {
  const { items: pages, setItems: setPages, isSaving, save, error } = useCmsCollection<PageSEO>(
    'seo_pages',
    INITIAL_SEO_PAGES,
  );
  const [openPage, setOpenPage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'meta' | 'social' | 'schema'>('meta');

  const filtered = useMemo(() => {
    if (!searchQuery) return pages;
    return pages.filter(p => p.page.toLowerCase().includes(searchQuery.toLowerCase()) || p.path.includes(searchQuery));
  }, [pages, searchQuery]);

  const update = (id: string, field: keyof PageSEO, value: string) => setPages(pages.map(p => p.id === id ? { ...p, [field]: value } : p));
  const handleSave = async () => { try { await save(); } catch { /* surfaced via hook */ } };

  const avgScore = useMemo(() => {
    const scores = pages.map(p => {
      let s = 0;
      if (p.metaTitle.length > 10 && p.metaTitle.length <= 60) s += 20; else if (p.metaTitle.length > 0) s += 10;
      if (p.metaDescription.length > 50 && p.metaDescription.length <= 160) s += 20; else if (p.metaDescription.length > 0) s += 10;
      if (p.ogTitle) s += 15; if (p.ogDescription) s += 10; if (p.ogImage) s += 10; if (p.focusKeyword) s += 10; if (p.canonical) s += 10; if (p.robots === 'index,follow') s += 5;
      return s;
    });
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [pages]);

  const scoreColor = avgScore >= 85 ? 'from-[#93d35c] to-[#7ebd4e]' : avgScore >= 60 ? 'from-[#feb835] to-[#FFD700]' : 'from-red-500 to-red-400';

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm sticky top-[72px] z-20">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${scoreColor} flex items-center justify-center text-white text-[16px] font-bold shadow-lg`}>{avgScore}</div>
          <div>
            <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>SEO Manager</h2>
            <p className="text-[12px] text-[#5a7d62]/50">Average SEO score across {pages.length} pages</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {error && <span className="text-[11px] font-semibold text-red-500">{error}</span>}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Save size={15} /> {isSaving ? 'Saving...' : 'Save All'}</motion.button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a7d62]/30" />
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search pages..." className="w-full h-[44px] pl-12 pr-4 rounded-xl bg-white/80 backdrop-blur-xl border border-white/60 text-[#3a6b44] text-[14px] font-medium outline-none focus:border-[#ff5c00]/20 transition-all shadow-sm" />
      </div>

      {/* Page List */}
      <div className="space-y-3">
        {filtered.map((page) => {
          const isOpen = openPage === page.id;
          return (
            <motion.div key={page.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
              {/* Page Header */}
              <button onClick={() => setOpenPage(isOpen ? null : page.id)} className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-[#3a6b44]/[0.02] transition-colors group">
                <span className="text-xl">{page.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-bold text-[#3a6b44] group-hover:text-[#ff5c00] transition-colors">{page.page}</h3>
                  <p className="text-[12px] text-[#5a7d62]/40 font-mono">{page.path}</p>
                </div>
                <SeoScore page={page} />
                {isOpen ? <ChevronUp size={18} className="text-[#5a7d62]/40" /> : <ChevronDown size={18} className="text-[#5a7d62]/40" />}
              </button>

              {/* Expanded Editor */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="p-6 border-t border-[#3a6b44]/5">
                      {/* Tabs */}
                      <div className="flex gap-1 bg-[#3a6b44]/5 rounded-xl p-1 mb-6">
                        {[
                          { id: 'meta' as const, label: 'Meta & Keywords', icon: Search },
                          { id: 'social' as const, label: 'Social / OG', icon: Share2 },
                          { id: 'schema' as const, label: 'Structured Data', icon: Code },
                        ].map(tab => (
                          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] font-bold transition-all ${activeTab === tab.id ? 'bg-white text-[#ff5c00] shadow-sm' : 'text-[#5a7d62]/50 hover:text-[#3a6b44]'}`}>
                            <tab.icon size={14} /> {tab.label}
                          </button>
                        ))}
                      </div>

                      {activeTab === 'meta' && (
                        <div className="space-y-5">
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-[12px] font-semibold text-[#3a6b44]">Meta Title</label>
                              <CharCounter value={page.metaTitle.length} max={60} warn={50} />
                            </div>
                            <input value={page.metaTitle} onChange={e => update(page.id, 'metaTitle', e.target.value)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-[12px] font-semibold text-[#3a6b44]">Meta Description</label>
                              <CharCounter value={page.metaDescription.length} max={160} warn={140} />
                            </div>
                            <textarea value={page.metaDescription} onChange={e => update(page.id, 'metaDescription', e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all resize-none" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Focus Keyword</label>
                              <input value={page.focusKeyword} onChange={e => update(page.id, 'focusKeyword', e.target.value)} placeholder="e.g. christian kids music" className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all" />
                            </div>
                            <div>
                              <label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Robots Directive</label>
                              <select value={page.robots} onChange={e => update(page.id, 'robots', e.target.value)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all appearance-none cursor-pointer">
                                <option value="index,follow">Index, Follow ✅</option>
                                <option value="noindex,follow">NoIndex, Follow</option>
                                <option value="index,nofollow">Index, NoFollow</option>
                                <option value="noindex,nofollow">NoIndex, NoFollow 🚫</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Canonical URL</label>
                            <input value={page.canonical} onChange={e => update(page.id, 'canonical', e.target.value)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all font-mono" />
                          </div>
                          <GooglePreview title={page.metaTitle} description={page.metaDescription} path={page.path} />
                        </div>
                      )}

                      {activeTab === 'social' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">OG Title</label>
                              <input value={page.ogTitle} onChange={e => update(page.id, 'ogTitle', e.target.value)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all" />
                            </div>
                            <div>
                              <label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">OG Description</label>
                              <textarea value={page.ogDescription} onChange={e => update(page.id, 'ogDescription', e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all resize-none" />
                            </div>
                            <div>
                              <label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">OG Image Path</label>
                              <input value={page.ogImage} onChange={e => update(page.id, 'ogImage', e.target.value)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" />
                            </div>
                          </div>
                          <SocialPreview title={page.ogTitle} description={page.ogDescription} image={page.ogImage} />
                        </div>
                      )}

                      {activeTab === 'schema' && (
                        <div className="space-y-4">
                          <div>
                            <label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Schema Type</label>
                            <select value={page.schemaType} onChange={e => update(page.id, 'schemaType', e.target.value)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all appearance-none cursor-pointer">
                              <option value="WebPage">WebPage</option>
                              <option value="Article">Article</option>
                              <option value="VideoObject">VideoObject</option>
                              <option value="FAQPage">FAQPage</option>
                              <option value="Organization">Organization</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">JSON-LD Preview</label>
                            <pre className="bg-[#1e1e2e] text-[#c6d0f5] text-[12px] p-5 rounded-xl overflow-x-auto leading-relaxed font-mono">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": page.schemaType,
  "name": page.metaTitle,
  "description": page.metaDescription,
  "url": page.canonical,
  ...(page.ogImage ? { "image": `https://selahkids.com${page.ogImage}` } : {}),
  ...(page.schemaType === 'Organization' ? { "logo": "https://selahkids.com/SK_Logo_FN.jpg", "sameAs": ["https://www.youtube.com/@selahkidsworship", "https://www.instagram.com/selah.kids", "https://open.spotify.com/artist/6lShgHNhA1vXSZ6f4UXMa4"] } : {})
}, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
