import React, { useState } from 'react';
import { Sparkles, Globe, BookOpen } from 'lucide-react';
import { DonateHero } from '../components/donate/DonateHero';
import { DonateCard } from '../components/donate/DonateCard';
import { DonateImpact } from '../components/donate/DonateImpact';

const AMOUNTS = [10, 20, 30, 50];

const IMPACTS = [
  {
    amount: 10,
    icon: Sparkles,
    title: "One Day of Animation",
    desc: "Helps fund a day of work for our talented animators bringing Bible stories to life.",
    color: "text-[#FFD700]",
    bg: "bg-[#FFD700]/10"
  },
  {
    amount: 30,
    icon: Globe,
    title: "A Song Translation",
    desc: "Covers the cost of translating and recording a song into Spanish for bilingual families.",
    color: "text-[#00BFFF]",
    bg: "bg-[#00BFFF]/10"
  },
  {
    amount: 50,
    icon: BookOpen,
    title: "Resources for 100 Schools",
    desc: "Provides free Sunday School curriculum and printables to 100 under-resourced churches.",
    color: "text-[#98FF98]",
    bg: "bg-[#98FF98]/10"
  }
];

export const DonatePage = () => {
  const [frequency, setFrequency] = useState<'One-Time' | 'Monthly' | 'Annual'>('Monthly');
  const [amount, setAmount] = useState<number>(30);

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-selah-orange/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-selah-pink/5 rounded-full blur-[150px] pointer-events-none" />

      <DonateHero />
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
};
