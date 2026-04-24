import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/cms-server';
import { isLocale } from '@/lib/i18n';

/**
 * Folder-level metadata wrapper — see privacy/layout.tsx for rationale.
 * Same pattern: client page can't export metadata, so a server-only
 * layout owns the SEO surface.
 */
interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata('/terms', isLocale(locale) ? locale : 'en');
}

export default function TermsLayout({ children }: LayoutProps) {
  return children;
}
