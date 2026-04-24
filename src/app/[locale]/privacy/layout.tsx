import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/cms-server';
import { isLocale } from '@/lib/i18n';

/**
 * Folder-level metadata wrapper.
 *
 * The page itself is `'use client'` (it hooks into LanguageContext for
 * inline EN/ES copy), which means it cannot export `generateMetadata`
 * directly — client components aren't allowed to. Putting the metadata
 * export here in a server-only layout gives us CMS-driven SEO without
 * having to restructure the page into a server wrapper + client child.
 */
interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata('/privacy', isLocale(locale) ? locale : 'en');
}

export default function PrivacyLayout({ children }: LayoutProps) {
  return children;
}
