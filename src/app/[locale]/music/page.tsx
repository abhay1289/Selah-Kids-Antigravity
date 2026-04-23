'use client';
import { motion, Variants } from 'framer-motion';
import { Music, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SpotifyEmbed from '@/components/music/SpotifyEmbed';
import { AppleMusicEmbed } from '@/components/music/AppleMusicEmbed';

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
    <div className="min-h-screen bg-slate-900 pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto relative z-10 space-y-16"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
            <Music className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            {title}
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Primary: Spotify Embed */}
        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-slate-700/50 shadow-2xl">
          <SpotifyEmbed theme="light" height={420} />
        </motion.div>

        {/* Secondary: Apple Music */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">
            {secondaryTitle}
          </h2>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-slate-700/50 shadow-2xl">
            <AppleMusicEmbed />
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 pt-8">
          <a
            href={youtubeMusicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-6 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-full transition-colors border border-red-500/20"
          >
            <span className="font-medium">YouTube Music</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="https://music.amazon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-6 py-3 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 rounded-full transition-colors border border-cyan-500/20"
          >
            <span className="font-medium">Amazon Music</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}