import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

interface BookSummaryRow {
  id: string;
  title: string;
  subtitle: string | null;
  cover_url: string | null;
  cover_image_url: string | null;
  status: string;
  page_count: number | null;
  created_at: string;
  updated_at: string;
  is_shared: boolean;
  share_token: string | null;
}

export async function GET() {
  try {
    const sessionClient = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await sessionClient.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'You must be signed in to view your bookshelf.' },
        { status: 401 }
      );
    }

    const admin = createAdminClient();
    const { data: books, error: dbError } = await admin
      .from('books')
      .select('id, title, subtitle, cover_url, cover_image_url, status, page_count, created_at, updated_at, is_shared, share_token')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (dbError) throw dbError;

    const booksList = ((books || []) as BookSummaryRow[]).map((book) => ({
      ...book,
      cover_url: book.cover_url || book.cover_image_url,
      cover_image_url: book.cover_image_url || book.cover_url,
    }));

    return NextResponse.json({ books: booksList });
  } catch (err) {
    console.error('[Books Route Error]:', err);
    return NextResponse.json(
      { error: 'LIBRARY_UNAVAILABLE', message: 'Your bookshelf is temporarily unavailable.' },
      { status: 503 }
    );
  }
}
