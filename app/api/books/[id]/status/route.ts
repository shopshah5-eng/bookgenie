// app/api/books/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GenerationPipeline } from '@/lib/ai/pipeline';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const url = new URL(req.url);
    const jobId = url.searchParams.get('jobId') || id;

    // 1. Query Supabase PostgreSQL jobs table
    try {
      const { createAdminClient } = await import('@/lib/supabase/admin');
      const supabase = createAdminClient();
      const { data: dbJob } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (dbJob) {
        const stageDescriptions: Record<string, string[]> = {
          planning: ['Idea Analyzed', 'Crafting Book Blueprint'],
          writing: ['Idea Analyzed', 'Structure & Chapters Crafted', 'Writing Chapter Content'],
          generating_visuals: ['Idea Analyzed', 'Structure & Chapters Crafted', 'Rendering Luxury Artworks'],
          designing: ['Idea Analyzed', 'Structure & Chapters Crafted', 'Artwork Rendered', 'Composing Page Blocks'],
          completed: ['Idea Analyzed', 'Structure & Chapters Crafted', 'Artwork Rendered', 'Quality Check Passed', 'Your Book Is Ready'],
          failed: ['Publishing interrupted'],
        };

        return NextResponse.json({
          id: dbJob.id,
          bookId: dbJob.book_id,
          status: dbJob.status,
          stage: dbJob.stage,
          progress: dbJob.progress,
          stepsCompleted: stageDescriptions[dbJob.stage] || ['Analyzing creative tone'],
          error: dbJob.error_message || null,
        });
      }
    } catch (dbErr) {
      console.warn('Supabase job status fetch warning:', dbErr);
    }

    // 2. Query in-memory dev store fallback
    const job = GenerationPipeline.getJobState(jobId);
    if (job) {
      return NextResponse.json({
        id: job.id,
        bookId: job.bookId,
        status: job.status,
        stage: job.stage,
        progress: job.progress,
        stepsCompleted: job.stepsCompleted,
        error: job.error || null,
      });
    }

    // 3. Genuine 404 - never fake success
    return NextResponse.json(
      {
        id: jobId,
        status: 'not_found',
        error: 'Job not found or has expired.',
      },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch status.' },
      { status: 500 }
    );
  }
}
