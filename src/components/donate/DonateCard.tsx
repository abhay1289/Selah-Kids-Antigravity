"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface DonateCardProps {
  frequency: 'One-Time' | 'Monthly' | 'Annual';
  setFrequency: (freq: 'One-Time' | 'Monthly' | 'Annual') => void;
  amount: number;
  setAmount: (amt: number) => void;
  amounts: number[];
}

export const DonateCard: React.FC<DonateCardProps> = ({ frequency, setFrequency, amount, setAmount, amounts }) => {
  const { t } = useLanguage();

  const freqLabel = (freq: string) => {
    if (freq === 'One-Time') return t('One-Time', 'Una Vez');
    if (freq === 'Monthly') return t('Monthly', 'Mensual');
    return t('Annual', 'Anual');
  };

  const subLabel = () => {
    if (frequency === 'One-Time') return t('Once', 'Una vez');
    if (frequency === 'Monthly') return t('/ Month', '/ Mes');
    return t('/ Year', '/ Año');
  };

  const ctaSubLabel = () => {
    if (frequency === 'Monthly') return t('Monthly', 'Mensual');
    if (frequency === 'Annual') return t('Annually', 'Anualmente');
    return t('Today', 'Hoy');
  };

  return (
    <section className="max-w-4xl mx-auto px-6 mb-12 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }} 
        className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[3rem] p-3 border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] relative overflow-hidden flex flex-col"
      >
        {/* ─── Inner Container Island ─── */}
        <div className="relative flex-grow bg-gradient-to-b from-[#FAF8F5] to-white rounded-[2rem] p-6 md:p-12 lg:p-16 border border-black/[0.03] shadow-inner overflow-hidden">
          
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-selah-orange/10 via-selah-pink/5 to-transparent rounded-bl-full pointer-events-none opacity-60" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#93D35C]/5 rounded-tr-full pointer-events-none blur-[60px]" />
          
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-[0.04] pointer-events-none mix-blend-multiply" />

          {/* ── Frequency Toggle ── */}
          <div className="flex justify-center mb-10 md:mb-14 relative z-10 w-full">
            <div className="bg-selah-dark/[0.04] p-1.5 rounded-full inline-flex w-full sm:w-auto shadow-inner border border-white/50">
              {['One-Time', 'Monthly', 'Annual'].map((freq) => (
                <button 
                  key={freq} 
                  onClick={() => setFrequency(freq as any)} 
                  className={`flex-1 sm:flex-none px-4 md:px-8 py-3.5 md:py-4 rounded-full font-display font-bold text-[13px] md:text-[15px] tracking-tight transition-all duration-500 ${ 
                    frequency === freq 
                    ? 'bg-white text-selah-dark shadow-[0_8px_20px_rgba(0,0,0,0.08)] scale-[1.02]' 
                    : 'text-selah-muted/70 hover:text-selah-dark hover:bg-white/40' 
                  }`}
                >
                  {freqLabel(freq)}
                </button>
              ))}
            </div>
          </div>

          {/* ── Amount Grid ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-10 relative z-10">
            {amounts.map((amt) => (
              <motion.button 
                key={amt} 
                whileTap={{ scale: 0.96 }} 
                onClick={() => setAmount(amt)} 
                className={`h-28 md:h-36 rounded-2xl md:rounded-[1.5rem] flex flex-col items-center justify-center transition-all duration-500 border-2 relative group overflow-hidden ${ 
                  amount === amt 
                  ? 'bg-gradient-to-br from-selah-orange to-[#FF7B29] text-white border-transparent shadow-[0_20px_40px_-15px_rgba(255,92,0,0.4)] scale-105' 
                  : 'bg-white text-selah-dark border-transparent shadow-[0_8px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] hover:border-selah-orange/20' 
                }`}
              >
                <div className="flex flex-col items-center relative z-10">
                  <span className={`text-3xl md:text-4xl font-black font-display tracking-tight leading-none mb-1 ${amount === amt ? 'text-white' : 'text-selah-dark group-hover:text-selah-orange transition-colors duration-300'}`}>
                    ${amt}
                  </span>
                  <span className={`text-[12px] font-bold uppercase tracking-widest ${amount === amt ? 'text-white/80' : 'text-selah-muted/40 group-hover:text-selah-orange/60 transition-colors duration-300'}`}>
                    {subLabel()}
                  </span>
                </div>
                {/* Active glow inside button */}
                {amount === amt && (
                  <div className="absolute inset-0 bg-white opacity-[0.15] rounded-[1.5rem]">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/40 blur-[20px] rounded-full" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* ── Action Section ── */}
          <div className="relative z-10 flex flex-col items-center mt-12 pt-10 border-t border-selah-dark/[0.04]">
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }} 
              whileTap={{ scale: 0.98 }} 
              className="w-full md:w-auto min-w-[320px] bg-selah-dark text-white rounded-[1.5rem] p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] transition-all flex items-center justify-between group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                  <Heart size={22} className="text-selah-orange fill-selah-orange/20 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="text-left">
                  <div className="text-[14px] text-white/50 font-bold uppercase tracking-widest mb-0.5">{t('Donate', 'Donar')} {ctaSubLabel()}</div>
                  <div className="text-[22px] font-black font-display tracking-tight leading-none">${amount} USD</div>
                </div>
              </div>
              <div className="relative z-10 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-selah-orange group-hover:text-white text-white/50 transition-colors duration-500">
                <ArrowRight size={18} strokeWidth={2.5} />
              </div>
            </motion.button>

            <div className="mt-6 flex items-center gap-2 text-selah-muted/60 text-[12px] font-bold uppercase tracking-wider bg-black/[0.03] px-4 py-2 rounded-full border border-black/[0.02]">
              <ShieldCheck size={14} className="text-[#22c55e]" />
              {t('Secure & Encrypted Payment', 'Pago Seguro y Encriptado')}
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
};
