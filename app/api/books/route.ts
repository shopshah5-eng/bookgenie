import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'You must be signed in to view your bookshelf.' },
        { status: 401 }
      );
    }

    let booksList: any[] = [];

    try {
      const admin = createAdminClient();
      const { data: books, error: dbError } = await admin
        .from('books')
        .select('id, title, subtitle, author, cover_url, cover_image_url, status, page_count, created_at, updated_at, is_shared, share_token')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!dbError && books) {
        booksList = books.map((b) => ({
          ...b,
          cover_url: b.cover_url || b.cover_image_url,
          cover_image_url: b.cover_image_url || b.cover_url,
        }));
      }
    } catch (dbErr) {
      console.warn('[Books DB Fetch Warning]:', dbErr);
    }

    // Merge dev pipeline in-memory books if available
    try {
      const { GenerationPipeline } = await import('@/lib/ai/pipeline');
      const devBooks = GenerationPipeline.getUserBooks(user.id);
      for (const db of devBooks) {
        if (!booksList.some((b) => b.id === db.id)) {
          booksList.push({
            id: db.id,
            title: db.title,
            subtitle: db.subtitle,
            cover_url: db.coverUrl,
            cover_image_url: db.coverUrl,
            status: 'completed',
            page_count: db.pageCount || db.pages.length,
            created_at: db.createdAt,
            updated_at: db.updatedAt,
          });
        }
      }
    } catch (_) {}

    return NextResponse.json({
      books: booksList,
    });
  } catch (err: any) {
    console.error('[Books Route Error]:', err);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: err.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
