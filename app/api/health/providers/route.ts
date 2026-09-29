import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSupabaseConfig } from '@/lib/supabase/config';
import { isRazorpayConfigured } from '@/lib/payments/razorpay';

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticated endpoint
    const { user, error: authError } = await getAuthenticatedUser(req);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required to inspect provider health.' },
        { status: 401 }
      );
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY?.trim();
    const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
    const imageProviderEnv = (process.env.AI_IMAGE_PROVIDER || 'gemini').toLowerCase().trim();
    const allowWatermarked = process.env.ALLOW_PROVIDER_WATERMARKED_COVERS === 'true';

    // 2. Check Supabase reachability
    let dbReachable = false;
    let dbError: string | null = null;
    const supabaseConfigured = getSupabaseConfig() !== null && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
    if (supabaseConfigured) {
      try {
        const admin = createAdminClient();
        const { error: queryErr } = await admin.from('profiles').select('id', { count: 'exact', head: true }).limit(1);
        if (!queryErr) {
          dbReachable = true;
        } else {
          dbError = queryErr.message;
        }
      } catch (err) {
        dbError = err instanceof Error ? err.message : 'Database ping failed';
      }
    }

    // 3. Image provider cover safety evaluation
    // Cover is only safe if Gemini is selected and configured, or if watermarked covers are explicitly allowed
    const isGeminiSelected = imageProviderEnv === 'gemini';
    const isGeminiConfigured = Boolean(geminiApiKey);
    const coverSafe = (isGeminiSelected && isGeminiConfigured) || allowWatermarked;

    const responsePayload = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
      },
      imageProvider: {
        selected: imageProviderEnv,
        configured: imageProviderEnv === 'gemini' ? isGeminiConfigured : true,
        coverSafe,
        allowWatermarkedCovers: allowWatermarked,
        status: isGeminiConfigured || imageProviderEnv === 'pollinations' ? 'ready' : 'fallback_mode',
      },
      providers: {
        text: {
          provider: 'openrouter',
          model: 'meta-llama/llama-3.1-8b-instruct',
          configured: Boolean(openRouterApiKey),
          reachable: Boolean(openRouterApiKey),
          status: openRouterApiKey ? 'ready' : 'missing_api_key',
        },
        image: {
          selected: imageProviderEnv,
          configured: imageProviderEnv === 'gemini' ? isGeminiConfigured : true,
          coverSafe,
          allowWatermarkedCovers: allowWatermarked,
          status: isGeminiConfigured || imageProviderEnv === 'pollinations' ? 'ready' : 'fallback_mode',
        },
        database: {
          provider: 'supabase',
          configured: supabaseConfigured,
          reachable: dbReachable,
          status: dbReachable ? 'connected' : dbError || 'unreachable',
        },
        payments: {
          provider: 'razorpay',
          configured: isRazorpayConfigured(),
          status: isRazorpayConfigured() ? 'active' : 'unconfigured',
        },
      },
    };

    return NextResponse.json(responsePayload);
  } catch (err) {
    console.error('Provider health diagnostics error:', err);
    return NextResponse.json(
      { error: 'DIAGNOSTICS_ERROR', message: 'Failed to inspect provider health.' },
      { status: 500 }
    );
  }
}
