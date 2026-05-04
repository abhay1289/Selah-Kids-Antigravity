'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

interface SettingsField { id: string; label: string; value: string; type: 'text' | 'url'; group: string; }

const INITIAL_SETTINGS: SettingsField[] = [
  // Branding
  { id: 'site_title', label: 'Site Title', value: 'Selah Kids', type: 'text', group: 'Branding' },
  { id: 'meta_desc', label: 'Meta Description', value: 'A faith-based platform featuring original worship music, Christian cartoons, and engaging activities for children and families.', type: 'text', group: 'Branding' },
  { id: 'logo_path', label: 'Logo Path', value: '/SK_Logo_FN.jpg', type: 'text', group: 'Branding' },
  { id: 'footer_tagline_en', label: 'Footer Tagline (EN)', value: "We're on a mission to fill every home with faith-filled melodies and stories that spark wonder in the hearts of children.", type: 'text', group: 'Branding' },
  { id: 'footer_tagline_es', label: 'Footer Tagline (ES)', value: 'Nuestra misión es llenar cada hogar con melodías llenas de fe e historias que despierten asombro en los corazones de los niños.', type: 'text', group: 'Branding' },
  // Social — EN
  { id: 'youtube_en', label: 'YouTube (EN)', value: 'https://www.youtube.com/@selahkidsworship', type: 'url', group: 'Social Links (EN)' },
  { id: 'instagram_en', label: 'Instagram (EN)', value: 'https://www.instagram.com/selah.kids', type: 'url', group: 'Social Links (EN)' },
  // Social — ES
  { id: 'youtube_es', label: 'YouTube (ES)', value: 'https://www.youtube.com/@SelahKidsEspanol', type: 'url', group: 'Social Links (ES)' },
  { id: 'instagram_es', label: 'Instagram (ES)', value: 'https://www.instagram.com/selahkids_spn/', type: 'url', group: 'Social Links (ES)' },
  // Music
  { id: 'spotify', label: 'Spotify', value: 'https://open.spotify.com/artist/6lShgHNhA1vXSZ6f4UXMa4', type: 'url', group: 'Music Platforms' },
  { id: 'applemusic', label: 'Apple Music', value: 'https://music.apple.com/us/artist/selah-kids/1823099991', type: 'url', group: 'Music Platforms' },
  // Contact
  { id: 'email', label: 'Contact Email', value: 'info.selahkids@gmail.com', type: 'text', group: 'Contact' },
];

export default function GlobalSettings() {
  const [settings, setSettings] = useState<SettingsField[]>(INITIAL_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const update = (id: string, value: string) => setSettings(settings.map(s => s.id === id ? { ...s, value } : s));
  const handleSave = async () => { setIsSaving(true); await new Promise(r => setTimeout(r, 1500)); setIsSaving(false); };

  const groups = [...new Set(settings.map(s => s.group))];
  const groupIcons: Record<string, string> = { 'Branding': '🎨', 'Social Links (EN)': '🇺🇸', 'Social Links (ES)': '🇪🇸', 'Music Platforms': '🎵', 'Contact': '📧' };

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm sticky top-[72px] z-20">
        <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Global Settings</h2>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Save size={15} /> {isSaving ? 'Saving...' : 'Save'}</motion.button>
      </div>
      {groups.map(group => (
        <motion.div key={group} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6 space-y-4">
          <h3 className="text-[14px] font-bold text-[#3a6b44] flex items-center gap-2" style={{ fontFamily: 'var(--font-fredoka)' }}>
            <span>{groupIcons[group] || '⚙️'}</span> {group}
          </h3>
          {settings.filter(s => s.group === group).map(s => (
            <div key={s.id} className="space-y-1">
              <label className="text-[12px] font-semibold text-[#3a6b44]">{s.label}</label>
              <input value={s.value} onChange={e => update(s.id, e.target.value)} className={`w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all ${s.type === 'url' ? 'font-mono' : ''}`} />
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}
