// app/api/contact/route.ts
// Contact inquiry submission endpoint with input validation and persistence

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

    const { name, email, message, category = 'support' } = body || {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'INVALID_NAME', message: 'Please provide your name.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'INVALID_EMAIL', message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { error: 'INVALID_MESSAGE', message: 'Message must be at least 10 characters long.' },
        { status: 400 }
      );
    }

    const submission = {
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 150),
      message: message.trim().slice(0, 5000),
      category: String(category).slice(0, 50),
      created_at: new Date().toISOString(),
    };

    // Persist to Supabase if configured
    try {
      const supabase = createAdminClient();
      await supabase.from('contact_submissions').insert(submission);
    } catch (dbErr) {
      console.warn('Contact submission database notice:', dbErr);
    }

    console.log(`[Contact Form Submission] From: ${submission.name} (${submission.email}) | Category: ${submission.category}`);

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. Our editorial team will respond within 12 hours.',
    });
  } catch (err: any) {
    console.error('Contact submission error:', err);
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: 'Failed to submit message. Please try again or email support@bookgenie.ai directly.' },
      { status: 500 }
    );
  }
}
