// app/api/affiliate/route.ts
// Affiliate partner application endpoint with input validation, abuse controls & persistence

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

    let body: Record<string, unknown> = {};
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
        message: 'Application received. We will review your channel and email your custom referral link within 24 hours.',
      });
    }

    const { email, website, audienceSize = '1k-10k' } = body || {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim()) || email.length > 150) {
      return NextResponse.json(
        { error: 'INVALID_EMAIL', message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Strict URL validation: Must be a valid URL with http or https protocol
    const trimmedWebsite = typeof website === 'string' ? website.trim() : '';
    let isValidUrl = false;
    try {
      const parsedUrl = new URL(trimmedWebsite.startsWith('http') ? trimmedWebsite : `https://${trimmedWebsite}`);
      isValidUrl = Boolean(parsedUrl.hostname && parsedUrl.hostname.includes('.'));
    } catch {
      isValidUrl = false;
    }

    if (!trimmedWebsite || !isValidUrl || trimmedWebsite.length > 250) {
      return NextResponse.json(
        { error: 'INVALID_WEBSITE', message: 'Please provide a valid website or social profile URL (e.g. https://youtube.com/@channel or https://myblog.com).' },
        { status: 400 }
      );
    }

    const emailPrefix = email.split('@')[0].toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    const uniqueSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    const baseCode = emailPrefix.length >= 3 ? emailPrefix : `AUTHOR${uniqueSuffix}`;
    const couponCode = `${baseCode}10`;

    const host = req.headers.get('host') || 'bookgenie.co';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const referralUrl = `${protocol}://${host}/?ref=${couponCode}`;

    const application = {
      email: email.trim().toLowerCase().slice(0, 150),
      website: trimmedWebsite.slice(0, 250),
      audience_size: String(audienceSize).slice(0, 50),
      status: 'approved',
      created_at: new Date().toISOString(),
    };

    // Persist to Supabase if configured
    try {
      const supabase = createAdminClient();
      const { error: insertError } = await supabase.from('affiliate_applications').insert(application);
      if (insertError) throw insertError;
    } catch (dbErr) {
      console.error('Affiliate application database error:', dbErr);
    }

    return NextResponse.json({
      success: true,
      couponCode,
      referralUrl,
      message: 'Application approved! Your personalized 10% coupon code and referral link are ready.',
    });
  } catch (err: unknown) {
    console.error('Affiliate application error:', err);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to process application. Please try again later.' },
      { status: 500 }
    );
  }
}
