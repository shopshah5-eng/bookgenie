import { NextRequest, NextResponse } from 'next/server';
import { GenerationPipeline } from '@/lib/ai/pipeline';
import { AICostController } from '@/lib/ai/cost-controller';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      bookType = 'auto',
      language = 'English',
      style = 'Modern',
      uploadedContext,
      pageTarget = 16,
    } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'A book prompt is required.' },
        { status: 400 }
      );
    }

    // Determine authenticated user
    let userId = 'user-anonymous';
    try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
      } else if (body.userId) {
        userId = body.userId;
      }
    } catch {
      if (body.userId) userId = body.userId;
    }

    // Enforce Plan Quota & Entitlements
    const quotaCheck = await AICostController.validatePlanQuota(userId, Number(pageTarget) || 16);
    if (!quotaCheck.allowed) {
      return NextResponse.json(
        {
          error: 'QUOTA_EXCEEDED',
          message: quotaCheck.reason,
          tier: quotaCheck.tier,
          limits: quotaCheck.limits,
        },
        { status: 403 }
      );
    }

    const { bookId, jobId } = await GenerationPipeline.createBookAndJob({
      userId,
      prompt,
      bookType,
      language,
      style,
      uploadedContext,
    });

    return NextResponse.json({
      bookId,
      jobId,
      status: 'planning',
      message: 'Generation job successfully queued.',
    });
  } catch (err: any) {
    console.error('Create book error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to initiate book generation.' },
      { status: 500 }
    );
  }
}
