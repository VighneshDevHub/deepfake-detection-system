import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

if (!supabaseUrl || !supabaseKey) {
  if (process.env.NODE_ENV === 'production') {
    // During production build, we don't want to crash if env vars are missing
    // but we should still warn. Vercel builds often run without these vars
    // unless explicitly added to the dashboard.
    console.warn('Supabase credentials are missing during build.');
  } else {
    console.warn('Supabase credentials are missing. Auth and database features will not work.');
  }
}

// Only create the client if we have the required credentials to avoid throwing during build
// We use a Proxy as a fallback to prevent "cannot read property of null" errors
// during Next.js static generation/prerendering.
export const supabase = (supabaseUrl && supabaseKey) 
  ? createBrowserClient(supabaseUrl, supabaseKey)
  : new Proxy({}, {
      get: (target, prop) => {
        // Return a function that returns an object with nested proxy for chained calls
        return () => new Proxy({}, { get: () => () => ({ data: null, error: null }) });
      }
    }) as any;
