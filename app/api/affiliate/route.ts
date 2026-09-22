// app/api/affiliate/route.ts
// Affiliate partner application endpoint with input validation and persistence

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'INVALID_JSON', message: 'Malformed JSON payload.' },
        { status: 400 }
      );
    }

    const { email, website, audienceSize = '1k-10k' } = body || {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'INVALID_EMAIL', message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!website || typeof website !== 'string' || website.trim().length < 3) {
      return NextResponse.json(
        { error: 'INVALID_WEBSITE', message: 'Please provide your website or primary social channel.' },
        { status: 400 }
      );
    }

    const application = {
      email: email.trim().toLowerCase().slice(0, 150),
      website: website.trim().slice(0, 250),
      audience_size: String(audienceSize).slice(0, 50),
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    // Persist to Supabase if configured
    try {
      const supabase = createAdminClient();
      await supabase.from('affiliate_applications').insert(application);
    } catch (dbErr) {
      console.warn('Affiliate application database notice:', dbErr);
    }

    console.log(`[Affiliate Application] Email: ${application.email} | Channel: ${application.website}`);

    return NextResponse.json({
      success: true,
      message: 'Application received. We will review your channel and email your custom referral link within 24 hours.',
    });
  } catch (err: any) {
    console.error('Affiliate application error:', err);
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: 'Failed to submit application. Please try again later.' },
      { status: 500 }
    );
  }
}
