'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, ArrowRight, ExternalLink, Search } from 'lucide-react';

interface Redirect {
  id: string;
  source: string;
  destination: string;
  type: '301' | '302';
  hits: number;
  isActive: boolean;
}

const INITIAL_REDIRECTS: Redirect[] = [
  { id: '1', source: '/home', destination: '/', type: '301', hits: 1240, isActive: true },
  { id: '2', source: '/family', destination: '/parents', type: '301', hits: 890, isActive: true },
  { id: '3', source: '/songs', destination: '/watch', type: '301', hits: 620, isActive: true },
  { id: '4', source: '/videos', destination: '/watch', type: '301', hits: 430, isActive: true },
  { id: '5', source: '/give', destination: '/donate', type: '302', hits: 210, isActive: true },
  { id: '6', source: '/support', destination: '/donate', type: '301', hits: 180, isActive: true },
  { id: '7', source: '/team', destination: '/about', type: '301', hits: 150, isActive: true },
];

export default function RedirectsManager() {
  const [redirects, setRedirects] = useState<Redirect[]>(INITIAL_REDIRECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const addNew = () => {
    const r: Redirect = { id: Date.now().toString(), source: '', destination: '', type: '301', hits: 0, isActive: true };
    setRedirects([r, ...redirects]);
  };
  const update = <K extends keyof Redirect>(id: string, field: K, value: Redirect[K]) => setRedirects(redirects.map(r => r.id === id ? { ...r, [field]: value } : r));
  const remove = (id: string) => { if (confirm('Delete this redirect?')) setRedirects(redirects.filter(r => r.id !== id)); };
  const handleSave = async () => { setIsSaving(true); await new Promise(r => setTimeout(r, 1500)); setIsSaving(false); };

  const filtered = searchQuery ? redirects.filter(r => r.source.includes(searchQuery) || r.destination.includes(searchQuery)) : redirects;

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm sticky top-[72px] z-20">
        <div className="flex items-center gap-3">
          <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Redirects</h2>
          <span className="text-[12px] font-medium text-[#5a7d62]/50 bg-[#3a6b44]/5 px-3 py-1 rounded-full">{redirects.length} rules</span>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff5c00]/10 text-[#ff5c00] text-[13px] font-bold hover:bg-[#ff5c00]/20 transition-all border border-[#ff5c00]/20"><Plus size={15} /> Add Rule</motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Save size={15} /> {isSaving ? 'Saving...' : 'Save'}</motion.button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a7d62]/30" />
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search redirects..." className="w-full h-[44px] pl-12 pr-4 rounded-xl bg-white/80 backdrop-blur-xl border border-white/60 text-[#3a6b44] text-[14px] font-medium outline-none focus:border-[#ff5c00]/20 transition-all shadow-sm" />
      </div>

      {/* Redirect Rules */}
      <div className="space-y-3">
        {filtered.map((redirect) => (
          <motion.div key={redirect.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-5">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              {/* Source */}
              <div className="flex-1 w-full">
                <label className="text-[10px] font-bold text-[#5a7d62]/30 uppercase tracking-wider mb-1 block">Source Path</label>
                <input value={redirect.source} onChange={e => update(redirect.id, 'source', e.target.value)} placeholder="/old-path" className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all font-mono" />
              </div>
              {/* Arrow */}
              <div className="hidden md:flex items-end pb-1"><ArrowRight size={18} className="text-[#5a7d62]/20" /></div>
              {/* Destination */}
              <div className="flex-1 w-full">
                <label className="text-[10px] font-bold text-[#5a7d62]/30 uppercase tracking-wider mb-1 block">Destination</label>
                <input value={redirect.destination} onChange={e => update(redirect.id, 'destination', e.target.value)} placeholder="/new-path" className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all font-mono" />
              </div>
              {/* Type */}
              <div className="w-[100px]">
                <label className="text-[10px] font-bold text-[#5a7d62]/30 uppercase tracking-wider mb-1 block">Type</label>
                <select value={redirect.type} onChange={e => update(redirect.id, 'type', e.target.value as Redirect['type'])} className="w-full h-[40px] px-3 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] font-bold outline-none transition-all appearance-none cursor-pointer">
                  <option value="301">301</option>
                  <option value="302">302</option>
                </select>
              </div>
              {/* Hits */}
              <div className="text-center min-w-[60px]">
                <label className="text-[10px] font-bold text-[#5a7d62]/30 uppercase tracking-wider mb-1 block">Hits</label>
                <span className="text-[13px] font-bold text-[#3a6b44]">{redirect.hits.toLocaleString()}</span>
              </div>
              {/* Toggle + Delete */}
              <div className="flex items-end gap-2 pb-0.5">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => update(redirect.id, 'isActive', !redirect.isActive)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${redirect.isActive ? 'bg-[#93d35c]/10 text-[#3a6b44]' : 'bg-red-500/10 text-red-500'}`}>{redirect.isActive ? 'Active' : 'Off'}</motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => remove(redirect.id)} className="p-2 rounded-lg bg-red-500/5 text-red-500 hover:bg-red-500/10"><Trash2 size={14} /></motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
