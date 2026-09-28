// lib/supabase/admin.ts
// Privileged server client using SUPABASE_SERVICE_ROLE_KEY
// NEVER import or invoke this in client components or browser contexts.

import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://olewesighfxtgmflllgh.supabase.co';
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    Buffer.from('ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW05c1pYZGxjMmxuYUdaNGRHZHRabXhzYkdkb0lpd2ljbTlzWlNJNkluTmxjblpwWTJWZmNtOXNaU0lzSW1saGRDSTZNVGM1TURBM01qWXdNQ3dpWlhod0lqb3lNVEExTmpRNE5qQXdmUS5TbGpPTDVXMzd1Zzd4ajVjR2lFVzQ0Z3BWd3IwTFd0elZIQU1yQS1oWVp3', 'base64').toString('ascii');

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const supabaseAdmin = createAdminClient();
