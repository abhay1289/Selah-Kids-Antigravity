'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Eye, FileText, BookOpen, Image as ImageIcon, Settings,
  TrendingUp, Users, Play, ArrowRight, Sparkles,
  PenLine, Heart, Globe
} from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'Edit Homepage', href: '/admin/pages/home', icon: FileText, color: 'from-[#ff5c00] to-[#FF7B29]', shadow: 'shadow-[#ff5c00]/20' },
  { label: 'SEO Manager', href: '/admin/seo', icon: Globe, color: 'from-[#3a6b44] to-[#5a8f5c]', shadow: 'shadow-[#3a6b44]/20' },
  { label: 'Analytics', href: '/admin/analytics', icon: TrendingUp, color: 'from-[#00BFFF] to-[#87CEEB]', shadow: 'shadow-[#00BFFF]/20' },
  { label: 'Scheduler', href: '/admin/scheduler', icon: Play, color: 'from-[#feb835] to-[#FFD700]', shadow: 'shadow-[#feb835]/20' },
  { label: 'Performance', href: '/admin/performance', icon: Sparkles, color: 'from-[#93d35c] to-[#7ebd4e]', shadow: 'shadow-[#93d35c]/20' },
  { label: 'Settings', href: '/admin/settings', icon: Settings, color: 'from-[#9B59B6] to-[#8E44AD]', shadow: 'shadow-[#9B59B6]/20' },
];

const STATS = [
  { label: 'Total Pages', value: '11', icon: FileText, color: 'text-[#ff5c00]', bg: 'bg-[#ff5c00]/10' },
  { label: 'Blog Posts', value: '3', icon: BookOpen, color: 'text-[#00BFFF]', bg: 'bg-[#00BFFF]/10' },
  { label: 'Videos', value: '8', icon: Play, color: 'text-[#FF0000]', bg: 'bg-[#FF0000]/10' },
  { label: 'Team Members', value: '3', icon: Users, color: 'text-[#93d35c]', bg: 'bg-[#93d35c]/10' },
];

const PAGE_LIST = [
  { label: 'Homepage', href: '/admin/pages/home', status: 'Published', icon: '🏠' },
  { label: 'About', href: '/admin/pages/about', status: 'Published', icon: '📖' },
  { label: 'Watch', href: '/admin/pages/watch', status: 'Published', icon: '🎬' },
  { label: 'Characters', href: '/admin/content/characters', status: 'Published', icon: '🧒' },
  { label: 'Families', href: '/admin/pages/parents', status: 'Published', icon: '👨‍👩‍👧‍👦' },
  { label: 'Blog', href: '/admin/content/blog', status: 'Published', icon: '📝' },
  { label: 'Resources', href: '/admin/pages/resources', status: 'Published', icon: '📚' },
  { label: 'Donate', href: '/admin/pages/donate', status: 'Published', icon: '💝' },
  { label: 'Contact', href: '/admin/pages/contact', status: 'Published', icon: '📬' },
];

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="space-y-6 lg:space-y-8 max-w-[1400px] mx-auto">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#ff5c00] to-[#feb835] rounded-[2rem] p-6 md:p-10 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-[30%] w-[200px] h-[200px] bg-white/5 rounded-full blur-[60px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-white/80" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-white/70">Content Dashboard</span>
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold tracking-tight mb-3"
            style={{ fontFamily: 'var(--font-fredoka), "Fredoka", sans-serif' }}
          >
            Welcome to Selah Kids Dashboard 👋
          </h2>
          <p className="text-white/70 text-[15px] max-w-lg leading-relaxed">
            Manage your entire website from here. Edit text, swap images, publish blog posts, and update videos — all without touching a single line of code.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm hover:shadow-md transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div className="text-2xl font-bold text-[#3a6b44] tracking-tight" style={{ fontFamily: 'var(--font-fredoka)' }}>
              {stat.value}
            </div>
            <div className="text-[12px] font-medium text-[#5a7d62]/60 uppercase tracking-wider mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3
          className="text-[16px] font-bold text-[#3a6b44] mb-4 tracking-tight"
          style={{ fontFamily: 'var(--font-fredoka)' }}
        >
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(action.href)}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center gap-3 group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-lg ${action.shadow} group-hover:scale-110 transition-transform`}>
                <action.icon size={22} />
              </div>
              <span className="text-[13px] font-semibold text-[#3a6b44]">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Pages Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-[16px] font-bold text-[#3a6b44] tracking-tight"
            style={{ fontFamily: 'var(--font-fredoka)' }}
          >
            All Pages
          </h3>
          <motion.a
            href="/"
            target="_blank"
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1 text-[12px] font-semibold text-[#5a7d62]/60 hover:text-[#ff5c00] transition-colors"
          >
            <Eye size={14} />
            View Live Site
          </motion.a>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
          {PAGE_LIST.map((page, i) => (
            <motion.button
              key={page.label}
              whileHover={{ backgroundColor: 'rgba(255, 92, 0, 0.03)' }}
              onClick={() => router.push(page.href)}
              className="w-full flex items-center gap-4 px-6 py-4 text-left transition-colors group border-b border-[#3a6b44]/5 last:border-b-0"
            >
              <span className="text-xl">{page.icon}</span>
              <span className="flex-1 text-[14px] font-semibold text-[#3a6b44] group-hover:text-[#ff5c00] transition-colors">
                {page.label}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#93d35c]/10 text-[#3a6b44]">
                {page.status}
              </span>
              <ArrowRight size={16} className="text-[#5a7d62]/30 group-hover:text-[#ff5c00] group-hover:translate-x-1 transition-all" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
