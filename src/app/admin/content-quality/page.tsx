'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, CheckCircle2, AlertTriangle, Clock, FileText, ArrowRight } from 'lucide-react';

interface PageContent { id: string; page: string; path: string; wordCount: number; readability: string; readabilityScore: number; keywordDensity: number; focusKeyword: string; headingCount: number; imageCount: number; internalLinks: number; externalLinks: number; metaLength: number; lastUpdated: string; }

const PAGES: PageContent[] = [
  { id: '1', page: 'Homepage', path: '/', wordCount: 1240, readability: 'Easy', readabilityScore: 92, keywordDensity: 2.1, focusKeyword: 'christian kids music', headingCount: 8, imageCount: 6, internalLinks: 12, externalLinks: 3, metaLength: 148, lastUpdated: '2h ago' },
  { id: '2', page: 'About', path: '/about', wordCount: 820, readability: 'Easy', readabilityScore: 88, keywordDensity: 1.8, focusKeyword: 'selah kids story', headingCount: 5, imageCount: 4, internalLinks: 6, externalLinks: 1, metaLength: 142, lastUpdated: '1d ago' },
  { id: '3', page: 'Watch', path: '/watch', wordCount: 380, readability: 'Very Easy', readabilityScore: 95, keywordDensity: 3.2, focusKeyword: 'christian kids videos', headingCount: 3, imageCount: 8, internalLinks: 4, externalLinks: 2, metaLength: 155, lastUpdated: '3h ago' },
  { id: '4', page: 'Families', path: '/parents', wordCount: 560, readability: 'Easy', readabilityScore: 86, keywordDensity: 1.5, focusKeyword: 'safe christian content kids', headingCount: 4, imageCount: 3, internalLinks: 5, externalLinks: 0, metaLength: 138, lastUpdated: '2d ago' },
  { id: '5', page: 'Blog', path: '/blog', wordCount: 2450, readability: 'Standard', readabilityScore: 78, keywordDensity: 1.2, focusKeyword: 'christian family blog', headingCount: 12, imageCount: 3, internalLinks: 8, externalLinks: 2, metaLength: 120, lastUpdated: '6h ago' },
  { id: '6', page: 'Resources', path: '/resources', wordCount: 420, readability: 'Easy', readabilityScore: 90, keywordDensity: 2.0, focusKeyword: 'christian kids resources', headingCount: 3, imageCount: 2, internalLinks: 4, externalLinks: 1, metaLength: 152, lastUpdated: '3d ago' },
  { id: '7', page: 'Donate', path: '/donate', wordCount: 290, readability: 'Very Easy', readabilityScore: 94, keywordDensity: 1.0, focusKeyword: 'support selah kids', headingCount: 2, imageCount: 1, internalLinks: 3, externalLinks: 1, metaLength: 130, lastUpdated: '5d ago' },
  { id: '8', page: 'Contact', path: '/contact', wordCount: 180, readability: 'Very Easy', readabilityScore: 96, keywordDensity: 0.8, focusKeyword: 'contact selah kids', headingCount: 2, imageCount: 0, internalLinks: 2, externalLinks: 0, metaLength: 115, lastUpdated: '1w ago' },
];

function ScorePill({ score, label }: { score: number; label: string }) {
  const color = score >= 80 ? 'text-[#93d35c] bg-[#93d35c]/10' : score >= 60 ? 'text-[#feb835] bg-[#feb835]/10' : 'text-red-500 bg-red-500/10';
  return <span className={`text-[12px] font-bold px-2.5 py-1 rounded-lg ${color}`}>{score} — {label}</span>;
}

export default function ContentQuality() {
  const avgScore = Math.round(PAGES.reduce((a, p) => a + p.readabilityScore, 0) / PAGES.length);
  const totalWords = PAGES.reduce((a, p) => a + p.wordCount, 0);

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm">
        <div><h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Content Quality</h2><p className="text-[12px] text-[#5a7d62]/50">Readability, word count, and SEO content analysis</p></div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg. Readability', value: avgScore.toString(), sub: 'Easy to read', color: '#93d35c' },
          { label: 'Total Word Count', value: totalWords.toLocaleString(), sub: 'Across all pages', color: '#00BFFF' },
          { label: 'Total Pages', value: PAGES.length.toString(), sub: 'Analyzed', color: '#ff5c00' },
          { label: 'Avg. Keyword Density', value: `${(PAGES.reduce((a, p) => a + p.keywordDensity, 0) / PAGES.length).toFixed(1)}%`, sub: 'Optimal: 1-3%', color: '#feb835' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm">
            <div className="text-2xl font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)', color: s.color }}>{s.value}</div>
            <div className="text-[12px] font-bold text-[#3a6b44] mt-1">{s.label}</div>
            <div className="text-[11px] text-[#5a7d62]/40">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Page Cards */}
      <div className="space-y-3">
        {PAGES.map((page, i) => (
          <motion.div key={page.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="text-[14px] font-bold text-[#3a6b44]">{page.page}</h3><p className="text-[11px] text-[#5a7d62]/40 font-mono">{page.path}</p></div>
              <ScorePill score={page.readabilityScore} label={page.readability} />
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { label: 'Words', value: page.wordCount.toLocaleString(), ok: page.wordCount >= 300 },
                { label: 'Keyword %', value: `${page.keywordDensity}%`, ok: page.keywordDensity >= 1 && page.keywordDensity <= 3 },
                { label: 'Headings', value: page.headingCount.toString(), ok: page.headingCount >= 2 },
                { label: 'Images', value: page.imageCount.toString(), ok: page.imageCount >= 1 },
                { label: 'Int. Links', value: page.internalLinks.toString(), ok: page.internalLinks >= 3 },
                { label: 'Meta Len.', value: `${page.metaLength}`, ok: page.metaLength >= 120 && page.metaLength <= 160 },
              ].map(m => (
                <div key={m.label} className="text-center">
                  <div className={`text-[14px] font-bold ${m.ok ? 'text-[#3a6b44]' : 'text-red-500'}`}>{m.value}</div>
                  <div className="text-[10px] text-[#5a7d62]/30 flex items-center justify-center gap-1">{m.ok ? <CheckCircle2 size={8} className="text-[#93d35c]" /> : <AlertTriangle size={8} className="text-red-400" />}{m.label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#3a6b44]/5">
              <span className="text-[10px] text-[#5a7d62]/30">Focus: </span><span className="text-[11px] font-medium text-[#ff5c00] bg-[#ff5c00]/10 px-2 py-0.5 rounded">{page.focusKeyword}</span>
              <span className="text-[10px] text-[#5a7d62]/20 ml-auto">Updated {page.lastUpdated}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
