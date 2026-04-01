'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Music, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function MusicPage() {
  const { t } = useLanguage();

  const MUSIC_PLATFORMS = [
    { name: "Spotify", description: t("Stream our worship songs on Spotify", "Escucha nuestras canciones de adoración en Spotify"), color: "bg-[#1DB954]", textColor: "text-white", href: "https://open.spotify.com/artist/selahkids", icon: "🎵" },
    { name: "Apple Music", description: t("Listen on Apple Music", "Escucha en Apple Music"), color: "bg-gradient-to-br from-[#FC3C44] to-[#FC6E29]", textColor: "text-white", href: "https://music.apple.com/us/artist/selah-kids", icon: "🎶" },
    { name: "YouTube Music", description: t("Watch & listen on YouTube Music", "Mira y escucha en YouTube Music"), color: "bg-[#FF0000]", textColor: "text-white", href: "https://www.youtube.com/@selahkidsworship", icon: "▶️" },
    { name: "Amazon Music", description: t("Available on Amazon Music", "Disponible en Amazon Music"), color: "bg-[#00A8E1]", textColor: "text-white", href: "https://music.amazon.com", icon: "🎼" },
  ];

  return (
    <div className="bg-gradient-to-b from-[#FFF5EE] via-[#FDFBF7] to-[#F5FBF0] min-h-screen pt-36 md:pt-44 pb-16">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="w-20 h-20 bg-selah-orange/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8">
            <Music size={40} className="text-selah-orange" />
          </div>
          <h1 className="hero-headline mb-4 tracking-tight">{t("Listen to Selah Kids", "Escucha a Selah Kids")}</h1>
          <p className="body-text mx-auto mb-12 text-center">
            {t(
              "Choose your favorite platform to stream or download our worship songs for children.",
              "Elige tu plataforma favorita para escuchar o descargar nuestras canciones de adoración para niños."
            )}
          </p>
        </motion.div>

        <div className="grid gap-4">
          {MUSIC_PLATFORMS.map((platform, i) => (
            <motion.a key={i} href={platform.href} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 0.3 }} whileHover={{ scale: 1.02, x: 4 }} className={`flex items-center justify-between gap-4 p-6 rounded-2xl ${platform.color} ${platform.textColor} shadow-lg hover:shadow-xl transition-all duration-300 group`}>
              <div className="flex items-center gap-4">
                <span className="text-3xl">{platform.icon}</span>
                <div className="text-left">
                  <p className="content-h3 text-white">{platform.name}</p>
                  <p className="opacity-80 ui-caption">{platform.description}</p>
                </div>
              </div>
              <ExternalLink size={20} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
