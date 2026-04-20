'use client';

import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Syncs the <html lang> attribute with the current language selection.
 * This ensures screen readers, search engines, and browser tools
 * always see the correct language for the current content.
 */
export function LanguageSync() {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language === 'EN' ? 'en' : 'es';
  }, [language]);

  return null;
}
