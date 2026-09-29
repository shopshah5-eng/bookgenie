import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, getAuthenticatedUser } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(req);
    if (authError || !user) {
      return NextResponse.json({ tier: 'free', currentPlan: 'free' });
    }

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from('profiles')
      .select('id, email, tier')
      .eq('id', user.id)
      .maybeSingle();

    const activeTier = profile?.tier || user.user_metadata?.tier || 'free';
    return NextResponse.json({
      tier: activeTier,
      currentPlan: activeTier,
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
    if (requestedTier === 'pro_monthly' || requestedTier === 'pro_annual' || requestedTier === 'creator') {
      requestedTier = 'creator';
    } else if (requestedTier === 'premium_monthly' || requestedTier === 'premium_annual' || requestedTier === 'pro') {
      requestedTier = 'pro';
    } else if (requestedTier === 'free' || requestedTier === 'discovery') {
      requestedTier = 'free';
    }

    if (requestedTier !== 'free' && requestedTier !== 'creator' && requestedTier !== 'pro') {
      return NextResponse.json(
        { error: 'INVALID_TIER', message: 'Valid plan tiers are free, creator (Pro), and pro (Premium).' },
        { status: 400 }
      );
    }

    const { user, sessionClient, error: authError } = await getAuthenticatedUser(req);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Sign in before choosing a subscription plan.' },
        { status: 401 }
      );
    }

    const admin = createAdminClient();
    const { data: profile, error } = await admin
      .from('profiles')
      .update({ tier: requestedTier, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select('id, email, tier')
      .maybeSingle();
    if (error) throw error;

    // Also update auth user metadata so client-side sessions reflect immediately
    try {
      await sessionClient.auth.updateUser({
        data: { tier: requestedTier },
      });
    } catch (_) {}

    const planName = requestedTier === 'pro' ? 'Premium' : requestedTier === 'creator' ? 'Pro' : 'Free';

    return NextResponse.json({
      success: true,
      subscriptionTier: requestedTier,
      tier: requestedTier,
      planName,
      message: `Your account is now on the ${planName} plan.`,
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
