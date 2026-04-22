'use client';

/**
 * CMS wiring hooks with offline fallback.
 *
 * These hooks replace the admin pages' hardcoded `useState(INITIAL_*)` pattern
 * with one that:
 *
 *   1. Reads from Supabase (via src/lib/cms.ts) when env vars are set (live mode)
 *   2. Falls back to the provided `fallback` constant when no CMS data exists
 *   3. Persists to localStorage in offline mode so demo edits survive refresh
 *   4. Exposes a `save()` that returns a promise, so admin "Save" buttons can
 *      show `isSaving` state during real network calls
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getAllCollectionItems,
  getSiteSettings,
  getAllPageContent,
  upsertCollectionItem,
  updateSiteSettings,
  upsertPageContent,
  deleteCollectionItem,
  type CollectionItem,
  type SiteSettings,
  type PageContent,
} from './cms';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const isOfflineMode = !SUPABASE_URL || !SUPABASE_ANON;

// ───────────────────────────────────────────────────────────
// localStorage helpers (offline demo persistence)
// ───────────────────────────────────────────────────────────

function readLocal<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded / serialization failure — surface as a thrown error so
    // the caller can show a toast rather than silently losing edits.
    throw new Error('Failed to persist to localStorage.');
  }
}

// ───────────────────────────────────────────────────────────
// useCmsCollection — list of items with the same shape (blog, videos, etc.)
// ───────────────────────────────────────────────────────────

export interface UseCmsCollection<T extends { id: string }> {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  save: () => Promise<void>;
  mode: 'live' | 'offline';
}

/**
 * @param collection   Collection name in Supabase (e.g. 'blog_posts', 'videos')
 * @param fallback     Starting data when nothing is persisted yet
 * @param options      Additional behaviour
 */
export function useCmsCollection<T extends { id: string }>(
  collection: string,
  fallback: T[],
  options: { sortOrder?: boolean } = {},
): UseCmsCollection<T> {
  const [items, setItems] = useState<T[]>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track the baseline loaded from the backing store so save() can compute
  // deletions. Without this, removing an item locally wouldn't be reflected
  // in the DB.
  const baselineRef = useRef<T[]>(fallback);
  const storageKey = `selah-cms:${collection}`;

  // Load once on mount
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (isOfflineMode) {
          const local = readLocal<T[]>(storageKey);
          const next = local ?? fallback;
          if (!cancelled) {
            setItems(next);
            baselineRef.current = next;
          }
        } else {
          const rows = await getAllCollectionItems(collection);
          if (rows.length === 0) {
            // Empty DB → seed with fallback so the editor isn't blank
            if (!cancelled) {
              setItems(fallback);
              baselineRef.current = [];
            }
          } else {
            // data JSONB column stores the item; id is stored separately, but
            // we also write it inside data so admin UI doesn't lose the id.
            const unpacked = rows.map((row) => {
              const d = row.data as Record<string, unknown>;
              return { ...(d as object), id: (d.id as string) ?? row.id } as T;
            });
            if (!cancelled) {
              setItems(unpacked);
              baselineRef.current = unpacked;
            }
          }
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Load failed');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  const save = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      if (isOfflineMode) {
        writeLocal(storageKey, items);
        baselineRef.current = items;
      } else {
        // Diff against baseline — delete rows removed locally, upsert the rest.
        const currentIds = new Set(items.map((i) => i.id));
        const toDelete = baselineRef.current.filter((b) => !currentIds.has(b.id));

        for (const doomed of toDelete) {
          const { error: delErr } = await deleteCollectionItem(doomed.id);
          if (delErr) throw delErr;
        }

        let order = 0;
        for (const item of items) {
          const { error: upErr } = await upsertCollectionItem({
            id: item.id,
            collection,
            data: { ...(item as unknown as Record<string, unknown>) },
            sort_order: options.sortOrder !== false ? order : 0,
            is_published: true,
          });
          if (upErr) throw upErr;
          order += 1;
        }

        baselineRef.current = items;
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Save failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSaving(false);
    }
  }, [collection, items, options.sortOrder, storageKey]);

  return { items, setItems, isLoading, isSaving, error, save, mode: isOfflineMode ? 'offline' : 'live' };
}

