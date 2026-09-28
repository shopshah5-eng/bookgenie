import { NextRequest, NextResponse } from 'next/server';
import { GenerationPipeline } from '@/lib/ai/pipeline';
import { OpenRouterTextProvider } from '@/lib/ai/openrouter';
import { GeminiImageProvider } from '@/lib/ai/gemini';
import { PollinationsImageProvider } from '@/lib/ai/pollinations';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { BookDocument } from '@/lib/book/types';

const DEMO_IDS = new Set(['ocean-wonders', 'demo-ocean-wonders']);

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (DEMO_IDS.has(id)) {
      return NextResponse.json(
        { error: 'Demo publications are read-only.' },
        { status: 403 }
      );
    }

    const body: unknown = await req.json().catch(() => null);
    const instruction = body && typeof body === 'object' && 'instruction' in body
      ? (body as { instruction?: unknown }).instruction
      : undefined;
    const requestedTargets = body && typeof body === 'object' && 'targetPageNumbers' in body
      ? (body as { targetPageNumbers?: unknown }).targetPageNumbers
      : undefined;

    if (typeof instruction !== 'string' || instruction.trim().length < 3 || instruction.length > 4000) {
      return NextResponse.json(
        { error: 'An editorial revision instruction between 3 and 4,000 characters is required.' },
        { status: 400 }
      );
    }

    const targetPageNumbers = requestedTargets === undefined
      ? undefined
      : Array.isArray(requestedTargets) && requestedTargets.every(
          (page): page is number => Number.isInteger(page) && page > 0 && page <= 1000
        )
        ? requestedTargets
        : null;
    if (targetPageNumbers === null) {
      return NextResponse.json({ error: 'targetPageNumbers must contain positive page numbers.' }, { status: 400 });
    }

    const sessionClient = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await sessionClient.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required to revise a book.' },
        { status: 401 }
      );
    }

    const admin = createAdminClient();
    const { data: dbBook, error: bookError } = await admin
      .from('books')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (bookError) throw bookError;

    let book: BookDocument | null = null;
    if (dbBook) {
      if (dbBook.user_id !== user.id) {
        return NextResponse.json(
          { error: 'FORBIDDEN', message: 'You cannot modify another creator’s publication.' },
          { status: 403 }
        );
      }

      const { data: dbPages, error: pagesError } = await admin
        .from('book_pages')
        .select('*')
        .eq('book_id', id)
        .order('page_number', { ascending: true });
      if (pagesError) throw pagesError;

      book = {
        schemaVersion: 1,
        id: dbBook.id,
        userId: dbBook.user_id,
        title: dbBook.title,
        subtitle: dbBook.subtitle || undefined,
        bookType: dbBook.book_type,
        language: dbBook.language || 'English',
        style: dbBook.style || 'Modern',
        pageCount: dbBook.page_count || dbPages?.length || 0,
        coverUrl: dbBook.cover_url || dbBook.cover_image_url || undefined,
        blueprint: dbBook.blueprint,
        pages: (dbPages || []).map((page) => ({
          pageNumber: page.page_number,
          chapterIndex: page.chapter_index,
          title: page.title,
          pageType: page.page_type,
          layout: page.layout,
          blocks: page.blocks,
        })),
        versionNumber: dbBook.version_number || 1,
        isShared: dbBook.is_shared,
        shareToken: dbBook.share_token,
        createdAt: dbBook.created_at,
        updatedAt: dbBook.updated_at,
      };
    } else {
      const memoryBook = GenerationPipeline.getBook(id);
      if (!memoryBook || memoryBook.userId !== user.id) {
        return NextResponse.json({ error: 'NOT_FOUND', message: 'Publication not found.' }, { status: 404 });
      }
      book = memoryBook;
    }

    const textProvider = new OpenRouterTextProvider();
    const imageProvider = process.env.AI_IMAGE_PROVIDER === 'gemini'
      ? new GeminiImageProvider()
      : new PollinationsImageProvider();

    const previousVersion = book.versionNumber || 1;
    const newVersion = previousVersion + 1;

    const { error: snapshotError } = await admin.from('book_versions').insert({
      book_id: book.id,
      version_number: previousVersion,
      document_snapshot: book,
      change_instruction: instruction.trim(),
    });
    if (snapshotError) throw snapshotError;

    const result = await textProvider.regeneratePages({
      blueprint: book.blueprint,
      existingPages: book.pages,
      instruction: instruction.trim(),
      targetPageNumbers,
    });

    let updatedCoverUrl = book.coverUrl;
    const isCoverChange = instruction.toLowerCase().includes('cover') || Boolean(targetPageNumbers?.includes(1));
    if (isCoverChange) {
      const coverResult = await imageProvider.generateImage({
        prompt: `${book.title}, ${instruction.trim()}, professional book cover illustration`,
        bookTitle: book.title,
        style: book.style,
        isCover: true,
      });
      updatedCoverUrl = coverResult.url || updatedCoverUrl;
    }

    if (result.requiresImageRegeneration && result.imageInstructions) {
      for (const imageRequest of result.imageInstructions) {
        await imageProvider.generateImage({
          prompt: imageRequest.prompt,
          bookTitle: book.title,
          style: book.style,
          isCover: imageRequest.pageNumber === 1,
        });
      }
    }

    const updatedBook: BookDocument = {
      ...book,
      coverUrl: updatedCoverUrl,
      pages: result.pages,
      versionNumber: newVersion,
      updatedAt: new Date().toISOString(),
    };

    const { error: updateError } = await admin
      .from('books')
      .update({
        cover_url: updatedCoverUrl,
        cover_image_url: updatedCoverUrl,
        version_number: newVersion,
        updated_at: updatedBook.updatedAt,
      })
      .eq('id', book.id)
      .eq('user_id', user.id);
    if (updateError) throw updateError;

    for (const page of result.pages) {
      const { error: pageError } = await admin.from('book_pages').upsert(
        {
          book_id: book.id,
          page_number: page.pageNumber,
          chapter_index: page.chapterIndex || 1,
          title: page.title || '',
          page_type: page.pageType || 'illustrated_content',
          layout: page.layout || 'standard',
          blocks: page.blocks,
        },
        { onConflict: 'book_id,page_number' }
      );
      if (pageError) throw pageError;
    }

    GenerationPipeline.saveBook(updatedBook);
    return NextResponse.json({
      success: true,
      book: updatedBook,
      versionNumber: newVersion,
      message: `Version ${newVersion} successfully compiled.`,
    });
  } catch (err) {
    console.error('Regenerate error:', err);
    return NextResponse.json(
      { error: 'REVISION_FAILED', message: 'Failed to apply editorial revision.' },
      { status: 500 }
    );
  }
}
