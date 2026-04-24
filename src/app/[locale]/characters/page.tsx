import type { Metadata } from 'next';
import { getCollection, getSeoMetadata } from '@/lib/cms-server';
import { INITIAL_CHARACTERS } from '@/data/cms-fallbacks';
import type { Character } from '@/data/characters';
import { isLocale } from '@/lib/i18n';
import CharactersListClient from './CharactersListClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata('/characters', isLocale(locale) ? locale : 'en');
}

/**
 * Characters list — server component, CMS-driven.
 *
 * Fetches the full characters collection via `getCollection('characters',
 * INITIAL_CHARACTERS)` so admin edits land on the live site without a
 * deploy. Rendering lives in the client wrapper so PageShell's scroll
 * hooks and framer-motion primitives stay on the client boundary.
 */
export default async function CharactersPage() {
  const characters = await getCollection<Character>('characters', INITIAL_CHARACTERS);
  return <CharactersListClient characters={characters} />;
}
