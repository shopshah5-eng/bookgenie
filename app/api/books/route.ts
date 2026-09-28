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

    const admin = createAdminClient();
    const { data: books, error: dbError } = await admin
      .from('books')
      .select('id, title, subtitle, author, cover_image_url, status, page_count, created_at, updated_at, is_shared, share_token')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (dbError) {
      console.error('[Books Fetch Error]:', dbError);
      return NextResponse.json(
        { error: 'DATABASE_ERROR', message: 'Failed to retrieve books.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      books: books || [],
    });
  } catch (err: any) {
    console.error('[Books Route Error]:', err);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: err.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
