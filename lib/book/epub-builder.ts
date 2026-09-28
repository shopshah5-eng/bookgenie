// lib/book/epub-builder.ts
// Deterministic EPUB3 Compiler from canonical BookDocument
// Produces 100% compliant EPUB3 archives readable in Apple Books, Kindle, and Calibre.

import JSZip from 'jszip';
import type { BookDocument } from './types';
import { loadBinaryAsset, extensionForContentType } from './asset-data';

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

  // Embed the generated cover image when available.
  let hasCoverImage = false;
  let coverHref = '';
  const coverAsset = await loadBinaryAsset(book.coverUrl);
  if (coverAsset) {
    const coverExtension = extensionForContentType(coverAsset.contentType);
    coverHref = `images/cover.${coverExtension}`;
    oebps.file(coverHref, coverAsset.bytes);
    manifestItems.push(`<item id="cover-image" href="${coverHref}" media-type="${coverAsset.contentType}" properties="cover-image"/>`);
    hasCoverImage = true;
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
    ${hasCoverImage ? `<p><img src="${coverHref}" alt="Cover" style="max-width:100%; height:auto; margin:0 auto 1.5em; border-radius:8px;"/></p>` : ''}
    <h1>${escapeXml(book.title)}</h1>
    <div class="subtitle">${escapeXml(book.subtitle || 'A publication crafted with BookGenie')}</div>
    <p><em>${escapeXml(book.bookType)} • BookGenie Edition</em></p>
  </div>
</body>
</html>`;

  oebps.file('cover.xhtml', coverHtml);
  manifestItems.push(`<item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>`);
  spineItems.push(`<itemref idref="cover"/>`);

  // Content Pages. Images are copied into the archive, rather than leaving
  // broken external URLs inside the downloadable EPUB.
  let interiorImageIndex = 0;
  for (const [idx, page] of book.pages.entries()) {
    const pageId = `page_${idx + 1}`;
    const filename = `${pageId}.xhtml`;
    const blockHtml: string[] = [];

    for (const block of page.blocks) {
      if (block.type === 'heading') {
        blockHtml.push(`<h2>${escapeXml(block.text || '')}</h2>`);
      } else if (block.type === 'quote') {
        blockHtml.push(`<blockquote>${escapeXml(block.text || '')}</blockquote>`);
      } else if (block.type === 'paragraph') {
        blockHtml.push(`<p>${escapeXml(block.text || '')}</p>`);
      } else if ((block.type === 'list' || (block.type as string) === 'bullet_list') && block.items) {
        blockHtml.push(`<ul>${block.items.map((it) => `<li>${escapeXml(it)}</li>`).join('')}</ul>`);
      } else if (block.type === 'callout' || (block.type as string) === 'field_notes') {
        blockHtml.push(`<div style="background:#FAF7F0; padding:0.8em 1em; border-left:3px solid #9A6F3C; margin:1em 0; font-size:0.9em; color:#4A453E;">${escapeXml(block.text || '')}</div>`);
      } else if (block.type === 'divider') {
        blockHtml.push('<hr style="border:none; border-top:1px solid #EFECE6; margin:1.5em 0;" />');
      } else if (block.type === 'image') {
        const image = await loadBinaryAsset(block.url);
        if (image) {
          interiorImageIndex += 1;
          const extension = extensionForContentType(image.contentType);
          const imageHref = `images/interior-${interiorImageIndex}.${extension}`;
          const imageId = `interior-image-${interiorImageIndex}`;
          oebps.file(imageHref, image.bytes);
          manifestItems.push(`<item id="${imageId}" href="${imageHref}" media-type="${image.contentType}"/>`);
          blockHtml.push(`<p><img src="${imageHref}" alt="${escapeXml(block.caption || 'Illustration')}" style="max-width:100%; height:auto;"/></p>`);
        }
        blockHtml.push(`<p><em>${escapeXml(block.caption || 'Illustration')}</em></p>`);
      }
    }

    const blocksHtml = blockHtml.join('\n');
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
  }

  // 5. OEBPS/nav.xhtml (EPUB3 Navigation Document)
  // Filter out redundant "Title & Cover" entry if page 1 is already cover
  const filteredNavItems = book.pages
    .map((p, i) => {
      const isRedundantCover = i === 0 && (p.title === 'Title & Cover' || p.title === 'Title Page' || p.pageType === 'cover');
      if (isRedundantCover) return null;
      return `<li><a href="page_${i + 1}.xhtml">${escapeXml(p.title || `Page ${p.pageNumber}`)}</a></li>`;
    })
    .filter(Boolean);

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
      ${filteredNavItems.join('\n      ')}
    </ol>
  </nav>
</body>
</html>`;
  oebps.file('nav.xhtml', navHtml);

  // 6. OEBPS/content.opf (Packaging Metadata & Manifest)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(book.id || '');
  const pubIdentifier = isUuid ? `urn:uuid:${book.id}` : `urn:bookgenie:${book.id || 'edition'}`;

  const opfContent = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="pub-id">${pubIdentifier}</dc:identifier>
    <dc:title>${escapeXml(book.title)}</dc:title>
    <dc:language>${book.language?.slice(0, 2).toLowerCase() || 'en'}</dc:language>
    <dc:creator>BookGenie Publishing Studio</dc:creator>
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
