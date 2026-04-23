'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-b from-[#FFF5EE] via-[#FDFBF7] to-[#F0FAE6] min-h-screen pt-36 md:pt-44 pb-16 relative overflow-hidden selection:bg-selah-orange selection:text-white">
      {/* Vivid Color Washes */}
      <div className="absolute top-0 right-0 w-[50vw] h-[40vh] bg-gradient-to-bl from-[#FF7F50]/8 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[45vw] h-[40vh] bg-gradient-to-tr from-[#93D35C]/8 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[50%] left-[10%] w-[30vw] h-[30vh] bg-[#00BFFF]/5 rounded-full blur-[100px] pointer-events-none" />
      {/* Paper Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="w-20 h-20 bg-selah-orange/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8">
            <Shield size={40} className="text-selah-orange" />
          </div>
          <h1 className="hero-headline mb-6 tracking-tight text-center">
            {t("Privacy Policy", "Política de Privacidad")}
          </h1>
          <div className="body-text !max-w-none space-y-6">
            <p>
              {t(
                "At Selah Kids, we are committed to protecting the privacy of children and families who use our platform. This privacy policy outlines how we collect, use, and safeguard your information.",
                "En Selah Kids, estamos comprometidos a proteger la privacidad de los niños y las familias que usan nuestra plataforma. Esta política de privacidad describe cómo recopilamos, usamos y protegemos su información."
              )}
            </p>
            <h2 className="content-h3 !text-selah-dark">{t("Information We Collect", "Información que Recopilamos")}</h2>
            <p>
              {t(
                "We collect minimal information necessary to provide our services. This may include email addresses voluntarily submitted through our newsletter signup, and standard analytics data to improve our content.",
                "Recopilamos la información mínima necesaria para proporcionar nuestros servicios. Esto puede incluir direcciones de correo electrónico enviadas voluntariamente a través de nuestro boletín y datos analíticos estándar para mejorar nuestro contenido."
              )}
            </p>
            <h2 className="content-h3 !text-selah-dark">{t("Children's Privacy", "Privacidad de los Niños")}</h2>
            <p>
              {t(
                "We do not knowingly collect personal information from children under 13. Our content is designed for family viewing and we encourage parents to supervise their children's online activities.",
                "No recopilamos intencionalmente información personal de niños menores de 13 años. Nuestro contenido está diseñado para la visualización familiar y alentamos a los padres a supervisar las actividades en línea de sus hijos."
              )}
            </p>
            <h2 className="content-h3 !text-selah-dark">{t("Contact Us", "Contáctanos")}</h2>
            <p>
              {t(
                "If you have any questions about our privacy practices, please contact us at info.selahkids@gmail.com.",
                "Si tiene alguna pregunta sobre nuestras prácticas de privacidad, contáctenos en info.selahkids@gmail.com."
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
