"use client";

import React from 'react';
import { motion } from 'framer-motion';
import NextImage from 'next/image';
import { Badge } from '../UI';
import { staggerContainer, zoomInUp } from '../../utils/animations';
import { useLanguage } from '../../contexts/LanguageContext';

const CHARACTERS = [
  {
    name: "Andy",
    role: "The Friendly Leader",
    roleEs: "El Líder Amigable",
    desc: "Andy is a smart and friendly boy who loves to lead. He spends his days playing outside in the garden with his best friend and pet sheep, Shiloh. Join Andy as he sings fun worship songs!",
    descEs: "Andy es un niño inteligente y amigable que le encanta liderar. Pasa sus días jugando afuera en el jardín con su mejor amigo y oveja mascota, Shiloh. ¡Únete a Andy mientras canta divertidas canciones de adoración!",
    color: "bg-selah-blue",
    image: "/TGN_SingleFrames+28229.jpg"
  },
  {
    name: "Libni",
    role: "The Musical Neighbor",
    roleEs: "La Vecina Musical",
    desc: "Libni is Andy's creative and giggly next-door neighbor who loves music. She spends her time picking flowers, singing Christian kids music, and making up fun dances for her family.",
    descEs: "Libni es la vecina creativa y risueña de Andy que ama la música. Pasa su tiempo recogiendo flores, cantando música cristiana para niños y creando bailes divertidos para su familia.",
    color: "bg-selah-pink",
    image: "/TGN_SingleFrames+28329.jpg" 
  },
  {
    name: "Shiloh",
    role: "The Funny Sheep",
    roleEs: "La Oveja Graciosa",
    desc: "Shiloh is Andy's pet sheep and best friend. He is curious, helpful, and very funny! Shiloh loves resting in the warm sun, finding yummy snacks, and taking long naps in the garden.",
    descEs: "Shiloh es la oveja mascota y mejor amigo de Andy. ¡Es curioso, servicial y muy gracioso! A Shiloh le encanta descansar bajo el sol, buscar bocadillos ricos y tomar largas siestas en el jardín.",
    color: "bg-selah-green",
    image: "/TGN_SingleFrames+28729.jpg" 
  }
];

export const AboutCharacters = () => {
  const { t, language } = useLanguage();
  return (
    <section className="max-w-[1400px] mx-auto px-6 py-12 md:py-16 relative z-10">
      <div className="text-center mb-12">
        <Badge color="orange" className="mb-6">{t("OUR FRIENDS", "NUESTROS AMIGOS")}</Badge>
        <h2 className="content-h2 leading-[1.1] tracking-tight">
          {t("Meet the Characters", "Conoce a los Personajes")}
        </h2>
        <p className="body-text mt-6 max-w-2xl mx-auto">
          {t(
            "Join Andy, Libni, and Shiloh on their fun adventures as they sing, play, and learn about God's love!",
            "¡Únete a Andy, Libni y Shiloh en sus divertidas aventuras mientras cantan, juegan y aprenden sobre el amor de Dios!"
          )}
        </p>
      </div>
      
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid md:grid-cols-3 gap-8"
      >
        {CHARACTERS.map((char, i) => (
          <motion.div
            key={i}
            variants={zoomInUp}
            className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-8 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col items-center text-center group hover:-translate-y-4 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className={`w-48 h-48 rounded-full mb-8 overflow-hidden ${char.color}/10 flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-700 ease-out relative z-10`}>
              <div className={`w-full h-full rounded-full overflow-hidden ${char.color}/20 flex items-center justify-center`}>
                <NextImage src={char.image} alt={char.name} width={192} height={192} className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
            <h3 className="content-h3-playful mb-2 relative z-10">{char.name}</h3>
            <div className="ui-label text-selah-orange uppercase mb-6 relative z-10">{language === 'ES' && char.roleEs ? char.roleEs : char.role}</div>
            <p className="body-text leading-relaxed relative z-10">
              {language === 'ES' && char.descEs ? char.descEs : char.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
