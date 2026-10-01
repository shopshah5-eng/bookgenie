// app/api/affiliate/request-payout/route.ts
// Endpoint for affiliate partners to request a withdrawal transfer once reaching the $10 minimum.

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(req);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'You must be signed in to request a payout.' },
        { status: 401 }
      );
    }

    const admin = createAdminClient();
    const userMetadata = (user.user_metadata as Record<string, unknown>) || {};
    const payoutSettings = (userMetadata.affiliate_payout_settings as Record<string, unknown>) || {};

    // 1. Verify payout method is configured
    if (!payoutSettings.upiId && !payoutSettings.accountNumber && !payoutSettings.paypalEmail) {
      return NextResponse.json(
        {
          error: 'NO_PAYOUT_METHOD',
          message: 'Please add your Bank Details or UPI ID in the Payout Settings section before requesting a payout.',
        },
        { status: 400 }
      );
    }

    // 2. Compute live partner earnings from captured purchases
    const emailPrefix = (user.email || 'PARTNER').split('@')[0].toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    const couponCode = typeof userMetadata.affiliate_coupon_code === 'string' && userMetadata.affiliate_coupon_code
      ? userMetadata.affiliate_coupon_code
      : `${emailPrefix}10`;

    const { data: purchases } = await admin
      .from('purchases')
      .select('id, amount, notes, status')
      .eq('status', 'captured');

    let totalEarningsCents = 0;
    (purchases || []).forEach((p) => {
      const pNotes = (p.notes as Record<string, unknown>) || {};
      const aff = String(pNotes.affiliateCode || pNotes.couponCode || '').toUpperCase().trim();
      if (aff === couponCode || (aff.length >= 3 && couponCode.startsWith(aff))) {
        const orderAmountCents = Number(p.amount) || 0;
        const commissionCents = typeof pNotes.commissionCents === 'number'
          ? Number(pNotes.commissionCents)
          : Math.round(orderAmountCents * 0.1);
        totalEarningsCents += commissionCents;
      }
    });

    const paidOutCents = Number(userMetadata.affiliate_paid_out_cents) || 0;
    const availableBalanceCents = Math.max(totalEarningsCents - paidOutCents, 0);

    const MIN_PAYOUT_CENTS = 1000; // $10.00 minimum payout

    if (availableBalanceCents < MIN_PAYOUT_CENTS) {
      return NextResponse.json(
        {
          error: 'MINIMUM_NOT_MET',
          message: `Minimum payout is $10.00. Your current available balance is $${(availableBalanceCents / 100).toFixed(2)}.`,
        },
        { status: 400 }
      );
    }

    // Log the payout request in user metadata
    const requestedAmountUsd = (availableBalanceCents / 100).toFixed(2);
    const payoutRequests = Array.isArray(userMetadata.payout_requests) ? userMetadata.payout_requests : [];

    const newRequest = {
      requestId: `pay_${Date.now().toString(36)}`,
      amountCents: availableBalanceCents,
      amountUsd: requestedAmountUsd,
      payoutMethod: payoutSettings.method,
      recipientDetails: payoutSettings.upiId || payoutSettings.accountNumber || payoutSettings.paypalEmail,
      status: 'processing',
      requestedAt: new Date().toISOString(),
    };

    await admin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...userMetadata,
        affiliate_paid_out_cents: paidOutCents + availableBalanceCents,
        payout_requests: [newRequest, ...payoutRequests],
      },
    });

    return NextResponse.json({
      success: true,
      message: `🎉 Payout request for $${requestedAmountUsd} submitted! Your funds will be transferred directly to your ${payoutSettings.method === 'upi' ? `UPI ID (${payoutSettings.upiId})` : `Bank Account (${payoutSettings.accountNumber})`} within 2 business days.`,
      request: newRequest,
    });
  } catch (err) {
    console.error('Request payout error:', err);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to submit payout request. Please try again later.' },
      { status: 500 }
    );
  }
}
