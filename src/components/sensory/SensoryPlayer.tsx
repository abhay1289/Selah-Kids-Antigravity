'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Moon } from 'lucide-react';
import { getSensoryEpisodes, Episode } from '../../data/catalog';
import { useMedia } from '../../contexts/MediaContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useState } from 'react';

export default function SensoryPlayer() {
  const { language } = useLanguage();
  const { openEpisode } = useMedia();
  const [timer, setTimer] = useState<number | null>(null);

  const sensoryEpisodes = getSensoryEpisodes();

  const handleTimerSelect = (t: number) => {
    setTimer(t);
    console.log(`Bedtime timer set to ${t} minutes`);
  };

  return (
    <div className="relative min-h-screen pt-24 pb-12 px-4 overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 bg-slate-950 -z-20" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="text-center mb-10 relative z-10 w-full max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-light text-slate-100 tracking-wide mb-6">
          {language === 'ES' ? 'Canciones Suaves para el Tiempo de Tranquilidad' : 'Gentle Songs for Quiet Time'}
        </h1>
        
        <div className="flex flex-wrap justify-center items-center gap-3">
          <Moon className="w-5 h-5 text-amber-200 mr-2 opacity-80" />
          {[5, 10, 15, 30].map((t) => (
            <button
              key={t}
              onClick={() => handleTimerSelect(t)}
              className={`px-5 py-2 rounded-full text-sm transition-all duration-300 border ${
                timer === t 
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {t} {language === 'ES' ? 'min' : 'min'}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {sensoryEpisodes.map((ep, index) => {
          const isFeatured = index === 0;
          return (
            <motion.div
              key={ep.id}
              onClick={() => openEpisode(ep, sensoryEpisodes)}
              whileHover={{ scale: 1.02 }}
              className={`group cursor-pointer rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden transition-colors hover:bg-white/10 ${
                isFeatured ? 'md:col-span-2 max-w-2xl mx-auto w-full' : ''
              }`}
            >
              <div className="p-4">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 mb-4">
                  <Image
                    src={ep.thumbnail || ''}
                    alt={(language === 'ES' ? ep.titleEs : ep.title) || ep.title}
                    fill
                    className="object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500/20 group-hover:border-amber-500/50 transition-all duration-300">
                      <Play className="w-6 h-6 text-white ml-1 opacity-80 group-hover:opacity-100 group-hover:text-amber-200" />
                    </div>
                  </div>
                </div>
                <div className="px-2 pb-2 text-center">
                  <h3 className="text-xl font-medium text-slate-200 mb-2">
                    {language === 'ES' ? ep.titleEs : ep.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {language === 'ES' ? ep.descriptionEs : ep.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
