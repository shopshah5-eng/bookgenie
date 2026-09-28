import { NextRequest, NextResponse } from 'next/server';
import { GenerationPipeline } from '@/lib/ai/pipeline';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

interface JobRecord {
  id: string;
  book_id: string;
  status: string;
  stage: string;
  progress: number;
  title?: string;
  subtitle?: string;
  cover_url?: string;
  page_count?: number;
  error_message?: string;
}

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

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const jobIdParam = new URL(req.url).searchParams.get('jobId');

    // Status is private operational data. Require the owner before querying a
    // job, otherwise a guessed job ID could be used to enumerate book metadata.
    const sessionClient = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await sessionClient.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required to view generation status.' },
        { status: 401 }
      );
    }

    const admin = createAdminClient();
    const { data: dbBook, error: bookError } = await admin
      .from('books')
      .select('id, user_id, title, subtitle, cover_url, cover_image_url, page_count')
      .eq('id', id)
      .maybeSingle();

    if (bookError) throw bookError;

    if (dbBook) {
      if (dbBook.user_id !== user.id) {
        return NextResponse.json(
          { error: 'FORBIDDEN', message: 'You do not have access to this generation job.' },
          { status: 403 }
        );
      }

      let dbJob: JobRecord | null = null;
      if (jobIdParam) {
        const { data, error } = await admin
          .from('jobs')
          .select('*')
          .eq('id', jobIdParam)
          .maybeSingle();
        if (error) throw error;
        if (data && data.book_id !== id) {
          return NextResponse.json(
            { error: 'NOT_FOUND', message: 'Job ID does not match the requested book.' },
            { status: 404 }
          );
        }
        dbJob = data as JobRecord | null;
      } else {
        const { data, error } = await admin
          .from('jobs')
          .select('*')
          .eq('book_id', id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (error) throw error;
        dbJob = data as JobRecord | null;
      }

      if (!dbJob) {
        return NextResponse.json(
          { error: 'NOT_FOUND', message: 'Generation job not found.' },
          { status: 404 }
        );
      }

      let activeJob: JobRecord = dbJob;
      if (dbJob.status !== 'completed' && dbJob.status !== 'failed') {
        const advanced = await GenerationPipeline.advanceJob(dbJob.id, id);
        if (advanced) activeJob = { ...dbJob, ...advanced } as JobRecord;
      }

      return NextResponse.json({
        id: activeJob.id,
        bookId: activeJob.book_id,
        status: activeJob.status,
        stage: activeJob.stage,
        progress: activeJob.progress,
        title: dbBook.title || activeJob.title || 'Untitled eBook',
        subtitle: dbBook.subtitle || activeJob.subtitle || '',
        cover_url: dbBook.cover_url || dbBook.cover_image_url || activeJob.cover_url || null,
        page_count: dbBook.page_count ?? activeJob.page_count ?? 0,
        stepsCompleted: stageDescriptions[activeJob.stage] || ['Analyzing creative tone'],
        error: activeJob.error_message || null,
      });
    }

    // A local in-memory job is only valid when it belongs to the authenticated
    // user. It is never treated as a durable production job.
    const effectiveJobId = jobIdParam || id;
    const memoryJob = GenerationPipeline.getJobState(effectiveJobId);
    const memoryBook = GenerationPipeline.getBook(id);
    if (memoryJob && memoryBook && memoryJob.bookId === id && memoryBook.userId === user.id) {
      return NextResponse.json({
        id: memoryJob.id,
        bookId: memoryJob.bookId,
        status: memoryJob.status,
        stage: memoryJob.stage,
        progress: memoryJob.progress,
        title: memoryJob.title || memoryBook.title,
        subtitle: memoryJob.subtitle || memoryBook.subtitle || '',
        cover_url: memoryJob.coverUrl || memoryBook.coverUrl || null,
        page_count: memoryJob.pageCount ?? memoryBook.pageCount,
        stepsCompleted: memoryJob.stepsCompleted,
        error: memoryJob.error || null,
      });
    }

    return NextResponse.json(
      { id: effectiveJobId, status: 'not_found', error: 'Job not found or has expired.' },
      { status: 404 }
    );
  } catch (err) {
    console.error('Generation status error:', err);
    return NextResponse.json(
      { error: 'STATUS_UNAVAILABLE', message: 'Generation status is temporarily unavailable.' },
      { status: 503 }
    );
  }
}
