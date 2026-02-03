import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail gracefully if environment variables are not set
// This allows the UI to render even if the backend isn't connected yet
let supabaseClient;

try {
  const url = supabaseUrl;
  const key = supabaseAnonKey;

  if (!url || !key) {
    console.error('Supabase keys are missing in .env');
  } else if (!url.startsWith('http')) {
    console.error('Supabase URL seems invalid (must start with http/https)');
  }

  // Use provided keys or fallbacks to prevent crash
  // If url is bogus, createClient might throw or return a client that fails requests
  const validUrl = url && url.startsWith('http') ? url : 'https://placeholder.supabase.co';
  const validKey = key || 'placeholder-key';

  supabaseClient = createClient(validUrl, validKey);
} catch (error) {
  console.error('Supabase client initialization failed:', error);
  // Fallback to a valid-ish client or null to prevent crash, though usage will fail
  supabaseClient = createClient('https://placeholder.supabase.co', 'placeholder-key');
}

export const supabase = supabaseClient;
