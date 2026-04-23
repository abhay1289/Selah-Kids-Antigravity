'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { useCmsPageContent } from '../../../../lib/useCms';
import {
  RESOURCES_FIELDS,
  resourcesKeyFor,
  buildResourcesFallback,
  type PageEditorField,
} from '../../../../data/page-content-resources';

export default function ResourcesPageEditor() {
  const fallback = useMemo(buildResourcesFallback, []);
  const { fields, setField, isSaving, save, error } = useCmsPageContent('resources', fallback);
  const [editedKeys, setEditedKeys] = useState<Set<string>>(new Set());
  const getVal = (f: PageEditorField, lang: 'en' | 'es') => {
    const v = fields[resourcesKeyFor(f.id)];
    return v ? v[lang] : (lang === 'en' ? f.valueEn : f.valueEs);
  };
  const setVal = (fid: string, lang: 'en' | 'es', v: string) => {
    const k = resourcesKeyFor(fid);
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
          <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Resources Page</h2>
          {editedCount > 0 && <span className="text-[12px] font-medium text-[#ff5c00] bg-[#ff5c00]/10 px-3 py-1 rounded-full">{editedCount} unsaved</span>}
        </div>
        <div className="flex items-center gap-3">
          {error && <span className="text-[11px] font-semibold text-red-500">{error}</span>}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={editedCount === 0 || isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Save size={15} /> {isSaving ? 'Saving...' : 'Save'}</motion.button>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6 space-y-5">
        {RESOURCES_FIELDS.map(f => (
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
      </motion.div>
    </div>
  );
}
