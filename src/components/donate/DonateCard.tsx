"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck } from 'lucide-react';
import { Button } from '../UI';

interface DonateCardProps {
  frequency: 'One-Time' | 'Monthly' | 'Annual';
  setFrequency: (freq: 'One-Time' | 'Monthly' | 'Annual') => void;
  amount: number;
  setAmount: (amt: number) => void;
  amounts: number[];
}

export const DonateCard: React.FC<DonateCardProps> = ({ frequency, setFrequency, amount, setAmount, amounts }) => {
  return (
    <section className="max-w-4xl mx-auto px-6 mb-32 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-8 md:p-16 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.1)] border border-white relative overflow-hidden"
      >
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-selah-orange/10 via-selah-pink/5 to-transparent rounded-bl-full pointer-events-none opacity-50" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none" />

        {/* Frequency Toggle */}
        <div className="flex justify-center mb-16 relative z-10">
          <div className="bg-[#F3EFE6] p-2 rounded-full inline-flex shadow-inner border border-black/5">
            {['One-Time', 'Monthly', 'Annual'].map((freq) => (
              <button
                key={freq}
                onClick={() => setFrequency(freq as any)}
                className={`px-8 py-4 rounded-full ui-label transition-all duration-500 ${ frequency === freq ? 'bg-white text-selah-dark shadow-[0_8px_20px_rgba(0,0,0,0.08)] scale-105' : 'text-selah-muted hover:text-selah-dark hover:bg-white/50' }`}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 relative z-10">
          {amounts.map((amt) => (
            <motion.button
              key={amt}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAmount(amt)}
              className={`h-32 rounded-[2rem] flex flex-col items-center justify-center transition-all duration-500 border-2 relative overflow-hidden group ${
                amount === amt
                  ? 'bg-selah-orange text-white border-selah-orange shadow-[0_20px_40px_-15px_rgba(255,127,80,0.5)] scale-105'
                  : 'bg-white text-selah-dark border-black/5 hover:border-selah-orange/30 hover:bg-[#FFFDF5] hover:shadow-lg'
              }`}
            >
              <span className={`content-h3 ${amount === amt ? 'text-white' : 'text-selah-dark group-hover:text-selah-orange transition-colors'}`}>
                ${amt}
              </span>
              <span className={`ui-label ${amount === amt ? 'text-white/80' : 'text-selah-muted/50 group-hover:text-selah-orange/50 transition-colors'}`}>
                {frequency === 'One-Time' ? 'Once' : frequency === 'Monthly' ? '/ Month' : '/ Year'}
              </span>
            </motion.button>
          ))}
        </div>
        
        {/* Primary CTA */}
        <div className="relative z-10 max-w-2xl mx-auto">
          <Button 
            icon={Heart}
            className="w-full !bg-selah-dark hover:!bg-black !text-white !border-none !py-8 !text-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] transition-all duration-500 hover:scale-[1.02] rounded-full group"
          >
            <span className="flex items-center gap-3">
              Donate ${amount} <span className="text-white/50 body-text">{frequency === 'Monthly' ? 'Monthly' : frequency === 'Annual' ? 'Annually' : 'Today'}</span>
            </span>
          </Button>
        </div>

        {/* Secure Payment Note */}
        <div className="mt-10 flex items-center justify-center gap-3 text-selah-muted/60 ui-label relative z-10 uppercase">
          <ShieldCheck size={18} className="text-[#93D35C]" />
          Secure, encrypted payment processing via Stripe
        </div>
      </motion.div>
    </section>
  );
};
