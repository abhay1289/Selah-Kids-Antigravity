"use client";

import { SparklesIcon, Heart, Star } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { MarqueeStrip } from '../design';

export const AboutMarqueeSection = () => {
  const { t } = useLanguage();
  return (
    <MarqueeStrip
      items={[
        { text: t('Joyful', 'Gozoso'), icon: SparklesIcon },
        { text: t('Faith-Filled', 'Lleno de Fe'), icon: Star },
        { text: t('Creative', 'Creativo'), icon: Heart },
      ]}
    />
  );
};
