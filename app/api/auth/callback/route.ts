import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const rawNext = requestUrl.searchParams.get('next') || '/';

  // Open-redirect prevention: ensure next is a relative path
  const cleanNext = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/';

  // Determine canonical origin: eliminate Netlify master-- branch split and localhost leaks
  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = request.headers.get('host') || '';
  const isLocal = host.includes('localhost') || (forwardedHost && forwardedHost.includes('localhost'));

  let baseOrigin: string;
  if (isLocal) {
    baseOrigin = 'http://localhost:3000';
  } else if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')) {
    baseOrigin = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '');
  } else if (forwardedHost && !forwardedHost.includes('master--')) {
    baseOrigin = `https://${forwardedHost}`;
  } else {
    baseOrigin = 'https://bookgenie-app.netlify.app';
  }

  if (code) {
    try {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${baseOrigin}${cleanNext}`);
      }
    } catch (err) {
      console.error('[Auth Callback] Code exchange error:', err);
    }
  }

  return NextResponse.redirect(`${baseOrigin}/?error=auth-failed`);
}
