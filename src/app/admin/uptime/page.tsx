'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, XCircle, Clock, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface UptimeEntry { date: string; status: 'up' | 'down' | 'degraded'; responseTime: number; }

const DAYS_90: UptimeEntry[] = Array.from({ length: 90 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - 89 + i);
  const isDown = i === 42 || i === 43; // Simulated downtime
  const isDegraded = i === 67;
  return { date: d.toISOString().slice(0, 10), status: isDown ? 'down' : isDegraded ? 'degraded' : 'up', responseTime: isDown ? 0 : isDegraded ? 1200 : 80 + Math.floor(Math.random() * 120) };
});

const INCIDENTS = [
  { id: '1', date: 'Mar 12, 2026', duration: '47 min', cause: 'Vercel deployment error — DNS propagation delay', status: 'Resolved', severity: 'Major' },
  { id: '2', date: 'Apr 7, 2026', duration: '12 min', cause: 'Supabase rate limit exceeded during social media spike', status: 'Resolved', severity: 'Minor' },
];

export default function UptimeMonitor() {
  const upDays = DAYS_90.filter(d => d.status === 'up').length;
  const uptime = ((upDays / 90) * 100).toFixed(2);
  const avgResponse = Math.round(DAYS_90.filter(d => d.status === 'up').reduce((a, d) => a + d.responseTime, 0) / upDays);

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm">
        <div><h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Uptime Monitor</h2><p className="text-[12px] text-[#5a7d62]/50">90-day site availability tracking</p></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#93d35c] animate-pulse" /><span className="text-[13px] font-bold text-[#93d35c]">Online</span></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Uptime (90d)', value: `${uptime}%`, color: '#93d35c', icon: Wifi },
          { label: 'Avg. Response', value: `${avgResponse}ms`, color: '#00BFFF', icon: Clock },
          { label: 'Incidents', value: INCIDENTS.length.toString(), color: '#feb835', icon: Activity },
          { label: 'Last Checked', value: 'Just now', color: '#ff5c00', icon: RefreshCw },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm">
            <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}><s.icon size={18} style={{ color: s.color }} /></div>
            <div className="text-2xl font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>{s.value}</div>
            <div className="text-[12px] font-medium text-[#5a7d62]/50 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* 90-Day Grid */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-sm">
        <h3 className="text-[14px] font-bold text-[#3a6b44] mb-4" style={{ fontFamily: 'var(--font-fredoka)' }}>90-Day Availability</h3>
        <div className="flex flex-wrap gap-[3px]">
          {DAYS_90.map((d, i) => (
            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.005 }} className={`w-[14px] h-[14px] rounded-sm cursor-pointer transition-transform hover:scale-150 ${d.status === 'up' ? 'bg-[#93d35c]' : d.status === 'degraded' ? 'bg-[#feb835]' : 'bg-red-500'}`} title={`${d.date} — ${d.status === 'up' ? `${d.responseTime}ms` : d.status}`} />
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 text-[10px] text-[#5a7d62]/30">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#93d35c]" /> Up</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#feb835]" /> Degraded</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-500" /> Down</span>
          <span className="ml-auto">90 days ago → Today</span>
        </div>
      </motion.div>

      {/* Incidents */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#3a6b44]/5"><h3 className="text-[14px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Incident History</h3></div>
        {INCIDENTS.map(inc => (
          <div key={inc.id} className="px-6 py-4 border-b border-[#3a6b44]/5 last:border-0 flex items-start gap-4">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${inc.severity === 'Major' ? 'bg-red-500/10' : 'bg-[#feb835]/10'}`}>{inc.severity === 'Major' ? <WifiOff size={16} className="text-red-500" /> : <Activity size={16} className="text-[#feb835]" />}</div>
            <div className="flex-1"><p className="text-[13px] font-semibold text-[#3a6b44]">{inc.cause}</p><p className="text-[11px] text-[#5a7d62]/40 mt-0.5">{inc.date} · Duration: {inc.duration}</p></div>
            <span className="text-[11px] font-bold text-[#93d35c] bg-[#93d35c]/10 px-2 py-1 rounded-lg">{inc.status}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
