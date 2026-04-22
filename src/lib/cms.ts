import { supabase } from './supabase';

/**
 * CMS Bridge Layer
 * Fetches content from Supabase for the public site.
 * If Supabase is unavailable, returns null so components can fall back to static data.
 */

export interface SiteSettings {
  id: string;
  site_title: string;
  meta_description: string;
  meta_description_es: string;
  logo_url: string;
  footer_tagline: string;
  footer_tagline_es: string;
  footer_email: string;
  youtube_url_en: string;
  youtube_url_es: string;
  instagram_url_en: string;
  instagram_url_es: string;
  spotify_url: string;
  apple_music_url: string;
  updated_at: string;
}

export interface PageContent {
  id: string;
  page: string;
  section: string;
  field: string;
  value_en: string;
  value_es: string;
  field_type: 'text' | 'textarea' | 'richtext' | 'image' | 'url' | 'color' | 'number';
  sort_order: number;
  is_published: boolean;
  updated_at: string;
}

export interface CollectionItem {
  id: string;
  collection: string;
  data: Record<string, unknown>;
  sort_order: number;
  is_published: boolean;
  updated_at: string;
}

// ─── Site Settings ───────────────────────────────────────────
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>) {
  const { data, error } = await supabase
    .from('site_settings')
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq('id', 'global')
    .select()
    .single();
  return { data, error };
}

// ─── Page Content ────────────────────────────────────────────
export async function getPageContent(page: string): Promise<PageContent[]> {
  try {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page', page)
      .eq('is_published', true)
      .order('sort_order');
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

export async function getAllPageContent(page: string): Promise<PageContent[]> {
  try {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page', page)
      .order('sort_order');
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

export async function upsertPageContent(content: Partial<PageContent>) {
  const { data, error } = await supabase
    .from('page_content')
    .upsert({
      ...content,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  return { data, error };
}

// ─── Collections (Videos, Testimonials, Team, etc.) ──────────
export async function getCollection(collection: string): Promise<CollectionItem[]> {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('collection', collection)
      .eq('is_published', true)
      .order('sort_order');
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

export async function getAllCollectionItems(collection: string): Promise<CollectionItem[]> {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('collection', collection)
      .order('sort_order');
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

export async function upsertCollectionItem(item: Partial<CollectionItem>) {
  const { data, error } = await supabase
    .from('collections')
    .upsert({
      ...item,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  return { data, error };
}

export async function deleteCollectionItem(id: string) {
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id);
  return { error };
}

// ─── Media Upload ────────────────────────────────────────────
export async function uploadMedia(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('media')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });
  
  if (error) return { url: null, error };
  
  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(data.path);
  
  return { url: publicUrl, error: null };
}
