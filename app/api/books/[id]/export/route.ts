// app/api/books/[id]/export/route.ts
// On-Demand Binary PDF & EPUB compiler with strict authorization & sanitization

import { NextRequest, NextResponse } from 'next/server';
import { GenerationPipeline } from '@/lib/ai/pipeline';
import { getDemoBook, getOceanWondersDemoBook } from '@/lib/book/demo-book';
import { generateBookPdfBuffer } from '@/lib/book/pdf-generator';
import { escapeHtml, sanitizeFilename } from '@/lib/utils/sanitize';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { BookDocument } from '@/lib/book/types';
import JSZip from 'jszip';

import { generateEpub3Buffer } from '@/lib/book/epub-builder';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const url = new URL(req.url);
    const format = (url.searchParams.get('format') || 'pdf').toLowerCase().trim();

    // 1. Validate format strictly
    if (format !== 'pdf' && format !== 'epub') {
      return NextResponse.json(
        {
          error: 'INVALID_FORMAT',
          message: 'Unsupported export format. Supported formats are: pdf, epub.',
        },
        { status: 400 }
      );
    }

    let book: BookDocument | null = null;
    const demoMatch = getDemoBook(id);
    const isPublicDemo = Boolean(demoMatch) || id === 'ocean-wonders' || id === 'demo-ocean-wonders';

    // 2. Fetch from Supabase PostgreSQL
    try {
      const admin = createAdminClient();
      const { data: dbBook } = await admin.from('books').select('*').eq('id', id).single();
      if (dbBook) {
        const { data: dbPages } = await admin
          .from('book_pages')
          .select('*')
          .eq('book_id', id)
          .order('page_number', { ascending: true });

        book = {
          schemaVersion: 1,
          id: dbBook.id,
          userId: dbBook.user_id,
          title: dbBook.title,
          subtitle: dbBook.subtitle || undefined,
          bookType: dbBook.book_type,
          language: dbBook.language || 'English',
          style: dbBook.style || 'Modern',
          pageCount: dbBook.page_count || dbPages?.length || 0,
          coverUrl: dbBook.cover_url,
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
          isShared: dbBook.is_shared,
          createdAt: dbBook.created_at,
          updatedAt: dbBook.updated_at,
        };
      }
    } catch (dbErr) {
      console.warn('Supabase export fetch warning:', dbErr);
    }

    if (!book) {
      book = GenerationPipeline.getBook(id) || null;
    }

    if (!book) {
      if (demoMatch) {
        book = demoMatch;
      } else if (isPublicDemo) {
        book = getOceanWondersDemoBook();
      } else {
        return NextResponse.json({ error: 'Book not found.' }, { status: 404 });
      }
    }

    // 3. Authorization check for private books
    if (!isPublicDemo && !book.isShared) {
      let authorized = false;
      try {
        const supabase = await createServerSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user && user.id === book.userId) {
          authorized = true;
        }
      } catch (authErr) {
        console.warn('Export auth check notice:', authErr);
      }

      if (!authorized) {
        return NextResponse.json(
          {
            error: 'UNAUTHORIZED',
            message: 'You do not have permission to export this private book. Please sign in.',
          },
          { status: 403 }
        );
      }
    }

    const safeFilename = sanitizeFilename(book.title, 'bookgenie-book');
    const version = book.versionNumber || 1;

    // 4. EPUB Export
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

    // 5. True Binary PDF Export using jsPDF
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
  } catch (err: any) {
    console.error('Export compilation error:', err);
    return NextResponse.json(
      { error: err.message || 'Export compilation failed.' },
      { status: 500 }
    );
  }
}
