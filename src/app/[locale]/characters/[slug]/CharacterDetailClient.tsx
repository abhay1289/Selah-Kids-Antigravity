'use client';

import React from 'react';
import { PageShell } from '@/components/design';
import CharacterHero from '@/components/characters/CharacterHero';
import CharacterVerse from '@/components/characters/CharacterVerse';
import CharacterEpisodes from '@/components/characters/CharacterEpisodes';
import type { Character } from '@/data/characters';

/**
 * Client wrapper for the character detail route. The parent Server
 * Component handles CMS fetch + slug lookup; this file owns the shell
 * so PageShell's client-only hooks (useScroll + useRef) stay on the
 * client side of the boundary.
 */
export default function CharacterDetailClient({ character }: { character: Character }) {
  return (
    <PageShell mainClassName="pt-36 md:pt-44 pb-16">
      <CharacterHero character={character} />
      <CharacterVerse character={character} />
      <CharacterEpisodes character={character} />
    </PageShell>
  );
}
