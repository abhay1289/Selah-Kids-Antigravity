'use client';

/**
 * Field resolver hook for CMS-backed page content.
 *
 * Each public-page section component takes an optional `fields?: PageFieldMap`
 * prop. When the map has an entry for the requested key, the admin-edited
 * value wins; otherwise the hardcoded literal passed as fallback is returned.
 *
 * This fallback-through behavior is what lets Phase 4 ship with zero visual
 * change before seeding: the DB is empty, `getPageContent` returns the
 * INITIAL_PAGE_* constant (which is itself derived from the same hardcoded
 * literals), and every section renders exactly as it did before migration.
 *
 * Key convention: `<sectionId>.<fieldId>`, e.g. 'hero.hero_description'.
 * Keys must match the admin editor's `keyFor()` output so admin edits land
 * at the same key the public page reads from.
 */

import { useLanguage } from '../contexts/LanguageContext';
import type { PageFieldMap } from './cms-server';

export type FieldResolver = (key: string, fallbackEn: string, fallbackEs: string) => string;

export function useFieldResolver(fields?: PageFieldMap): FieldResolver {
  const { language } = useLanguage();
  return (key, fallbackEn, fallbackEs) => {
    const entry = fields?.[key];
    const value = entry ? (language === 'EN' ? entry.en : entry.es) : undefined;
    // Treat missing, null/non-string, AND empty-string values as "use fallback".
    // Empty string protects against admin clearing a field by accident leaving
    // the public page with a blank element; if a field is legitimately meant
    // to be empty, remove its `f()` wire rather than saving "" in the DB.
    if (typeof value === 'string' && value.length > 0) return value;
    return language === 'EN' ? fallbackEn : fallbackEs;
  };
}
