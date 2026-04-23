'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import NextImage from 'next/image';
import { Badge } from '@/components/UI';
import { Star, Heart, Music, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalePath } from '@/hooks/useLocalePath';

const CHARACTERS = [
  {
    id: 'andy',
    name: 'Andy',
    role: 'The Natural-Born Leader',
    roleEs: 'El Líder Nato',
    bio: "A natural-born leader, Andy is a sharp and friendly little boy. Andy enjoys playtime outside in the garden with his best friend (and pet sheep), Shiloh.",
    bioEs: "Un líder nato, Andy es un niño astuto y amigable. Andy disfruta jugar afuera en el jardín con su mejor amigo (y oveja mascota), Shiloh.",
    favorites: ['Playing outside in the garden', 'Spending time with Shiloh', 'All sports, especially karate'],
    favoritesEs: ['Jugar afuera en el jardín', 'Pasar tiempo con Shiloh', 'Todos los deportes, especialmente karate'],
    color: 'orange',
    accentColor: '#FF7F50',
    gradient: 'from-[#FF7F50]/15 via-[#FFF5EE] to-[#FFE4CC]/20',
    blobColor: 'bg-[#FF7F50]',
    ringColor: 'ring-[#FF7F50]/30',
    image: '/SK_Andy_Intro_Pose-removebg-preview.png',
    imageAlt: 'Andy – The Natural-Born Leader',
    icon: Music,
    funFact: 'Andy once sang so loud that Shiloh fell off the couch!',
    funFactEs: '¡Andy una vez cantó tan fuerte que Shiloh se cayó del sofá!'
  },
  {
    id: 'libni',
    name: 'Libni',
    role: 'The Imaginative Neighbor',
    roleEs: 'La Vecina Imaginativa',
    bio: "Libni is Andy's imaginative, musical, and giggly next-door neighbor. Libni spends her days picking flowers, singing, and creating dances for her family.",
    bioEs: "Libni es la vecina imaginativa, musical y risueña de Andy. Libni pasa sus días recogiendo flores, cantando y creando bailes para su familia.",
    favorites: ['Picking flowers', 'Singing and making music', 'Creating dances for her family'],
    favoritesEs: ['Recoger flores', 'Cantar y hacer música', 'Crear bailes para su familia'],
    color: 'blue',
    accentColor: '#00BFFF',
    gradient: 'from-[#00BFFF]/15 via-[#F0FBFF] to-[#E0F7FF]/20',
    blobColor: 'bg-[#00BFFF]',
    ringColor: 'ring-[#00BFFF]/30',
    image: '/SK_Libni_Intro_Pose-removebg-preview.png',
    imageAlt: 'Libni – The Imaginative Neighbor',
    icon: Heart,
    funFact: 'Libni can invent a new dance in under 10 seconds!',
    funFactEs: '¡Libni puede inventar un nuevo baile en menos de 10 segundos!'
  },
  {
    id: 'shiloh',
    name: 'Shiloh',
    role: 'The Faithful Best Friend',
    roleEs: 'El Mejor Amigo Fiel',
    bio: "Curious, helpful and funny, Shiloh is Andy's pet sheep and best friend. He enjoys basking in the sunlight, finding snacks to eat, and taking long naps in the garden.",
    bioEs: "Curioso, servicial y gracioso, Shiloh es la oveja mascota y mejor amigo de Andy. Disfruta tomar el sol, buscar bocadillos para comer y tomar largas siestas en el jardín.",
    favorites: ['Basking in the sunlight', 'Finding snacks to eat', 'Taking long naps in the garden'],
    favoritesEs: ['Tomar el sol', 'Buscar bocadillos para comer', 'Tomar largas siestas en el jardín'],
    color: 'yellow',
    accentColor: '#FFD700',
    gradient: 'from-[#FFD700]/15 via-[#FFFDF0] to-[#FFF8DC]/20',
    blobColor: 'bg-[#FFD700]',
    ringColor: 'ring-[#FFD700]/30',
    image: '/SK_Shiloh_Intro_Pose.png',
    imageAlt: 'Shiloh – The Faithful Best Friend',
    icon: Star,
    funFact: 'Shiloh\'s favorite snack is apples straight from the tree!',
    funFactEs: '¡La merienda favorita de Shiloh son las manzanas directo del árbol!'
  }
];

