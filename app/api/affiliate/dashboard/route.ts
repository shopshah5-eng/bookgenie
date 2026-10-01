// app/api/affiliate/dashboard/route.ts
// Real-time affiliate partner metrics, commission ledger, and saved payout settings.

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(req);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'You must be signed in to view your affiliate dashboard.' },
        { status: 401 }
      );
    }

    const admin = createAdminClient();

    // 1. Resolve Partner's Unique Coupon Code & Referral Link
    const userMetadata = (user.user_metadata as Record<string, unknown>) || {};
    const emailPrefix = (user.email || 'PARTNER').split('@')[0].toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    const fallbackCode = `${emailPrefix.length >= 3 ? emailPrefix : 'PARTNER'}10`;

    const couponCode = typeof userMetadata.affiliate_coupon_code === 'string' && userMetadata.affiliate_coupon_code
      ? userMetadata.affiliate_coupon_code
      : fallbackCode;

    const host = req.headers.get('host') || 'bookgenie.co';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const referralUrl = `${protocol}://${host}/?ref=${couponCode}`;

    // 2. Fetch all real purchases in Supabase attributed to this partner
    // Purchases store notes->>'affiliateCode'
    const { data: purchases, error: purchaseError } = await admin
      .from('purchases')
      .select('id, amount, currency, status, created_at, notes, plan_id')
      .eq('status', 'captured')
      .order('created_at', { ascending: false });

    if (purchaseError) {
      console.warn('Could not query purchases for affiliate ledger:', purchaseError.message);
    }

    // Filter purchases where affiliateCode matches this partner's code (case-insensitive)
    const matchingPurchases = (purchases || []).filter((p) => {
      const pNotes = (p.notes as Record<string, unknown>) || {};
      const aff = String(pNotes.affiliateCode || pNotes.couponCode || '').toUpperCase().trim();
      return aff === couponCode || (aff.length >= 3 && couponCode.startsWith(aff));
    });

    // 3. Calculate Earnings
    let totalEarningsCents = 0;
    const referredOrders = matchingPurchases.map((p) => {
      const pNotes = (p.notes as Record<string, unknown>) || {};
      const orderAmountCents = Number(p.amount) || 0;
      // 10% commission
      const commissionCents = typeof pNotes.commissionCents === 'number'
        ? Number(pNotes.commissionCents)
        : Math.round(orderAmountCents * 0.1);

      totalEarningsCents += commissionCents;

      return {
        id: p.id,
        date: p.created_at,
        planName: String(pNotes.planName || p.plan_id || 'Digital Book Plan').toUpperCase(),
        interval: String(pNotes.interval || 'one_time'),
        orderAmountUsd: Number((orderAmountCents / 100).toFixed(2)),
        commissionUsd: Number((commissionCents / 100).toFixed(2)),
        status: 'Available',
      };
    });

    // Load saved payout settings
    const savedPayout = (userMetadata.affiliate_payout_settings as Record<string, unknown>) || {};
    const paidOutCents = Number(userMetadata.affiliate_paid_out_cents) || 0;
    const availableBalanceCents = Math.max(totalEarningsCents - paidOutCents, 0);

    const MIN_PAYOUT_CENTS = 1000; // $10.00 minimum payout

    return NextResponse.json({
      success: true,
      partner: {
        email: user.email,
        name: userMetadata.full_name || userMetadata.name || emailPrefix,
        couponCode,
        referralUrl,
        commissionRatePercent: 10,
      },
      metrics: {
        totalEarningsUsd: Number((totalEarningsCents / 100).toFixed(2)),
        availableBalanceUsd: Number((availableBalanceCents / 100).toFixed(2)),
        paidOutUsd: Number((paidOutCents / 100).toFixed(2)),
        minPayoutUsd: Number((MIN_PAYOUT_CENTS / 100).toFixed(2)),
        isEligibleForPayout: availableBalanceCents >= MIN_PAYOUT_CENTS,
        totalReferredOrders: referredOrders.length,
      },
      payoutSettings: {
        method: savedPayout.method || 'upi', // 'upi' | 'bank' | 'paypal'
        upiId: savedPayout.upiId || '',
        accountHolderName: savedPayout.accountHolderName || '',
        bankName: savedPayout.bankName || '',
        accountNumber: savedPayout.accountNumber || '',
        ifscCode: savedPayout.ifscCode || '',
        paypalEmail: savedPayout.paypalEmail || '',
        isConfigured: Boolean(savedPayout.upiId || savedPayout.accountNumber || savedPayout.paypalEmail),
      },
      orders: referredOrders,
    });
  } catch (err) {
    console.error('Affiliate dashboard API error:', err);
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: 'Failed to load affiliate dashboard.' },
      { status: 500 }
    );
  }
}
