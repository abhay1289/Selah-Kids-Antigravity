'use client';
import { use } from 'react';
import { notFound } from 'next/navigation';
import { getCharacter } from '@/data/characters';
import CharacterHero from '@/components/characters/CharacterHero';
import CharacterVerse from '@/components/characters/CharacterVerse';
import CharacterEpisodes from '@/components/characters/CharacterEpisodes';

export default function CharacterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const character = getCharacter(slug);
  if (!character) return notFound();
  return (
    <div className="bg-gradient-to-b from-[#FFF5EE] via-[#FDFBF7] to-[#F0FAE6] min-h-screen pt-36 md:pt-44 pb-16 relative overflow-hidden">
      <CharacterHero character={character} />
      <CharacterVerse character={character} />
      <CharacterEpisodes character={character} />
    </div>
  );
}
