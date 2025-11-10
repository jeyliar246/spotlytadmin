import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = import.meta.env as Record<string, string | undefined>;

const supabaseUrl = env.VITE_SUPABASE_URL ?? env.SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY ?? env.SUPABASE_KEY;

let supabase: SupabaseClient | null = null;
let supabaseInitError: string | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  supabaseInitError =
    'Supabase credentials are missing. Set either VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY or SUPABASE_URL/SUPABASE_KEY.';
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase, supabaseInitError };
