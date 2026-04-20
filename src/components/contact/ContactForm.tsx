"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { slideInLeft } from '../../utils/animations';
import { useLanguage } from '../../contexts/LanguageContext';

export const ContactForm = () => {
  const { t } = useLanguage();
  const emailContacts: Array<{ label: string; href: string; email: string }> = [
    {
      label: t("General Inquiries", "Consultas Generales"),
      href: "mailto:info.selahkids@gmail.com",
      email: "info.selahkids@gmail.com",
    },
    {
      label: t("Partnerships & Ministry", "Colaboración y Ministerio"),
      href: "mailto:partners@selahkids.com",
      email: "partners@selahkids.com",
    },
    {
      label: t("Press & Media", "Prensa y Medios"),
      href: "mailto:press@selahkids.com",
      email: "press@selahkids.com",
    },
  ];

  return (
    <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="lg:col-span-7 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[3rem] p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-white/60 relative overflow-hidden">
      
      {/* Inner Island */}
      <div className="bg-gradient-to-b from-[#FDFBF7] to-white rounded-[2rem] p-6 md:p-10 lg:p-14 border border-black/[0.02] relative overflow-hidden">
        
        {/* Ambient internal glows */}
        <motion.div 
          animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-48 h-48 bg-selah-orange/[0.06] rounded-full blur-[60px] pointer-events-none" 
        />
        <motion.div 
          animate={{ x: [0, -10, 0], y: [0, 12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-48 h-48 bg-[#00BFFF]/[0.04] rounded-full blur-[60px] pointer-events-none" 
        />

        <div className="relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="content-h2 mb-10"
          >
            {t("Let's Email", "Envíanos un correo")}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className="relative rounded-[1.75rem] md:rounded-[2rem] border border-black/5 bg-white/90 p-6 md:p-8 shadow-[0_24px_50px_-22px_rgba(0,0,0,0.16)]"
          >
            <p className="text-[13px] md:text-[14px] font-semibold tracking-[0.02em] text-selah-muted mb-5">
              {t("Prefer email?", "¿Prefieres email?")}
            </p>

            <div className="flex flex-col gap-4">
              {emailContacts.map((contact) => {
                return (
                  <motion.a
                    key={contact.email}
                    href={contact.href}
                    whileHover={{ y: -1, scale: 1.01 }}
                    whileTap={{ scale: 0.995 }}
                    transition={{ type: "spring", stiffness: 360, damping: 24 }}
                    className="group rounded-2xl border border-black/[0.06] bg-gradient-to-br from-white to-[#fff7f2] px-5 py-4 hover:border-selah-orange/30 hover:shadow-[0_16px_32px_-22px_rgba(255,92,0,0.5)] transition-all"
                  >
                    <p className="text-[13px] md:text-[14px] font-semibold text-selah-muted group-hover:text-selah-dark transition-colors">
                      {contact.label}
                    </p>
                    <p className="text-[15px] md:text-[16px] font-black font-display tracking-tight text-selah-dark group-hover:text-selah-orange break-all transition-colors">
                      {contact.email}
                    </p>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
