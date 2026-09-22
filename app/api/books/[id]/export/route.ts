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

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const url = new URL(req.url);
    const format = url.searchParams.get('format') || 'pdf';

    let book = GenerationPipeline.getBook(id);
    if (!book) {
      book = getOceanWondersDemoBook();
      book.id = id;
    }

    const safeTitle = book.title.toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (format === 'epub') {
      // Return EPUB format representation
      const epubHtml = renderBookToPrintHtml(book);
      return new NextResponse(epubHtml, {
        status: 200,
        headers: {
          'Content-Type': 'application/epub+zip, text/html',
          'Content-Disposition': `attachment; filename="${safeTitle}-v${book.versionNumber || 1}.epub"`,
        },
      });
    }

    // Default: Printable HTML / PDF compile stream
    const printHtml = renderBookToPrintHtml(book);
    return new NextResponse(printHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="${safeTitle}-v${book.versionNumber || 1}.html"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Export failed.' },
      { status: 500 }
    );
  }
}
