// Server Supabase client that reads/writes the user's auth cookies.
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { requireSupabaseConfig } from './config';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = requireSupabaseConfig();

  return createServerClient(url, anonKey, {
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
          // Server components may expose read-only cookies. Route handlers can write them.
        }
      },
    },
  });
}

export async function getAuthenticatedUser(req?: Request) {
  const sessionClient = await createServerSupabaseClient();
  const authHeader = req?.headers.get('authorization');
  const bearerToken = authHeader?.replace(/^Bearer\s+/i, '').trim();

  if (bearerToken) {
    const { data: { user }, error } = await sessionClient.auth.getUser(bearerToken);
    if (user && !error) {
      return { user, sessionClient, error: null };
    }
  }

  const { data: { user }, error } = await sessionClient.auth.getUser();
  return { user: error ? null : user, sessionClient, error: user ? null : error };
}
