"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { Button } from '../UI';
import { slideInLeft } from '../../utils/animations';
import { useLanguage } from '../../contexts/LanguageContext';

export const ContactForm = () => {
  const { t } = useLanguage();
  return (
    <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="lg:col-span-7 bg-white/80 backdrop-blur-2xl rounded-2xl md:rounded-[3rem] p-6 md:p-10 lg:p-16 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.08)] border border-white">
      <h2 className="content-h2 mb-10">{t("Send a Message", "Envía un Mensaje")}</h2>
      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3 group">
            <label htmlFor="name" className="ui-label text-selah-muted group-focus-within:text-selah-blue transition-colors">{t("Name", "Nombre")}</label>
            <input type="text" id="name" className="w-full px-0 py-4 bg-transparent border-b-2 border-black/10 focus:border-selah-blue focus:outline-none transition-all duration-500 content-h3 text-selah-dark placeholder-selah-muted/30" placeholder={t("Jane Doe", "María García")} />
          </div>
          <div className="space-y-3 group">
            <label htmlFor="email" className="ui-label text-selah-muted group-focus-within:text-selah-blue transition-colors">{t("Email", "Correo")}</label>
            <input type="email" id="email" className="w-full px-0 py-4 bg-transparent border-b-2 border-black/10 focus:border-selah-blue focus:outline-none transition-all duration-500 content-h3 text-selah-dark placeholder-selah-muted/30" placeholder={t("jane@example.com", "maria@ejemplo.com")} />
          </div>
        </div>
        <div className="space-y-3 group">
          <label htmlFor="subject" className="ui-label text-selah-muted group-focus-within:text-selah-blue transition-colors">{t("Subject", "Asunto")}</label>
          <input type="text" id="subject" className="w-full px-0 py-4 bg-transparent border-b-2 border-black/10 focus:border-selah-blue focus:outline-none transition-all duration-500 content-h3 text-selah-dark placeholder-selah-muted/30" placeholder={t("How can we help?", "¿Cómo podemos ayudarte?")} />
        </div>
        <div className="space-y-3 group">
          <label htmlFor="message" className="ui-label text-selah-muted group-focus-within:text-selah-blue transition-colors">{t("Message", "Mensaje")}</label>
          <textarea id="message" rows={4} className="w-full px-0 py-4 bg-transparent border-b-2 border-black/10 focus:border-selah-blue focus:outline-none transition-all duration-500 content-h3 text-selah-dark placeholder-selah-muted/30 resize-none" placeholder={t("Tell us more about your inquiry...", "Cuéntanos más sobre tu consulta...")} />
        </div>
        <Button icon={MessageSquare} className="w-full md:w-auto !bg-selah-orange hover:!bg-[#e65300] !text-white !border-none !py-4 !px-10 ui-button shadow-[0_20px_40px_-15px_rgba(255,92,0,0.4)] hover:shadow-[0_30px_60px_-15px_rgba(255,92,0,0.6)] transition-all duration-500 hover:scale-[1.02] mt-8 rounded-full">
          {t("Send Message", "Enviar Mensaje")}
        </Button>
      </form>
    </motion.div>
  );
};
