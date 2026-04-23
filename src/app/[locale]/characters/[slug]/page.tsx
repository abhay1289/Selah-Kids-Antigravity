import { notFound } from 'next/navigation';
import { getCollection } from '@/lib/cms-server';
import { INITIAL_CHARACTERS } from '@/data/cms-fallbacks';
import type { Character } from '@/data/characters';
import CharacterHero from '@/components/characters/CharacterHero';
import CharacterVerse from '@/components/characters/CharacterVerse';
import CharacterEpisodes from '@/components/characters/CharacterEpisodes';

/**
 * Character detail — server component, Phase 3 CMS-driven.
 *
 * Reads the characters collection once per render and matches on slug.
 * The three sub-sections (Hero, Verse, Episodes) are already client
 * components that take a Character prop, so no extra split is needed —
 * the data boundary is at this file.
 */

interface CharacterSlugPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function CharacterSlugPage({ params }: CharacterSlugPageProps) {
  const { slug } = await params;
  const characters = await getCollection<Character>('characters', INITIAL_CHARACTERS);
  const character = characters.find((c) => c.slug === slug);
  if (!character) notFound();
  return (
    <div className="bg-gradient-to-b from-[#FFF5EE] via-[#FDFBF7] to-[#F0FAE6] min-h-screen pt-36 md:pt-44 pb-16 relative overflow-hidden">
      <CharacterHero character={character} />
      <CharacterVerse character={character} />
      <CharacterEpisodes character={character} />
    </div>
  );
}
