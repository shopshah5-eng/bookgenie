// Privileged server client using SUPABASE_SERVICE_ROLE_KEY.
// NEVER import or invoke this from a client component or browser bundle.
import { createClient } from '@supabase/supabase-js';
import { requireSupabaseConfig, requireSupabaseServiceRoleKey } from './config';

export function createAdminClient() {
  const { url } = requireSupabaseConfig();
  const serviceRoleKey = requireSupabaseServiceRoleKey();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
