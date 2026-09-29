// app/api/payments/razorpay/verify/route.ts
// Server-side verification of Razorpay payment signatures and entitlement fulfillment.

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getPlan } from '@/lib/payments/plans';
import { verifyPaymentSignature, isRazorpayConfigured } from '@/lib/payments/razorpay';

export async function POST(req: NextRequest) {
  try {
    const { user, sessionClient, error: authError } = await getAuthenticatedUser(req);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'You must be signed in to verify payment.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { orderId, paymentId, signature, planId } = body || {};

    if (!orderId || !paymentId || !signature || !planId) {
      return NextResponse.json(
        { error: 'INVALID_PAYLOAD', message: 'orderId, paymentId, signature, and planId are required.' },
        { status: 400 }
      );
    }

    const plan = getPlan(planId);
    if (!plan) {
      return NextResponse.json(
        { error: 'INVALID_PLAN', message: 'The specified plan does not exist.' },
        { status: 400 }
      );
    }

    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        {
          error: 'PAYMENTS_NOT_CONFIGURED',
          message: 'Payments are not configured on this server.',
        },
        { status: 503 }
      );
    }

    const admin = createAdminClient();

    // 1. Verify cryptographic HMAC SHA256 signature
    const isValid = verifyPaymentSignature({ orderId, paymentId, signature });
    if (!isValid) {
      // Mark purchase failed in DB if found
      await admin
        .from('purchases')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('razorpay_order_id', orderId);

      return NextResponse.json(
        { error: 'INVALID_SIGNATURE', message: 'Payment verification failed: invalid signature.' },
        { status: 400 }
      );
    }

    // 2. Fetch existing purchase record for idempotency check
    const { data: purchase, error: purchaseError } = await admin
      .from('purchases')
      .select('id, status, plan_id')
      .eq('razorpay_order_id', orderId)
      .maybeSingle();

    if (purchaseError) {
      console.error('Error fetching purchase record:', purchaseError);
    }

    if (purchase && purchase.status === 'captured') {
      // Already processed idempotently
      return NextResponse.json({
        success: true,
        verified: true,
        alreadyProcessed: true,
        planId: plan.id,
        planName: plan.name,
        message: 'Payment was already verified and credited.',
      });
    }

    // 3. Mark purchase as captured
    let purchaseId = purchase?.id;
    if (purchase) {
      await admin
        .from('purchases')
        .update({
          status: 'captured',
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
          updated_at: new Date().toISOString(),
        })
        .eq('id', purchase.id);
    } else {
      const { data: newPurchase } = await admin
        .from('purchases')
        .insert({
          user_id: user.id,
          plan_id: plan.id,
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
          amount: plan.amountPaise,
          currency: 'INR',
          status: 'captured',
        })
        .select('id')
        .single();
      purchaseId = newPurchase?.id;
    }

    // 4. Grant explicit entitlement in entitlements table
    const { error: entError } = await admin.from('entitlements').insert({
      user_id: user.id,
      plan_id: plan.id,
      source_purchase_id: purchaseId || null,
      max_pages: plan.maxPagesPerBook,
      allowed_formats: plan.allowedFormats,
      has_watermark: plan.hasWatermark,
      commercial_rights: plan.commercialUse,
      can_regenerate: plan.canRegenerate,
      books_remaining: plan.maxBooksAllowed,
      expires_at: plan.billingType === 'subscription' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : null,
    });

    if (entError) {
      console.error('Failed to grant entitlement:', entError);
    }

    // 5. Update user profile active tier
    await admin
      .from('profiles')
      .update({ tier: plan.id, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    try {
      await sessionClient.auth.updateUser({
        data: { tier: plan.id },
      });
    } catch (_) {}

    return NextResponse.json({
      success: true,
      verified: true,
      planId: plan.id,
      planName: plan.name,
      message: `Payment verified successfully. Your ${plan.name} access is now active.`,
    });
  } catch (err) {
    console.error('Verify payment error:', err);
    const message = err instanceof Error ? err.message : 'Failed to verify payment.';
    return NextResponse.json(
      { error: 'VERIFICATION_FAILED', message },
      { status: 500 }
    );
  }
}
