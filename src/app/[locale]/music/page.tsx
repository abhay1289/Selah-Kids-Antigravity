'use client';
import { motion, Variants } from 'framer-motion';
import { Music, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SpotifyEmbed from '@/components/music/SpotifyEmbed';
import { AppleMusicEmbed } from '@/components/music/AppleMusicEmbed';
import { PageShell } from '@/components/design';

export default function MusicPage() {
  const { language } = useLanguage();
  const isEs = language === 'ES';

  const title = isEs ? 'Escucha a Selah Kids' : 'Listen to Selah Kids';
  const subtitle = isEs 
    ? 'Disfruta de nuestros últimos álbumes y sencillos. Perfecto para adoración, tiempo de juego o la hora de dormir.'
    : 'Enjoy our latest albums and singles. Perfect for worship, playtime, or bedtime.';

  const secondaryTitle = isEs ? 'También en Apple Music' : 'Also on Apple Music';
  const youtubeMusicUrl = isEs 
    ? 'https://www.youtube.com/@SelahKidsEspanol' 
    : 'https://www.youtube.com/@selahkidsworship';

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <PageShell mainClassName="pt-32 pb-24 px-4 sm:px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-16"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-selah-orange/15 flex items-center justify-center mx-auto mb-6">
            <Music className="w-8 h-8 text-selah-orange" />
          </div>
          <h1 className="hero-headline tracking-tight">
            {title}
          </h1>
          <p className="body-text mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Primary: Spotify Embed — dark slab on warm cream atmosphere */}
        <motion.div variants={itemVariants} className="glass-morphism-dark rounded-3xl p-6 md:p-8">
          <SpotifyEmbed theme="light" height={420} />
        </motion.div>

        {/* Secondary: Apple Music */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h2 className="content-h2 text-center">
            {secondaryTitle}
          </h2>
          <div className="glass-morphism-dark rounded-3xl p-6 md:p-8">
            <AppleMusicEmbed />
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 pt-8">
          <a
            href={youtubeMusicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-6 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-600 rounded-full transition-colors border border-red-500/20 ui-button"
          >
            <span>YouTube Music</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="https://music.amazon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-6 py-3 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-700 rounded-full transition-colors border border-cyan-500/20 ui-button"
          >
            <span>Amazon Music</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </motion.div>
    </PageShell>
  );
}