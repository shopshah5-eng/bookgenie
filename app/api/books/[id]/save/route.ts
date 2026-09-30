import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { BookDocument } from '@/lib/book/types';

function isBookDocument(value: unknown): value is BookDocument {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<BookDocument>;
  return candidate.id !== undefined && Array.isArray(candidate.pages) && typeof candidate.title === 'string';
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body: unknown = await req.json().catch(() => null);
    const bookData = body && typeof body === 'object' && 'bookData' in body
      ? (body as { bookData?: unknown }).bookData
      : undefined;

    if (!isBookDocument(bookData) || bookData.id !== id) {
      return NextResponse.json(
        { error: 'INVALID_BOOK', message: 'A valid book document for this book is required.' },
        { status: 400 }
      );
    }

    const { getAuthenticatedUser } = await import('@/lib/supabase/server');
    const { user, error: authError } = await getAuthenticatedUser(req);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required to save changes.' },
        { status: 401 }
      );
    }

    const admin = createAdminClient();
    const { data: dbBook, error: bookError } = await admin
      .from('books')
      .select('id, user_id')
      .eq('id', id)
      .maybeSingle();

    if (bookError) throw bookError;
    if (!dbBook) {
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Book not found.' }, { status: 404 });
    }
    if (dbBook.user_id !== user.id) {
      return NextResponse.json(
        { error: 'FORBIDDEN', message: 'You do not own this book.' },
        { status: 403 }
      );
    }

    const { error: updateError } = await admin
      .from('books')
      .update({
        title: bookData.title,
        subtitle: bookData.subtitle,
        cover_asset_id: bookData.coverAssetId || null,
        cover_url: bookData.coverUrl,
        cover_image_url: bookData.coverUrl,
        page_count: bookData.pageCount || bookData.pages.length,
        version_number: bookData.versionNumber || 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    if (updateError) throw updateError;

    for (const page of bookData.pages) {
      const { error: pageError } = await admin.from('book_pages').upsert(
        {
          book_id: id,
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

    return NextResponse.json({ success: true, message: 'Changes saved successfully.' });
  } catch (err) {
    console.error('Save book error:', err);
    return NextResponse.json(
      { error: 'SAVE_FAILED', message: 'Failed to save changes.' },
      { status: 500 }
    );
  }
}
