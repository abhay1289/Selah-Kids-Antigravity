"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { Badge, Button } from '../UI';

export const ParentsCommunity = () => {
  const { t } = useLanguage();
  const router = useRouter();
  return (
    <section className="max-w-4xl mx-auto px-6 mb-24 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
        {/* At-Home Resources */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="bg-white rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 hover:border-[#00BFFF]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,191,255,0.15)] transition-all duration-500 group"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#00BFFF]/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
            <Download size={32} className="text-[#00BFFF]" />
          </div>
          <Badge color="light" className="mb-4 text-[#00BFFF] border-[#00BFFF]/20 bg-[#00BFFF]/5">{t("FREE RESOURCES", "RECURSOS GRATUITOS")}</Badge>
          <h3 className="content-h3 mb-4">{t("Selah at Home", "Selah en Casa")}</h3>
          <p className="body-text mb-8">
            {t(
              "Extend the impact beyond the screen with free coloring pages, devotional guides, and family discussion questions.",
              "Extiende el impacto más allá de la pantalla con páginas para colorear gratuitas, guías devocionales y preguntas de discusión."
            )}
          </p>
          <Button variant="outline" className="w-full justify-between group-hover:border-[#00BFFF] group-hover:text-[#00BFFF] transition-colors" onClick={() => router.push('/resources')}>
            {t("Download Activities", "Descargar Actividades")}
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          className="bg-selah-dark text-white rounded-[2.5rem] p-10 shadow-xl overflow-hidden relative group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-selah-orange/20 rounded-full blur-[60px] pointer-events-none group-hover:scale-150 transition-transform duration-700" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <Mail size={32} className="text-selah-orange" />
            </div>
            <Badge color="orange" className="mb-4 bg-white/10 border-white/20 text-selah-orange hover:bg-white/20">{t("JOIN COMMUNITY", "ÚNETE A LA COMUNIDAD")}</Badge>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight font-outfit mb-4">{t("The Parenting Edit", "Boletín para Padres")}</h3>
            <p className="text-white/70 font-medium mb-8">
              {t(
                "A monthly, no-fluff email with media recommendations, encouragement, and early access to new Selah Kids releases.",
                "Un correo mensual sin rodeos con recomendaciones de medios, aliento y acceso anticipado al contenido de Selah Kids."
              )}
            </p>
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={t("Your email address", "Tu correo electrónico")} 
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-selah-orange focus:border-transparent transition-all"
              />
              <Button className="w-full justify-center bg-selah-orange hover:bg-selah-orange/90 text-white shadow-[0_0_20px_rgba(255,127,80,0.4)]">
                {t("Subscribe", "Suscribirse")}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
