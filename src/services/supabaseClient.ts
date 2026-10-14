import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validates whether Supabase credentials were provided in the build/deployment environment
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  typeof supabaseUrl === 'string' &&
  typeof supabaseAnonKey === 'string' &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== '' &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
);

// Safe fallback client builder to prevent top-level runtime crashes when deployed without env vars
function createSafeFallbackClient(): any {
  const chainable = () => {
    const obj: any = {
      select: () => obj,
      insert: () => obj,
      update: () => obj,
      delete: () => obj,
      eq: () => obj,
      neq: () => obj,
      ilike: () => obj,
      like: () => obj,
      order: () => obj,
      limit: () => obj,
      single: async () => ({ data: null, error: null }),
      then: (resolve: any) => Promise.resolve({ data: [], error: null }).then(resolve),
    };
    return obj;
  };

  return {
    from: () => chainable(),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  };
}

let clientInstance: SupabaseClient;

if (isSupabaseConfigured) {
  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Acquire Surgery: Failed to initialize Supabase client, using safe offline fallback.', err);
    clientInstance = createSafeFallbackClient();
  }
} else {
  // Graceful fallback for static deployments (e.g. Vercel) where env vars may not yet be defined
  console.info('Acquire Surgery: Running with local resilient state (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set).');
  clientInstance = createSafeFallbackClient();
}

export const supabase = clientInstance;
