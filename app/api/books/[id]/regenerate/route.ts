import { NextRequest, NextResponse } from 'next/server';
import { OpenRouterTextProvider } from '@/lib/ai/openrouter';
import { GeminiImageProvider } from '@/lib/ai/gemini';
import { PollinationsImageProvider } from '@/lib/ai/pollinations';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { persistGeneratedImage } from '@/lib/book/asset-storage';
import type { BookDocument } from '@/lib/book/types';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Publication not found.' }, { status: 404 });
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
    let updatedCoverAssetId = book.coverAssetId;
    const isCoverChange = instruction.toLowerCase().includes('cover') || Boolean(targetPageNumbers?.includes(1));
    if (isCoverChange) {
      const coverPrompt = `${book.title}, ${instruction.trim()}, professional book cover illustration`;
      const coverResult = await imageProvider.generateImage({
        prompt: coverPrompt,
        bookTitle: book.title,
        style: book.style,
        isCover: true,
      });
      const coverAsset = await persistGeneratedImage({
        bookId: book.id,
        userId: user.id,
        type: 'cover',
        prompt: coverPrompt,
        result: coverResult,
      });
      updatedCoverAssetId = coverAsset.id;
      updatedCoverUrl = coverAsset.url;
    }

    let revisedPages = result.pages;
    if (result.requiresImageRegeneration && result.imageInstructions) {
      for (const imageRequest of result.imageInstructions) {
        const imageResult = await imageProvider.generateImage({
          prompt: imageRequest.prompt,
          bookTitle: book.title,
          style: book.style,
          isCover: false,
        });
        const imageAsset = await persistGeneratedImage({
          bookId: book.id,
          userId: user.id,
          type: 'illustration',
          pageNumber: imageRequest.pageNumber,
          prompt: imageRequest.prompt,
          result: imageResult,
        });
        revisedPages = revisedPages.map((page) => {
          if (page.pageNumber !== imageRequest.pageNumber) return page;
          const nextImage = {
            id: `asset-${imageAsset.id}`,
            type: 'image' as const,
            assetId: imageAsset.id,
            url: imageAsset.url,
            caption: imageRequest.prompt,
          };
          const imageExists = page.blocks.some((block) => block.type === 'image');
          return {
            ...page,
            blocks: imageExists
              ? page.blocks.map((block) => block.type === 'image' ? { ...block, ...nextImage } : block)
              : [...page.blocks, nextImage],
          };
        });
      }
    }

    const updatedBook: BookDocument = {
      ...book,
      coverAssetId: updatedCoverAssetId,
      coverUrl: updatedCoverUrl,
      pages: revisedPages,
      versionNumber: newVersion,
      updatedAt: new Date().toISOString(),
    };

    const { error: updateError } = await admin
      .from('books')
      .update({
        cover_asset_id: updatedCoverAssetId,
        cover_url: updatedCoverUrl,
        cover_image_url: updatedCoverUrl,
        version_number: newVersion,
        updated_at: updatedBook.updatedAt,
      })
      .eq('id', book.id)
      .eq('user_id', user.id);
    if (updateError) throw updateError;

    for (const page of revisedPages) {
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
