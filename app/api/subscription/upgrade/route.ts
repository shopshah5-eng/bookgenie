import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, getAuthenticatedUser } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(req);
    if (authError || !user) {
      return NextResponse.json({ tier: 'free', currentPlan: 'free', entitlements: [] });
    }

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from('profiles')
      .select('id, email, tier')
      .eq('id', user.id)
      .maybeSingle();

    // Check for active creator subscription
    const { data: sub } = await admin
      .from('subscriptions')
      .select('plan_id, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    // Check for unused entitlements
    const { data: entitlements } = await admin
      .from('entitlements')
      .select('plan_id, max_pages, books_remaining, has_watermark, commercial_rights')
      .eq('user_id', user.id)
      .gt('books_remaining', 0);

    const activeTier = sub?.plan_id || (entitlements && entitlements.length > 0 ? entitlements[0].plan_id : profile?.tier || 'free');

    return NextResponse.json({
      tier: activeTier,
      currentPlan: activeTier,
      hasSubscription: Boolean(sub),
      entitlementsCount: entitlements?.length || 0,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Subscription status error:', err);
    return NextResponse.json({ tier: 'free', currentPlan: 'free' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json().catch(() => null);
    let requestedTier = body && typeof body === 'object' && 'tier' in body
      ? (body as { tier?: unknown }).tier
      : undefined;

    // Normalize plan names from frontend
    if (requestedTier === 'creator') {
      requestedTier = 'creator';
    } else if (requestedTier === 'book_plus' || requestedTier === 'bookplus') {
      requestedTier = 'book_plus';
    } else if (requestedTier === 'book') {
      requestedTier = 'book';
    } else if (requestedTier === 'free' || requestedTier === 'discovery') {
      requestedTier = 'free';
    }

    const { user, sessionClient, error: authError } = await getAuthenticatedUser(req);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Sign in before choosing a subscription plan.' },
        { status: 401 }
      );
    }

    // Only the FREE plan can be self-activated without Razorpay payment verification
    if (requestedTier !== 'free') {
      return NextResponse.json(
        {
          error: 'PAYMENT_REQUIRED',
          message: 'Paid plans (Book, Book Plus, and Creator) require verified checkout through Razorpay. Client-supplied upgrades are prohibited.',
        },
        { status: 402 }
      );
    }

    const admin = createAdminClient();
    const { data: profile, error } = await admin
      .from('profiles')
      .update({ tier: 'free', updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select('id, email, tier')
      .maybeSingle();
    if (error) throw error;

    try {
      await sessionClient.auth.updateUser({
        data: { tier: 'free' },
      });
    } catch (_) {}

    return NextResponse.json({
      success: true,
      subscriptionTier: 'free',
      tier: 'free',
      planName: 'FREE',
      message: 'Your account is on the FREE plan.',
      profile,
    });
  } catch (err) {
    console.error('Subscription handler error:', err);
    return NextResponse.json(
      { error: 'SUBSCRIPTION_FAILED', message: 'Could not update your subscription.' },
      { status: 500 }
    );
  }
}
