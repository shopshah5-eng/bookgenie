// app/api/books/[id]/export/route.ts
// On-demand binary PDF/EPUB compilation for durable Supabase publications.

import { NextRequest, NextResponse } from 'next/server';
import { generateBookPdfBuffer } from '@/lib/book/pdf-generator';
import { sanitizeFilename } from '@/lib/utils/sanitize';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { BookDocument } from '@/lib/book/types';
import { generateEpub3Buffer } from '@/lib/book/epub-builder';
import { hydrateAssetUrls } from '@/lib/book/server-books';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const format = (new URL(req.url).searchParams.get('format') || 'pdf').toLowerCase().trim();
    if (format !== 'pdf' && format !== 'epub') {
      return NextResponse.json(
        { error: 'INVALID_FORMAT', message: 'Unsupported export format. Supported formats are: pdf, epub.' },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const { data: dbBook, error: bookError } = await admin
      .from('books')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (bookError) throw bookError;
    if (!dbBook) return NextResponse.json({ error: 'BOOK_NOT_FOUND', message: 'Book not found.' }, { status: 404 });

    const { getAuthenticatedUser } = await import('@/lib/supabase/server');
    const { user } = await getAuthenticatedUser(req);
    const tokenParam = new URL(req.url).searchParams.get('token');
    const isOwner = Boolean(user && dbBook.user_id === user.id);
    const isSharedTokenValid = Boolean(dbBook.is_shared && dbBook.share_token && tokenParam === dbBook.share_token);

    if (!isOwner && !isSharedTokenValid) {
      if (tokenParam) {
        return NextResponse.json({ error: 'FORBIDDEN', message: 'Invalid or expired share token.' }, { status: 403 });
      }
      if (!user) {
        return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Please sign in or provide a valid share token to export this book.' }, { status: 401 });
      }
      return NextResponse.json({ error: 'FORBIDDEN', message: 'You do not have permission to export this book.' }, { status: 403 });
    }

    // Format entitlement check: Free plan only supports PDF
    const planId = dbBook.plan_id || 'free';
    if (format === 'epub' && planId === 'free') {
      return NextResponse.json(
        {
          error: 'FORMAT_NOT_ALLOWED',
          message: 'EPUB exports are exclusive to paid plans (Book, Book Plus, and Creator). The Free plan supports PDF export.',
        },
        { status: 403 }
      );
    }

    const { data: dbPages, error: pagesError } = await admin
      .from('book_pages')
      .select('*')
      .eq('book_id', id)
      .order('page_number', { ascending: true });
    if (pagesError) throw pagesError;
    if (!dbPages || dbPages.length === 0) {
      return NextResponse.json({ error: 'BOOK_NOT_READY', message: 'The book has no generated pages yet.' }, { status: 409 });
    }

    let book: BookDocument = {
      schemaVersion: 1,
      id: dbBook.id,
      userId: dbBook.user_id,
      title: dbBook.title,
      subtitle: dbBook.subtitle || undefined,
      bookType: dbBook.book_type,
      language: dbBook.language || 'English',
      style: dbBook.style || 'Modern',
      pageCount: dbBook.page_count || dbPages.length,
      coverAssetId: dbBook.cover_asset_id || undefined,
      coverUrl: dbBook.cover_url || dbBook.cover_image_url || undefined,
      blueprint: dbBook.blueprint,
      pages: dbPages.map((page) => ({
        pageNumber: page.page_number,
        chapterIndex: page.chapter_index,
        title: page.title,
        pageType: page.page_type,
        layout: page.layout,
        blocks: page.blocks,
      })),
      versionNumber: dbBook.version_number || 1,
      isShared: dbBook.is_shared,
      shareToken: dbBook.share_token || undefined,
      planId: dbBook.plan_id || 'free',
      hasWatermark: dbBook.has_watermark !== false,
      commercialUse: dbBook.commercial_use === true,
      createdAt: dbBook.created_at,
      updatedAt: dbBook.updated_at,
    };

    book = await hydrateAssetUrls(book);
    const safeFilename = sanitizeFilename(book.title, 'bookgenie-book');
    const version = book.versionNumber || 1;

    if (format === 'epub') {
      const epubBuffer = await generateEpub3Buffer(book);
      return new NextResponse(new Uint8Array(epubBuffer) as unknown as BodyInit, {
        status: 200,
        headers: {
          'Content-Type': 'application/epub+zip',
          'Content-Disposition': `attachment; filename="${safeFilename}-v${version}.epub"`,
          'Content-Length': epubBuffer.length.toString(),
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    const pdfBuffer = await generateBookPdfBuffer(book);
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}-v${version}.pdf"`,
        'Content-Length': pdfBuffer.byteLength.toString(),
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('Export compilation error:', err);
    return NextResponse.json(
      { error: 'EXPORT_FAILED', message: err instanceof Error ? err.message : 'Export compilation failed.' },
      { status: 500 }
    );
  }
}
