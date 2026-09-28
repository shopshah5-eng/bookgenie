// Browser Supabase client. This returns null when authentication is not configured
// so the public pages can still render without pretending auth is available.
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './config';

export function createClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config) return null;

  return createBrowserClient(config.url, config.anonKey);
}
