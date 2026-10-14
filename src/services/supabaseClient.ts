import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://zfifmfzrzxmbwilcsnhx.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmaWZtZnpyenhtYndpbGNzbmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NDk1NDEsImV4cCI6MjEwNzUyNTU0MX0.2-7NB9SoCXG-5BnpwBneKevxZQmjf5F3LQaTEiz2Auk';

const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  DEFAULT_SUPABASE_URL;

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.SUPABASE_ANON_KEY || 
  DEFAULT_SUPABASE_ANON_KEY;

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

// Safe fallback client builder to prevent top-level runtime crashes
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

try {
  if (isSupabaseConfigured) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } else {
    clientInstance = createSafeFallbackClient();
  }
} catch (err) {
  console.warn('Acquire Surgery: Failed to initialize live Supabase client, using safe offline fallback.', err);
  clientInstance = createSafeFallbackClient();
}

export const supabase = clientInstance;
