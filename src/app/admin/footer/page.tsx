'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useCmsCollection } from '../../../lib/useCms';
import {
  INITIAL_FOOTER_LINKS,
  INITIAL_FOOTER_SOCIAL,
  INITIAL_FOOTER_SETTINGS,
  type FooterLink,
  type SocialLink,
  type FooterSettings,
} from '../../../data/chrome-footer';

export default function FooterEditor() {
  const linksHook = useCmsCollection<FooterLink>('footer_links', INITIAL_FOOTER_LINKS);
  const socialHook = useCmsCollection<SocialLink>('footer_social', INITIAL_FOOTER_SOCIAL);
  const settingsHook = useCmsCollection<FooterSettings>('footer_settings', INITIAL_FOOTER_SETTINGS, { sortOrder: false });
  const { items: links, setItems: setLinks } = linksHook;
  const { items: social, setItems: setSocial } = socialHook;
  const settings = settingsHook.items[0] ?? INITIAL_FOOTER_SETTINGS[0];
  const setSettings = (s: FooterSettings) => settingsHook.setItems([s]);
  const isSaving = linksHook.isSaving || socialHook.isSaving || settingsHook.isSaving;
  const error = linksHook.error || socialHook.error || settingsHook.error;

  const updateLink = (id: string, field: keyof FooterLink, value: string) => setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));
  const removeLink = (id: string) => setLinks(links.filter(l => l.id !== id));
  const addLink = () => setLinks([...links, { id: Date.now().toString(), labelEn: '', labelEs: '', href: '/', icon: '🔗' }]);
  const updateSocial = (id: string, field: keyof SocialLink, value: string) => setSocial(social.map(s => s.id === id ? { ...s, [field]: value } : s));
  const handleSave = async () => {
    try { await Promise.all([linksHook.save(), socialHook.save(), settingsHook.save()]); } catch { /* surfaced via hook */ }
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm sticky top-[72px] z-20">
        <div><h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Footer</h2><p className="text-[12px] text-[#5a7d62]/50">Edit footer links, social, newsletter & credits</p></div>
        <div className="flex items-center gap-3">
          {error && <span className="text-[11px] font-semibold text-red-500">{error}</span>}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Save size={15} /> {isSaving ? 'Saving...' : 'Save'}</motion.button>
        </div>
      </div>

      {/* Tagline */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6 space-y-4">
        <h3 className="text-[14px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>🎯 Brand Tagline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Tagline (EN) 🇺🇸</label><textarea value={settings.taglineEn} onChange={e => setSettings({ ...settings, taglineEn: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all resize-none" /></div>
          <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Tagline (ES) 🇪🇸</label><textarea value={settings.taglineEs} onChange={e => setSettings({ ...settings, taglineEs: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all resize-none" /></div>
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between"><h3 className="text-[14px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>🔗 Page Links</h3><motion.button whileTap={{ scale: 0.98 }} onClick={addLink} className="text-[12px] font-bold text-[#ff5c00]"><Plus size={14} className="inline mr-1" />Add</motion.button></div>
        {links.map((link) => (
          <div key={link.id} className="grid grid-cols-[30px_1fr_1fr_120px_32px] gap-2 items-center">
            <input value={link.icon} onChange={e => updateLink(link.id, 'icon', e.target.value)} className="w-8 h-8 text-center rounded-lg bg-[#3a6b44]/[0.02] border-2 border-transparent text-[14px] outline-none" />
            <input value={link.labelEn} onChange={e => updateLink(link.id, 'labelEn', e.target.value)} placeholder="EN label" className="h-[36px] px-3 rounded-lg bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] font-medium outline-none transition-all" />
            <input value={link.labelEs} onChange={e => updateLink(link.id, 'labelEs', e.target.value)} placeholder="ES label" className="h-[36px] px-3 rounded-lg bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] font-medium outline-none transition-all" />
            <input value={link.href} onChange={e => updateLink(link.id, 'href', e.target.value)} className="h-[36px] px-3 rounded-lg bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[12px] font-mono outline-none transition-all" />
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => removeLink(link.id)} className="w-8 h-8 rounded-lg bg-red-500/5 text-red-500 hover:bg-red-500/10 flex items-center justify-center"><Trash2 size={13} /></motion.button>
          </div>
        ))}
      </motion.div>

      {/* Social Links */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6 space-y-4">
        <h3 className="text-[14px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>📱 Social Media Icons</h3>
        {social.map(s => (
          <div key={s.id} className="space-y-2 pb-4 border-b border-[#3a6b44]/5 last:border-0 last:pb-0">
            <p className="text-[13px] font-bold text-[#3a6b44]">{s.icon} {s.platform}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><label className="text-[10px] font-bold text-[#5a7d62]/30 uppercase mb-0.5 block">URL (EN) 🇺🇸</label><input value={s.urlEn} onChange={e => updateSocial(s.id, 'urlEn', e.target.value)} className="w-full h-[36px] px-3 rounded-lg bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[12px] font-mono outline-none transition-all" /></div>
              <div><label className="text-[10px] font-bold text-[#5a7d62]/30 uppercase mb-0.5 block">URL (ES) 🇪🇸</label><input value={s.urlEs} onChange={e => updateSocial(s.id, 'urlEs', e.target.value)} className="w-full h-[36px] px-3 rounded-lg bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[12px] font-mono outline-none transition-all" /></div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Newsletter & Contact */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6 space-y-4">
        <h3 className="text-[14px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>📬 Newsletter & Contact</h3>
        <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Contact Email</label><input value={settings.contactEmail} onChange={e => setSettings({ ...settings, contactEmail: e.target.value })} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Newsletter Title (EN)</label><input value={settings.newsletterTitleEn} onChange={e => setSettings({ ...settings, newsletterTitleEn: e.target.value })} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
          <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Newsletter Title (ES)</label><input value={settings.newsletterTitleEs} onChange={e => setSettings({ ...settings, newsletterTitleEs: e.target.value })} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Button Text (EN)</label><input value={settings.newsletterBtnEn} onChange={e => setSettings({ ...settings, newsletterBtnEn: e.target.value })} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
          <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Button Text (ES)</label><input value={settings.newsletterBtnEs} onChange={e => setSettings({ ...settings, newsletterBtnEs: e.target.value })} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
        </div>
      </motion.div>

      {/* Credits */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6 space-y-4">
        <h3 className="text-[14px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>©️ Copyright & Credits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Copyright (EN)</label><input value={settings.copyrightEn} onChange={e => setSettings({ ...settings, copyrightEn: e.target.value })} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
          <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Copyright (ES)</label><input value={settings.copyrightEs} onChange={e => setSettings({ ...settings, copyrightEs: e.target.value })} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Credit Text</label><input value={settings.creditText} onChange={e => setSettings({ ...settings, creditText: e.target.value })} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
          <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Credit Link</label><input value={settings.creditLink} onChange={e => setSettings({ ...settings, creditLink: e.target.value })} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 text-[#3a6b44] text-[13px] font-mono outline-none transition-all" /></div>
        </div>
      </motion.div>
    </div>
  );
}
