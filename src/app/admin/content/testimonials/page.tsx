'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, MessageSquare, Eye, EyeOff } from 'lucide-react';

interface Testimonial {
  id: string;
  quoteEn: string;
  quoteEs: string;
  author: string;
  roleEn: string;
  roleEs: string;
  color: string;
  isPublished: boolean;
}

const INITIAL_TESTIMONIALS: Testimonial[] = [
  { id: '1', quoteEn: "What joy I feel in my heart watching this beautiful program that's now available for families and little ones!", quoteEs: 'Que gozo siento en mi corazón mirando que esta bella bendicion está disponible para los pequeños y toda la familia', author: 'le_chosen', roleEn: 'YouTube Community', roleEs: 'Comunidad de YouTube', color: '#FF7F50', isPublished: true },
  { id: '2', quoteEn: "I love that there are now amazing videos available like Selah Kids that children can learn about the Word of God!", quoteEs: 'Me alegra mucho que haya videos divertidos como los de Selah Kids! para que los niños aprendan sobre la Palabra de Dios.', author: 'kims_slice', roleEn: 'YouTube Community', roleEs: 'Comunidad de YouTube', color: '#00BFFF', isPublished: true },
  { id: '3', quoteEn: 'What a blessing! May God bless this project that is so special.', quoteEs: '¡Que bendición! Que Dios bendiga este trabajo tan especial.', author: 'elizabeth.towerss', roleEn: 'YouTube Community', roleEs: 'Comunidad de YouTube', color: '#98FF98', isPublished: true },
  { id: '4', quoteEn: "How beautiful and impactful Selah Kids! is that children can grow by listening to the Word of God in song!", quoteEs: '¡Que lindo e impactante para el crecimiento de los niños, oír la palabra de Dios en canción!', author: 'amarobella', roleEn: 'YouTube Community', roleEs: 'Comunidad de YouTube', color: '#E6E6FA', isPublished: true },
  { id: '5', quoteEn: 'My children have finally found songs about God that they like. The music is very good!', quoteEs: 'Mis hijos por fin han encontrado canciones de dios que a ellos les gustan. ¡La música es muy buena!', author: 'apallahdz', roleEn: 'YouTube Community', roleEs: 'Comunidad de YouTube', color: '#FFD700', isPublished: true },
];

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [isSaving, setIsSaving] = useState(false);
  const addNew = () => {
    const t: Testimonial = { id: Date.now().toString(), quoteEn: '', quoteEs: '', author: '', roleEn: 'YouTube Community', roleEs: 'Comunidad de YouTube', color: '#FF7F50', isPublished: false };
    setTestimonials([t, ...testimonials]);
  };
  const update = <K extends keyof Testimonial>(id: string, field: K, value: Testimonial[K]) => setTestimonials(testimonials.map(t => t.id === id ? { ...t, [field]: value } : t));
  const remove = (id: string) => { if (confirm('Delete this testimonial?')) setTestimonials(testimonials.filter(t => t.id !== id)); };
  const handleSave = async () => { setIsSaving(true); await new Promise(r => setTimeout(r, 1500)); setIsSaving(false); };

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm sticky top-[72px] z-20">
        <div className="flex items-center gap-3">
          <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Testimonials</h2>
          <span className="text-[12px] font-medium text-[#5a7d62]/50 bg-[#3a6b44]/5 px-3 py-1 rounded-full">{testimonials.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff5c00]/10 text-[#ff5c00] text-[13px] font-bold hover:bg-[#ff5c00]/20 transition-all border border-[#ff5c00]/20"><Plus size={15} /> Add</motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Save size={15} /> {isSaving ? 'Saving...' : 'Save'}</motion.button>
        </div>
      </div>
      <div className="space-y-4">
        {testimonials.map((t) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-10 rounded-full" style={{ backgroundColor: t.color }} />
              <MessageSquare size={16} className="text-[#5a7d62]/40" />
              <span className="text-[14px] font-bold text-[#3a6b44]">{t.author || 'New Testimonial'}</span>
              <div className="flex-1" />
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => update(t.id, 'isPublished', !t.isPublished)} className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold ${t.isPublished ? 'bg-[#93d35c]/10 text-[#3a6b44]' : 'bg-[#feb835]/10 text-[#feb835]'}`}>{t.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}{t.isPublished ? 'Published' : 'Draft'}</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => remove(t.id)} className="p-2 rounded-lg bg-red-500/5 text-red-500 hover:bg-red-500/10"><Trash2 size={14} /></motion.button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Quote (EN) 🇺🇸</label><textarea value={t.quoteEn} onChange={(e) => update(t.id, 'quoteEn', e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all resize-none" /></div>
              <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Quote (ES) 🇪🇸</label><textarea value={t.quoteEs} onChange={(e) => update(t.id, 'quoteEs', e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all resize-none" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Author</label><input value={t.author} onChange={(e) => update(t.id, 'author', e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
              <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Role (EN / ES)</label><input value={t.roleEn} onChange={(e) => update(t.id, 'roleEn', e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
              <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Accent Color</label><div className="flex items-center gap-2"><div className="w-10 h-10 rounded-xl border-2 border-[#3a6b44]/10" style={{ backgroundColor: t.color }} /><input value={t.color} onChange={(e) => update(t.id, 'color', e.target.value)} className="flex-1 h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all font-mono" /></div></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
