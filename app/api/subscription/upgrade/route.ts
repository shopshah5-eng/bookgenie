import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  const supabaseAdmin = createAdminClient();
  try {
    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body. Please provide a valid payload.' },
        { status: 400 }
      );
    }

    const tier = typeof body?.tier === 'string' ? body.tier : undefined;
    const validTiers = ['free', 'creator', 'pro'];

    if (!tier || !validTiers.includes(tier)) {
      return NextResponse.json(
        { error: `Invalid plan tier. Valid options are: ${validTiers.join(', ')}.` },
        { status: 400 }
      );
    }

    // Authenticate user session
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Read-only in route handler context
            }
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to upgrade or modify your subscription.' },
        { status: 401 }
      );
    }

    // Update profile tier using supabaseAdmin to bypass RLS restrictions on tier field
    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        tier,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select('id, email, tier')
      .single();

    if (updateError) {
      console.error('[Subscription Upgrade Error]:', updateError);
      return NextResponse.json(
        { error: 'Failed to update subscription tier. Please contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Your subscription has been updated to the ${tier.toUpperCase()} plan.`,
      profile: updatedProfile,
    });
  } catch (err: unknown) {
    console.error('[Subscription Upgrade Handler Error]:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'An unexpected error occurred while processing subscription upgrade.' },
      { status: 500 }
    );
  }
}
