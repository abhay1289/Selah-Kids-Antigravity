"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Youtube, Play } from "lucide-react";
import { Button, Badge } from "../UI";
import { useLanguage } from "../../contexts/LanguageContext";
import { useMedia } from "../../contexts/MediaContext";
import { EPISODES, getTodaysPick } from "../../data/catalog";
import { useFieldResolver } from "../../lib/page-fields";
import type { PageFieldMap } from "../../lib/cms-server";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

export function JoinYouTubeSection({ fields }: { fields?: PageFieldMap } = {}) {
  const { t, language } = useLanguage();
  const { openEpisode } = useMedia();
  const containerRef = useRef<HTMLElement>(null);
  const f = useFieldResolver(fields);

  const today = new Date().toISOString().slice(0, 10);
  const pick = getTodaysPick(today);
  const pickTitle = language === 'ES' && pick.titleEs ? pick.titleEs : pick.title;
  const previewDuration = `${Math.floor(pick.durationSec / 60)}:${String(pick.durationSec % 60).padStart(2, '0')}`;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  const videoY = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);

  return (
    <motion.section 
      ref={containerRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
      className="py-12 md:py-16 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              style={{ y: textY }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 50, damping: 15 }}
              viewport={{ once: true }}
            >
              <div className="inline-block mb-8">
                <Badge color="yellow" className="!rotate-0 shadow-sm">{f("youtube.yt_badge", "SUBSCRIBE & WORSHIP", "SUSCRÍBETE Y ADORA")}</Badge>
              </div>
              <h2 className="content-h2 mb-8 leading-[1.05] tracking-[-0.02em]">
                {f("youtube.yt_title_line1", "Join Our YouTube", "Únete a Nuestra")} <br /> {f("youtube.yt_title_line2", "Family!", "Familia de YouTube!")}
              </h2>
              <p className="text-xl text-selah-muted mb-12 max-w-lg leading-relaxed text-balance">
                {f(
                  "youtube.yt_description",
                  "Get new worship songs, English and Spanish worship videos, and awesome Christian cartoons every single week! Subscribe to our channel so you never miss a release.",
                  "¡Obtén nuevas canciones de adoración, videos de adoración en inglés y español, y dibujos animados cristianos increíbles cada semana! ¡Suscríbete a nuestro canal para que nunca te pierdas un estreno!"
                )}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <Button
                  onClick={() => window.open(language === 'ES' ? "https://www.youtube.com/@SelahKidsEspanol" : "https://www.youtube.com/@selahkidsworship", "_blank", "noopener,noreferrer")}
                  className="!bg-[#FF0000] !border-none !text-white !px-10 !py-4 ui-button flex items-center justify-center gap-3 whitespace-nowrap w-full sm:w-auto [box-shadow:0_8px_24px_-4px_rgba(255,0,0,0.38),0_2px_4px_rgba(0,0,0,0.04)] hover:[box-shadow:0_24px_64px_-12px_rgba(255,0,0,0.42),0_8px_16px_rgba(255,0,0,0.20)]"
                >
                  <Youtube size={28} aria-hidden /> {f("youtube.yt_cta", "Subscribe Now", "Suscríbete Ahora")}
                </Button>
                <span className="ui-label text-selah-muted/70">{f("youtube.yt_community_label", "JOIN THE COMMUNITY", "ÚNETE A LA COMUNIDAD")}</span>
              </div>
            </motion.div>

            <motion.div
              style={{ y: videoY }}
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 50, damping: 12, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Real in-site play: thumbnail opens VideoOverlay via MediaContext */}
              <motion.button
                type="button"
                onClick={() => openEpisode(pick, EPISODES)}
                aria-label={t(`Play ${pickTitle}`, `Reproducir ${pickTitle}`)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="block w-full aspect-video bg-black rounded-[40px] overflow-hidden border-8 border-white/10 relative group shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                <Image
                  src={pick.thumbnail}
                  alt={pickTitle}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1200ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="w-24 h-24 bg-white/95 rounded-full flex items-center justify-center text-selah-dark shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]"
                    aria-hidden="true"
                  >
                    <Play fill="currentColor" size={40} className="ml-2" />
                  </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-white drop-shadow-md">
                    <div className="ui-label opacity-80 mb-1">{t("TODAY’S PICK", "ELEGIDO DE HOY")}</div>
                    <div className="content-h3 leading-tight">{pickTitle}</div>
                    <div className="ui-label opacity-70 mt-1">{previewDuration} · {pick.language}</div>
                  </div>
                </div>
              </motion.button>

              {/* Resting badges — gentle entrance, hover lift, no infinite loops */}
              <motion.div
                initial={{ y: 18, opacity: 0, rotate: -4 }}
                whileInView={{ y: 0, opacity: 1, rotate: -3 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.35 }}
                whileHover={{ y: -4, rotate: -2 }}
                className="absolute -top-10 -right-10 z-20"
              >
                <Badge color="light" className="!px-8 !py-4 ui-button shadow-lg border border-white/20">{f("youtube.yt_floating_badge1", "New Weekly!", "¡Nuevo Cada Semana!")}</Badge>
              </motion.div>
              <motion.div
                initial={{ y: -18, opacity: 0, rotate: 4 }}
                whileInView={{ y: 0, opacity: 1, rotate: 3 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.5 }}
                whileHover={{ y: 4, rotate: 2 }}
                className="absolute -bottom-10 -left-10 z-20"
              >
                <Badge color="yellow" className="!px-8 !py-4 ui-button shadow-lg border border-selah-yellow/20">{f("youtube.yt_floating_badge2", "Bilingual", "Bilingüe")}</Badge>
              </motion.div>
            </motion.div>
          </div>
      </div>
    </motion.section>
  );
}
