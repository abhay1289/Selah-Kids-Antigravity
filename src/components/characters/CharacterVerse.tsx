'use client';

import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Download } from 'lucide-react';
import { Character } from '../../data/characters';
import { useLanguage } from '../../contexts/LanguageContext';

interface CharacterVerseProps {
  character: Character;
}

export default function CharacterVerse({ character }: CharacterVerseProps) {
  const { language } = useLanguage();

  const isEs = language === 'ES';

  const name = character.name;
  const verseText = isEs ? character.favoriteVerse?.text_es : character.favoriteVerse?.text_en;
  const verseRef = isEs && character.favoriteVerse?.refEs ? character.favoriteVerse.refEs : character.favoriteVerse?.ref;
  const originText = isEs ? character.originStory?.es : character.originStory?.en;

  const t = {
    favoriteVerse: isEs ? 'Versículo Favorito' : 'Favorite Verse',
    meet: isEs ? 'Conoce a' : 'Meet',
    download: isEs ? 'Descargar hoja para colorear' : 'Download coloring sheet'
  };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="rounded-[2rem] bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.08)] p-8 md:p-10 border border-black/5 flex flex-col items-start"
        >
          <div className="flex items-center gap-3 mb-8">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: `${character.colorPrimary}20`, color: character.colorPrimary }}
            >
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="font-semibold text-neutral-800 tracking-wide uppercase text-sm">
              {t.favoriteVerse}
            </span>
          </div>
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-serif italic text-neutral-900 leading-snug mb-6 flex-grow">
            "{verseText}"
          </blockquote>
          <p className="text-sm md:text-base font-medium text-neutral-500 uppercase tracking-widest">
            {verseRef}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="rounded-[2rem] bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.08)] p-8 md:p-10 border border-black/5 flex flex-col"
        >
          <div className="flex items-center gap-3 mb-8">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: `${character.colorPrimary}20`, color: character.colorPrimary }}
            >
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="font-semibold text-neutral-800 tracking-wide uppercase text-sm">
              {t.meet} {name}
            </span>
          </div>
          <p className="text-lg text-neutral-700 leading-relaxed whitespace-pre-line">
            {originText}
          </p>
        </motion.div>
      </div>

      {character.coloringPdfUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="mt-12 flex justify-center"
        >
          <a
            href={character.coloringPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg"
            style={{ backgroundColor: character.colorPrimary }}
          >
            <Download className="w-5 h-5" />
            <span>{t.download}</span>
          </a>
        </motion.div>
      )}
    </section>
  );
}
