'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Eye, FileText, Calendar, Plus } from 'lucide-react';

interface ScheduledItem {
  id: string;
  title: string;
  type: 'blog' | 'page' | 'video';
  status: 'draft' | 'scheduled' | 'published';
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  author: string;
}

const ITEMS: ScheduledItem[] = [
  { id: '1', title: 'The Strong Tower of Security', type: 'blog', status: 'published', scheduledDate: '2026-04-07', scheduledTime: '09:00', author: 'Leah' },
  { id: '2', title: 'Are We Repeating Patterns?', type: 'blog', status: 'published', scheduledDate: '2026-04-02', scheduledTime: '08:00', author: 'Leah' },
  { id: '3', title: 'The Call to Be a Blessing', type: 'blog', status: 'published', scheduledDate: '2026-04-15', scheduledTime: '10:00', author: 'Leah' },
  { id: '4', title: 'New Easter Devotional Post', type: 'blog', status: 'scheduled', scheduledDate: '2026-04-22', scheduledTime: '08:00', author: 'Carla' },
  { id: '5', title: 'Psalm 23 Lyric Video', type: 'video', status: 'scheduled', scheduledDate: '2026-04-25', scheduledTime: '12:00', author: 'Rey' },
  { id: '6', title: 'Summer Resources Update', type: 'page', status: 'draft', scheduledDate: '', scheduledTime: '', author: 'Leah' },
  { id: '7', title: 'Mother\'s Day Special Post', type: 'blog', status: 'scheduled', scheduledDate: '2026-05-10', scheduledTime: '07:00', author: 'Carla' },
];

const STATUS_MAP = {
  draft: { label: 'Draft', color: 'text-[#5a7d62]/50', bg: 'bg-[#3a6b44]/5' },
  scheduled: { label: 'Scheduled', color: 'text-[#feb835]', bg: 'bg-[#feb835]/10' },
  published: { label: 'Published', color: 'text-[#93d35c]', bg: 'bg-[#93d35c]/10' },
};

const TYPE_MAP = {
  blog: { label: '📝 Blog', color: '#00BFFF' },
  page: { label: '📄 Page', color: '#ff5c00' },
  video: { label: '🎬 Video', color: '#FF0000' },
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function ContentScheduler() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); } else setCurrentMonth(currentMonth - 1); };
  const nextMonth = () => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); } else setCurrentMonth(currentMonth + 1); };

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [firstDay, daysInMonth]);

  const getItemsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return ITEMS.filter(item => item.scheduledDate === dateStr);
  };

  const isToday = (day: number) => day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const upcoming = ITEMS.filter(i => i.status === 'scheduled').sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
  const drafts = ITEMS.filter(i => i.status === 'draft');

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm">
        <div>
          <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Content Scheduler</h2>
          <p className="text-[12px] text-[#5a7d62]/50">Plan and schedule content publishing</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff5c00]/10 text-[#ff5c00] text-[13px] font-bold hover:bg-[#ff5c00]/20 transition-all border border-[#ff5c00]/20"><Plus size={15} /> Schedule Content</motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Calendar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
          {/* Month Navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#3a6b44]/5">
            <motion.button whileTap={{ scale: 0.9 }} onClick={prevMonth} className="w-8 h-8 rounded-lg bg-[#3a6b44]/5 flex items-center justify-center hover:bg-[#3a6b44]/10 transition-colors"><ChevronLeft size={16} className="text-[#3a6b44]" /></motion.button>
            <h3 className="text-[15px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>{monthName}</h3>
            <motion.button whileTap={{ scale: 0.9 }} onClick={nextMonth} className="w-8 h-8 rounded-lg bg-[#3a6b44]/5 flex items-center justify-center hover:bg-[#3a6b44]/10 transition-colors"><ChevronRight size={16} className="text-[#3a6b44]" /></motion.button>
          </div>
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-[#3a6b44]/5">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-2 text-center text-[11px] font-bold text-[#5a7d62]/40 uppercase">{d}</div>
            ))}
          </div>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, i) => {
              const items = day ? getItemsForDay(day) : [];
              return (
                <div key={i} className={`min-h-[80px] p-1.5 border-b border-r border-[#3a6b44]/5 ${day ? 'hover:bg-[#3a6b44]/[0.02]' : ''} transition-colors`}>
                  {day && (
                    <>
                      <span className={`text-[12px] font-bold px-1.5 py-0.5 rounded-md ${isToday(day) ? 'bg-[#ff5c00] text-white' : 'text-[#3a6b44]'}`}>{day}</span>
                      <div className="mt-1 space-y-0.5">
                        {items.map(item => (
                          <div key={item.id} className="px-1.5 py-0.5 rounded-md text-[9px] font-bold truncate" style={{ backgroundColor: `${TYPE_MAP[item.type].color}15`, color: TYPE_MAP[item.type].color }}>{item.title}</div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Sidebar: Upcoming + Drafts */}
        <div className="space-y-6">
          {/* Upcoming */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#3a6b44]/5 flex items-center gap-2">
              <Clock size={14} className="text-[#feb835]" />
              <h3 className="text-[13px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Upcoming</h3>
              <span className="text-[11px] font-bold text-[#feb835] bg-[#feb835]/10 px-2 py-0.5 rounded-full ml-auto">{upcoming.length}</span>
            </div>
            <div className="divide-y divide-[#3a6b44]/5">
              {upcoming.map(item => (
                <div key={item.id} className="px-5 py-3 hover:bg-[#3a6b44]/[0.02] transition-colors">
                  <p className="text-[13px] font-semibold text-[#3a6b44] mb-1">{item.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${TYPE_MAP[item.type].color}15`, color: TYPE_MAP[item.type].color }}>{TYPE_MAP[item.type].label}</span>
                    <span className="text-[11px] text-[#5a7d62]/40">{new Date(item.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {item.scheduledTime}</span>
                  </div>
                </div>
              ))}
              {upcoming.length === 0 && <div className="px-5 py-8 text-center text-[13px] text-[#5a7d62]/30">No upcoming content</div>}
            </div>
          </motion.div>

          {/* Drafts */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#3a6b44]/5 flex items-center gap-2">
              <FileText size={14} className="text-[#5a7d62]/40" />
              <h3 className="text-[13px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Drafts</h3>
              <span className="text-[11px] font-bold text-[#5a7d62]/30 bg-[#3a6b44]/5 px-2 py-0.5 rounded-full ml-auto">{drafts.length}</span>
            </div>
            <div className="divide-y divide-[#3a6b44]/5">
              {drafts.map(item => (
                <div key={item.id} className="px-5 py-3 hover:bg-[#3a6b44]/[0.02] transition-colors">
                  <p className="text-[13px] font-semibold text-[#3a6b44] mb-1">{item.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${TYPE_MAP[item.type].color}15`, color: TYPE_MAP[item.type].color }}>{TYPE_MAP[item.type].label}</span>
                    <span className="text-[11px] text-[#5a7d62]/40">by {item.author}</span>
                  </div>
                </div>
              ))}
              {drafts.length === 0 && <div className="px-5 py-8 text-center text-[13px] text-[#5a7d62]/30">No drafts</div>}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
