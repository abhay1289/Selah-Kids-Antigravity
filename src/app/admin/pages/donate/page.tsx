'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

interface EditorField { id: string; label: string; type: 'text' | 'textarea'; valueEn: string; valueEs: string; }

const FIELDS: EditorField[] = [
  { id: 'badge', label: 'Badge', type: 'text', valueEn: 'MAKE A DIFFERENCE', valueEs: 'HAZ LA DIFERENCIA' },
  { id: 'title1', label: 'Headline Part 1', type: 'text', valueEn: 'Support', valueEs: 'Apoya' },
  { id: 'title_accent', label: 'Headline Accent (orange)', type: 'text', valueEn: 'Selah Kids', valueEs: 'Selah Kids' },
  { id: 'desc', label: 'Description', type: 'textarea', valueEn: "Your generosity helps us create high-quality, faith-filled content that teaches children about God's love.", valueEs: 'Tu generosidad nos ayuda a crear contenido de alta calidad y lleno de fe que enseña a los niños sobre el amor de Dios.' },
];

export default function DonatePageEditor() {
  const [editedFields, setEditedFields] = useState<Record<string, { en: string; es: string }>>({});
  const [isSaving, setIsSaving] = useState(false);
  const getVal = (f: EditorField, lang: 'en' | 'es') => editedFields[f.id]?.[lang] ?? (lang === 'en' ? f.valueEn : f.valueEs);
  const setVal = (id: string, lang: 'en' | 'es', v: string) => setEditedFields(p => ({ ...p, [id]: { ...p[id], [lang]: v } }));
  const editedCount = Object.keys(editedFields).length;
  const handleSave = async () => { setIsSaving(true); await new Promise(r => setTimeout(r, 1500)); setIsSaving(false); };

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm sticky top-[72px] z-20">
        <div className="flex items-center gap-3">
          <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Donate Page</h2>
          {editedCount > 0 && <span className="text-[12px] font-medium text-[#ff5c00] bg-[#ff5c00]/10 px-3 py-1 rounded-full">{editedCount} unsaved</span>}
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={editedCount === 0 || isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Save size={15} /> {isSaving ? 'Saving...' : 'Save'}</motion.button>
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6 space-y-5">
        {FIELDS.map(f => (
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
