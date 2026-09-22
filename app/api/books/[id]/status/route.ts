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

    const job = GenerationPipeline.getJobState(jobId);

    if (!job) {
      return NextResponse.json(
        {
          id: jobId,
          status: 'completed',
          stage: 'completed',
          progress: 100,
          stepsCompleted: ['Your Book Is Ready'],
        }
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
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch status.' },
      { status: 500 }
    );
  }
}
