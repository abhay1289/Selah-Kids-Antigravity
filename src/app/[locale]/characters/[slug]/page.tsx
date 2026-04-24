import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCollection } from '@/lib/cms-server';
import { INITIAL_CHARACTERS } from '@/data/cms-fallbacks';
import { resolveCharacter, pairedCharacterSlug, type Character } from '@/data/characters';
import { isLocale } from '@/lib/i18n';
import { SITE_ORIGIN } from '@/data/chrome-seo';
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

/**
 * Per-character metadata — title, description, canonical, hreflang, OG
 * derived from the character row. Uses the short origin story as the
 * meta description (truncated to ~155 chars to fit SERP snippets).
 */
export async function generateMetadata({ params }: CharacterSlugPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const resolvedLocale = isLocale(locale) ? locale : 'en';
  const characters = await getCollection<Character>('characters', INITIAL_CHARACTERS);
  const character = resolveCharacter(characters, slug, resolvedLocale);
  if (!character) return {};

  const role = resolvedLocale === 'es' ? (character.roleEs || character.role) : character.role;
  const origin = resolvedLocale === 'es'
    ? (character.originStory.es || character.originStory.en)
    : (character.originStory.en || character.originStory.es);
  const title = `${character.name} — ${role}`;
  const description = (origin || '').replace(/\s+/g, ' ').trim().slice(0, 155);

  const enSlug = character.slugEn || character.slug;
  const esSlug = character.slugEs || character.slug;
  const enUrl = `${SITE_ORIGIN}/en/characters/${enSlug}`;
  const esUrl = `${SITE_ORIGIN}/es/characters/${esSlug}`;
  const canonical = resolvedLocale === 'es' ? esUrl : enUrl;
  const ogImage = character.posePng.startsWith('http')
    ? character.posePng
    : `${SITE_ORIGIN}${character.posePng.startsWith('/') ? '' : '/'}${character.posePng}`;

  const paired = pairedCharacterSlug(characters, character.slug, resolvedLocale === 'es' ? 'en' : 'es');
  const languages: Record<string, string> = { [resolvedLocale]: canonical };
  if (paired) {
    languages[resolvedLocale === 'es' ? 'en' : 'es'] = resolvedLocale === 'es' ? enUrl : esUrl;
    languages['x-default'] = enUrl;
  }

  return {
    title: { absolute: `${title} | Selah Kids` },
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      type: 'profile',
      url: canonical,
      siteName: 'Selah Kids',
      images: [{ url: ogImage }],
      locale: resolvedLocale === 'es' ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CharacterSlugPage({ params }: CharacterSlugPageProps) {
  const { slug, locale } = await params;
  const resolvedLocale = isLocale(locale) ? locale : 'en';
  const characters = await getCollection<Character>('characters', INITIAL_CHARACTERS);
  const character = resolveCharacter(characters, slug, resolvedLocale);
  if (!character) notFound();
  return <CharacterDetailClient character={character} allCharacters={characters} />;
}
