'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Search, ArrowUpRight, Target, Eye, Hash } from 'lucide-react';

interface Keyword { id: string; keyword: string; position: number; prevPosition: number; volume: number; difficulty: string; page: string; cpc: string; }

const KEYWORDS: Keyword[] = [
  { id: '1', keyword: 'christian kids music', position: 3, prevPosition: 5, volume: 2400, difficulty: 'Medium', page: '/', cpc: '$0.42' },
  { id: '2', keyword: 'selah kids', position: 1, prevPosition: 1, volume: 1800, difficulty: 'Low', page: '/', cpc: '$0.15' },
  { id: '3', keyword: 'christian cartoons for kids', position: 7, prevPosition: 12, volume: 3200, difficulty: 'High', page: '/watch', cpc: '$0.68' },
  { id: '4', keyword: 'worship songs for children', position: 5, prevPosition: 8, volume: 1900, difficulty: 'Medium', page: '/watch', cpc: '$0.55' },
  { id: '5', keyword: 'kids bible songs', position: 11, prevPosition: 15, volume: 2800, difficulty: 'High', page: '/', cpc: '$0.38' },
  { id: '6', keyword: 'faith based kids content', position: 4, prevPosition: 6, volume: 890, difficulty: 'Low', page: '/about', cpc: '$0.22' },
  { id: '7', keyword: 'christian music spanish kids', position: 2, prevPosition: 3, volume: 720, difficulty: 'Low', page: '/watch', cpc: '$0.18' },
  { id: '8', keyword: 'selah kids worship', position: 1, prevPosition: 1, volume: 580, difficulty: 'Low', page: '/', cpc: '$0.10' },
  { id: '9', keyword: 'bible songs for toddlers', position: 14, prevPosition: 22, volume: 4100, difficulty: 'High', page: '/watch', cpc: '$0.72' },
  { id: '10', keyword: 'christian kids youtube', position: 8, prevPosition: 11, volume: 5600, difficulty: 'High', page: '/watch', cpc: '$0.85' },
  { id: '11', keyword: 'donate to kids ministry', position: 6, prevPosition: 9, volume: 320, difficulty: 'Low', page: '/donate', cpc: '$1.20' },
  { id: '12', keyword: 'kids worship resources', position: 9, prevPosition: 10, volume: 1100, difficulty: 'Medium', page: '/resources', cpc: '$0.45' },
];

const RANK_HISTORY = [
  { date: 'Mar 21', avg: 12.4 }, { date: 'Mar 28', avg: 11.2 }, { date: 'Apr 4', avg: 9.8 },
  { date: 'Apr 11', avg: 8.5 }, { date: 'Apr 18', avg: 7.1 }, { date: 'Apr 20', avg: 6.3 },
];

