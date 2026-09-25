// app/api/books/[id]/regenerate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GenerationPipeline } from '@/lib/ai/pipeline';
import { OpenRouterTextProvider } from '@/lib/ai/openrouter';
import { GeminiImageProvider } from '@/lib/ai/gemini';
import { PollinationsImageProvider } from '@/lib/ai/pollinations';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getOceanWondersDemoBook } from '../route';
import type { BookDocument } from '@/lib/book/types';

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

    const admin = createAdminClient();

    // 1. Verify user authentication & ownership if in authenticated mode
    let currentUserId: string | null = null;
    try {
      const serverSupabase = await createServerSupabaseClient();
      const { data: { user } } = await serverSupabase.auth.getUser();
      if (user) currentUserId = user.id;
    } catch {
      // Local development or simulated session
    }

    // 2. Fetch current book from Supabase
    let book: BookDocument | null = null;

    try {
      const { data: dbBook } = await admin
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

      if (dbBook) {
        if (currentUserId && dbBook.user_id !== currentUserId) {
          return NextResponse.json(
            { error: 'Unauthorized. You cannot modify publications belonging to another creator.' },
            { status: 403 }
          );
        }

        const { data: dbPages } = await admin
          .from('book_pages')
          .select('*')
          .eq('book_id', id)
          .order('page_number', { ascending: true });

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
          coverUrl: dbBook.cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
          blueprint: dbBook.blueprint,
          pages: (dbPages || []).map((p) => ({
            pageNumber: p.page_number,
            chapterIndex: p.chapter_index,
            title: p.title,
            pageType: p.page_type,
            layout: p.layout,
            blocks: p.blocks,
          })),
          versionNumber: dbBook.version_number || 1,
          createdAt: dbBook.created_at,
          updatedAt: dbBook.updated_at,
        };
      }
    } catch (dbErr) {
      console.warn('Supabase book lookup for revision warning:', dbErr);
    }

    if (!book) {
      book = GenerationPipeline.getBook(id) || null;
    }

    if (!book) {
      if (id === 'ocean-wonders' || id === 'demo-ocean-wonders') {
        book = getOceanWondersDemoBook();
      } else {
        return NextResponse.json({ error: 'Publication not found.' }, { status: 404 });
      }
    }

    const textProvider = new OpenRouterTextProvider();
    const imageProvider = process.env.AI_IMAGE_PROVIDER === 'gemini' && process.env.GEMINI_API_KEY
      ? new GeminiImageProvider()
      : new PollinationsImageProvider();

    // 3. Save snapshot of CURRENT version to book_versions before applying changes
    const previousVersion = book.versionNumber || 1;
    const newVersion = previousVersion + 1;

    try {
      await admin.from('book_versions').insert({
        book_id: book.id,
        version_number: previousVersion,
        document_snapshot: JSON.parse(JSON.stringify(book)),
        change_instruction: instruction,
      });
    } catch (snapshotErr) {
      console.warn('Version snapshot notice:', snapshotErr);
    }

    // 4. Perform targeted natural-language page revision
    const result = await textProvider.regeneratePages({
      blueprint: book.blueprint,
      existingPages: book.pages,
      instruction,
      targetPageNumbers,
    });

    // 5. Only regenerate an image if explicitly requested
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

    // 6. Assemble updated canonical document
    const updatedBook: BookDocument = {
      ...book,
      pages: result.pages,
      versionNumber: newVersion,
      updatedAt: new Date().toISOString(),
    };

    GenerationPipeline.saveBook(updatedBook);

    // 7. Persist updated version and pages to Supabase
    try {
      await admin
        .from('books')
        .update({
          version_number: newVersion,
          updated_at: new Date().toISOString(),
        })
        .eq('id', book.id);

      for (const page of result.pages) {
        await admin.from('book_pages').upsert(
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
      }
    } catch (persistErr) {
      console.warn('Supabase revision persistence warning:', persistErr);
    }

    return NextResponse.json({
      success: true,
      book: updatedBook,
      versionNumber: newVersion,
      message: `Version ${newVersion} successfully compiled.`,
    });
  } catch (err: unknown) {
    console.error('Regenerate error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to apply editorial revision.' },
      { status: 500 }
    );
  }
}
