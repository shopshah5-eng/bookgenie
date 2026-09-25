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

/**
 * Compiles a valid EPUB 3.0 container in-memory
 */
function toBcp47(langStr?: string): string {
  if (!langStr) return 'en';
  const lower = langStr.trim().toLowerCase();
  const map: Record<string, string> = {
    english: 'en',
    spanish: 'es',
    french: 'fr',
    german: 'de',
    italian: 'it',
    portuguese: 'pt',
    japanese: 'ja',
    chinese: 'zh',
    hindi: 'hi',
    russian: 'ru',
    arabic: 'ar',
    korean: 'ko',
    dutch: 'nl',
  };
  return map[lower] || (lower.length === 2 ? lower : 'en');
}

async function generateEpub3Buffer(book: BookDocument): Promise<Buffer> {
  const zip = new JSZip();

  // 1. mimetype (MUST be first file, uncompressed)
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  // 2. META-INF/container.xml
  zip.file(
    'META-INF/container.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
  );

  const oebps = zip.folder('OEBPS');
  if (!oebps) throw new Error('Failed to create OEBPS archive directory');

  // Sanitize all book fields & normalize language to BCP-47
  const safeTitle = escapeHtml(book.title || 'Untitled');
  const safeLang = toBcp47(book.language);
  const safeId = escapeHtml(book.id || 'book-id');

  // 3. OEBPS/toc.xhtml (EPUB 3 Navigation Document)
  const navItems = (book.pages || [])
    .map(
      (p, i) =>
        `<li><a href="page_${i + 1}.xhtml">${escapeHtml(p.title || `Page ${p.pageNumber || i + 1}`)}</a></li>`
    )
    .join('\n');

  oebps.file(
    'toc.xhtml',
    `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${safeLang}">
<head>
  <title>${safeTitle} - Table of Contents</title>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Table of Contents</h1>
    <ol>${navItems}</ol>
  </nav>
</body>
</html>`
  );

  // 4. Content Pages XHTML
  (book.pages || []).forEach((p, i) => {
    const pageNum = p.pageNumber || i + 1;
    const bodyContent = (p.blocks || [])
      .map((b) => {
        if (b.type === 'heading') return `<h${b.level || 2}>${escapeHtml(b.text || '')}</h${b.level || 2}>`;
        if (b.type === 'quote') return `<blockquote><p>${escapeHtml(b.text || '')}</p></blockquote>`;
        if (b.type === 'image') return `<figure><p><em>[Illustration: ${escapeHtml(b.caption || '')}]</em></p></figure>`;
        return `<p>${escapeHtml(b.text || '')}</p>`;
      })
      .join('\n');

    oebps.file(
      `page_${pageNum}.xhtml`,
      `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${safeLang}">
<head>
  <title>${escapeHtml(p.title || `Page ${pageNum}`)}</title>
  <style>
    body { font-family: sans-serif; line-height: 1.6; padding: 2em; color: #1A1612; }
    h1, h2, h3 { font-family: serif; color: #181511; }
    blockquote { border-left: 3px solid #8C5F2E; padding-left: 1em; color: #6B635B; font-style: italic; }
    p { margin-bottom: 1em; }
  </style>
</head>
<body>
  <h2>${escapeHtml(p.title || `Page ${pageNum}`)}</h2>
  ${bodyContent}
</body>
</html>`
    );
  });

  // 5. OEBPS/content.opf (Manifest & Spine)
  const manifestItems = (book.pages || [])
    .map(
      (p, i) =>
        `<item id="page_${i + 1}" href="page_${i + 1}.xhtml" media-type="application/xhtml+xml"/>`
    )
    .join('\n');

  const spineItems = (book.pages || [])
    .map((p, i) => `<itemref idref="page_${i + 1}"/>`)
    .join('\n');

  oebps.file(
    'content.opf',
    `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="BookId">urn:uuid:${safeId}</dc:identifier>
    <dc:title>${safeTitle}</dc:title>
    <dc:language>${safeLang}</dc:language>
    <dc:creator>BookGenie AI Publishing Studio</dc:creator>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.[0-9]+Z$/, 'Z')}</meta>
  </metadata>
  <manifest>
    <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    ${manifestItems}
  </manifest>
  <spine>
    ${spineItems}
  </spine>
</package>`
  );

  return await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}

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
  } catch (err: unknown) {
    console.error('Export compilation error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Export compilation failed.' },
      { status: 500 }
    );
  }
}
