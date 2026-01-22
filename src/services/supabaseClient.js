import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
    console.warn(
        '⚠️ Supabase not configured. Please create a .env file with:\n' +
        'VITE_SUPABASE_URL=your_supabase_url\n' +
        'VITE_SUPABASE_ANON_KEY=your_supabase_anon_key\n\n' +
        'See .env.example for reference.'
    );
}

// Create client only if configured, otherwise create a mock that won't crash
export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
