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

    // Server-enforced amount from canonical definition (never trust browser amount)
    const receipt = `rcpt_${Date.now().toString(36)}_${user.id.slice(0, 8)}`;
    const order = await razorpay.orders.create({
      amount: plan.amountPaise,
      currency: 'INR',
      receipt,
      notes: {
        userId: user.id,
        userEmail: user.email || '',
        planId: plan.id,
        planName: plan.name,
      },
    });

    if (!order || !order.id) {
      throw new Error('Failed to generate Razorpay order ID.');
    }

    // Persist pending purchase record in Supabase
    const admin = createAdminClient();
    const { error: dbError } = await admin.from('purchases').insert({
      user_id: user.id,
      plan_id: plan.id,
      razorpay_order_id: order.id,
      amount: plan.amountPaise,
      currency: 'INR',
      status: 'created',
      notes: {
        planName: plan.name,
        receipt,
        userEmail: user.email || '',
      },
    });

    if (dbError) {
      console.error('Failed to persist purchase record:', dbError);
      throw new Error('Could not initialize purchase record.');
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: plan.amountPaise,
      currency: 'INR',
      keyId: config.keyId,
      planId: plan.id,
      planName: plan.name,
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
