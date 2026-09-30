// app/api/ebooks/verify-payment/route.ts
// Verifies HMAC-SHA256 signature for ebook checkout and issues download token

import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature, isRazorpayConfigured } from '@/lib/payments/razorpay';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'node:crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { orderId, paymentId, signature, email, bookId } = body || {};

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: 'INVALID_PAYLOAD', message: 'orderId, paymentId, and signature are required.' },
        { status: 400 }
      );
    }

    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        { error: 'PAYMENTS_NOT_CONFIGURED', message: 'Payments are not configured.' },
        { status: 503 }
      );
    }

    // 1. Verify cryptographic HMAC SHA256 signature
    const isValid = verifyPaymentSignature({ orderId, paymentId, signature });
    if (!isValid) {
      return NextResponse.json(
        { error: 'INVALID_SIGNATURE', message: 'Cryptographic signature verification failed.' },
        { status: 400 }
      );
    }

    const targetSlug = bookId === 'glow-up' ? 'glow-up' : 'blueprint';
    const { EBOOK_CATALOG } = await import('@/lib/ebooks/catalog');
    const { generateOrderCode, recordEbookOrder, generateEbookToken } = await import('@/lib/ebooks/order-store');

    const orderCode = generateOrderCode();
    const token = generateEbookToken(orderCode, targetSlug);
    const catalogItem = EBOOK_CATALOG[targetSlug];

    await recordEbookOrder({
      orderCode,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      slug: targetSlug as 'blueprint' | 'glow-up',
      bookTitle: catalogItem?.title || 'eBook Edition',
      amount: catalogItem?.priceInr || 149,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully.',
      orderCode,
      orderId,
      paymentId,
      slug: targetSlug,
      title: catalogItem?.title || 'eBook Edition',
      downloadUrl: `/api/ebooks/download/${targetSlug}?token=${token}&orderCode=${encodeURIComponent(orderCode)}`,
      token,
    });
  } catch (err: unknown) {
    console.error('Verify ebook payment error:', err);
    const message = err instanceof Error ? err.message : 'Payment verification failed.';
    return NextResponse.json(
      { error: 'VERIFICATION_FAILED', message },
      { status: 500 }
    );
  }
}
