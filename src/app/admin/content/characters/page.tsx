'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  trait: string;
  description: string;
  image: string;
  color: string;
}

const INITIAL_CHARACTERS: Character[] = [
  { id: '1', name: 'Andy', trait: 'The Friendly Leader', description: 'Andy is a smart and friendly boy who loves to lead. He spends his days playing outside in the garden with his best friend and pet sheep, Shiloh.', image: '/SK_Andy_Intro_Pose-removebg-preview.png', color: 'from-[#00BFFF] to-[#87CEEB]' },
  { id: '2', name: 'Libni', trait: 'The Musical Neighbor', description: "Libni is Andy's creative and giggly next-door neighbor who loves music. She spends her time picking flowers, singing, and making up new dances.", image: '/SK_Libni_Intro_Pose-removebg-preview.png', color: 'from-[#E6E6FA] to-[#D8BFD8]' },
  { id: '3', name: 'Shiloh', trait: 'The Playful Sheep', description: "Shiloh is Andy's pet sheep and best friend. He is curious, helpful, and very playful! Shiloh loves resting in the warm sun and finding yummy snacks.", image: '/SK_Shiloh_Intro_Pose.png', color: 'from-[#98FF98] to-[#93D35C]' },
];

export default function CharactersManager() {
  const [characters, setCharacters] = useState<Character[]>(INITIAL_CHARACTERS);
  const [selected, setSelected] = useState<string>(characters[0]?.id || '');
  const [isSaving, setIsSaving] = useState(false);
  const char = characters.find(c => c.id === selected);
  const update = (field: keyof Character, value: string) => setCharacters(characters.map(c => c.id === selected ? { ...c, [field]: value } : c));
  const handleSave = async () => { setIsSaving(true); await new Promise(r => setTimeout(r, 1500)); setIsSaving(false); };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm sticky top-[72px] z-20">
        <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Characters</h2>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Save size={15} /> {isSaving ? 'Saving...' : 'Save All'}</motion.button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <div className="space-y-3">
          {characters.map((c) => (
            <motion.button key={c.id} whileHover={{ x: 4 }} onClick={() => setSelected(c.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${selected === c.id ? 'bg-white shadow-md border border-[#ff5c00]/20' : 'bg-white/50 border border-transparent hover:bg-white/80'}`}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f1f8e7] to-white flex items-center justify-center overflow-hidden">
                {c.image && <img src={c.image} alt="" className="w-14 h-14 object-contain" />}
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#3a6b44]">{c.name}</p>
                <p className="text-[12px] text-[#5a7d62]/60">{c.trait}</p>
              </div>
            </motion.button>
          ))}
        </div>
        {char && (
          <motion.div key={char.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-5">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#f1f8e7] to-white border-2 border-dashed border-[#3a6b44]/10 flex items-center justify-center overflow-hidden">
                {char.image && <img src={char.image} alt="" className="w-24 h-24 object-contain" />}
              </div>
              <div className="flex-1">
                <label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Character Image Path</label>
                <input value={char.image} onChange={(e) => update('image', e.target.value)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Name</label><input value={char.name} onChange={(e) => update('name', e.target.value)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all" /></div>
              <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Trait / Tagline</label><input value={char.trait} onChange={(e) => update('trait', e.target.value)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all" /></div>
            </div>
            <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Description</label><textarea value={char.description} onChange={(e) => update('description', e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all resize-none leading-relaxed" style={{ fontFamily: 'var(--font-quicksand)' }} /></div>
            <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1.5 block">Gradient Color</label><input value={char.color} onChange={(e) => update('color', e.target.value)} className="w-full h-[44px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all font-mono" /></div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
