'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import { useCmsCollection } from '../../../lib/useCms';

interface NavLink {
  id: string;
  labelEn: string;
  labelEs: string;
  href: string;
  isVisible: boolean;
}

interface NavSettings {
  id: string;
  logoPath: string;
  ctaLabelEn: string;
  ctaLabelEs: string;
  ctaHref: string;
  ctaStyle: 'primary' | 'secondary';
  stickyOnScroll: boolean;
  showLanguageToggle: boolean;
}

const INITIAL_LINKS: NavLink[] = [
  { id: '1', labelEn: 'Home', labelEs: 'Inicio', href: '/', isVisible: true },
  { id: '2', labelEn: 'About', labelEs: 'Sobre Nosotros', href: '/about', isVisible: true },
  { id: '3', labelEn: 'Watch', labelEs: 'Ver', href: '/watch', isVisible: true },
  { id: '4', labelEn: 'Characters', labelEs: 'Personajes', href: '/characters', isVisible: true },
  { id: '5', labelEn: 'Families', labelEs: 'Familias', href: '/parents', isVisible: true },
  { id: '6', labelEn: 'Blog', labelEs: 'Blog', href: '/blog', isVisible: true },
  { id: '7', labelEn: 'Resources', labelEs: 'Recursos', href: '/resources', isVisible: true },
];

const INITIAL_SETTINGS: NavSettings[] = [{
  id: 'nav',
  logoPath: '/SK_Logo_FN.jpg',
  ctaLabelEn: 'Donate',
  ctaLabelEs: 'Donar',
  ctaHref: '/donate',
  ctaStyle: 'primary',
  stickyOnScroll: true,
  showLanguageToggle: true,
}];

