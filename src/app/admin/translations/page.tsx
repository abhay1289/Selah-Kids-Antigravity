'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, CheckCircle2, AlertCircle, Clock, Search } from 'lucide-react';

interface Translation { id: string; page: string; path: string; enStatus: 'complete' | 'partial' | 'missing'; esStatus: 'complete' | 'partial' | 'missing'; enWords: number; esWords: number; lastSynced: string; missingFields?: string[]; }

const TRANSLATIONS: Translation[] = [
  { id: '1', page: 'Homepage', path: '/', enStatus: 'complete', esStatus: 'complete', enWords: 1240, esWords: 1180, lastSynced: '2h ago' },
  { id: '2', page: 'About', path: '/about', enStatus: 'complete', esStatus: 'complete', enWords: 820, esWords: 790, lastSynced: '1d ago' },
  { id: '3', page: 'Watch', path: '/watch', enStatus: 'complete', esStatus: 'complete', enWords: 380, esWords: 360, lastSynced: '3h ago' },
  { id: '4', page: 'Families', path: '/parents', enStatus: 'complete', esStatus: 'complete', enWords: 560, esWords: 530, lastSynced: '2d ago' },
  { id: '5', page: 'Blog', path: '/blog', enStatus: 'complete', esStatus: 'partial', enWords: 2450, esWords: 1800, lastSynced: '6h ago', missingFields: ['Latest blog post descriptions', 'Author bios'] },
  { id: '6', page: 'Resources', path: '/resources', enStatus: 'complete', esStatus: 'partial', enWords: 420, esWords: 310, lastSynced: '3d ago', missingFields: ['Download button labels', 'Resource descriptions'] },
  { id: '7', page: 'Donate', path: '/donate', enStatus: 'complete', esStatus: 'complete', enWords: 290, esWords: 280, lastSynced: '5d ago' },
  { id: '8', page: 'Contact', path: '/contact', enStatus: 'complete', esStatus: 'complete', enWords: 180, esWords: 170, lastSynced: '1w ago' },
  { id: '9', page: 'Navbar', path: 'component', enStatus: 'complete', esStatus: 'complete', enWords: 45, esWords: 42, lastSynced: '1h ago' },
  { id: '10', page: 'Footer', path: 'component', enStatus: 'complete', esStatus: 'complete', enWords: 120, esWords: 115, lastSynced: '1d ago' },
];

const STATUS_CONFIG = {
  complete: { icon: CheckCircle2, label: 'Complete', color: 'text-[#93d35c]', bg: 'bg-[#93d35c]/10' },
  partial: { icon: AlertCircle, label: 'Partial', color: 'text-[#feb835]', bg: 'bg-[#feb835]/10' },
  missing: { icon: Clock, label: 'Missing', color: 'text-red-500', bg: 'bg-red-500/10' },
};

export default function TranslationManager() {
  const complete = TRANSLATIONS.filter(t => t.esStatus === 'complete').length;
  const partial = TRANSLATIONS.filter(t => t.esStatus === 'partial').length;
  const pct = Math.round((complete / TRANSLATIONS.length) * 100);
  const totalEn = TRANSLATIONS.reduce((a, t) => a + t.enWords, 0);
  const totalEs = TRANSLATIONS.reduce((a, t) => a + t.esWords, 0);

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm">
        <div><h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Translations</h2><p className="text-[12px] text-[#5a7d62]/50">EN ↔ ES translation status across all pages</p></div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Translation Coverage', value: `${pct}%`, color: '#93d35c' },
          { label: 'Fully Translated', value: `${complete}/${TRANSLATIONS.length}`, color: '#00BFFF' },
          { label: 'English Words', value: totalEn.toLocaleString(), color: '#ff5c00' },
          { label: 'Spanish Words', value: totalEs.toLocaleString(), color: '#feb835' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm">
            <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-fredoka)', color: s.color }}>{s.value}</div>
            <div className="text-[12px] font-medium text-[#5a7d62]/50 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Progress */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm">
        <div className="flex justify-between mb-2"><span className="text-[13px] font-bold text-[#3a6b44]">Overall Progress</span><span className="text-[13px] font-bold text-[#93d35c]">{pct}%</span></div>
        <div className="h-3 bg-[#3a6b44]/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] rounded-full" /></div>
      </motion.div>

      {/* Page List */}
      <div className="space-y-3">
        {TRANSLATIONS.map((t, i) => {
          const esConfig = STATUS_CONFIG[t.esStatus];
          const coveragePct = Math.round((t.esWords / t.enWords) * 100);
          return (
            <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div><h3 className="text-[14px] font-bold text-[#3a6b44]">{t.page}</h3><p className="text-[11px] text-[#5a7d62]/40 font-mono">{t.path}</p></div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold px-2 py-0.5 rounded-lg bg-[#00BFFF]/10 text-[#00BFFF]">🇺🇸 {t.enWords}w</span>
                  <span className={`text-[12px] font-bold px-2 py-0.5 rounded-lg ${esConfig.bg} ${esConfig.color}`}>🇪🇸 {t.esWords}w</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-[#3a6b44]/5 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] rounded-full" style={{ width: `${coveragePct}%` }} /></div>
                <span className="text-[11px] font-bold text-[#5a7d62]/40">{coveragePct}%</span>
                <esConfig.icon size={14} className={esConfig.color} />
              </div>
              {t.missingFields && (
                <div className="mt-3 pt-3 border-t border-[#3a6b44]/5"><p className="text-[11px] text-[#feb835] font-medium">⚠️ Missing: {t.missingFields.join(', ')}</p></div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
