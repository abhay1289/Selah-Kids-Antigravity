'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, Eye, Clock, MousePointerClick, Globe, Monitor, Smartphone, Tablet, ArrowRight, ArrowUpRight } from 'lucide-react';

// Simulated 30-day data (ready for GA4 API integration)
const DAILY_VIEWS = [320, 420, 380, 510, 620, 580, 490, 720, 810, 760, 890, 950, 1020, 980, 870, 920, 1050, 1120, 1080, 960, 1030, 1150, 1200, 1180, 1090, 1250, 1340, 1300, 1380, 1420];
const LABELS = Array.from({ length: 30 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 29 + i); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); });

const STATS = [
  { label: 'Total Visits', value: '28.4K', change: '+12.3%', up: true, icon: Eye, color: 'text-[#ff5c00]', bg: 'bg-[#ff5c00]/10' },
  { label: 'Unique Visitors', value: '18.2K', change: '+8.7%', up: true, icon: Users, color: 'text-[#00BFFF]', bg: 'bg-[#00BFFF]/10' },
  { label: 'Avg. Duration', value: '3m 42s', change: '+5.2%', up: true, icon: Clock, color: 'text-[#93d35c]', bg: 'bg-[#93d35c]/10' },
  { label: 'Bounce Rate', value: '32.1%', change: '-4.8%', up: false, icon: MousePointerClick, color: 'text-[#feb835]', bg: 'bg-[#feb835]/10' },
];

const TOP_PAGES = [
  { path: '/', name: 'Homepage', views: 8420, change: '+15%' },
  { path: '/watch', name: 'Watch', views: 6210, change: '+22%' },
  { path: '/about', name: 'About', views: 3840, change: '+8%' },
  { path: '/blog', name: 'Blog', views: 3120, change: '+31%' },
  { path: '/parents', name: 'Families', views: 2650, change: '+11%' },
  { path: '/resources', name: 'Resources', views: 1890, change: '+19%' },
  { path: '/donate', name: 'Donate', views: 1340, change: '+7%' },
  { path: '/contact', name: 'Contact', views: 920, change: '+3%' },
];

const SOURCES = [
  { name: 'Organic Search', value: 42, color: '#93d35c' },
  { name: 'YouTube', value: 28, color: '#FF0000' },
  { name: 'Direct', value: 15, color: '#ff5c00' },
  { name: 'Social Media', value: 10, color: '#00BFFF' },
  { name: 'Referral', value: 5, color: '#feb835' },
];

const DEVICES = [
  { name: 'Mobile', value: 58, icon: Smartphone, color: '#ff5c00' },
  { name: 'Desktop', value: 34, icon: Monitor, color: '#93d35c' },
  { name: 'Tablet', value: 8, icon: Tablet, color: '#00BFFF' },
];

const COUNTRIES = [
  { flag: '🇺🇸', name: 'United States', visitors: '8.2K', pct: 45 },
  { flag: '🇲🇽', name: 'Mexico', visitors: '3.1K', pct: 17 },
  { flag: '🇨🇴', name: 'Colombia', visitors: '1.8K', pct: 10 },
  { flag: '🇦🇷', name: 'Argentina', visitors: '1.2K', pct: 7 },
  { flag: '🇪🇸', name: 'Spain', visitors: '980', pct: 5 },
  { flag: '🇨🇦', name: 'Canada', visitors: '840', pct: 5 },
];

