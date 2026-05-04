import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create client only if credentials are available
let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Create a mock client that won't crash — dashboard runs in "offline" mode
  // All CMS calls will gracefully return null/empty arrays
  console.warn('[Selah CMS] Supabase not configured. Dashboard running in offline mode.');
  supabase = {
    auth: {
      signInWithPassword: async () => ({ data: { user: { email: 'admin@selahkids.com' }, session: {} }, error: null }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: { user: { email: 'admin@selahkids.com' } } }, error: null }),
      getUser: async () => ({ data: { user: { email: 'admin@selahkids.com', id: 'offline' } }, error: null }),
    },
    from: () => ({
      select: () => ({ single: async () => ({ data: null, error: null }), eq: () => ({ order: () => ({ data: [], error: null }), single: async () => ({ data: null, error: null }), data: [], error: null }), order: () => ({ data: [], error: null }), data: [], error: null }),
      update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
      upsert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
      delete: () => ({ eq: async () => ({ error: null }) }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: { message: 'Offline mode' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  } as any;
}

export { supabase };

// Server-side client with service role (for admin operations)
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!supabaseUrl || !serviceRoleKey) return supabase; // fallback to regular client
  return createClient(supabaseUrl, serviceRoleKey);
}