/* ── Floating particle component ─────────────────────── */
function FloatingParticle({ delay, size, x, color }: { delay: number; size: number; x: string; color: string }) {
  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: '-100%', opacity: [0, 0.6, 0.6, 0] }}
      transition={{ duration: 8 + delay * 2, repeat: Infinity, delay, ease: 'linear' }}
      className="absolute pointer-events-none"
      style={{ left: x, width: size, height: size }}
    >
      <div className="w-full h-full rounded-full" style={{ backgroundColor: color, opacity: 0.25 }} />
    </motion.div>
  );
}

/* ── 3D Tilt Card: follows mouse ───────────────────── */
function CharacterImage({ char, index }: { char: typeof CHARACTERS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 80, scale: 0.85 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="relative w-full max-w-[420px] mx-auto cursor-pointer group"
    >
      {/* Glow ring */}
      <div className={`absolute -inset-4 rounded-[4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl ${char.blobColor}`} style={{ opacity: 0.15 }} />

      {/* Card */}
      <div className="relative aspect-[3/4] rounded-[3.5rem] overflow-hidden bg-gradient-to-b from-white to-white/80 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border-[6px] border-white/70 group-hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] transition-shadow duration-700">
        {/* Subtle color wash behind character */}
        <div className={`absolute inset-0 bg-gradient-to-b ${char.gradient} opacity-60`} />

        {/* Character image */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.8 }}
          className="relative w-full h-full"
        >
          <NextImage
            src={char.image}
            alt={char.imageAlt}
            fill
            className="object-contain p-4 drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)] mix-blend-multiply"
            sizes="(max-width: 768px) 90vw, 420px"
            priority={index === 0}
          />
        </motion.div>

        {/* Hover shimmer */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms]" />
        </div>
      </div>

      {/* Name tag floating at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 + index * 0.1 }}
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="px-8 py-3 bg-white rounded-2xl shadow-xl border border-black/5 flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${char.blobColor} shadow-sm`} />
          <span className="content-h3 text-selah-dark whitespace-nowrap">{char.name}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Character detail section ──────────────────────── */
function CharacterSection({ char, index }: { char: typeof CHARACTERS[0]; index: number }) {
  const { t, language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isEven = index % 2 === 0;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <motion.section
      ref={sectionRef}
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Full-width gradient background with parallax */}
      <motion.div
        style={{ scale: bgScale }}
        className={`absolute inset-0 bg-gradient-to-b ${char.gradient}`}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[0, 1, 2, 3, 4].map(i => (
          <FloatingParticle
            key={i}
            delay={i * 1.5}
            size={6 + i * 4}
            x={`${15 + i * 18}%`}
            color={char.accentColor}
          />
        ))}
      </div>

      {/* Giant watermark name */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.03 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span className="text-[22vw] font-display font-bold text-black whitespace-nowrap tracking-[-0.05em] leading-none select-none">
          {char.name.toUpperCase()}
        </span>
      </motion.div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24`}>

          {/* Image column */}
          <motion.div style={{ y: parallaxY }} className="w-full lg:w-[45%]">
            <CharacterImage char={char} index={index} />
          </motion.div>

          {/* Text column */}
          <div className="w-full lg:w-[55%] space-y-8 pt-8 lg:pt-0">
            {/* Role badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge color={char.color as any} className="shadow-md text-sm px-6 py-2.5 backdrop-blur">
                <char.icon size={14} className="inline mr-2 -mt-0.5" />
                {language === 'ES' && char.roleEs ? char.roleEs : char.role}
              </Badge>
            </motion.div>

            {/* Name heading */}
            <motion.h2
              initial={{ opacity: 0, y: 30, clipPath: 'inset(100% 0 0 0)' }}
              whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              className="hero-headline tracking-[-0.02em] leading-[0.9] drop-shadow-sm"
            >
              {char.name}
            </motion.h2>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="body-text leading-relaxed max-w-xl text-balance"
            >
              {language === 'ES' && char.bioEs ? char.bioEs : char.bio}
            </motion.p>

            {/* Fun fact pill */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-black/5 bg-white/70 backdrop-blur-sm shadow-sm"
            >
              <Sparkles size={16} className="text-selah-yellow" />
              <span className="ui-caption text-selah-dark">{language === 'ES' && char.funFactEs ? char.funFactEs : char.funFact}</span>
            </motion.div>

            {/* Favorites card */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
              whileHover={{ y: -6 }}
              className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] max-w-xl relative overflow-hidden group"
            >
              {/* Hover wash */}
              <div className={`absolute inset-0 ${char.blobColor} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700`} />

              <h3 className="ui-label text-selah-dark mb-6 flex items-center gap-3 relative z-10">
                <span className={`w-2.5 h-2.5 rounded-full ${char.blobColor} shadow-sm`} />
                {t("Favorite Things", "Cosas Favoritas")}
              </h3>

              <ul className="space-y-5 relative z-10">
                {(language === 'ES' && char.favoritesEs ? char.favoritesEs : char.favorites).map((fav: string, i: number) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                    viewport={{ once: true }}
                    className="flex items-center gap-5 group/item cursor-default"
                  >
                    <span
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-display transition-all duration-300 group-hover/item:scale-110 group-hover/item:rotate-3"
                      style={{ backgroundColor: `${char.accentColor}15`, color: char.accentColor }}
                    >
                      0{i + 1}
                    </span>
                    <span className="body-text !text-selah-dark !max-w-none group-hover/item:translate-x-1 transition-transform duration-300">
                      {fav}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ── Main page ─────────────────────────────────────── */
export default function CharactersPage() {
  const { t, language } = useLanguage();
  const { lh } = useLocalePath();
  return (
    <div className="bg-gradient-to-b from-[#FFF5EE] via-[#FDFBF7] to-[#F0FAE6] min-h-screen overflow-hidden selection:bg-selah-orange selection:text-white relative">
      {/* Vivid Color Washes */}
      <div className="absolute top-0 right-0 w-[55vw] h-[45vh] bg-gradient-to-bl from-[#FF7F50]/10 via-[#FF5C00]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[50%] left-0 w-[45vw] h-[40vh] bg-gradient-to-r from-[#00BFFF]/8 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[40vw] h-[40vh] bg-[#FFD700]/8 rounded-full blur-[100px] pointer-events-none" />
      {/* Paper Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />

      {/* Hero Section */}
      <section className="pt-36 md:pt-44 pb-8 relative z-10 text-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Badge color="orange" className="mb-8 shadow-md">{t("MEET THE CREW", "CONOCE AL EQUIPO")}</Badge>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }} className="hero-headline mb-6 tracking-tight leading-[1.1] drop-shadow-sm">
          {t("Our Characters", "Nuestros Personajes")}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }} className="body-text max-w-2xl mx-auto leading-relaxed tracking-tight mb-12">
          {t("Get to know the friends who make learning about Jesus an exciting adventure!", "¡Conoce a los amigos que hacen del aprendizaje sobre Jesús una aventura emocionante!")}
        </motion.p>
      </section>

      {/* Character Sections */}
      <div className="flex flex-col">
        {CHARACTERS.map((char, index) => (
          <CharacterSection key={char.id} char={char} index={index} />
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-6 text-center bg-gradient-to-b from-selah-bg/50 to-white"
      >
        <h2 className="content-h2 mb-4 tracking-tight">{t("Want to see them in action?", "¿Quieres verlos en acción?")}</h2>
        <p className="body-text mx-auto mb-10 max-w-lg">
          {t(
            "Watch Andy, Libni, and Shiloh sing, dance, and worship together on our YouTube channel!",
            "¡Mira a Andy, Libni y Shiloh cantar, bailar y adorar juntos en nuestro canal de YouTube!"
          )}
        </p>
        <motion.a
          href={lh("/watch")}
          onClick={(e) => { e.preventDefault(); window.location.href = '/watch'; }}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-3 px-10 py-4 bg-selah-orange text-white rounded-2xl ui-button shadow-[0_20px_40px_-10px_rgba(255,92,0,0.4)] hover:shadow-[0_30px_60px_-10px_rgba(255,92,0,0.5)] transition-all duration-300"
        >
          {t("Watch Our Videos", "Ver Nuestros Videos")}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </motion.a>
      </motion.section>
    </div>
  );
}
