import { notFound } from 'next/navigation';
import { getCollection } from '@/lib/cms-server';
import { INITIAL_CHARACTERS } from '@/data/cms-fallbacks';
import type { Character } from '@/data/characters';
import CharacterDetailClient from './CharacterDetailClient';

/**
 * Character detail — server component, Phase 3 CMS-driven.
 *
 * Reads the characters collection once per render and matches on slug.
 * The shell + sub-section rendering lives in the client wrapper so
 * PageShell's client-only hooks have somewhere to mount.
 */

interface CharacterSlugPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function CharacterSlugPage({ params }: CharacterSlugPageProps) {
  const { slug } = await params;
  const characters = await getCollection<Character>('characters', INITIAL_CHARACTERS);
  const character = characters.find((c) => c.slug === slug);
  if (!character) notFound();
  return <CharacterDetailClient character={character} />;
}
