// app/api/ebooks/verify-payment/route.ts
// Verifies HMAC-SHA256 signature for ebook checkout and issues download token

import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature, isRazorpayConfigured } from '@/lib/payments/razorpay';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'node:crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { orderId, paymentId, signature, email } = body || {};

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

    // 2. Generate secure download token
    const token = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'bookgenie-secure-secret')
      .update(`${orderId}:${paymentId}:${email || 'buyer'}`)
      .digest('hex');

    // 3. Mark purchase record as completed
    try {
      const admin = createAdminClient();
      await admin
        .from('purchases')
        .update({
          status: 'completed',
          razorpay_payment_id: paymentId,
          updated_at: new Date().toISOString(),
        })
        .eq('razorpay_order_id', orderId);
    } catch {
      // Non-fatal if purchases table is not populated
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully.',
      orderId,
      paymentId,
      email: email || '',
      downloadUrl: `/api/ebooks/download/blueprint?token=${token}`,
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