function PositionBadge({ pos, prev }: { pos: number; prev: number }) {
  const diff = prev - pos;
  const color = diff > 0 ? 'text-[#93d35c]' : diff < 0 ? 'text-red-500' : 'text-[#5a7d62]/40';
  const bg = diff > 0 ? 'bg-[#93d35c]/10' : diff < 0 ? 'bg-red-500/10' : 'bg-[#3a6b44]/5';
  return (
    <div className="flex items-center gap-2">
      <span className="text-[15px] font-bold text-[#3a6b44] w-8 text-center">{pos}</span>
      {diff !== 0 && <span className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-lg ${bg} ${color}`}>{diff > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}{Math.abs(diff)}</span>}
    </div>
  );
}

function DifficultyBadge({ level }: { level: string }) {
  const c = level === 'Low' ? 'text-[#93d35c] bg-[#93d35c]/10' : level === 'Medium' ? 'text-[#feb835] bg-[#feb835]/10' : 'text-[#ff5c00] bg-[#ff5c00]/10';
  return <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${c}`}>{level}</span>;
}

export default function KeywordTracker() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'position' | 'volume'>('position');

  const sorted = [...KEYWORDS].sort((a, b) => sortBy === 'position' ? a.position - b.position : b.volume - a.volume);
  const filtered = searchQuery ? sorted.filter(k => k.keyword.toLowerCase().includes(searchQuery.toLowerCase())) : sorted;

  const avgPos = (KEYWORDS.reduce((a, k) => a + k.position, 0) / KEYWORDS.length).toFixed(1);
  const top3 = KEYWORDS.filter(k => k.position <= 3).length;
  const top10 = KEYWORDS.filter(k => k.position <= 10).length;
  const improved = KEYWORDS.filter(k => k.prevPosition > k.position).length;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm">
        <div><h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Keyword Tracker</h2><p className="text-[12px] text-[#5a7d62]/50">Monitor search rankings across {KEYWORDS.length} keywords</p></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg. Position', value: avgPos, icon: Target, color: 'text-[#ff5c00]', bg: 'bg-[#ff5c00]/10' },
          { label: 'Top 3 Rankings', value: top3.toString(), icon: TrendingUp, color: 'text-[#93d35c]', bg: 'bg-[#93d35c]/10' },
          { label: 'Top 10 Rankings', value: top10.toString(), icon: Eye, color: 'text-[#00BFFF]', bg: 'bg-[#00BFFF]/10' },
          { label: 'Improved', value: `${improved}/${KEYWORDS.length}`, icon: ArrowUpRight, color: 'text-[#feb835]', bg: 'bg-[#feb835]/10' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><s.icon size={18} className={s.color} /></div>
            <div className="text-2xl font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>{s.value}</div>
            <div className="text-[12px] font-medium text-[#5a7d62]/50 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Rank Trend */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-sm">
        <h3 className="text-[14px] font-bold text-[#3a6b44] mb-4" style={{ fontFamily: 'var(--font-fredoka)' }}>Average Position Trend</h3>
        <div className="flex items-end gap-4 h-[80px]">
          {RANK_HISTORY.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[11px] font-bold text-[#3a6b44]">{h.avg}</span>
              <motion.div initial={{ height: 0 }} animate={{ height: `${(1 - (h.avg - 5) / 20) * 60}px` }} transition={{ duration: 0.8, delay: i * 0.1 }} className="w-full rounded-t-lg bg-gradient-to-t from-[#93d35c] to-[#93d35c]/30" />
              <span className="text-[9px] text-[#5a7d62]/30">{h.date}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Search & Sort */}
      <div className="flex gap-3">
        <div className="relative flex-1"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a7d62]/30" /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search keywords..." className="w-full h-[44px] pl-12 pr-4 rounded-xl bg-white/80 backdrop-blur-xl border border-white/60 text-[#3a6b44] text-[14px] font-medium outline-none focus:border-[#ff5c00]/20 transition-all shadow-sm" /></div>
        <div className="flex gap-1 bg-white/80 backdrop-blur-xl rounded-xl p-1 border border-white/60 shadow-sm">
          {(['position', 'volume'] as const).map(s => (
            <button key={s} onClick={() => setSortBy(s)} className={`px-4 py-2 rounded-lg text-[12px] font-bold capitalize transition-all ${sortBy === s ? 'bg-white text-[#ff5c00] shadow-sm' : 'text-[#5a7d62]/50'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Keyword Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_90px_80px_80px_100px_70px] gap-2 px-6 py-3 text-[10px] font-bold text-[#5a7d62]/30 uppercase tracking-wider border-b border-[#3a6b44]/5">
          <span>Keyword</span><span className="text-center">Position</span><span className="text-center">Volume</span><span className="text-center">Difficulty</span><span>Ranking Page</span><span className="text-center">CPC</span>
        </div>
        {filtered.map((kw, i) => (
          <motion.div key={kw.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="grid grid-cols-[1fr_90px_80px_80px_100px_70px] gap-2 px-6 py-3 items-center border-b border-[#3a6b44]/5 last:border-0 hover:bg-[#3a6b44]/[0.02]">
            <div className="flex items-center gap-2"><Hash size={12} className="text-[#5a7d62]/20" /><span className="text-[13px] font-medium text-[#3a6b44]">{kw.keyword}</span></div>
            <div className="flex justify-center"><PositionBadge pos={kw.position} prev={kw.prevPosition} /></div>
            <span className="text-[12px] font-bold text-[#3a6b44] text-center">{kw.volume.toLocaleString()}</span>
            <div className="flex justify-center"><DifficultyBadge level={kw.difficulty} /></div>
            <span className="text-[11px] font-mono text-[#5a7d62]/40">{kw.page}</span>
            <span className="text-[12px] font-medium text-[#5a7d62]/50 text-center">{kw.cpc}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
