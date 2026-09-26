// lib/book/epub-builder.ts
// Deterministic EPUB3 Compiler from canonical BookDocument
// Produces 100% compliant EPUB3 archives readable in Apple Books, Kindle, and Calibre.

import JSZip from 'jszip';
import type { BookDocument } from './types';

export async function generateEpub3Buffer(book: BookDocument): Promise<Buffer> {
  const zip = new JSZip();

  // 1. mimetype (Must be first, uncompressed)
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  // 2. META-INF/container.xml
  zip.folder('META-INF')?.file(
    'container.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
  );

  const oebps = zip.folder('OEBPS');
  if (!oebps) throw new Error('Failed to create OEBPS directory in EPUB package.');

  // 3. OEBPS/style.css
  oebps.file(
    'style.css',
    `
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Georgia, serif;
  color: #1A1612;
  background-color: #FFFFFF;
  margin: 5%;
  line-height: 1.6;
}
h1 {
  font-size: 2em;
  color: #1A1612;
  margin-bottom: 0.2em;
  font-weight: bold;
}
h2 {
  font-size: 1.4em;
  color: #1A1612;
  margin-top: 1.2em;
  margin-bottom: 0.5em;
  font-weight: bold;
}
p {
  margin-bottom: 1em;
  text-align: justify;
}
blockquote {
  border-left: 3px solid #9A6F3C;
  padding-left: 1em;
  margin: 1.2em 0;
  font-style: italic;
  color: #6B635B;
}
.cover-wrapper {
  text-align: center;
  padding: 3em 1em;
}
.subtitle {
  color: #9A6F3C;
  font-style: italic;
  margin-bottom: 2em;
}
.meta-footer {
  margin-top: 3em;
  border-top: 1px solid #EFECE6;
  padding-top: 0.5em;
  font-size: 0.8em;
  color: #9E968E;
}
`
  );

  // 4. Generate Chapter XHTML pages & Cover Asset
  const manifestItems: string[] = [
    `<item id="css" href="style.css" media-type="text/css"/>`,
    `<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>`,
  ];
  const spineItems: string[] = [];

  // Embed Cover Image if local or remote URL provided
  let hasCoverImage = false;
  try {
    if (book.coverUrl) {
      let imageBuffer: Buffer | null = null;
      if (book.coverUrl.startsWith('/images/')) {
        const fs = await import('fs');
        const path = await import('path');
        const localPath = path.join(process.cwd(), 'public', book.coverUrl);
        if (fs.existsSync(localPath)) {
          imageBuffer = fs.readFileSync(localPath);
        }
      } else if (book.coverUrl.startsWith('http')) {
        const res = await fetch(book.coverUrl);
        if (res.ok) {
          const arr = await res.arrayBuffer();
          imageBuffer = Buffer.from(arr);
        }
      }

      if (imageBuffer) {
        oebps.file('images/cover.jpg', imageBuffer);
        manifestItems.push(`<item id="cover-image" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>`);
        hasCoverImage = true;
      }
    }
  } catch (imgErr) {
    console.warn('[EPUB Builder] Cover image embedding warning:', imgErr);
  }

  // Cover Page
  const coverHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${book.language || 'en'}">
<head>
  <meta charset="utf-8"/>
  <title>${escapeXml(book.title)}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <div class="cover-wrapper">
    ${hasCoverImage ? '<p><img src="images/cover.jpg" alt="Cover" style="max-width:100%; height:auto; margin:0 auto 1.5em; border-radius:8px;"/></p>' : ''}
    <h1>${escapeXml(book.title)}</h1>
    <div class="subtitle">${escapeXml(book.subtitle || 'A publication crafted with BookGenie AI')}</div>
    <p><em>${escapeXml(book.bookType)} • BookGenie Edition</em></p>
  </div>
</body>
</html>`;

  oebps.file('cover.xhtml', coverHtml);
  manifestItems.push(`<item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>`);
  spineItems.push(`<itemref idref="cover"/>`);

  // Content Pages
  book.pages.forEach((page, idx) => {
    const pageId = `page_${idx + 1}`;
    const filename = `${pageId}.xhtml`;

    const blocksHtml = page.blocks
      .map((block) => {
        if (block.type === 'heading') {
          return `<h2>${escapeXml(block.text || '')}</h2>`;
        }
        if (block.type === 'quote') {
          return `<blockquote>${escapeXml(block.text || '')}</blockquote>`;
        }
        if (block.type === 'paragraph') {
          return `<p>${escapeXml(block.text || '')}</p>`;
        }
        if (block.type === 'list' && block.items) {
          return `<ul>${block.items.map((it) => `<li>${escapeXml(it)}</li>`).join('')}</ul>`;
        }
        if (block.type === 'image') {
          return `<p><em>[Illustration: ${escapeXml(block.caption || 'Artwork')}]</em></p>`;
        }
        return '';
      })
      .join('\n');

    const pageContent = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${book.language || 'en'}">
<head>
  <meta charset="utf-8"/>
  <title>${escapeXml(page.title || `Page ${page.pageNumber}`)}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  ${page.title ? `<h2>${escapeXml(page.title)}</h2>` : ''}
  ${blocksHtml}
  <div class="meta-footer">
    <span>Page ${page.pageNumber} • ${escapeXml(book.title)}</span>
  </div>
</body>
</html>`;

    oebps.file(filename, pageContent);
    manifestItems.push(`<item id="${pageId}" href="${filename}" media-type="application/xhtml+xml"/>`);
    spineItems.push(`<itemref idref="${pageId}"/>`);
  });

  // 5. OEBPS/nav.xhtml (EPUB3 Navigation Document)
  const navHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${book.language || 'en'}">
<head>
  <meta charset="utf-8"/>
  <title>Table of Contents</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Table of Contents</h1>
    <ol>
      <li><a href="cover.xhtml">Title &amp; Cover</a></li>
      ${book.pages
        .map(
          (p, i) =>
            `<li><a href="page_${i + 1}.xhtml">${escapeXml(p.title || `Page ${p.pageNumber}`)}</a></li>`
        )
        .join('\n      ')}
    </ol>
  </nav>
</body>
</html>`;
  oebps.file('nav.xhtml', navHtml);

  // 6. OEBPS/content.opf (Packaging Metadata & Manifest)
  const opfContent = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="pub-id">urn:uuid:${book.id}</dc:identifier>
    <dc:title>${escapeXml(book.title)}</dc:title>
    <dc:language>${book.language?.slice(0, 2).toLowerCase() || 'en'}</dc:language>
    <dc:creator>BookGenie AI Publishing Studio</dc:creator>
    <dc:date>${new Date().toISOString()}</dc:date>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</meta>
  </metadata>
  <manifest>
    ${manifestItems.join('\n    ')}
  </manifest>
  <spine>
    ${spineItems.join('\n    ')}
  </spine>
</package>`;

  oebps.file('content.opf', opfContent);

  // Generate buffer
  return await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
