'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Character } from '../../data/characters';
import { EPISODES, Episode } from '../../data/catalog';
import { useMedia } from '../../contexts/MediaContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface Props { character: Character }

export default function CharacterEpisodes({ character }: Props) {
  const { openEpisode } = useMedia();
  const { t } = useLanguage();
  const list = EPISODES.slice(0, 6);
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="content-h2 mb-8">{t('Appears in these episodes', 'Aparece en estos episodios')}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x">
        {list.map((ep) => (
          <motion.button
            key={ep.id}
            whileHover={{ y: -4 }}
            onClick={() => openEpisode(ep, list)}
            className="snap-start shrink-0 w-60 text-left rounded-2xl overflow-hidden shadow-md bg-white"
          >
            <div className="relative aspect-video">
              <Image src={ep.thumbnail} alt={ep.title} fill className="object-cover" sizes="240px" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/40 transition">
                <Play size={32} className="text-white drop-shadow-lg" />
              </div>
            </div>
            <div className="p-3">
              <div className="text-sm font-semibold truncate">{ep.title}</div>
              <div className="text-xs text-selah-muted">{Math.floor(ep.durationSec/60)}m</div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
