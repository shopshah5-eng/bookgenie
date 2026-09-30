// app/api/ebooks/create-order/route.ts
// Creates server-side Razorpay order for The Digital Product Profit Blueprint (₹299 INR)

import { NextRequest, NextResponse } from 'next/server';
import { getRazorpayClient, getRazorpayConfig, isRazorpayConfigured } from '@/lib/payments/razorpay';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === 'string' ? body.email.trim() : '';

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'EMAIL_REQUIRED', message: 'A valid email address is required for receipt and delivery.' },
        { status: 400 }
      );
    }

    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        {
          error: 'PAYMENTS_NOT_CONFIGURED',
          message: 'Razorpay credentials are not yet configured on this server.',
        },
        { status: 503 }
      );
    }

    const razorpay = getRazorpayClient();
    const config = getRazorpayConfig();

    if (!razorpay || !config) {
      return NextResponse.json(
        {
          error: 'PAYMENTS_NOT_CONFIGURED',
          message: 'Razorpay is temporarily unavailable.',
        },
        { status: 503 }
      );
    }

    const bookId = typeof body?.bookId === 'string' ? body.bookId.trim() : 'blueprint';
    const { EBOOK_CATALOG } = await import('@/lib/ebooks/catalog');
    const product = EBOOK_CATALOG[bookId] || EBOOK_CATALOG['blueprint'];
    const amountInPaise = Math.round((product.priceInr || 299) * 100);
    const receipt = `ebk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

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
        plan_id: 'digital-product-profit-blueprint',
        razorpay_order_id: order.id,
        amount: amountInPaise,
        currency: 'INR',
        status: 'created',
        notes: {
          bookTitle: 'The Digital Product Profit Blueprint',
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
      bookTitle: 'The Digital Product Profit Blueprint',
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
