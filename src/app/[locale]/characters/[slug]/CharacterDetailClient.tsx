'use client';

import React from 'react';
import { PageShell, LanguageCrossPromo } from '@/components/design';
import CharacterHero from '@/components/characters/CharacterHero';
import CharacterVerse from '@/components/characters/CharacterVerse';
import CharacterEpisodes from '@/components/characters/CharacterEpisodes';
import { pairedCharacterSlug, type Character } from '@/data/characters';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Client wrapper for the character detail route. The parent Server
 * Component handles CMS fetch + slug lookup; this file owns the shell
 * so PageShell's client-only hooks (useScroll + useRef) stay on the
 * client side of the boundary.
 *
 * Takes the full `allCharacters` list so the language cross-promo can
 * compute the paired slug without issuing a second fetch.
 */
export default function CharacterDetailClient({
  character,
  allCharacters,
}: {
  character: Character;
  allCharacters: Character[];
}) {
  const { language } = useLanguage();
  const targetLocale: 'en' | 'es' = language === 'EN' ? 'es' : 'en';
  const pair = pairedCharacterSlug(allCharacters, character.slug, targetLocale);
  const pairedPath = pair ? `/characters/${pair}` : undefined;

  return (
    <PageShell mainClassName="pt-36 md:pt-44 pb-16">
      <CharacterHero character={character} />
      <CharacterVerse character={character} />
      <CharacterEpisodes character={character} />
      <div className="max-w-4xl mx-auto mt-12 mb-8 px-6">
        <LanguageCrossPromo pairedPath={pairedPath} />
      </div>
    </PageShell>
  );
}
