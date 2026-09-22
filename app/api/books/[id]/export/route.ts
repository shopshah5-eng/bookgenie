// app/api/books/[id]/export/route.ts
// On-Demand PDF & EPUB compiler from canonical BookDocument

import { NextRequest, NextResponse } from 'next/server';
import { GenerationPipeline } from '@/lib/ai/pipeline';
import { getOceanWondersDemoBook } from '../route';
import type { BookDocument } from '@/lib/book/types';

function renderBookToPrintHtml(book: BookDocument): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${book.title} — BookGenie Edition</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 20mm;
      @bottom-right {
        content: counter(page);
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Plus Jakarta Sans", sans-serif;
      color: #1A1612;
      background: #FFFFFF;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    .page-container {
      page-break-after: always;
      break-after: page;
      min-height: 90vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 24px;
    }
    .cover-page {
      text-align: center;
      background: #FDFBF7;
      border: 1px solid #EFECE6;
      border-radius: 12px;
      padding: 40px;
    }
    h1 {
      font-family: "Playfair Display", Georgia, serif;
      font-size: 32px;
      margin-bottom: 8px;
      color: #1A1612;
    }
    h2 {
      font-family: "Playfair Display", Georgia, serif;
      font-size: 24px;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    .subtitle {
      font-style: italic;
      color: #9A6F3C;
      margin-bottom: 24px;
    }
    p {
      margin-bottom: 14px;
      font-size: 14px;
      color: #2D2620;
    }
    blockquote {
      border-left: 3px solid #9A6F3C;
      margin: 18px 0;
      padding-left: 14px;
      font-style: italic;
      color: #6B635B;
    }
    .meta-bar {
      margin-top: auto;
      padding-top: 20px;
      font-size: 11px;
      color: #9E968E;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #EFECE6;
    }
  </style>
</head>
<body>
  <!-- Cover Page -->
  <div class="page-container cover-page">
    <div style="text-transform: uppercase; font-size: 11px; letter-spacing: 2px; color: #9A6F3C; margin-bottom: 16px;">
      ${book.bookType} • BookGenie Edition
    </div>
    <h1>${book.title}</h1>
    <div class="subtitle">${book.subtitle || 'A publication crafted with BookGenie AI'}</div>
    <div style="margin-top: 40px; font-size: 12px; color: #6B635B;">
      ${book.pages.length} Pages • Language: ${book.language} • Style: ${book.style}
    </div>
  </div>

  <!-- Content Pages -->
  ${book.pages
    .map(
      (page) => `
    <div class="page-container">
      ${page.title ? `<h2>${page.title}</h2>` : ''}
      ${page.blocks
        .map((block) => {
          if (block.type === 'heading') {
            return `<h${block.level || 2}>${block.text || ''}</h${block.level || 2}>`;
          }
          if (block.type === 'quote') {
            return `<blockquote>${block.text || ''}</blockquote>`;
          }
          if (block.type === 'paragraph') {
            return `<p>${block.text || ''}</p>`;
          }
          if (block.type === 'list' && block.items) {
            return `<ul>${block.items.map((it) => `<li>${it}</li>`).join('')}</ul>`;
          }
          if (block.type === 'image') {
            return `<div style="padding: 16px; background: #F8F4EC; border: 1px solid #EAE3D5; border-radius: 8px; font-size: 12px; color: #8C5F2E; margin: 16px 0; text-align: center;">[Illustration: ${block.caption || 'Scene artwork'}]</div>`;
          }
          return '';
        })
        .join('')}
      <div class="meta-bar">
        <span>${book.title}</span>
        <span>Page ${page.pageNumber}</span>
      </div>
    </div>
  `
    )
    .join('')}
</body>
</html>`;
}

import { generateEpub3Buffer } from '@/lib/book/epub-builder';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const url = new URL(req.url);
    const format = url.searchParams.get('format') || 'pdf';

    let book: BookDocument | null = null;

    // 1. Fetch from Supabase PostgreSQL
    try {
      const admin = createAdminClient();
      const { data: dbBook } = await admin.from('books').select('*').eq('id', id).single();
      if (dbBook) {
        const { data: dbPages } = await admin.from('book_pages').select('*').eq('book_id', id).order('page_number', { ascending: true });
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
      if (id === 'ocean-wonders' || id === 'demo-ocean-wonders') {
        book = getOceanWondersDemoBook();
      } else {
        return NextResponse.json({ error: 'Book not found.' }, { status: 404 });
      }
    }

    const safeTitle = (book.title || 'book').toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (format === 'epub') {
      const epubBuffer = await generateEpub3Buffer(book);
      return new NextResponse(new Uint8Array(epubBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/epub+zip',
          'Content-Disposition': `attachment; filename="${safeTitle}-v${book.versionNumber || 1}.epub"`,
          'Content-Length': epubBuffer.length.toString(),
        },
      });
    }

    // Default: High-Resolution Print-Ready HTML with auto-trigger print for PDF export
    const printHtml = renderBookToPrintHtml(book);
    return new NextResponse(printHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="${safeTitle}-v${book.versionNumber || 1}.html"`,
      },
    });
  } catch (err: any) {
    console.error('Export error:', err);
    return NextResponse.json(
      { error: err.message || 'Export failed.' },
      { status: 500 }
    );
  }
}
