import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const PUBLIC_DEMO_IDS = new Set(['ocean-wonders', 'demo-ocean-wonders']);

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Demo publications already have a public, immutable route.
    if (PUBLIC_DEMO_IDS.has(id)) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || req.nextUrl.origin;
      return NextResponse.json({
        success: true,
        shareToken: 'ocean-wonders',
        shareUrl: `${baseUrl}/shared/ocean-wonders`,
        isShared: true,
      });
    }

    const sessionClient = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await sessionClient.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required to share a book.' },
        { status: 401 }
      );
    }

    const admin = createAdminClient();
    const { data: book, error: fetchError } = await admin
      .from('books')
      .select('id, user_id, is_shared, share_token')
      .eq('id', id)
      .maybeSingle();
    if (fetchError) throw fetchError;

    if (!book) {
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Book not found.' }, { status: 404 });
    }
    if (book.user_id !== user.id) {
      return NextResponse.json(
        { error: 'FORBIDDEN', message: 'You do not own this publication.' },
        { status: 403 }
      );
    }

    const shareToken = book.share_token || crypto.randomUUID();
    const { error: updateError } = await admin
      .from('books')
      .update({ is_shared: true, share_token: shareToken })
      .eq('id', id)
      .eq('user_id', user.id);
    if (updateError) throw updateError;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || req.nextUrl.origin;
    return NextResponse.json({
      success: true,
      shareToken,
      shareUrl: `${baseUrl}/shared/${shareToken}`,
      isShared: true,
    });
  } catch (err) {
    console.error('Share book error:', err);
    return NextResponse.json(
      { error: 'SHARE_FAILED', message: 'Failed to generate a share link.' },
      { status: 500 }
    );
  }
}
