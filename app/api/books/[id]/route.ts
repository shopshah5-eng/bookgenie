import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getServerBook } from '@/lib/book/server-books';
import { getOceanWondersDemoBook } from '@/lib/book/demo-book';

export { getOceanWondersDemoBook };

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const book = await getServerBook(id);

    if (!book) {
      return NextResponse.json({ error: 'Book not found.' }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (err) {
    console.error('Book fetch error:', err);
    return NextResponse.json(
      { error: 'Failed to load book.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required to delete a book.' },
        { status: 401 }
      );
    }

    const admin = createAdminClient();
    const { data: dbBook, error: bookError } = await admin
      .from('books')
      .select('id, user_id')
      .eq('id', id)
      .maybeSingle();

    if (bookError || !dbBook) {
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

    const { error: deleteError } = await admin.from('books').delete().eq('id', id);
    if (deleteError) {
      return NextResponse.json(
        { error: 'DELETE_FAILED', message: 'Failed to delete book.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Book deleted successfully.' });
  } catch (err) {
    console.error('Book deletion error:', err);
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: 'Failed to process deletion.' },
      { status: 500 }
    );
  }
}
