// app/api/payments/razorpay/create-order/route.ts
// Server-side Razorpay order creation using canonical plans and amounts.

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getPlan } from '@/lib/payments/plans';
import { getRazorpayClient, getRazorpayConfig, isRazorpayConfigured } from '@/lib/payments/razorpay';
import { validateCoupon } from '@/lib/payments/coupons';

export async function POST(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(req);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'You must be signed in to purchase a plan.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const planId = typeof body?.planId === 'string' ? body.planId : '';
    const plan = getPlan(planId);

    if (!plan) {
      return NextResponse.json(
        { error: 'INVALID_PLAN', message: 'The requested plan does not exist.' },
        { status: 400 }
      );
    }

    if (plan.id === 'free') {
      return NextResponse.json(
        { error: 'FREE_PLAN', message: 'The free plan does not require payment.' },
        { status: 400 }
      );
    }

    // Verify server-side Razorpay configuration
    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        {
          error: 'PAYMENTS_NOT_CONFIGURED',
          message: 'Payments are not configured yet. Please configure Razorpay keys to enable paid checkout.',
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
          message: 'Payments are not configured yet. Please configure Razorpay keys to enable paid checkout.',
        },
        { status: 503 }
      );
    }

    // Server-enforced amount from canonical definition with support for custom pages, quarterly, or annual interval
    const interval = (typeof body?.interval === 'string' ? body.interval : 'monthly') as 'monthly' | 'quarterly' | 'annual';
    const isQuarterly = interval === 'quarterly';
    const isAnnual = interval === 'annual';

    let orderAmountCents = plan.amountCents ?? plan.amountPaise ?? 0;
    let selectedMaxPages = plan.maxPagesPerBook;
    const requestedPages = typeof body?.pages === 'number' ? body.pages : undefined;

    if (plan.id === 'single' && requestedPages) {
      const { calculateSinglePlanPrice } = await import('@/lib/payments/plans');
      const dynamic = calculateSinglePlanPrice(requestedPages);
      orderAmountCents = dynamic.amountCents;
      selectedMaxPages = dynamic.maxPages;
    } else if (isQuarterly && plan.quarterlyAmountCents) {
      orderAmountCents = plan.quarterlyAmountCents;
    } else if (isAnnual && (plan.annualAmountCents || plan.annualAmountPaise)) {
      orderAmountCents = plan.annualAmountCents || plan.annualAmountPaise || 0;
    }

    const originalAmountCents = orderAmountCents;

    // Apply Coupon / Stepped Tier discount
    const rawCoupon = typeof body?.couponCode === 'string' && body.couponCode.trim()
      ? body.couponCode.trim()
      : (typeof body?.affiliateRef === 'string' ? body.affiliateRef.trim() : '');

    let discountCents = 0;
    let appliedCouponCode: string | null = null;
    let appliedAffiliateCode: string | null = null;

    const { getPreorderStatus, getAnnualDiscountPercent } = await import('@/lib/payments/preorder');
    const preorder = await getPreorderStatus();
    const baseActivePercent = preorder.isPreorderActive ? preorder.activeTier.discountPercent : 0;

    // First 100 users get full discount (e.g. 50%) on 3-month/monthly plans, and half discount (30% in Tier 1) on 12-month annual
    const activePercent = isAnnual
      ? getAnnualDiscountPercent(baseActivePercent)
      : baseActivePercent;

    if (rawCoupon) {
      const couponResult = validateCoupon(rawCoupon, orderAmountCents, activePercent);
      if (couponResult.valid) {
        discountCents = couponResult.discountAmountCents;
        orderAmountCents = couponResult.finalAmountCents;
        appliedCouponCode = couponResult.code;
        appliedAffiliateCode = couponResult.affiliateCode || (typeof body?.affiliateRef === 'string' ? body.affiliateRef : null);
      }
    } else if (preorder.isPreorderActive && activePercent > 0) {
      // Automatic Stepped Founder discount
      const autoResult = validateCoupon('FOUNDER', orderAmountCents, activePercent);
      if (autoResult.valid) {
        discountCents = autoResult.discountAmountCents;
        orderAmountCents = autoResult.finalAmountCents;
        appliedCouponCode = `FOUNDER${activePercent}`;
      }
    }

    const receipt = `rcpt_${Date.now().toString(36)}_${user.id.slice(0, 8)}`;
    const commissionCents = appliedAffiliateCode ? Math.round(orderAmountCents * 0.1) : 0;

    const order = await razorpay.orders.create({
      amount: orderAmountCents,
      currency: 'USD',
      receipt,
      notes: {
        userId: user.id,
        userEmail: user.email || '',
        planId: plan.id,
        planName: plan.name,
        maxPages: String(selectedMaxPages),
        interval,
        isPreorder: 'true',
        couponCode: appliedCouponCode || '',
        affiliateCode: appliedAffiliateCode || '',
        discountCents: String(discountCents),
        commissionCents: String(commissionCents),
      },
    });

    if (!order || !order.id) {
      throw new Error('Failed to generate Razorpay order ID.');
    }

    // Persist pending purchase record in Supabase with legacy database constraint compatibility
    try {
      const admin = createAdminClient();
      const dbPlanId = plan.id === 'single' ? 'book' : plan.id === 'pro' ? 'creator' : plan.id;

      const purchaseNotes = {
        canonicalPlanId: plan.id,
        planName: plan.name,
        receipt,
        userEmail: user.email || '',
        maxPages: selectedMaxPages,
        isPreorder: true,
        couponCode: appliedCouponCode || null,
        affiliateCode: appliedAffiliateCode || null,
        discountCents,
        commissionCents,
      };

      const { error: dbError } = await admin.from('purchases').insert({
        user_id: user.id,
        plan_id: plan.id,
        razorpay_order_id: order.id,
        amount: orderAmountCents,
        currency: 'USD',
        status: 'created',
        notes: purchaseNotes,
      });

      if (dbError) {
        console.warn('Initial purchase insert with plan.id failed, retrying with dbPlanId fallback:', dbError.message);
        await admin.from('purchases').insert({
          user_id: user.id,
          plan_id: dbPlanId,
          razorpay_order_id: order.id,
          amount: orderAmountCents,
          currency: 'USD',
          status: 'created',
          notes: purchaseNotes,
        });
      }
    } catch (dbErr) {
      console.warn('Non-fatal: Failed to persist preliminary purchase record:', dbErr);
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: orderAmountCents,
      originalAmount: originalAmountCents,
      discountAmount: discountCents,
      couponCode: appliedCouponCode,
      affiliateCode: appliedAffiliateCode,
      currency: 'USD',
      keyId: config.keyId,
      planId: plan.id,
      planName: plan.name,
      maxPages: selectedMaxPages,
    });
  } catch (err) {
    console.error('Create Razorpay order error:', err);
    const message = err instanceof Error ? err.message : 'Failed to create payment order.';
    return NextResponse.json(
      { error: 'ORDER_CREATION_FAILED', message },
      { status: 500 }
    );
  }
}
