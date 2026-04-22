'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { useCmsCollection } from '../../../../lib/useCms';

interface TeamMember {
  id: string;
  name: string;
  titleEn: string;
  titleEs: string;
  img: string;
  bioEn: string;
  bioEs: string;
  color: string;
}

const INITIAL_TEAM: TeamMember[] = [
  {
    id: '1', name: 'Leah', titleEn: 'Creator', titleEs: 'Creadora', img: '/leah.png',
    bioEn: "Leah is a singer-songwriter and worship leader who recognizes the impact that music can have on the heart, mind, body and soul. In addition to being a licensed pediatric speech-language therapist, she is also a mother of four active children and knows first hand the challenges that families face when seeking safe and wholesome content online.\n\nTogether with her husband, Gachener, Leah launched Selah Kids! in December 2024 in order to create an enriching, biblically sound, research-based, and child-approved space for families around the world.",
    bioEs: "Leah es cantautora y líder de alabanza, que reconoce el impacto que la música puede tener en el corazón, la mente y el alma. Como madre de cuatro hijos activos y licenciada en terapia del habla y el lenguaje pediátrico, comprende de primera mano los retos que enfrentan las familias actuales al buscar contenido digital seguro en línea.\n\nEn diciembre de 2024, junto a su esposo Gachener, Leah fundó Selah Kids!. Su misión es clara: ofrecer un espacio enriquecedor con fundamentos bíblicos, basado en investigaciones y \"aprobado por niños\" para familias de todo el mundo.",
    color: 'from-[#FF7F50] to-[#FF5C00]'
  },
  {
    id: '2', name: 'Rey', titleEn: 'Director of Animation', titleEs: 'Director de Animación', img: '/rey.png',
    bioEn: "Rey is the creative lead for the Selah Kids! art design and animation. Drawing from experience in feature film, television, and games, he values impactful storytelling and uses the most up-to-date technologies to bring Selah Kids! to life. Rey takes pride in helping raise the creative bar.\n\nThrough his animation studio, Veyra Studios, Rey creates work that not only connects with audiences worldwide, but also reflects a deeper commitment to excellence and faith.",
    bioEs: "Rey es el líder creativo a cargo del diseño artístico y la animación de Selah Kids!. Con una trayectoria forjada en equipos creativos para cine, televisión y videojuegos, valora la narración de historias con impacto y emplea las tecnologías más avanzadas para dar vida a Selah Kids!. Teniendo como base su valiosa experiencia, Rey se dedica a elevar el estándar visual del contenido infantil.\n\nA través de su estudio de animación, Veyra Studios, Rey crea obras que no solo cautivan a audiencias de todo el mundo, sino que también reflejan un compromiso inquebrantable con la excelencia y la fe.",
    color: 'from-[#00BFFF] to-[#87CEEB]'
  },
  {
    id: '3', name: 'Carla', titleEn: 'Social Media Editor', titleEs: 'Editora de Redes Sociales', img: '/carla.png',
    bioEn: "Carla is a passionate educator who finds her greatest joy in using her talents to serve God and His Kingdom. For Carla, being part of Selah Kids! is a mission that allows her to be a blessing to families, combining her love for teaching with her creativity to create content that inspires minds young and old.\n\nCarla enjoys sowing seeds of faith and core values into every home by crafting each message with the dedication and affection of someone who is contributing to a project with a higher eternal purpose.",
    bioEs: "Carla es una educadora apasionada que encuentra su mayor alegría en poner sus talentos al servicio de Dios. Para ella, formar parte de Selah Kids! es una misión que le permite bendecir a las familias, uniendo su amor por la enseñanza con su creatividad para generar contenidos que inspiren a los más pequeños.\n\nSu propósito es sembrar semillas de fe y valores en cada hogar, preparando cada mensaje con la dedicación y el cariño de quien sabe que está contribuyendo a un proyecto con propósito eterno.",
    color: 'from-[#FFD700] to-[#FEB835]'
  }
];

export default function TeamManager() {
  const { items: members, setItems: setMembers, isSaving, save, error } = useCmsCollection<TeamMember>(
    'team',
    INITIAL_TEAM,
  );
  const [selected, setSelected] = useState<string>(INITIAL_TEAM[0]?.id || '');
  const member = members.find(m => m.id === selected);
  const update = (field: keyof TeamMember, value: string) => setMembers(members.map(m => m.id === selected ? { ...m, [field]: value } : m));
  const handleSave = async () => { try { await save(); } catch { /* surfaced via hook */ } };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/60 shadow-sm sticky top-[72px] z-20">
        <h2 className="text-[16px] font-bold text-[#3a6b44]" style={{ fontFamily: 'var(--font-fredoka)' }}>Team Members</h2>
        <div className="flex items-center gap-3">
          {error && <span className="text-[11px] font-semibold text-red-500">{error}</span>}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93d35c] to-[#7ebd4e] text-white text-[13px] font-bold shadow-lg shadow-[#93d35c]/20 disabled:opacity-40 transition-all"><Save size={15} /> {isSaving ? 'Saving...' : 'Save All'}</motion.button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <div className="space-y-3">
          {members.map((m) => (
            <motion.button key={m.id} whileHover={{ x: 4 }} onClick={() => setSelected(m.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${selected === m.id ? 'bg-white shadow-md border border-[#ff5c00]/20' : 'bg-white/50 border border-transparent hover:bg-white/80'}`}>
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-[#f1f8e7] to-white border-2 border-white shadow-sm">
                {m.img && <img src={m.img} alt="" className="w-full h-full object-cover" />}
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#3a6b44]">{m.name}</p>
                <p className="text-[12px] text-[#5a7d62]/60">{m.titleEn}</p>
              </div>
            </motion.button>
          ))}
        </div>
        {member && (
          <motion.div key={member.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {member.img && <img src={member.img} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 space-y-2">
                <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Name</label><input value={member.name} onChange={(e) => update('name', e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-bold outline-none transition-all" /></div>
              </div>
            </div>
            <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Photo Path</label><input value={member.img} onChange={(e) => update('img', e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Title (EN) 🇺🇸</label><input value={member.titleEn} onChange={(e) => update('titleEn', e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
              <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Title (ES) 🇪🇸</label><input value={member.titleEs} onChange={(e) => update('titleEs', e.target.value)} className="w-full h-[40px] px-4 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[13px] font-medium outline-none transition-all" /></div>
            </div>
            <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Bio (EN) 🇺🇸</label><textarea value={member.bioEn} onChange={(e) => update('bioEn', e.target.value)} rows={6} className="w-full px-4 py-3 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all resize-none leading-relaxed" /></div>
            <div><label className="text-[12px] font-semibold text-[#3a6b44] mb-1 block">Bio (ES) 🇪🇸</label><textarea value={member.bioEs} onChange={(e) => update('bioEs', e.target.value)} rows={6} className="w-full px-4 py-3 rounded-xl bg-[#3a6b44]/[0.02] border-2 border-transparent focus:border-[#ff5c00]/20 focus:bg-white text-[#3a6b44] text-[14px] font-medium outline-none transition-all resize-none leading-relaxed" /></div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
