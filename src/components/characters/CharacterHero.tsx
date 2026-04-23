'use client';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Play } from 'lucide-react';
import { Character } from '../../data/characters';
import { useLanguage } from '../../contexts/LanguageContext';

interface CharacterHeroProps {
  character: Character;
}

export default function CharacterHero({ character }: CharacterHeroProps) {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });

  // Parallax transforms
  // Text moves slightly to the right
  const textX = useTransform(smoothProgress, [0, 1], ['0%', '10%']);
  // Character moves slightly to the left and up
  const characterX = useTransform(smoothProgress, [0, 1], ['0%', '-5%']);
  const characterY = useTransform(smoothProgress, [0, 1], ['0%', '-10%']);

  const role = language === 'ES' ? (character.roleEs || character.role) : character.role;
  const catchphrase = language === 'ES' ? character.catchphrase?.es : character.catchphrase?.en;
  
  // Verse text
  const verseRef = language === 'ES' && character.favoriteVerse?.refEs 
    ? character.favoriteVerse.refEs 
    : character.favoriteVerse?.ref;
  const verseText = language === 'ES' 
    ? character.favoriteVerse?.text_es 
    : character.favoriteVerse?.text_en;

  const playText = language === 'ES' ? 'Reproducir mi canción' : 'Play my theme song';

  const poseSrc = (character as any).posePng || `/images/characters/${character.slug}-pose.png`;

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-zinc-950 text-white pt-24 pb-12"
    >
      {/* Blurred Color Blobs */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10 blur-[100px]"
        style={{ backgroundColor: character.colorPrimary }}
      />
      <div 
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-[120px]"
        style={{ backgroundColor: character.colorAccent || character.colorPrimary }}
      />

      {/* Giant Background Text */}
      <motion.div 
        className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap text-[22vw] font-black tracking-tighter opacity-5 pointer-events-none uppercase font-display"
        style={{ x: textX, color: character.colorPrimary }}
      >
        {character.name}
      </motion.div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Character Pose */}
        <motion.div 
          className="relative h-[50vh] lg:h-[60vh] flex items-center justify-center lg:justify-end"
          style={{ x: characterX, y: characterY }}
        >
          <div className="relative w-full h-full max-w-lg">
            <Image
              src={poseSrc}
              alt={character.name}
              fill
              priority
              className="object-contain object-bottom drop-shadow-2xl"
            />
          </div>
        </motion.div>

        {/* Right Side Content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl uppercase tracking-widest text-zinc-400 font-semibold">
              {role}
            </h2>
            <h1 className="text-5xl md:text-7xl font-bold font-display" style={{ color: character.colorPrimary }}>
              {character.name}
            </h1>
          </div>

          {catchphrase && (
            <p className="text-2xl md:text-3xl italic font-light text-zinc-300 border-l-4 pl-6" style={{ borderColor: character.colorPrimary }}>
              &quot;{catchphrase}&quot;
            </p>
          )}

          {verseRef && verseText && (
            <div className="bg-zinc-900/50 p-6 rounded-2xl backdrop-blur-sm border border-zinc-800/50 max-w-xl">
              <p className="text-lg md:text-xl text-zinc-200 mb-2 font-medium">&quot;{verseText}&quot;</p>
              <p className="text-sm uppercase tracking-wider font-semibold" style={{ color: character.colorAccent || character.colorPrimary }}>
                — {verseRef}
              </p>
            </div>
          )}

          <button 
            onClick={() => console.log(`Play theme song for ${character.name}`)}
            className="group flex items-center space-x-3 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
            style={{ 
              backgroundColor: character.colorPrimary,
              color: '#fff',
              boxShadow: `0 10px 30px -10px ${character.colorPrimary}80`
            }}
          >
            <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
            <span>{playText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}