function MiniChart({ data, color = '#ff5c00' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 40;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  const fillPoints = `0,${h} ${points} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[60px]" preserveAspectRatio="none">
      <defs><linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <polygon points={fillPoints} fill={`url(#grad-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm">
        <div>
          <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Analytics</h2>
          <p className="text-[12px] text-[#5a7d62]/50">Site traffic & engagement overview</p>
        </div>
        <div className="flex items-center gap-1 bg-[#3a6b44]/5 rounded-xl p-1">
          {(['7d', '30d', '90d'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-2 rounded-lg text-[12px] font-bold transition-all ${period === p ? 'bg-white text-[#ff5c00] shadow-sm' : 'text-[#5a7d62]/50 hover:text-[#3a6b44]'}`}>{p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}</button>
          ))}
        </div>
      </div>

      {/* Real-time banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-[#3a6b44] to-[#5a8f5c] rounded-2xl p-5 text-white flex items-center gap-4">
        <div className="w-3 h-3 rounded-full bg-[#93d35c] animate-pulse shadow-lg shadow-[#93d35c]/50" />
        <span className="text-[14px] font-medium"><span className="font-bold text-[18px]">24</span> active visitors right now</span>
        <div className="flex-1" />
        <span className="text-[12px] text-white/50">Updated live</span>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm group hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}><stat.icon size={20} className={stat.color} /></div>
              <span className={`flex items-center gap-1 text-[12px] font-bold ${stat.up ? 'text-[#93d35c]' : 'text-[#feb835]'}`}>{stat.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-[#3a6b44] tracking-tight" style={{ fontFamily: 'var(--font-fredoka)' }}>{stat.value}</div>
            <div className="text-[12px] font-medium text-[#5a7d62]/50 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Traffic Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-sm">
        <h3 className="text-[14px] font-bold text-[#3a6b44] mb-4" style={{ fontFamily: 'var(--font-fredoka)' }}>Traffic Overview</h3>
        <MiniChart data={DAILY_VIEWS} color="#ff5c00" />
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-[#5a7d62]/30">{LABELS[0]}</span>
          <span className="text-[10px] text-[#5a7d62]/30">{LABELS[14]}</span>
          <span className="text-[10px] text-[#5a7d62]/30">{LABELS[29]}</span>
        </div>
      </motion.div>

      {/* 3 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-1 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#3a6b44]/5"><h3 className="text-[14px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Top Pages</h3></div>
          <div>
            {TOP_PAGES.map((page, i) => (
              <div key={page.path} className="flex items-center gap-3 px-6 py-3 border-b border-[#3a6b44]/5 last:border-b-0 hover:bg-[#3a6b44]/[0.02] transition-colors">
                <span className="text-[12px] font-bold text-[#5a7d62]/30 w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#3a6b44] truncate">{page.name}</p>
                  <p className="text-[11px] text-[#5a7d62]/40 font-mono">{page.path}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold text-[#3a6b44]">{page.views.toLocaleString()}</p>
                  <p className="text-[11px] font-semibold text-[#93d35c]">{page.change}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-sm">
          <h3 className="text-[14px] font-bold text-[#3a6b44] mb-5" style={{ fontFamily: 'var(--font-fredoka)' }}>Traffic Sources</h3>
          <div className="space-y-4">
            {SOURCES.map(s => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-medium text-[#3a6b44]">{s.name}</span>
                  <span className="text-[12px] font-bold text-[#5a7d62]/60">{s.value}%</span>
                </div>
                <div className="h-2 bg-[#3a6b44]/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${s.value}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full rounded-full" style={{ backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Devices + Countries */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-6">
          {/* Devices */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-sm">
            <h3 className="text-[14px] font-bold text-[#3a6b44] mb-4" style={{ fontFamily: 'var(--font-fredoka)' }}>Devices</h3>
            <div className="space-y-3">
              {DEVICES.map(d => (
                <div key={d.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${d.color}15` }}><d.icon size={16} style={{ color: d.color }} /></div>
                  <span className="flex-1 text-[13px] font-medium text-[#3a6b44]">{d.name}</span>
                  <span className="text-[13px] font-bold text-[#3a6b44]">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
          {/* Countries */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-sm">
            <h3 className="text-[14px] font-bold text-[#3a6b44] mb-4" style={{ fontFamily: 'var(--font-fredoka)' }}>Top Countries</h3>
            <div className="space-y-2.5">
              {COUNTRIES.map(c => (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="text-lg">{c.flag}</span>
                  <span className="flex-1 text-[13px] font-medium text-[#3a6b44]">{c.name}</span>
                  <span className="text-[12px] font-bold text-[#5a7d62]/60">{c.visitors}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
