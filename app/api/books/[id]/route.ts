import { NextRequest, NextResponse } from 'next/server';
import { GenerationPipeline } from '@/lib/ai/pipeline';
import type { BookDocument } from '@/lib/book/types';
import { getDemoBook, getOceanWondersDemoBook } from '@/lib/book/demo-book';

export { getOceanWondersDemoBook };

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const demoBook = getDemoBook(id);
    if (demoBook) {
      return NextResponse.json(demoBook);
    }

    if (id === 'ocean-wonders' || id === 'demo-ocean-wonders') {
      return NextResponse.json(getOceanWondersDemoBook());
    }

    // 1. Query Supabase PostgreSQL
    try {
      const { createAdminClient } = await import('@/lib/supabase/admin');
      const supabase = createAdminClient();
      const { data: dbBook } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

      if (dbBook) {
        const isPublicDemo = id === 'demo-ocean-wonders' || id === 'ocean-wonders';
        if (!isPublicDemo && !dbBook.is_shared) {
          try {
            const { createServerSupabaseClient } = await import('@/lib/supabase/server');
            const serverSupabase = await createServerSupabaseClient();
            const {
              data: { user },
            } = await serverSupabase.auth.getUser();
            if (user && user.id !== dbBook.user_id) {
              return NextResponse.json(
                { error: 'FORBIDDEN', message: 'You do not have access to this private book.' },
                { status: 403 }
              );
            }
          } catch {
            // Auth verification notice
          }
        }

        const { data: dbPages } = await supabase
          .from('book_pages')
          .select('*')
          .eq('book_id', id)
          .order('page_number', { ascending: true });

        const doc: BookDocument = {
          schemaVersion: 1,
          id: dbBook.id,
          userId: dbBook.user_id,
          title: dbBook.title,
          subtitle: dbBook.subtitle || undefined,
          bookType: dbBook.book_type,
          language: dbBook.language || 'English',
          style: dbBook.style || 'Modern',
          pageCount: dbBook.page_count || dbPages?.length || 0,
          coverUrl: dbBook.blueprint?.visualPlan?.[0]?.url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
          blueprint: dbBook.blueprint || {
            title: dbBook.title,
            bookType: dbBook.book_type,
            audience: 'General Readers',
            language: dbBook.language,
            style: dbBook.style,
            pageTarget: dbBook.page_target || 16,
            chapters: [],
            visualPlan: [],
          },
          pages: (dbPages || []).map((p) => ({
            pageNumber: p.page_number,
            chapterIndex: p.chapter_index,
            title: p.title,
            pageType: p.page_type,
            layout: p.layout,
            blocks: p.blocks,
          })),
          versionNumber: dbBook.version_number || 1,
          isShared: dbBook.is_shared,
          shareToken: dbBook.share_token,
          createdAt: dbBook.created_at,
          updatedAt: dbBook.updated_at,
        };

        return NextResponse.json(doc);
      }
    } catch (dbErr) {
      console.warn('Supabase fetch error, checking dev store:', dbErr);
    }

    // 2. Check local dev memory store
    const book = GenerationPipeline.getBook(id);
    if (book) {
      return NextResponse.json(book);
    }

    return NextResponse.json(
      { error: 'Book not found.' },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Book not found.' },
      { status: 404 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required to delete a book.' },
        { status: 401 }
      );
    }

    const { createAdminClient } = await import('@/lib/supabase/admin');
    const admin = createAdminClient();

    // Verify ownership
    const { data: dbBook } = await admin
      .from('books')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (!dbBook) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Book not found.' },
        { status: 404 }
      );
    }

    if (dbBook.user_id !== user.id) {
      return NextResponse.json(
        { error: 'FORBIDDEN', message: 'You do not have permission to delete this book.' },
        { status: 403 }
      );
    }

    // Delete associated pages and book
    await admin.from('book_pages').delete().eq('book_id', id);
    const { error: deleteError } = await admin.from('books').delete().eq('id', id);

    if (deleteError) {
      return NextResponse.json(
        { error: 'DELETE_FAILED', message: 'Failed to delete book.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Book deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: err.message || 'Failed to process deletion.' },
      { status: 500 }
    );
  }
}

