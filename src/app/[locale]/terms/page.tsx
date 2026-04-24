'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageShell } from '@/components/design';

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <PageShell mainClassName="pt-36 md:pt-44 pb-16" spineStops={{ stopsCx1: ['30%', '50%', '70%'], stopsCy1: ['22%', '40%', '58%'], stopsCx2: ['70%', '50%', '30%'], stopsCy2: ['72%', '58%', '42%'] }}>
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="w-20 h-20 bg-selah-orange/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8">
            <FileText size={40} className="text-selah-orange" />
          </div>
          <h1 className="hero-headline mb-6 tracking-tight text-center">
            {t("Terms of Service", "Términos de Servicio")}
          </h1>
          <div className="body-text !max-w-none space-y-6">
            <p>
              {t(
                "Welcome to Selah Kids. By accessing or using our website, you agree to be bound by these terms of service.",
                "Bienvenido a Selah Kids. Al acceder o usar nuestro sitio web, usted acepta estar sujeto a estos términos de servicio."
              )}
            </p>
            <h2 className="content-h3 !text-selah-dark">{t("Use of Content", "Uso del Contenido")}</h2>
            <p>
              {t(
                "All content on Selah Kids, including videos, music, illustrations, and text, is the property of Selah Kids and is protected by copyright laws. You may view and share our content for personal, non-commercial use.",
                "Todo el contenido de Selah Kids, incluidos videos, música, ilustraciones y texto, es propiedad de Selah Kids y está protegido por leyes de derechos de autor. Puede ver y compartir nuestro contenido para uso personal y no comercial."
              )}
            </p>
            <h2 className="content-h3 !text-selah-dark">{t("User Conduct", "Conducta del Usuario")}</h2>
            <p>
              {t(
                "We expect all users to interact with our platform respectfully. Any content that is harmful, offensive, or inappropriate will not be tolerated.",
                "Esperamos que todos los usuarios interactúen con nuestra plataforma de manera respetuosa. No se tolerará contenido dañino, ofensivo o inapropiado."
              )}
            </p>
            <h2 className="content-h3 !text-selah-dark">{t("Changes to Terms", "Cambios en los Términos")}</h2>
            <p>
              {t(
                "We reserve the right to update these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.",
                "Nos reservamos el derecho de actualizar estos términos en cualquier momento. El uso continuado del sitio web después de los cambios constituye la aceptación de los nuevos términos."
              )}
            </p>
            <h2 className="content-h3 !text-selah-dark">{t("Contact", "Contacto")}</h2>
            <p>
              {t(
                "For questions about these terms, please reach out to info.selahkids@gmail.com.",
                "Para preguntas sobre estos términos, comuníquese con info.selahkids@gmail.com."
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}
