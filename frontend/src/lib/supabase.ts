import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials are missing. Auth and database features will not work.');
}

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);
