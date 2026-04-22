'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, Settings, LogIn, Trash2, Eye, PenLine, Plus, Image as ImageIcon } from 'lucide-react';

interface ActivityItem {
  id: string;
  action: 'updated' | 'published' | 'created' | 'deleted' | 'login' | 'settings';
  user: string;
  avatar: string;
  target: string;
  targetType: string;
  timestamp: string;
  timeAgo: string;
  details?: string;
}

const ACTIVITIES: ActivityItem[] = [
  { id: '1', action: 'updated', user: 'Leah', avatar: 'L', target: 'Homepage — Hero Section', targetType: 'Page', timestamp: '2026-04-20 10:05:00', timeAgo: '3 min ago', details: 'Changed hero description text' },
  { id: '2', action: 'published', user: 'Leah', avatar: 'L', target: 'The Call to Be a Blessing', targetType: 'Blog Post', timestamp: '2026-04-20 09:42:00', timeAgo: '26 min ago' },
  { id: '3', action: 'updated', user: 'Carla', avatar: 'C', target: 'SEO — Watch Page', targetType: 'SEO', timestamp: '2026-04-20 09:30:00', timeAgo: '38 min ago', details: 'Updated meta title and description' },
  { id: '4', action: 'created', user: 'Leah', avatar: 'L', target: 'New redirect /songs → /watch', targetType: 'Redirect', timestamp: '2026-04-20 09:15:00', timeAgo: '53 min ago' },
  { id: '5', action: 'updated', user: 'Rey', avatar: 'R', target: 'Andy — Character Description', targetType: 'Character', timestamp: '2026-04-20 08:50:00', timeAgo: '1h ago' },
  { id: '6', action: 'settings', user: 'Leah', avatar: 'L', target: 'Updated Spotify artist URL', targetType: 'Settings', timestamp: '2026-04-20 08:30:00', timeAgo: '1.5h ago' },
  { id: '7', action: 'login', user: 'Leah', avatar: 'L', target: 'Logged in from Chrome/Mac', targetType: 'Auth', timestamp: '2026-04-20 08:25:00', timeAgo: '1.5h ago' },
  { id: '8', action: 'updated', user: 'Carla', avatar: 'C', target: 'Testimonial — le_chosen', targetType: 'Testimonial', timestamp: '2026-04-19 18:20:00', timeAgo: '16h ago', details: 'Updated Spanish translation' },
  { id: '9', action: 'published', user: 'Leah', avatar: 'L', target: 'Are We Repeating Patterns?', targetType: 'Blog Post', timestamp: '2026-04-19 16:00:00', timeAgo: '18h ago' },
  { id: '10', action: 'deleted', user: 'Leah', avatar: 'L', target: 'Draft blog post "Test"', targetType: 'Blog Post', timestamp: '2026-04-19 15:45:00', timeAgo: '18h ago' },
  { id: '11', action: 'updated', user: 'Rey', avatar: 'R', target: 'Libni — Character Image', targetType: 'Character', timestamp: '2026-04-19 14:30:00', timeAgo: '20h ago', details: 'Uploaded new intro pose' },
  { id: '12', action: 'login', user: 'Rey', avatar: 'R', target: 'Logged in from Firefox/Win', targetType: 'Auth', timestamp: '2026-04-19 14:25:00', timeAgo: '20h ago' },
  { id: '13', action: 'created', user: 'Leah', avatar: 'L', target: 'The Strong Tower of Security', targetType: 'Blog Post', timestamp: '2026-04-19 10:00:00', timeAgo: '1d ago' },
  { id: '14', action: 'settings', user: 'Leah', avatar: 'L', target: 'Updated Instagram ES URL', targetType: 'Settings', timestamp: '2026-04-18 22:00:00', timeAgo: '1d ago' },
  { id: '15', action: 'login', user: 'Carla', avatar: 'C', target: 'Logged in from Safari/iPhone', targetType: 'Auth', timestamp: '2026-04-18 20:00:00', timeAgo: '2d ago' },
];

import type { LucideIcon } from 'lucide-react';

const ACTION_CONFIG: Record<string, { icon: LucideIcon; label: string; color: string; bg: string }> = {
  updated: { icon: PenLine, label: 'Updated', color: 'text-[#00BFFF]', bg: 'bg-[#00BFFF]/10' },
  published: { icon: Eye, label: 'Published', color: 'text-[#93d35c]', bg: 'bg-[#93d35c]/10' },
  created: { icon: Plus, label: 'Created', color: 'text-[#ff5c00]', bg: 'bg-[#ff5c00]/10' },
  deleted: { icon: Trash2, label: 'Deleted', color: 'text-red-500', bg: 'bg-red-500/10' },
  login: { icon: LogIn, label: 'Login', color: 'text-[#9B59B6]', bg: 'bg-[#9B59B6]/10' },
  settings: { icon: Settings, label: 'Settings', color: 'text-[#feb835]', bg: 'bg-[#feb835]/10' },
};

const FILTERS = ['All', 'Updated', 'Published', 'Created', 'Deleted', 'Login', 'Settings'] as const;

export default function ActivityLog() {
  const [filter, setFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let items = ACTIVITIES;
    if (filter !== 'All') items = items.filter(a => a.action === filter.toLowerCase());
    if (searchQuery) items = items.filter(a => a.target.toLowerCase().includes(searchQuery.toLowerCase()) || a.user.toLowerCase().includes(searchQuery.toLowerCase()));
    return items;
  }, [filter, searchQuery]);

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm">
        <div>
          <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Activity Log</h2>
          <p className="text-[12px] text-[#5a7d62]/50">Complete audit trail of dashboard actions</p>
        </div>
        <span className="text-[12px] font-medium text-[#5a7d62]/50 bg-[#3a6b44]/5 px-3 py-1 rounded-full">{filtered.length} entries</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a7d62]/30" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by action or user..." className="w-full h-[44px] pl-12 pr-4 rounded-xl bg-white/80 backdrop-blur-xl border border-white/60 text-[#3a6b44] text-[14px] font-medium outline-none focus:border-[#ff5c00]/20 transition-all shadow-sm" />
        </div>
        <div className="flex gap-1 bg-white/80 backdrop-blur-xl rounded-xl p-1 border border-white/60 shadow-sm overflow-x-auto">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${filter === f ? 'bg-[#ff5c00]/10 text-[#ff5c00]' : 'text-[#5a7d62]/50 hover:text-[#3a6b44]'}`}>{f}</button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        {filtered.map((item, i) => {
          const config = ACTION_CONFIG[item.action];
          const Icon = config.icon;
          return (
            <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white/60 shadow-sm flex items-start gap-4 hover:shadow-md transition-all group">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon size={16} className={config.color} />
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#ff5c00] to-[#feb835] flex items-center justify-center text-white text-[10px] font-bold">{item.avatar}</div>
                  <span className="text-[13px] font-bold text-[#3a6b44]">{item.user}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${config.bg} ${config.color}`}>{config.label}</span>
                </div>
                <p className="text-[13px] text-[#5a7d62]/70 truncate">{item.target}</p>
                {item.details && <p className="text-[12px] text-[#5a7d62]/40 mt-0.5 italic">{item.details}</p>}
              </div>
              {/* Time */}
              <div className="text-right flex-shrink-0">
                <p className="text-[12px] font-semibold text-[#5a7d62]/40">{item.timeAgo}</p>
                <p className="text-[10px] text-[#5a7d62]/20">{item.targetType}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
