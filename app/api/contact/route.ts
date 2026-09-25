// app/api/contact/route.ts
// Contact inquiry submission endpoint with input validation, abuse controls & persistence

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Sliding-window IP rate limiter: max 5 requests per 5 minutes
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000;
  const maxRequests = 5;

  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxRequests) {
    return false;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'TOO_MANY_REQUESTS', message: 'Too many submissions. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: 'INVALID_JSON', message: 'Malformed JSON payload.' },
        { status: 400 }
      );
    }

    // Honeypot trap: if bot filled hp_field or website_hp, silently return 200 without saving
    if (body?.hp_field || body?.website_hp) {
      return NextResponse.json({
        success: true,
        message: 'Your message has been received. Our editorial team will respond within 12 hours.',
      });
    }

    const name = body?.name;
    const email = body?.email;
    const message = body?.message;
    const category = body?.category ?? 'support';

    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: 'INVALID_NAME', message: 'Please provide a valid name (2-100 characters).' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim()) || email.length > 150) {
      return NextResponse.json(
        { error: 'INVALID_EMAIL', message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10 || message.length > 5000) {
      return NextResponse.json(
        { error: 'INVALID_MESSAGE', message: 'Message must be between 10 and 5,000 characters long.' },
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

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. Our editorial team will respond within 12 hours.',
    });
  } catch (err: unknown) {
    console.error('Contact endpoint error:', err);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: err instanceof Error ? err.message : 'Failed to process inquiry. Please try again later.' },
      { status: 500 }
    );
  }
}
