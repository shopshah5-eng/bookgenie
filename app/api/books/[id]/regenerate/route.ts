// app/api/books/[id]/regenerate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GenerationPipeline } from '@/lib/ai/pipeline';
import { OpenRouterTextProvider } from '@/lib/ai/openrouter';
import { GeminiImageProvider } from '@/lib/ai/gemini';
import { getOceanWondersDemoBook } from '../route';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { instruction, targetPageNumbers } = body;

    if (!instruction || typeof instruction !== 'string') {
      return NextResponse.json(
        { error: 'An editorial revision instruction is required.' },
        { status: 400 }
      );
    }

    let book = GenerationPipeline.getBook(id);
    if (!book) {
      book = getOceanWondersDemoBook();
      book.id = id;
    }

    const textProvider = new OpenRouterTextProvider();
    const imageProvider = new GeminiImageProvider();

    // 1. Perform targeted natural-language page revision
    const result = await textProvider.regeneratePages({
      blueprint: book.blueprint,
      existingPages: book.pages,
      instruction,
      targetPageNumbers,
    });

    // 2. Only regenerate an image if explicitly requested
    if (result.requiresImageRegeneration && result.imageInstructions) {
      for (const imgReq of result.imageInstructions) {
        await imageProvider.generateImage({
          prompt: imgReq.prompt,
          bookTitle: book.title,
          style: book.style,
          isCover: imgReq.pageNumber === 1,
        });
      }
    }

    // 3. Increment version number and update document snapshot
    const updatedBook = {
      ...book,
      pages: result.pages,
      versionNumber: (book.versionNumber || 1) + 1,
      updatedAt: new Date().toISOString(),
    };

    GenerationPipeline.saveBook(updatedBook);

    return NextResponse.json({
      success: true,
      book: updatedBook,
      versionNumber: updatedBook.versionNumber,
      message: `Version ${updatedBook.versionNumber} successfully compiled.`,
    });
  } catch (err: any) {
    console.error('Regenerate error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to apply editorial revision.' },
      { status: 500 }
    );
  }
}
