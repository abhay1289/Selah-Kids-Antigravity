import { createBrowserClient } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  // Browser client from @supabase/ssr writes auth to cookies, so middleware and
  // server actions (which use createServerClient from the same lib) can read the
  // same session. Using createClient from supabase-js would store auth in
  // localStorage and leave server-side guards seeing the user as anonymous,
  // causing /admin redirect loops once a real Supabase project is wired up.
  supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
} else {
  // Offline mode: no credentials. Return a mock so pages don't crash during dev
  // and so the dashboard can be explored without a live DB. All read calls
  // resolve to empty/null; all writes silently succeed.
  console.warn('[Selah CMS] Supabase not configured. Dashboard running in offline mode.');

  const offlineUser = { email: 'admin@selahkids.com', id: 'offline' };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock shape
  // is intentionally a partial match for SupabaseClient; fully typing every
  // nested builder is not worth the noise for a no-op fallback.
  const mock: any = {
    auth: {
      signInWithPassword: async () => ({
        data: { user: offlineUser, session: {} },
        error: null,
      }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({
        data: { session: { user: offlineUser } },
        error: null,
      }),
      getUser: async () => ({ data: { user: offlineUser }, error: null }),
    },
    from: () => ({
      select: () => ({
        single: async () => ({ data: null, error: null }),
        eq: () => ({
          order: () => ({ data: [], error: null }),
          single: async () => ({ data: null, error: null }),
          data: [],
          error: null,
        }),
        order: () => ({ data: [], error: null }),
        data: [],
        error: null,
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
      }),
      upsert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
      delete: () => ({ eq: async () => ({ error: null }) }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: { message: 'Offline mode' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  };
  supabase = mock as SupabaseClient;
}

export { supabase };

// Service-role client for server-side admin ops that need to bypass RLS.
// Keep this server-only — never import from a 'use client' module.
export function createAdminClient(): SupabaseClient {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!supabaseUrl || !serviceRoleKey) return supabase;
  return createClient(supabaseUrl, serviceRoleKey);
}
