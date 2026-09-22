// app/api/books/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GenerationPipeline } from '@/lib/ai/pipeline';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, bookType = 'auto', language = 'English', style = 'Modern', uploadedContext } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'A book prompt is required.' },
        { status: 400 }
      );
    }

    // Default user ID if dev/testing
    const userId = 'user-' + Date.now();

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