// ───────────────────────────────────────────────────────────
// useCmsSiteSettings — single global row in site_settings
// ───────────────────────────────────────────────────────────

export interface UseCmsSiteSettings<T> {
  settings: T;
  setSettings: React.Dispatch<React.SetStateAction<T>>;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  save: () => Promise<void>;
  mode: 'live' | 'offline';
}

export function useCmsSiteSettings<T>(fallback: T): UseCmsSiteSettings<T> {
  const [settings, setSettings] = useState<T>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const storageKey = 'selah-cms:site_settings';

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (isOfflineMode) {
          const local = readLocal<T>(storageKey);
          if (!cancelled) setSettings(local ?? fallback);
        } else {
          const row = await getSiteSettings();
          if (!cancelled) setSettings((row as unknown as T) ?? fallback);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Load failed');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      if (isOfflineMode) {
        writeLocal(storageKey, settings);
      } else {
        const { error: upErr } = await updateSiteSettings(
          settings as unknown as Partial<SiteSettings>,
        );
        if (upErr) throw upErr;
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Save failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSaving(false);
    }
  }, [settings]);

  return { settings, setSettings, isLoading, isSaving, error, save, mode: isOfflineMode ? 'offline' : 'live' };
}

// ───────────────────────────────────────────────────────────
// useCmsPageContent — key/value per-page fields (home, about, etc.)
// ───────────────────────────────────────────────────────────

/**
 * The page_content table stores one row per editable field as
 * (page, section, field, value_en, value_es). The admin page supplies a
 * fallback shape keyed by dotted `section.field` strings; the hook reads
 * those rows and returns a flat Record<string, { en, es }> indexed the same
 * way so existing editors can keep their form structure.
 */
export interface PageField {
  en: string;
  es: string;
}
export type PageFieldMap = Record<string, PageField>;

export interface UseCmsPageContent {
  fields: PageFieldMap;
  setField: (key: string, value: PageField) => void;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  save: () => Promise<void>;
  mode: 'live' | 'offline';
}

export function useCmsPageContent(page: string, fallback: PageFieldMap): UseCmsPageContent {
  const [fields, setFields] = useState<PageFieldMap>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const storageKey = `selah-cms:page:${page}`;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (isOfflineMode) {
          const local = readLocal<PageFieldMap>(storageKey);
          if (!cancelled) setFields(local ?? fallback);
        } else {
          const rows = await getAllPageContent(page);
          if (rows.length === 0) {
            if (!cancelled) setFields(fallback);
          } else {
            const map: PageFieldMap = {};
            for (const row of rows) {
              map[`${row.section}.${row.field}`] = {
                en: row.value_en,
                es: row.value_es,
              };
            }
            // Merge DB rows over fallback so newly-added fields in code still appear
            if (!cancelled) setFields({ ...fallback, ...map });
          }
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Load failed');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const setField = useCallback((key: string, value: PageField) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  const save = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      if (isOfflineMode) {
        writeLocal(storageKey, fields);
      } else {
        let order = 0;
        for (const [key, value] of Object.entries(fields)) {
          const [section, field] = key.split('.', 2);
          const { error: upErr } = await upsertPageContent({
            page,
            section,
            field,
            value_en: value.en,
            value_es: value.es,
            sort_order: order,
            is_published: true,
          } as Partial<PageContent>);
          if (upErr) throw upErr;
          order += 1;
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Save failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSaving(false);
    }
  }, [fields, page]);

  return { fields, setField, isLoading, isSaving, error, save, mode: isOfflineMode ? 'offline' : 'live' };
}

// Re-export types for convenience
export type { CollectionItem, SiteSettings, PageContent };
