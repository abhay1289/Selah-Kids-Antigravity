import React from 'react';
import { Badge } from '../UI';
import { useLanguage } from '../../contexts/LanguageContext';

export const DonateHero = () => {
  const { t } = useLanguage();
  return (
    <section className="text-center px-6 mb-12 relative z-10">
      <Badge color="orange" className="mb-8 shadow-sm bg-white border border-selah-orange/20">{t("MAKE A DIFFERENCE", "HAZ LA DIFERENCIA")}</Badge>
      <h1 className="hero-headline mb-6 tracking-tight leading-[1.1] drop-shadow-sm">
        {t("Support", "Apoya")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-selah-orange to-selah-pink">Selah Kids</span>
      </h1>
      <p className="body-text max-w-3xl mx-auto leading-relaxed tracking-tight mb-8">
        {t(
          "Your generosity helps us create high-quality, faith-filled content that teaches children about God's love.",
          "Tu generosidad nos ayuda a crear contenido de alta calidad y lleno de fe que enseña a los niños sobre el amor de Dios."
        )}
      </p>
    </section>
  );
};
