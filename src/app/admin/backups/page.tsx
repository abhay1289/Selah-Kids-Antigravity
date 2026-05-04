'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Clock, Database, FileText, HardDrive, Archive, RefreshCw } from 'lucide-react';

interface Backup { id: string; date: string; size: string; type: 'auto' | 'manual'; status: 'complete' | 'in-progress'; includes: string; }

const BACKUPS: Backup[] = [
  { id: '1', date: '2026-04-20 09:00', size: '12.4 MB', type: 'auto', status: 'complete', includes: 'Database + Media + Settings' },
  { id: '2', date: '2026-04-19 09:00', size: '12.3 MB', type: 'auto', status: 'complete', includes: 'Database + Media + Settings' },
  { id: '3', date: '2026-04-18 09:00', size: '12.1 MB', type: 'auto', status: 'complete', includes: 'Database + Media + Settings' },
  { id: '4', date: '2026-04-15 14:32', size: '11.8 MB', type: 'manual', status: 'complete', includes: 'Full Site Backup' },
  { id: '5', date: '2026-04-10 09:00', size: '11.2 MB', type: 'auto', status: 'complete', includes: 'Database + Media + Settings' },
  { id: '6', date: '2026-04-01 09:00', size: '10.8 MB', type: 'auto', status: 'complete', includes: 'Database + Media + Settings' },
];

const EXPORT_OPTIONS = [
  { id: 'db', label: 'Database (JSON)', icon: Database, desc: 'All page content, blog posts, team data, settings', size: '~2.4 MB' },
  { id: 'media', label: 'Media Files (ZIP)', icon: HardDrive, desc: 'Images, videos, and uploaded assets', size: '~8.9 MB' },
  { id: 'seo', label: 'SEO Data (CSV)', icon: FileText, desc: 'Meta titles, descriptions, keywords, scores', size: '~12 KB' },
  { id: 'redirects', label: 'Redirects (CSV)', icon: RefreshCw, desc: 'All redirect rules with hit counts', size: '~2 KB' },
  { id: 'full', label: 'Full Site Backup', icon: Archive, desc: 'Everything — database, media, SEO, settings', size: '~12 MB' },
];

export default function BackupExport() {
  const [isCreating, setIsCreating] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  const createBackup = async () => { setIsCreating(true); await new Promise(r => setTimeout(r, 2000)); setIsCreating(false); };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm">
        <div><h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Backup & Export</h2><p className="text-[12px] text-[#5a7d62]/50">Download data and manage backups</p></div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={createBackup} disabled={isCreating} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Archive size={15} /> {isCreating ? 'Creating...' : 'Create Backup'}</motion.button>
      </div>

      {/* Export Options */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-[14px] font-bold text-[#3a6b44] mb-3" style={{ fontFamily: 'var(--font-fredoka)' }}>📦 Export Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXPORT_OPTIONS.map(opt => (
            <motion.button key={opt.id} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm text-left hover:shadow-md hover:border-[#ff5c00]/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#ff5c00]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><opt.icon size={18} className="text-[#ff5c00]" /></div>
              <p className="text-[13px] font-bold text-[#3a6b44]">{opt.label}</p>
              <p className="text-[11px] text-[#5a7d62]/40 mt-1">{opt.desc}</p>
              <div className="flex items-center gap-2 mt-3"><Download size={12} className="text-[#ff5c00]" /><span className="text-[11px] font-bold text-[#ff5c00]">Download</span><span className="text-[10px] text-[#5a7d62]/30 ml-auto">{opt.size}</span></div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Auto Backup Toggle */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm flex items-center justify-between">
        <div><p className="text-[13px] font-bold text-[#3a6b44]">Automatic Daily Backups</p><p className="text-[12px] text-[#5a7d62]/40">Run at 09:00 UTC every day, keep last 30 days</p></div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setAutoBackup(!autoBackup)} className={`w-12 h-7 rounded-full relative transition-colors ${autoBackup ? 'bg-[#93d35c]' : 'bg-[#3a6b44]/10'}`}><motion.div animate={{ x: autoBackup ? 22 : 2 }} className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm" /></motion.button>
      </motion.div>

      {/* Backup History */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-[14px] font-bold text-[#3a6b44] mb-3" style={{ fontFamily: 'var(--font-fredoka)' }}>🕐 Backup History</h3>
        <div className="space-y-2">
          {BACKUPS.map((backup, i) => (
            <motion.div key={backup.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white/60 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${backup.type === 'auto' ? 'bg-[#00BFFF]/10' : 'bg-[#ff5c00]/10'}`}>{backup.type === 'auto' ? <Clock size={16} className="text-[#00BFFF]" /> : <Upload size={16} className="text-[#ff5c00]" />}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#3a6b44]">{backup.date}</p>
                <p className="text-[11px] text-[#5a7d62]/40">{backup.includes}</p>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${backup.type === 'auto' ? 'bg-[#00BFFF]/10 text-[#00BFFF]' : 'bg-[#ff5c00]/10 text-[#ff5c00]'}`}>{backup.type === 'auto' ? 'Auto' : 'Manual'}</span>
              <span className="text-[12px] font-medium text-[#5a7d62]/40">{backup.size}</span>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-3 py-1.5 rounded-lg bg-[#3a6b44]/5 text-[#3a6b44] text-[11px] font-bold hover:bg-[#3a6b44]/10 transition-colors"><Download size={12} className="inline mr-1" />Download</motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
