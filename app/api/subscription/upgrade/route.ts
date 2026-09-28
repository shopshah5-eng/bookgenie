import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json().catch(() => null);
    const tier = body && typeof body === 'object' && 'tier' in body
      ? (body as { tier?: unknown }).tier
      : undefined;

    if (tier !== 'free' && tier !== 'creator' && tier !== 'pro') {
      return NextResponse.json(
        { error: 'INVALID_TIER', message: 'Valid plan tiers are free, creator, and pro.' },
        { status: 400 }
      );
    }

    const sessionClient = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await sessionClient.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Sign in before changing a subscription.' },
        { status: 401 }
      );
    }

    // There is no payment provider or webhook in this repository. Never grant
    // paid entitlements just because a browser posted { tier: "pro" }.
    if (tier !== 'free') {
      return NextResponse.json(
        { error: 'PAYMENT_NOT_CONFIGURED', message: 'Paid plan checkout is not configured yet.' },
        { status: 501 }
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

    return NextResponse.json({
      success: true,
      subscriptionTier: 'free',
      tier: 'free',
      message: 'Your account is using the Free plan.',
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
