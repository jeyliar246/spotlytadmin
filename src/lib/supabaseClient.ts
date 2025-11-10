import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabase: SupabaseClient | null = null;
let supabaseInitError: string | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  supabaseInitError = 'Supabase credentials are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase, supabaseInitError };
