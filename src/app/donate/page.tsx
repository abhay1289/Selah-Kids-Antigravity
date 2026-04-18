'use client';

import React, { useState } from 'react';
import { DonateHero } from '../../components/donate/DonateHero';
import { DonateCard } from '../../components/donate/DonateCard';

const AMOUNTS = [10, 20, 30, 50];

export default function DonatePage() {
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

      <DonateHero />
      <DonateCard 
        frequency={frequency} 
        setFrequency={setFrequency} 
        amount={amount} 
        setAmount={setAmount} 
        amounts={AMOUNTS} 
      />
    </div>
  );
}