export default function NavbarEditor() {
  const { items: links, setItems: setLinks, isSaving: linksSaving, save: saveLinks, error: linksError } = useCmsCollection<NavLink>(
    'nav_links',
    INITIAL_LINKS,
  );
  const { items: settingsArr, setItems: setSettingsArr, isSaving: settingsSaving, save: saveSettings, error: settingsError } = useCmsCollection<NavSettings>(
    'nav_settings',
    INITIAL_SETTINGS,
    { sortOrder: false },
  );
  const settings = settingsArr[0] ?? INITIAL_SETTINGS[0];
  const setSettings = (s: NavSettings) => setSettingsArr([s]);
  const isSaving = linksSaving || settingsSaving;
  const error = linksError || settingsError;

  const addLink = () => {
    const l: NavLink = { id: Date.now().toString(), labelEn: '', labelEs: '', href: '/', isVisible: true };
    setLinks([...links, l]);
  };
  const updateLink = <K extends keyof NavLink>(id: string, field: K, value: NavLink[K]) => setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));
  const removeLink = (id: string) => { if (confirm('Remove this nav link?')) setLinks(links.filter(l => l.id !== id)); };
  const handleSave = async () => {
    try { await Promise.all([saveLinks(), saveSettings()]); } catch { /* surfaced via hook */ }
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm sticky top-[72px] z-20">
        <div>
          <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Navigation Bar</h2>
          <p className="text-[12px] text-[#5a7d62]/50">Edit menu links, logo, and CTA button</p>
        </div>
        <div className="flex items-center gap-3">
          {error && <span className="text-[11px] font-semibold text-red-500">{error}</span>}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Save size={15} /> {isSaving ? 'Saving...' : 'Save'}</motion.button>
        </div>
      </div>

      {/* Live Preview */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-4 overflow-hidden">
        <p className="text-[10px] font-bold text-[#5a7d62]/30 uppercase tracking-wider mb-3">Live Preview</p>
        <div className="flex items-center justify-between bg-white/70 rounded-2xl px-6 py-3 border border-[#3a6b44]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f1f8e7] overflow-hidden">{settings.logoPath && <img src={settings.logoPath} alt="" className="w-full h-full object-contain" />}</div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {links.filter(l => l.isVisible).map(l => (
              <span key={l.id} className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-[#3a6b44] hover:text-[#ff5c00] transition-colors cursor-default">{l.labelEn}</span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {settings.showLanguageToggle && <div className="flex bg-[#3a6b44]/5 rounded-full p-0.5"><span className="px-2 py-1 text-[10px] rounded-full bg-white shadow-sm">🇺🇸</span><span className="px-2 py-1 text-[10px]">🇪🇸</span></div>}
            <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff5c00] to-[#FF7B29] text-white text-[11px] font-bold">{settings.ctaLabelEn}</span>
          </div>
        </div>
      </motion.div>

      {/* Logo & CTA Settings */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6 space-y-4">
        <h3 className="text-[14px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>⚙️ General Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Logo Image Path</label><input value={settings.logoPath} onChange={e => setSettings({ ...settings, logoPath: e.target.value })} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
          <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">CTA Link</label><input value={settings.ctaHref} onChange={e => setSettings({ ...settings, ctaHref: e.target.value })} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all font-mono" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">CTA Label (EN) 🇺🇸</label><input value={settings.ctaLabelEn} onChange={e => setSettings({ ...settings, ctaLabelEn: e.target.value })} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
          <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">CTA Label (ES) 🇪🇸</label><input value={settings.ctaLabelEs} onChange={e => setSettings({ ...settings, ctaLabelEs: e.target.value })} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
        </div>
        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer"><motion.button whileTap={{ scale: 0.95 }} onClick={() => setSettings({ ...settings, stickyOnScroll: !settings.stickyOnScroll })} className={`w-10 h-6 rounded-full relative transition-colors ${settings.stickyOnScroll ? 'bg-[#93d35c]' : 'bg-[#3a6b44]/10'}`}><motion.div animate={{ x: settings.stickyOnScroll ? 18 : 2 }} className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" /></motion.button><span className="text-[12px] font-medium text-[#3a6b44]">Sticky on scroll</span></label>
          <label className="flex items-center gap-2 cursor-pointer"><motion.button whileTap={{ scale: 0.95 }} onClick={() => setSettings({ ...settings, showLanguageToggle: !settings.showLanguageToggle })} className={`w-10 h-6 rounded-full relative transition-colors ${settings.showLanguageToggle ? 'bg-[#93d35c]' : 'bg-[#3a6b44]/10'}`}><motion.div animate={{ x: settings.showLanguageToggle ? 18 : 2 }} className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" /></motion.button><span className="text-[12px] font-medium text-[#3a6b44]">Language toggle</span></label>
        </div>
      </motion.div>

      {/* Navigation Links */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>🔗 Menu Links ({links.length})</h3>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addLink} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff5c00]/10 text-[#ff5c00] text-[12px] font-bold hover:bg-[#ff5c00]/20 transition-all border border-[#ff5c00]/20"><Plus size={14} /> Add Link</motion.button>
        </div>
        {links.map((link, i) => (
          <motion.div key={link.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-4 flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="flex items-center gap-2 text-[#5a7d62]/20 flex-shrink-0"><GripVertical size={16} /><span className="text-[12px] font-bold w-5">{i + 1}</span></div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
              <div><label className="text-[10px] font-bold text-[#5a7d62]/30 uppercase mb-0.5 block">Label (EN)</label><input value={link.labelEn} onChange={e => updateLink(link.id, 'labelEn', e.target.value)} className="w-full h-[36px] px-3 rounded-lg bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
              <div><label className="text-[10px] font-bold text-[#5a7d62]/30 uppercase mb-0.5 block">Label (ES)</label><input value={link.labelEs} onChange={e => updateLink(link.id, 'labelEs', e.target.value)} className="w-full h-[36px] px-3 rounded-lg bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
              <div><label className="text-[10px] font-bold text-[#5a7d62]/30 uppercase mb-0.5 block">URL Path</label><input value={link.href} onChange={e => updateLink(link.id, 'href', e.target.value)} className="w-full h-[36px] px-3 rounded-lg bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all font-mono" /></div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateLink(link.id, 'isVisible', !link.isVisible)} className={`w-8 h-8 rounded-lg flex items-center justify-center ${link.isVisible ? 'bg-[#93d35c]/10 text-[#93d35c]' : 'bg-red-500/10 text-red-500'}`}>{link.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => removeLink(link.id)} className="w-8 h-8 rounded-lg bg-red-500/5 text-red-500 hover:bg-red-500/10 flex items-center justify-center"><Trash2 size={14} /></motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
