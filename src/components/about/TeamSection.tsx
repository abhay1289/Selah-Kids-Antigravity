import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '../../contexts/LanguageContext';
import { SectionHeader } from '../SectionHeader';
import { TEAM_MEMBERS } from '../../data/team';

export function TeamSection() {
  const { t, language } = useLanguage();

  return (
    <section className="py-20 md:py-32 relative bg-white overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-selah-blue/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-selah-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <SectionHeader 
          badge={t("The Team", "El Equipo")}
          title={t("Meet the Selah Kids Team!", "¡Conoce al Equipo Selah Kids!")}
          description={t("The passionate people bringing these stories to life.", "Las personas apasionadas que dan vida a estas historias.")}
          align="center"
        />

        <div className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          {TEAM_MEMBERS.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col h-full rounded-[3rem] p-8 md:p-10 bg-white border border-black/[0.04] shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden"
            >
              {/* Subtle hover glow layer */}
              <div className={`absolute inset-0 bg-gradient-to-b ${member.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

              {/* Image & Header */}
              <div className="flex flex-col items-center mb-8 relative z-10">
                <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full mb-6 group-hover:scale-105 transition-transform duration-500">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.color} blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                  <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-white bg-white shadow-[0_8px_20px_rgba(0,0,0,0.06)] z-10">
                    <Image 
                      src={member.img} 
                      alt={member.name}
                      fill
                      className="object-cover relative z-10 group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>
                </div>
                <h3 className="text-3xl font-display font-black text-selah-dark mb-2 text-center" translate="no">
                  {member.name}
                </h3>
                <span className={`inline-block px-4 py-1.5 rounded-full text-white font-bold text-sm bg-gradient-to-r ${member.color} shadow-sm`}>
                  {language === 'EN' ? member.titleEn : member.titleEs}
                </span>
              </div>

              {/* Bio Content */}
              <div className="flex-1 text-selah-dark/70 text-lg leading-relaxed space-y-4">
                {(language === 'EN' ? member.bioEn : member.bioEs).split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
