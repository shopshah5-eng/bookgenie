// app/api/ebooks/create-order/route.ts
// Creates server-side Razorpay order for The Digital Product Profit Blueprint (₹299 INR)

import { NextRequest, NextResponse } from 'next/server';
import { getRazorpayClient, getRazorpayConfig, isRazorpayConfigured } from '@/lib/payments/razorpay';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { EBOOK_CATALOG } from '@/lib/ebooks/catalog';

// In-memory sliding rate-limiter: max 10 order creates per IP per 5 minutes
const ipRateLimits = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown-ip';
    const now = Date.now();
    const timestamps = (ipRateLimits.get(ip) || []).filter((t) => now - t < 300_000);
    if (timestamps.length >= 10) {
      return NextResponse.json(
        { error: 'RATE_LIMIT_EXCEEDED', message: 'Too many order requests. Please try again shortly.' },
        { status: 429 }
      );
    }
    timestamps.push(now);
    ipRateLimits.set(ip, timestamps);

    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === 'string' && body.email.includes('@') ? body.email.trim() : 'support@bookgenie.app';

    const bookId = typeof body?.bookId === 'string' ? body.bookId.trim() : 'blueprint';
    const product = EBOOK_CATALOG[bookId];
    if (!product || product.isFree) {
      return NextResponse.json(
        { error: 'INVALID_PRODUCT', message: 'Requested eBook product is invalid or free.' },
        { status: 400 }
      );
    }
    const amountInPaise = Math.round((product.priceInr || 299) * 100);
    const receipt = `ebk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

    const config = getRazorpayConfig();
    const razorpay = getRazorpayClient();
    if (!config || !razorpay) {
      return NextResponse.json(
        { error: 'PAYMENT_UNAVAILABLE', message: 'Payment gateway is not currently configured.' },
        { status: 503 }
      );
    }

    const { user } = await getAuthenticatedUser(req).catch(() => ({ user: null }));

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        item: product.title,
        bookId: product.id,
        buyerEmail: email,
        userId: user?.id || 'guest',
      },
    });

    if (!order || !order.id) {
      throw new Error('Razorpay failed to return an order ID.');
    }

    // Optional: Log pending purchase in DB if supabase is configured
    try {
      const admin = createAdminClient();
      await admin.from('purchases').insert({
        user_id: user?.id || null,
        plan_id: product.id,
        razorpay_order_id: order.id,
        amount: amountInPaise,
        currency: 'INR',
        status: 'created',
        notes: {
          bookTitle: product.title,
          buyerEmail: email,
          receipt,
        },
      });
    } catch {
      // Non-fatal if purchases table requires specific user_id
    }

    return NextResponse.json({
      orderId: order.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId: config.keyId,
      email,
      bookTitle: product.title,
    });
  } catch (err: unknown) {
    console.error('Ebook create order error:', err);
    const message = err instanceof Error ? err.message : 'Could not initiate Razorpay order. Please try again.';
    return NextResponse.json(
      {
        error: 'ORDER_CREATION_FAILED',
        message,
      },
      { status: 500 }
    );
  }
}
