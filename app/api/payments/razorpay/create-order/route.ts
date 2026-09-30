// app/api/payments/razorpay/create-order/route.ts
// Server-side Razorpay order creation using canonical plans and amounts.

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getPlan } from '@/lib/payments/plans';
import { getRazorpayClient, getRazorpayConfig, isRazorpayConfigured } from '@/lib/payments/razorpay';

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

    // Server-enforced amount from canonical definition with support for custom pages or annual interval
    let orderAmountCents = plan.amountCents ?? plan.amountPaise ?? 0;
    let selectedMaxPages = plan.maxPagesPerBook;
    const requestedPages = typeof body?.pages === 'number' ? body.pages : undefined;
    const isAnnual = body?.interval === 'annual';

    if (plan.id === 'single' && requestedPages) {
      const { calculateSinglePlanPrice } = await import('@/lib/payments/plans');
      const dynamic = calculateSinglePlanPrice(requestedPages);
      orderAmountCents = dynamic.amountCents;
      selectedMaxPages = dynamic.maxPages;
    } else if (isAnnual && (plan.annualAmountCents || plan.annualAmountPaise)) {
      orderAmountCents = plan.annualAmountCents || plan.annualAmountPaise || 0;
    }

    const receipt = `rcpt_${Date.now().toString(36)}_${user.id.slice(0, 8)}`;
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
        interval: isAnnual ? 'annual' : 'monthly',
      },
    });

    if (!order || !order.id) {
      throw new Error('Failed to generate Razorpay order ID.');
    }

    // Persist pending purchase record in Supabase with legacy database constraint compatibility
    try {
      const admin = createAdminClient();
      const dbPlanId = plan.id === 'single' ? 'book' : plan.id === 'pro' ? 'creator' : plan.id;

      const { error: dbError } = await admin.from('purchases').insert({
        user_id: user.id,
        plan_id: plan.id,
        razorpay_order_id: order.id,
        amount: orderAmountCents,
        currency: 'USD',
        status: 'created',
        notes: {
          canonicalPlanId: plan.id,
          planName: plan.name,
          receipt,
          userEmail: user.email || '',
          maxPages: selectedMaxPages,
        },
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
          notes: {
            canonicalPlanId: plan.id,
            planName: plan.name,
            receipt,
            userEmail: user.email || '',
            maxPages: selectedMaxPages,
          },
        });
      }
    } catch (dbErr) {
      console.warn('Non-fatal: Failed to persist preliminary purchase record:', dbErr);
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: orderAmountCents,
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
