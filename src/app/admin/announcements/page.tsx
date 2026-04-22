'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Save, Eye, EyeOff, X, Megaphone } from 'lucide-react';
import { useCmsCollection } from '../../../lib/useCms';

interface Banner {
  id: string;
  textEn: string;
  textEs: string;
  linkText: string;
  linkHref: string;
  bgColor: string;
  textColor: string;
  isActive: boolean;
  dismissible: boolean;
  showOnPages: 'all' | 'home' | 'custom';
}

const INITIAL_BANNERS: Banner[] = [
  { id: '1', textEn: '🎉 New Song "I Am Blessed" is out now!', textEs: '🎉 ¡Nueva canción "Soy Bendecido" ya disponible!', linkText: 'Watch Now', linkHref: '/watch', bgColor: '#FF5C00', textColor: '#FFFFFF', isActive: true, dismissible: true, showOnPages: 'all' },
  { id: '2', textEn: '📖 New blog post: "The Call to Be a Blessing"', textEs: '📖 Nuevo artículo: "El Llamado a Ser de Bendición"', linkText: 'Read', linkHref: '/blog/the-call-to-be-a-blessing', bgColor: '#3A6B44', textColor: '#FFFFFF', isActive: false, dismissible: true, showOnPages: 'home' },
];

export default function AnnouncementBar() {
  const { items: banners, setItems: setBanners, isSaving, save, error } = useCmsCollection<Banner>(
    'announcement_banners',
    INITIAL_BANNERS,
  );

  const update = <K extends keyof Banner>(id: string, field: K, value: Banner[K]) => setBanners(banners.map(b => b.id === id ? { ...b, [field]: value } : b));
  const addBanner = () => setBanners([...banners, { id: Date.now().toString(), textEn: '', textEs: '', linkText: '', linkHref: '', bgColor: '#FF5C00', textColor: '#FFFFFF', isActive: false, dismissible: true, showOnPages: 'all' }]);
  const removeBanner = (id: string) => { if (confirm('Delete this banner?')) setBanners(banners.filter(b => b.id !== id)); };
  const handleSave = async () => { try { await save(); } catch { /* surfaced via hook */ } };

  const activeBanner = banners.find(b => b.isActive);

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm sticky top-[72px] z-20">
        <div><h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Announcement Bar</h2><p className="text-[12px] text-[#5a7d62]/50">Top-of-site promotional banner</p></div>
        <div className="flex gap-3 items-center">
          {error && <span className="text-[11px] font-semibold text-red-500">{error}</span>}
          <motion.button whileTap={{ scale: 0.98 }} onClick={addBanner} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff5c00]/10 text-[#ff5c00] text-[13px] font-bold hover:bg-[#ff5c00]/20 transition-all border border-[#ff5c00]/20"><Megaphone size={14} /> New Banner</motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Save size={15} /> {isSaving ? 'Saving...' : 'Save'}</motion.button>
        </div>
      </div>

      {/* Active Preview */}
      {activeBanner && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl overflow-hidden">
          <p className="text-[10px] font-bold text-[#5a7d62]/30 uppercase tracking-wider mb-2">Live Preview</p>
          <div className="flex items-center justify-center gap-3 px-6 py-3 text-[13px] font-bold" style={{ backgroundColor: activeBanner.bgColor, color: activeBanner.textColor }}>
            <span>{activeBanner.textEn}</span>
            {activeBanner.linkText && <span className="underline cursor-pointer opacity-80">{activeBanner.linkText} →</span>}
            {activeBanner.dismissible && <X size={14} className="opacity-50 ml-2" />}
          </div>
        </motion.div>
      )}

      {/* Banner List */}
      {banners.map((banner) => (
        <motion.div key={banner.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: banner.bgColor }} />
              <span className="text-[14px] font-bold text-[#3a6b44]">{banner.textEn || 'New Banner'}</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setBanners(banners.map(b => ({ ...b, isActive: b.id === banner.id ? !b.isActive : false }))); }} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold ${banner.isActive ? 'bg-[#93d35c]/10 text-[#3a6b44]' : 'bg-[#3a6b44]/5 text-[#5a7d62]/40'}`}>{banner.isActive ? <Eye size={12} /> : <EyeOff size={12} />}{banner.isActive ? 'Active' : 'Inactive'}</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => removeBanner(banner.id)} className="p-2 rounded-lg bg-red-500/5 text-red-500 hover:bg-red-500/10"><X size={14} /></motion.button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Text (EN) 🇺🇸</label><input value={banner.textEn} onChange={e => update(banner.id, 'textEn', e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
            <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Text (ES) 🇪🇸</label><input value={banner.textEs} onChange={e => update(banner.id, 'textEs', e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div><label className="text-[10px] font-bold text-[#5a7d62]/30 uppercase mb-0.5 block">Link Text</label><input value={banner.linkText} onChange={e => update(banner.id, 'linkText', e.target.value)} className="w-full h-[36px] px-3 rounded-lg bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[12px] outline-none transition-all" /></div>
            <div><label className="text-[10px] font-bold text-[#5a7d62]/30 uppercase mb-0.5 block">Link URL</label><input value={banner.linkHref} onChange={e => update(banner.id, 'linkHref', e.target.value)} className="w-full h-[36px] px-3 rounded-lg bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[12px] font-mono outline-none transition-all" /></div>
            <div><label className="text-[10px] font-bold text-[#5a7d62]/30 uppercase mb-0.5 block">BG Color</label><div className="flex items-center gap-2"><input type="color" value={banner.bgColor} onChange={e => update(banner.id, 'bgColor', e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer" /><input value={banner.bgColor} onChange={e => update(banner.id, 'bgColor', e.target.value)} className="flex-1 h-[36px] px-2 rounded-lg bg-[#3a6b44]/[0.02] border-2 border-transparent text-[11px] font-mono outline-none" /></div></div>
            <div><label className="text-[10px] font-bold text-[#5a7d62]/30 uppercase mb-0.5 block">Show On</label><select value={banner.showOnPages} onChange={e => update(banner.id, 'showOnPages', e.target.value as Banner['showOnPages'])} className="w-full h-[36px] px-3 rounded-lg bg-[#3a6b44]/[0.02] border-2 border-transparent text-[12px] text-[#3a6b44] outline-none appearance-none cursor-pointer">
              <option value="all">All Pages</option><option value="home">Homepage Only</option><option value="custom">Custom</option>
            </select></div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer"><motion.button whileTap={{ scale: 0.95 }} onClick={() => update(banner.id, 'dismissible', !banner.dismissible)} className={`w-10 h-6 rounded-full relative transition-colors ${banner.dismissible ? 'bg-[#93d35c]' : 'bg-[#3a6b44]/10'}`}><motion.div animate={{ x: banner.dismissible ? 18 : 2 }} className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" /></motion.button><span className="text-[12px] font-medium text-[#3a6b44]">Dismissible by visitor</span></label>
        </motion.div>
      ))}
    </div>
  );
}
