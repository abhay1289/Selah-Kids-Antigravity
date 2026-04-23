'use client';

import React, { useState } from 'react';
import { Music, Video, Globe } from 'lucide-react';
import { DonateHero } from '@/components/donate/DonateHero';
import { DonateCard } from '@/components/donate/DonateCard';
import { DonateImpact } from '@/components/donate/DonateImpact';
import type { PageFieldMap } from '@/lib/cms-server';

const AMOUNTS = [10, 20, 30, 50];

const IMPACTS = [
  {
    amount: 10,
    icon: Music,
    title: "Funds one worship song lyric sheet",
    titleEs: "Financia una hoja de letras de adoración",
    desc: "Your gift underwrites the lyric typography, illustration, and bilingual translation for one original song.",
    descEs: "Tu donación financia la tipografía, ilustración y traducción bilingüe de una canción original.",
    color: "text-selah-orange",
    bg: "bg-selah-orange/10",
  },
  {
    amount: 20,
    icon: Video,
    title: "Sponsors a minute of animation",
    titleEs: "Patrocina un minuto de animación",
    desc: "Animation is our most expensive craft. $20/month funds a minute of story-grade 2D animation.",
    descEs: "La animación es nuestro oficio más costoso. $20/mes financia un minuto de animación 2D de calidad.",
    color: "text-selah-blue",
    bg: "bg-selah-blue/10",
  },
  {
    amount: 30,
    icon: Globe,
    title: "Unlocks a family in a new language",
    titleEs: "Alcanza a una familia en un nuevo idioma",
    desc: "Bilingual production doubles our cost. Your gift keeps every song and story accessible in English and Spanish.",
    descEs: "La producción bilingüe duplica el costo. Tu donación mantiene cada canción e historia en inglés y español.",
    color: "text-selah-light",
    bg: "bg-selah-light/10",
  },
];

export default function DonatePageClient({ fields }: { fields?: PageFieldMap }) {
  const [frequency, setFrequency] = useState<'One-Time' | 'Monthly' | 'Annual'>('Monthly');
  const [amount, setAmount] = useState<number>(30);

  return (
    <div className="bg-gradient-to-b from-[#FFF5EE] via-[#FDFBF7] to-[#F0FAE6] min-h-screen pt-36 md:pt-44 pb-16 relative overflow-hidden selection:bg-selah-orange selection:text-white">
      {/* Vivid Color Washes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-selah-orange/12 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-gradient-to-tl from-[#FF69B4]/8 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-0 w-[40vw] h-[40vh] bg-[#93D35C]/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[15%] w-[35vw] h-[35vh] bg-[#FEB835]/8 rounded-full blur-[100px] pointer-events-none" />
      {/* Paper Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />

      <DonateHero fields={fields} />
      <DonateCard
        frequency={frequency}
        setFrequency={setFrequency}
        amount={amount}
        setAmount={setAmount}
        amounts={AMOUNTS}
      />
      <DonateImpact impacts={IMPACTS} amount={amount} />
    </div>
  );
}
