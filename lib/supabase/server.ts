// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://olewesighfxtgmflllgh.supabase.co';
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    Buffer.from('ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW05c1pYZGxjMmxuYUdaNGRHZHRabXhzYkdkb0lpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzT1RBd056STJNREFzSW1WNGNDSTZNakV3TlRZME9EWXdNSDAuVEU2U2Q0eVBCTE9YM1MwSk1RVmN2UDV1SUFJTFNpam1lMWxWS0lVSjd4Yw==', 'base64').toString('ascii');

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Can be ignored if called from Server Component
        }
      },
    },
  });
}
