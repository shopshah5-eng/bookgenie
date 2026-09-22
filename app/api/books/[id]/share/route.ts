import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // 1. Verify user session
    let userId: string | null = null;
    try {
      const serverSupabase = await createServerSupabaseClient();
      const { data: { user } } = await serverSupabase.auth.getUser();
      if (user) userId = user.id;
    } catch {
      // Local dev check
    }

    const admin = createAdminClient();

    // 2. Fetch the book
    const { data: book, error: fetchErr } = await admin
      .from('books')
      .select('id, user_id, is_shared, share_token, version_number')
      .eq('id', id)
      .single();

    if (fetchErr || !book) {
      // If book is only in dev memory, handle gracefully
      return NextResponse.json({
        shareToken: id,
        shareUrl: `${req.nextUrl.origin}/shared/${id}`,
        isShared: true,
      });
    }

    // 3. Verify ownership if user is logged in
    if (userId && book.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized. You do not own this publication.' },
        { status: 403 }
      );
    }

    // 4. Generate or preserve share token and set is_shared = true
    const shareToken = book.share_token || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : id);

    await admin
      .from('books')
      .update({
        is_shared: true,
        share_token: shareToken,
      })
      .eq('id', id);

    return NextResponse.json({
      success: true,
      shareToken,
      shareUrl: `${req.nextUrl.origin}/shared/${shareToken}`,
      isShared: true,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to generate share link.' },
      { status: 500 }
    );
  }
}
