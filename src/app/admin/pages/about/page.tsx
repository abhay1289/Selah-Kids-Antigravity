'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, ChevronDown, ChevronUp } from 'lucide-react';

interface EditorField { id: string; label: string; type: 'text' | 'textarea'; valueEn: string; valueEs: string; }
interface EditorSection { id: string; title: string; icon: string; fields: EditorField[]; }

const ABOUT_SECTIONS: EditorSection[] = [
  {
    id: 'hero', title: 'Hero Section', icon: '🌟',
    fields: [
      { id: 'badge', label: 'Badge Text', type: 'text', valueEn: 'OUR STORY', valueEs: 'NUESTRA HISTORIA' },
      { id: 'title_words', label: 'Title Words', type: 'text', valueEn: 'The Selah Kids Story', valueEs: 'La Historia de Selah Kids' },
      { id: 'description', label: 'Description', type: 'textarea', valueEn: "We are parents and creators on a mission to fill every home with faith-filled melodies that spark wonder in the hearts of children. Together, we worship, learn, and grow.", valueEs: 'Somos padres y creadores con la misión de llenar cada hogar con melodías llenas de fe que despiertan asombro en los corazones de los niños. Juntos, adoramos, aprendemos y crecemos.' },
      { id: 'tagline', label: 'Tagline (italic)', type: 'text', valueEn: 'Learning about God through worship and song', valueEs: 'Aprendiendo sobre Dios a través de la adoración y el canto' },
    ]
  },
  {
    id: 'values', title: 'Core Values', icon: '⭐',
    fields: [
      { id: 'v_badge', label: 'Badge', type: 'text', valueEn: 'OUR VALUES', valueEs: 'NUESTROS VALORES' },
      { id: 'v_title', label: 'Section Title', type: 'text', valueEn: 'What Guides Us', valueEs: 'Lo Que Nos Guía' },
      { id: 'v1_title', label: 'Value 1: Title', type: 'text', valueEn: 'All About Jesus', valueEs: 'Todo Sobre Jesús' },
      { id: 'v1_desc', label: 'Value 1: Description', type: 'textarea', valueEn: "Jesus is at the center of every story, teaching children about God's love and grace through engaging, faith-based videos.", valueEs: 'Jesús está en el centro de cada historia, enseñando a los niños sobre el amor y la gracia de Dios a través de videos atractivos y basados en la fe.' },
      { id: 'v2_title', label: 'Value 2: Title', type: 'text', valueEn: 'Made for Kids', valueEs: 'Hecho para Niños' },
      { id: 'v2_desc', label: 'Value 2: Description', type: 'textarea', valueEn: 'Our Christian cartoons are safe, wholesome, and crafted for children to watch, learn, and grow in faith.', valueEs: 'Nuestras caricaturas cristianas son seguras, sanas y hechas para que los niños vean, aprendan y crezcan en la fe.' },
      { id: 'v3_title', label: 'Value 3: Title', type: 'text', valueEn: 'True to the Bible', valueEs: 'Fiel a la Biblia' },
      { id: 'v3_desc', label: 'Value 3: Description', type: 'textarea', valueEn: 'Every song and story is carefully reviewed to make sure it teaches accurate and helpful biblical lessons.', valueEs: 'Cada canción e historia es cuidadosamente revisada para asegurar que enseñe lecciones bíblicas precisas y útiles.' },
      { id: 'v4_title', label: 'Value 4: Title', type: 'text', valueEn: 'For Everyone', valueEs: 'Para Todos' },
      { id: 'v4_desc', label: 'Value 4: Description', type: 'textarea', valueEn: "We celebrate the beautiful diversity of God's entire creation in all our kids worship videos — in English and Spanish.", valueEs: 'Celebramos la hermosa diversidad de toda la creación de Dios en todos nuestros videos de adoración para niños — en inglés y español.' },
      { id: 'v5_title', label: 'Value 5: Title', type: 'text', valueEn: 'Sensory Friendly', valueEs: 'Amigable Sensorial' },
      { id: 'v5_desc', label: 'Value 5: Description', type: 'textarea', valueEn: 'Our content is thoughtfully designed with gentle pacing, clear visuals, and calming music to support children of all sensory needs.', valueEs: 'Nuestro contenido está diseñado con ritmo gentil, visuales claros y música calmante para apoyar a niños con todas las necesidades sensoriales.' },
    ]
  },
  {
    id: 'team', title: 'Team Section', icon: '👥',
    fields: [
      { id: 't_badge', label: 'Badge', type: 'text', valueEn: 'The Team', valueEs: 'El Equipo' },
      { id: 't_title', label: 'Title', type: 'text', valueEn: 'Meet the Selah Kids Team!', valueEs: '¡Conoce al Equipo Selah Kids!' },
      { id: 't_description', label: 'Description', type: 'textarea', valueEn: 'The passionate people bringing these stories to life.', valueEs: 'Las personas apasionadas que dan vida a estas historias.' },
    ]
  },
];

export default function AboutPageEditor() {
  const [openSections, setOpenSections] = useState<string[]>(['hero']);
  const [editedFields, setEditedFields] = useState<Record<string, { en: string; es: string }>>({});
  const [isSaving, setIsSaving] = useState(false);
  const toggleSection = (id: string) => setOpenSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  const getVal = (f: EditorField, lang: 'en' | 'es') => editedFields[f.id]?.[lang] ?? (lang === 'en' ? f.valueEn : f.valueEs);
  const setVal = (id: string, lang: 'en' | 'es', v: string) => setEditedFields(p => ({ ...p, [id]: { ...p[id], [lang]: v } }));
  const editedCount = Object.keys(editedFields).length;
  const handleSave = async () => { setIsSaving(true); await new Promise(r => setTimeout(r, 1500)); setIsSaving(false); };

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm sticky top-[72px] z-20">
        <div className="flex items-center gap-3">
          <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>About Page</h2>
          {editedCount > 0 && <span className="text-[12px] font-medium text-[#ff5c00] bg-[#ff5c00]/10 px-3 py-1 rounded-full">{editedCount} unsaved</span>}
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={editedCount === 0 || isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Save size={15} /> {isSaving ? 'Saving...' : 'Save'}</motion.button>
      </div>
      {ABOUT_SECTIONS.map((section) => {
        const isOpen = openSections.includes(section.id);
        return (
          <motion.div key={section.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
            <button onClick={() => toggleSection(section.id)} className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-[#3a6b44]/[0.02] transition-colors group">
              <span className="text-xl">{section.icon}</span>
              <h3 className="flex-1 text-[15px] font-bold text-[#3a6b44] group-hover:text-[#ff5c00] transition-colors" style={{ fontFamily: 'var(--font-fredoka)' }}>{section.title}</h3>
              <span className="text-[11px] font-medium text-[#5a7d62]/40 uppercase tracking-wider mr-2">{section.fields.length} fields</span>
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
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
