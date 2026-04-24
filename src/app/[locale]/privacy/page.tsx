'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageShell } from '@/components/design';

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <PageShell mainClassName="pt-36 md:pt-44 pb-16" spineStops={{ stopsCx1: ['30%', '50%', '70%'], stopsCy1: ['22%', '40%', '58%'], stopsCx2: ['70%', '50%', '30%'], stopsCy2: ['72%', '58%', '42%'] }}>
      <div className="max-w-3xl mx-auto px-6">
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
    </PageShell>
  );
}
