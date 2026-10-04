import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Checks if real user credentials have been provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here'
);

// Exports real Supabase client if configured, otherwise null
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as ReturnType<typeof createClient>);
