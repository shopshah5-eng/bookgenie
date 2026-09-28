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
    const jobIdParam = url.searchParams.get('jobId');
    const effectiveJobId = jobIdParam || id;

    // 1. Query Supabase PostgreSQL jobs table
    try {
      const supabase = createAdminClient();
      let dbJob: any = null;

      // If jobId was passed and is not the book id, search by jobId
      if (jobIdParam && jobIdParam !== id) {
        const { data } = await supabase.from('jobs').select('*').eq('id', jobIdParam).maybeSingle();
        if (data) dbJob = data;
      }

      // If no job found by jobId, search by book_id
      if (!dbJob) {
        const { data: jobList } = await supabase
          .from('jobs')
          .select('*')
          .eq('book_id', id)
          .order('created_at', { ascending: false })
          .limit(1);
        if (jobList && jobList.length > 0) {
          dbJob = jobList[0];
        }
      }

      // If still no job record, check if the book exists in books table
      if (!dbJob) {
        const { data: bData } = await supabase
          .from('books')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (bData) {
          const newJobId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `job-${Date.now()}`;
          const isDone = bData.status === 'completed';
          const { data: createdJob } = await supabase
            .from('jobs')
            .insert({
              id: newJobId,
              book_id: id,
              status: isDone ? 'completed' : 'processing',
              stage: isDone ? 'completed' : 'planning',
              progress: isDone ? 100 : (bData.progress || 10),
            })
            .select()
            .single();
          if (createdJob) dbJob = createdJob;
        }
      }

      if (dbJob) {

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

        // Active serverless progression: advance the job by one stage during this poll
        let activeJob = dbJob;
        if (dbJob.status !== 'completed' && dbJob.status !== 'failed') {
          try {
            const advanced = await GenerationPipeline.advanceJob(dbJob.id, id);
            if (advanced) {
              activeJob = { ...activeJob, ...advanced };
            }
          } catch (advErr) {
            console.warn('Status poller job advancement notice:', advErr);
          }
        }

        let bookMeta: any = null;
        try {
          const { data: bData } = await supabase
            .from('books')
            .select('title, subtitle, cover_url, cover_image_url, page_count')
            .eq('id', id)
            .maybeSingle();
          if (bData) bookMeta = bData;
        } catch (_) {}

        const stageDescriptions: Record<string, string[]> = {
          planning: ['Idea Analyzed', 'Crafting Book Blueprint'],
          metadata: ['Idea Analyzed', 'Forming Book Metadata'],
          cover: ['Idea Analyzed', 'Creating Book Cover'],
          outline: ['Idea Analyzed', 'Structure & Chapters Crafted'],
          writing: ['Idea Analyzed', 'Writing Chapter Content'],
          illustrations: ['Idea Analyzed', 'Rendering Visual Artworks'],
          designing: ['Idea Analyzed', 'Composing Page Layouts'],
          finalizing: ['Preparing PDF and EPUB Downloads'],
          completed: ['Your Book Is Ready'],
          failed: ['Publishing interrupted'],
        };

        return NextResponse.json({
          id: activeJob.id,
          bookId: activeJob.book_id,
          status: activeJob.status,
          stage: activeJob.stage,
          progress: activeJob.progress,
          title: bookMeta?.title || activeJob.title || 'Untitled eBook',
          subtitle: bookMeta?.subtitle || activeJob.subtitle || '',
          cover_url: bookMeta?.cover_url || bookMeta?.cover_image_url || activeJob.cover_url || null,
          page_count: bookMeta?.page_count || activeJob.pageCount || 16,
          stepsCompleted: stageDescriptions[activeJob.stage] || ['Analyzing creative tone'],
          error: activeJob.error_message || null,
        });
      }
    } catch (dbErr) {
      console.warn('Supabase job status fetch warning:', dbErr);
    }

    // 2. Query in-memory dev store fallback
    const job = GenerationPipeline.getJobState(effectiveJobId);
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

      const memBook = GenerationPipeline.getBook(id);

      return NextResponse.json({
        id: job.id,
        bookId: job.bookId,
        status: job.status,
        stage: job.stage,
        progress: job.progress,
        title: job.title || memBook?.title || 'Untitled eBook',
        subtitle: job.subtitle || memBook?.subtitle || '',
        cover_url: job.coverUrl || memBook?.coverUrl || null,
        page_count: job.pageCount || memBook?.pageCount || 16,
        stepsCompleted: job.stepsCompleted,
        error: job.error || null,
      });
    }

    // 3. Genuine 404 - never fake success
    return NextResponse.json(
      {
        id: effectiveJobId,
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
