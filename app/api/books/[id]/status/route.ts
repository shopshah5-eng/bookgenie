// app/api/books/[id]/status/route.ts
// Secure job status endpoint with path-to-job ID validation and ownership checks

import { NextRequest, NextResponse } from 'next/server';
import { GenerationPipeline } from '@/lib/ai/pipeline';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

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
      const supabase = createAdminClient();
      const { data: dbJob } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (dbJob) {
        // Enforce ID Match: Path book ID must match the job's book_id
        if (dbJob.book_id !== id) {
          return NextResponse.json(
            {
              error: 'NOT_FOUND',
              message: 'Job ID does not match the requested book path.',
            },
            { status: 404 }
          );
        }

        // Check ownership if user is authenticated and not public demo
        if (id !== 'ocean-wonders' && id !== 'demo-ocean-wonders') {
          try {
            const serverSupabase = await createServerSupabaseClient();
            const {
              data: { user },
            } = await serverSupabase.auth.getUser();

            if (user) {
              const { data: book } = await supabase
                .from('books')
                .select('user_id, is_shared')
                .eq('id', id)
                .single();

              if (book && book.user_id && book.user_id !== user.id && !book.is_shared) {
                return NextResponse.json(
                  { error: 'FORBIDDEN', message: 'You do not have access to this generation job.' },
                  { status: 403 }
                );
              }
            }
          } catch (authErr) {
            console.warn('Status auth verification check notice:', authErr);
          }
        }

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
      // Enforce ID Match in dev store
      if (job.bookId !== id) {
        return NextResponse.json(
          {
            error: 'NOT_FOUND',
            message: 'Job ID does not match the requested book path.',
          },
          { status: 404 }
        );
      }

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
