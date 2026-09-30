import { NextRequest, NextResponse } from 'next/server';
import { isCurrentUserAdmin } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { isRazorpayConfigured } from '@/lib/payments/razorpay';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const adminCheck = await isCurrentUserAdmin(req);
    if (!adminCheck.isAdmin) {
      const statusCode = adminCheck.error === 'UNAUTHENTICATED' ? 401 : 403;
      return NextResponse.json(
        {
          error: adminCheck.error || 'FORBIDDEN',
          message:
            statusCode === 401
              ? 'Please sign in with an authorized account.'
              : 'Access restricted to BookGenie administrators.',
        },
        { status: statusCode }
      );
    }

    const admin = createAdminClient();

    // 1. Fetch User Profiles & Counts
    const { count: totalUsers, error: userCountErr } = await admin
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { data: recentProfiles } = await admin
      .from('profiles')
      .select('id, email, full_name, tier, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    // Tier distribution
    const { data: allTiers } = await admin
      .from('profiles')
      .select('tier');

    const tierBreakdown: Record<string, number> = {
      free: 0,
      single: 0,
      pro: 0,
      creator: 0,
      other: 0,
    };

    if (allTiers) {
      allTiers.forEach((p) => {
        const t = (p.tier || 'free').toLowerCase();
        if (t in tierBreakdown) {
          tierBreakdown[t]++;
        } else if (t === 'book') {
          tierBreakdown.single++;
        } else if (t === 'book_plus') {
          tierBreakdown.pro++;
        } else {
          tierBreakdown.other++;
        }
      });
    }

    // 2. Fetch Books Overview
    const { count: totalBooks } = await admin
      .from('books')
      .select('*', { count: 'exact', head: true });

    const { data: recentBooks } = await admin
      .from('books')
      .select('id, user_id, title, book_type, plan_id, status, page_count, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    // Books created in last 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: booksLast24h } = await admin
      .from('books')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneDayAgo);

    // 3. Fetch Generation Jobs
    const { count: totalJobs } = await admin
      .from('jobs')
      .select('*', { count: 'exact', head: true });

    const { count: activeJobs } = await admin
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .in('status', ['queued', 'processing']);

    const { count: failedJobs } = await admin
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed');

    const { count: completedJobs } = await admin
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    const { data: recentJobs } = await admin
      .from('jobs')
      .select('id, book_id, type, status, stage, progress, error_message, created_at, started_at, completed_at')
      .order('created_at', { ascending: false })
      .limit(10);

    // 4. Financial & Orders Summary (from purchases table)
    let totalRevenuePaise = 0;
    let recentPurchases: any[] = [];
    try {
      const { data: purchases } = await admin
        .from('purchases')
        .select('id, user_id, plan_id, amount, currency, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      recentPurchases = purchases || [];

      const { data: capturedPurchases } = await admin
        .from('purchases')
        .select('amount')
        .eq('status', 'captured');

      if (capturedPurchases) {
        totalRevenuePaise = capturedPurchases.reduce((acc, curr) => acc + (curr.amount || 0), 0);
      }
    } catch {
      // Purchases table might be empty or optional
    }

    // 5. Providers Health Diagnostics
    const nvidiaApiKey = process.env.NVIDIA_API_KEY?.trim();
    const openRouterApiKey = process.env.OPENROUTER_API_KEY?.trim();
    const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
    const imageProviderEnv = (process.env.AI_IMAGE_PROVIDER || 'gemini').toLowerCase().trim();
    const textProviderChoice = (process.env.AI_TEXT_PROVIDER || (nvidiaApiKey ? 'nvidia' : 'openrouter')).toLowerCase().trim();
    const standardModel = process.env.AI_TEXT_MODEL_STANDARD || (textProviderChoice === 'nvidia' ? 'meta/llama-3.2-11b-vision-instruct' : 'deepseek/deepseek-chat');
    const premiumModel = process.env.AI_TEXT_MODEL_PREMIUM || 'anthropic/claude-3.5-sonnet';

    const isTextConfigured = textProviderChoice === 'nvidia' ? Boolean(nvidiaApiKey) : Boolean(openRouterApiKey);

    const providers = {
      text: {
        provider: textProviderChoice === 'nvidia' ? 'NVIDIA NIM (Free Credits)' : 'OpenRouter',
        modelStandard: standardModel,
        modelPremium: premiumModel,
        configured: isTextConfigured,
        status: isTextConfigured ? 'active' : 'missing_key',
      },
      image: {
        provider: imageProviderEnv,
        geminiConfigured: Boolean(geminiApiKey),
        status: geminiApiKey || imageProviderEnv === 'pollinations' ? 'active' : 'unconfigured',
      },
      database: {
        provider: 'Supabase DB',
        status: userCountErr ? 'error' : 'connected',
        error: userCountErr?.message,
      },
      payments: {
        provider: 'Razorpay',
        configured: isRazorpayConfigured(),
        status: isRazorpayConfigured() ? 'active' : 'unconfigured',
      },
    };

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      adminUser: adminCheck.user,
      metrics: {
        users: {
          total: totalUsers || 0,
          tierBreakdown,
          recent: recentProfiles || [],
        },
        books: {
          total: totalBooks || 0,
          last24h: booksLast24h || 0,
          recent: recentBooks || [],
        },
        jobs: {
          total: totalJobs || 0,
          active: activeJobs || 0,
          completed: completedJobs || 0,
          failed: failedJobs || 0,
          recent: recentJobs || [],
        },
        revenue: {
          totalPaise: totalRevenuePaise,
          totalEstimatedUsd: Math.round(totalRevenuePaise / 85) / 100, // Approximate converted USD
          recentPurchases,
        },
        providers,
      },
    });
  } catch (err) {
    console.error('Admin overview API error:', err);
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}
