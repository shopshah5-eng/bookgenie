import { getAuthenticatedUser } from '@/lib/supabase/server';

export interface AdminAuthResult {
  isAdmin: boolean;
  user: {
    id: string;
    email?: string;
  } | null;
  error?: string;
}

/**
 * Checks whether the currently authenticated user has admin privileges.
 * Controlled by the ADMIN_EMAILS environment variable (comma-separated).
 */
export async function isCurrentUserAdmin(req?: Request): Promise<AdminAuthResult> {
  const { user, error } = await getAuthenticatedUser(req);

  if (error || !user || !user.email) {
    return {
      isAdmin: false,
      user: null,
      error: 'UNAUTHENTICATED',
    };
  }

  const rawAdmins = process.env.ADMIN_EMAILS || '';
  const adminEmails = rawAdmins
    .replace(/["']/g, '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  // Strict whitelist check
  if (adminEmails.length > 0) {
    const isWhitelisted = adminEmails.includes(user.email.toLowerCase());
    return {
      isAdmin: isWhitelisted,
      user: {
        id: user.id,
        email: user.email,
      },
      error: isWhitelisted ? undefined : 'FORBIDDEN',
    };
  }

  // If no admin emails are configured, fail closed unless explicit dev override is set
  if (process.env.NODE_ENV === 'development' && process.env.ALLOW_DEV_ADMIN === 'true') {
    return {
      isAdmin: true,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  return {
    isAdmin: false,
    user: {
      id: user.id,
      email: user.email,
    },
    error: 'ADMIN_NOT_CONFIGURED',
  };
}
