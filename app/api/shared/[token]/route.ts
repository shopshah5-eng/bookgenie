import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getOceanWondersDemoBook } from '@/app/api/books/[id]/route';
import { GenerationPipeline } from '@/lib/ai/pipeline';
import type { BookDocument } from '@/lib/book/types';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;

    if (token === 'ocean-wonders' || token === 'demo-ocean-wonders') {
      return NextResponse.json(getOceanWondersDemoBook());
    }

    const admin = createAdminClient();

    // 1. Look up book by share_token where is_shared is true (or by ID if token is uuid)
    const { data: dbBook } = await admin
      .from('books')
      .select('*')
      .or(`share_token.eq.${token},id.eq.${token}`)
      .eq('is_shared', true)
      .single();

    if (dbBook) {
      const { data: dbPages } = await admin
        .from('book_pages')
        .select('*')
        .eq('book_id', dbBook.id)
        .order('page_number', { ascending: true });

      // Sanitized public document: no private user IDs, emails, or internal paths
      const sanitizedDoc: BookDocument = {
        schemaVersion: 1,
        id: dbBook.id,
        userId: 'verified-creator', // Masked for privacy
        title: dbBook.title,
        subtitle: dbBook.subtitle || undefined,
        bookType: dbBook.book_type,
        language: dbBook.language || 'English',
        style: dbBook.style || 'Modern',
        pageCount: dbBook.page_count || dbPages?.length || 0,
        coverUrl: dbBook.blueprint?.visualPlan?.[0]?.url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
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
        isShared: true,
        shareToken: dbBook.share_token,
        createdAt: dbBook.created_at,
        updatedAt: dbBook.updated_at,
      };

      return NextResponse.json(sanitizedDoc);
    }

    // 2. Dev in-memory fallback if testing in local mock mode
    const devBook = GenerationPipeline.getBook(token);
    if (devBook) {
      return NextResponse.json({
        ...devBook,
        userId: 'verified-creator',
      });
    }

    return NextResponse.json(
      { error: 'Shared publication not found or private.' },
      { status: 404 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to retrieve shared publication.' },
      { status: 500 }
    );
  }
}
