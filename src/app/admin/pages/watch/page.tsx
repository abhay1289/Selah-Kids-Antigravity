'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Save, ChevronDown, ChevronUp } from 'lucide-react';
import { useCmsPageContent, type PageFieldMap } from '../../../../lib/useCms';

interface EditorField { id: string; label: string; type: 'text' | 'textarea'; valueEn: string; valueEs: string; }
interface EditorSection { id: string; title: string; icon: string; fields: EditorField[]; }

const SECTIONS: EditorSection[] = [
  { id: 'hero', title: 'Hero Section', icon: '🎬', fields: [
    { id: 'badge', label: 'Badge', type: 'text', valueEn: 'WATCH & LISTEN', valueEs: 'VER Y ESCUCHAR' },
    { id: 'title', label: 'Title', type: 'text', valueEn: 'Discover Our Videos', valueEs: 'Descubre Nuestros Videos' },
    { id: 'desc', label: 'Description', type: 'textarea', valueEn: "Sing, dance, and learn about God's love with our collection of high-quality Christian kids videos.", valueEs: 'Canta, baila y aprende del amor de Dios con nuestra colección de videos cristianos de alta calidad para niños.' },
  ]},
];

const keyFor = (sid: string, fid: string) => `${sid}.${fid}`;
const buildFallback = (): PageFieldMap => {
  const map: PageFieldMap = {};
  for (const s of SECTIONS) for (const f of s.fields) map[keyFor(s.id, f.id)] = { en: f.valueEn, es: f.valueEs };
  return map;
};

export default function WatchPageEditor() {
  const fallback = useMemo(buildFallback, []);
  const { fields, setField, isSaving, save, error } = useCmsPageContent('watch', fallback);
  const [openSections, setOpenSections] = useState<string[]>(['hero']);
  const [editedKeys, setEditedKeys] = useState<Set<string>>(new Set());
  const toggleSection = (id: string) => setOpenSections(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]);
  const findSectionId = (fid: string) => SECTIONS.find(s => s.fields.some(f => f.id === fid))?.id ?? 'misc';
  const getVal = (f: EditorField, lang: 'en' | 'es') => {
    const v = fields[keyFor(findSectionId(f.id), f.id)];
    return v ? v[lang] : (lang === 'en' ? f.valueEn : f.valueEs);
  };
  const setVal = (fid: string, lang: 'en' | 'es', v: string) => {
    const k = keyFor(findSectionId(fid), fid);
    const current = fields[k] ?? { en: '', es: '' };
    setField(k, { ...current, [lang]: v });
    setEditedKeys(prev => { const next = new Set(prev); next.add(k); return next; });
  };
  const editedCount = editedKeys.size;
  const handleSave = async () => { try { await save(); setEditedKeys(new Set()); } catch { /* surfaced via hook */ } };

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm sticky top-[72px] z-20">
        <div className="flex items-center gap-3">
          <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Watch Page</h2>
          {editedCount > 0 && <span className="text-[12px] font-medium text-[#ff5c00] bg-[#ff5c00]/10 px-3 py-1 rounded-full">{editedCount} unsaved</span>}
        </div>
        <div className="flex items-center gap-3">
          {error && <span className="text-[11px] font-semibold text-red-500">{error}</span>}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={editedCount === 0 || isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Save size={15} /> {isSaving ? 'Saving...' : 'Save'}</motion.button>
        </div>
      </div>
      {SECTIONS.map(section => {
        const isOpen = openSections.includes(section.id);
        return (
          <motion.div key={section.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
            <button onClick={() => toggleSection(section.id)} className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-[#3a6b44]/[0.02] transition-colors group">
              <span className="text-xl">{section.icon}</span>
              <h3 className="flex-1 text-[15px] font-bold text-[#3a6b44] group-hover:text-[#ff5c00] transition-colors" style={{ fontFamily: 'var(--font-fredoka)' }}>{section.title}</h3>
              {isOpen ? <ChevronUp size={18} className="text-[#5a7d62]/40" /> : <ChevronDown size={18} className="text-[#5a7d62]/40" />}
            </button>
            {isOpen && (
              <div className="p-6 border-t border-[#3a6b44]/5 space-y-5">
                {section.fields.map(f => (
                  <div key={f.id} className="space-y-2">
                    <label className="text-[13px] font-semibold text-[#3a6b44]">{f.label}</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(['en', 'es'] as const).map(lang => (
                        <div key={lang} className="relative">
                          <span className="absolute top-2 right-3 text-[10px] font-bold text-[#5a7d62]/20">{lang === 'en' ? '🇺🇸 EN' : '🇪🇸 ES'}</span>
                          {f.type === 'textarea' ? <textarea value={getVal(f, lang)} onChange={e => setVal(f.id, lang, e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all resize-none" /> : <input value={getVal(f, lang)} onChange={e => setVal(f.id, lang, e.target.value)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all" />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-4 rounded-xl bg-[#00BFFF]/5 border border-[#00BFFF]/10">
                  <p className="text-[13px] font-medium text-[#3a6b44]">💡 To manage individual videos, go to <a href="/admin/content/videos" className="text-[#ff5c00] underline font-bold">Content → Videos</a></p>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
