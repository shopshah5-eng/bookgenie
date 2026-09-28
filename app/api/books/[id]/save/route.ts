import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { GenerationPipeline } from '@/lib/ai/pipeline';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json().catch(() => ({}));
    const { bookData } = body;

    const admin = createAdminClient();

    // Check ownership if authenticated
    try {
      const serverSupabase = await createServerSupabaseClient();
      const { data: { user } } = await serverSupabase.auth.getUser();
      if (user && id !== 'ocean-wonders') {
        const { data: b } = await admin
          .from('books')
          .select('user_id')
          .eq('id', id)
          .single();
        if (b && b.user_id && b.user_id !== user.id) {
          return NextResponse.json(
            { error: 'Unauthorized to save changes to this book.' },
            { status: 403 }
          );
        }
      }
    } catch (_) {}

    if (bookData) {
      GenerationPipeline.saveBook(bookData);

      try {
        await admin
          .from('books')
          .update({
            title: bookData.title,
            subtitle: bookData.subtitle,
            cover_url: bookData.coverUrl,
            cover_image_url: bookData.coverUrl,
            page_count: bookData.pageCount || bookData.pages?.length,
            version_number: bookData.versionNumber || 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (bookData.pages && Array.isArray(bookData.pages)) {
          for (const page of bookData.pages) {
            await admin.from('book_pages').upsert(
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
          }
        }
      } catch (dbErr) {
        console.warn('Supabase save error:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Changes saved successfully.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to save changes.' },
      { status: 500 }
    );
  }
}
