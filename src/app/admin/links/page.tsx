'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, AlertTriangle, CheckCircle2, ExternalLink, XCircle, RefreshCw, Search } from 'lucide-react';

interface LinkCheck { id: string; page: string; url: string; anchor: string; status: 'ok' | 'broken' | 'redirect' | 'timeout'; statusCode: number; responseTime: number; type: 'internal' | 'external'; lastChecked: string; }

const LINK_CHECKS: LinkCheck[] = [
  { id: '1', page: '/', url: '/', anchor: 'Home', status: 'ok', statusCode: 200, responseTime: 45, type: 'internal', lastChecked: '2 min ago' },
  { id: '2', page: '/', url: '/about', anchor: 'About Us', status: 'ok', statusCode: 200, responseTime: 52, type: 'internal', lastChecked: '2 min ago' },
  { id: '3', page: '/', url: '/watch', anchor: 'Watch', status: 'ok', statusCode: 200, responseTime: 48, type: 'internal', lastChecked: '2 min ago' },
  { id: '4', page: '/', url: 'https://www.youtube.com/@selahkidsworship', anchor: 'YouTube EN', status: 'ok', statusCode: 200, responseTime: 210, type: 'external', lastChecked: '2 min ago' },
  { id: '5', page: '/', url: 'https://www.instagram.com/selah.kids', anchor: 'Instagram EN', status: 'ok', statusCode: 200, responseTime: 180, type: 'external', lastChecked: '2 min ago' },
  { id: '6', page: '/', url: 'https://open.spotify.com/artist/6lShgHNhA1vXSZ6f4UXMa4', anchor: 'Spotify', status: 'ok', statusCode: 200, responseTime: 320, type: 'external', lastChecked: '2 min ago' },
  { id: '7', page: '/about', url: '/team-old', anchor: 'Meet the Team', status: 'broken', statusCode: 404, responseTime: 0, type: 'internal', lastChecked: '2 min ago' },
  { id: '8', page: '/blog', url: '/blog/old-post-removed', anchor: 'Read More', status: 'broken', statusCode: 404, responseTime: 0, type: 'internal', lastChecked: '2 min ago' },
  { id: '9', page: '/resources', url: 'https://old-cdn.selahkids.com/coloring-page.pdf', anchor: 'Download PDF', status: 'timeout', statusCode: 0, responseTime: 5000, type: 'external', lastChecked: '2 min ago' },
  { id: '10', page: '/donate', url: '/give', anchor: 'Give Now', status: 'redirect', statusCode: 301, responseTime: 85, type: 'internal', lastChecked: '2 min ago' },
  { id: '11', page: '/', url: 'https://music.apple.com/us/artist/selah-kids/1716713041', anchor: 'Apple Music', status: 'ok', statusCode: 200, responseTime: 290, type: 'external', lastChecked: '2 min ago' },
  { id: '12', page: '/parents', url: '/parents', anchor: 'Families', status: 'ok', statusCode: 200, responseTime: 44, type: 'internal', lastChecked: '2 min ago' },
];

const STATUS_CONFIG = {
  ok: { icon: CheckCircle2, label: '200 OK', color: 'text-[#93d35c]', bg: 'bg-[#93d35c]/10' },
  broken: { icon: XCircle, label: '404 Broken', color: 'text-red-500', bg: 'bg-red-500/10' },
  redirect: { icon: RefreshCw, label: '301 Redirect', color: 'text-[#feb835]', bg: 'bg-[#feb835]/10' },
  timeout: { icon: AlertTriangle, label: 'Timeout', color: 'text-[#ff5c00]', bg: 'bg-[#ff5c00]/10' },
};

export default function BrokenLinkChecker() {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = LINK_CHECKS.filter(l => {
    if (filter !== 'all' && l.status !== filter) return false;
    if (searchQuery && !l.url.includes(searchQuery) && !l.anchor.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const ok = LINK_CHECKS.filter(l => l.status === 'ok').length;
  const broken = LINK_CHECKS.filter(l => l.status === 'broken').length;
  const redirects = LINK_CHECKS.filter(l => l.status === 'redirect').length;
  const timeouts = LINK_CHECKS.filter(l => l.status === 'timeout').length;

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm">
        <div><h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Link Checker</h2><p className="text-[12px] text-[#5a7d62]/50">Scan all internal and external links for errors</p></div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff5c00] to-[#FF7B29] text-white text-[13px] font-bold shadow-lg shadow-[#ff5c00]/20"><RefreshCw size={14} /> Re-scan</motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Healthy', count: ok, color: '#93d35c', icon: CheckCircle2 },
          { label: 'Broken', count: broken, color: '#ef4444', icon: XCircle },
          { label: 'Redirects', count: redirects, color: '#feb835', icon: RefreshCw },
          { label: 'Timeouts', count: timeouts, color: '#ff5c00', icon: AlertTriangle },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm text-center cursor-pointer hover:shadow-md transition-all" onClick={() => setFilter(s.label.toLowerCase() === 'healthy' ? 'ok' : s.label.toLowerCase() === 'redirects' ? 'redirect' : s.label.toLowerCase() === 'timeouts' ? 'timeout' : s.label.toLowerCase())}>
            <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}><s.icon size={18} style={{ color: s.color }} /></div>
            <div className="text-2xl font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>{s.count}</div>
            <div className="text-[12px] font-medium text-[#5a7d62]/50">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a7d62]/30" /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search URLs..." className="w-full h-[44px] pl-12 pr-4 rounded-xl bg-white/80 border border-white/60 text-[#3a6b44] text-[14px] outline-none focus:border-[#ff5c00]/20 transition-all shadow-sm" /></div>
        <div className="flex gap-1 bg-white/80 rounded-xl p-1 border border-white/60 shadow-sm">
          {['all', 'ok', 'broken', 'redirect', 'timeout'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-[11px] font-bold capitalize transition-all ${filter === f ? 'bg-white text-[#ff5c00] shadow-sm' : 'text-[#5a7d62]/50'}`}>{f === 'ok' ? 'Healthy' : f}</button>
          ))}
        </div>
      </div>

      {/* Link Table */}
      <div className="space-y-2">
        {filtered.map((link, i) => {
          const config = STATUS_CONFIG[link.status];
          return (
            <motion.div key={link.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white/60 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
              <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}><config.icon size={16} className={config.color} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5"><span className="text-[13px] font-semibold text-[#3a6b44] truncate">{link.anchor}</span><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${link.type === 'external' ? 'bg-[#00BFFF]/10 text-[#00BFFF]' : 'bg-[#3a6b44]/5 text-[#5a7d62]/40'}`}>{link.type}</span></div>
                <p className="text-[12px] text-[#5a7d62]/40 font-mono truncate">{link.url}</p>
              </div>
              <div className="text-right flex-shrink-0 space-y-0.5">
                <span className={`text-[11px] font-bold ${config.color}`}>{config.label}</span>
                <p className="text-[10px] text-[#5a7d62]/25">from {link.page} · {link.responseTime > 0 ? `${link.responseTime}ms` : '—'}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
