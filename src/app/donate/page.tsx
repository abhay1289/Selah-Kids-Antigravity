'use client';

import React, { useState } from 'react';
import { DonateHero } from '../../components/donate/DonateHero';
import { DonateCard } from '../../components/donate/DonateCard';

const AMOUNTS = [10, 20, 30, 50];

export default function DonatePage() {
  const [frequency, setFrequency] = useState<'One-Time' | 'Monthly' | 'Annual'>('Monthly');
  const [amount, setAmount] = useState<number>(30);

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-36 md:pt-44 pb-16 relative overflow-hidden">
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
    </div>
  );
}
