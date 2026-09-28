// lib/book/pdf-generator.ts
// Deterministic binary PDF generator using jsPDF
// Generates standard-compliant, printable application/pdf with %PDF- magic bytes

import { jsPDF } from 'jspdf';
import type { BookDocument, BookPageDocument } from '@/lib/book/types';
import { stripHtml } from '@/lib/utils/sanitize';

export async function generateBookPdfBuffer(book: BookDocument): Promise<Uint8Array> {
  // A4 portrait dimensions: 210mm x 297mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  const title = stripHtml(book.title || 'Untitled Book');
  const subtitle = stripHtml(book.subtitle || 'A BookGenie Publication');
  const bookType = stripHtml(book.bookType || 'Book');
  const language = stripHtml(book.language || 'English');
  const style = stripHtml(book.style || 'Editorial');

  // Set document metadata
  doc.setProperties({
    title: title,
    subject: subtitle,
    author: 'BookGenie AI Publishing Studio',
    keywords: `${bookType}, ebook, publishing`,
    creator: 'BookGenie Engine v1.0',
  });

  // -------------------------------------------------------------
  // COVER PAGE (Page 1)
  // -------------------------------------------------------------
  // Subtle warm ivory background for cover
  doc.setFillColor(253, 251, 247);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Thin editorial inner border
  doc.setDrawColor(218, 206, 191);
  doc.setLineWidth(0.5);
  doc.rect(margin - 5, margin - 5, contentWidth + 10, pageHeight - margin * 2 + 10);

  // Genre badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(140, 95, 46); // editorial bronze
  doc.text(`${bookType.toUpperCase()} • BOOKGENIE EDITION`, pageWidth / 2, 60, {
    align: 'center',
  });

  // Book Title
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(24, 21, 17);
  const titleLines = doc.splitTextToSize(title, contentWidth - 20);
  doc.text(titleLines, pageWidth / 2, 85, { align: 'center' });

  // Subtitle
  const titleBlockHeight = titleLines.length * 10;
  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(107, 99, 91);
  const subLines = doc.splitTextToSize(subtitle, contentWidth - 30);
  doc.text(subLines, pageWidth / 2, 85 + titleBlockHeight + 10, { align: 'center' });

  // Decorative center rule
  doc.setDrawColor(180, 150, 110);
  doc.setLineWidth(0.7);
  const lineY = 85 + titleBlockHeight + 25 + subLines.length * 6;
  doc.line(pageWidth / 2 - 25, lineY, pageWidth / 2 + 25, lineY);

  // Cover Bottom Metadata
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(140, 130, 120);
  doc.text(
    `${book.pages?.length || 0} Pages  |  Language: ${language}  |  Style: ${style}`,
    pageWidth / 2,
    pageHeight - 35,
    { align: 'center' }
  );

  doc.setFontSize(8);
  doc.text('Crafted with BookGenie AI Publishing Studio  •  All Commercial Rights Reserved', pageWidth / 2, pageHeight - 25, {
    align: 'center',
  });

  // -------------------------------------------------------------
  // CONTENT PAGES
  // -------------------------------------------------------------
  const pages: BookPageDocument[] = book.pages || [];

  for (let idx = 0; idx < pages.length; idx++) {
    const page = pages[idx];
    doc.addPage('a4', 'portrait');

    // Clean background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header rule & Title
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 140, 130);
    doc.text(title.toUpperCase(), margin, 15);
    doc.text(`PAGE ${page.pageNumber || idx + 1}`, pageWidth - margin, 15, { align: 'right' });

    doc.setDrawColor(240, 235, 228);
    doc.setLineWidth(0.3);
    doc.line(margin, 18, pageWidth - margin, 18);

    // Page Content Rendering
    let cursorY = 32;

    // Optional Page Title
    if (page.title && page.title !== 'Title & Cover') {
      doc.setFont('times', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(24, 21, 17);
      const cleanTitle = stripHtml(page.title);
      const pageTitleLines = doc.splitTextToSize(cleanTitle, contentWidth);
      doc.text(pageTitleLines, margin, cursorY);
      cursorY += pageTitleLines.length * 8 + 6;
    }

    // Render Blocks
    const blocks = page.blocks || [];
    for (const block of blocks) {
      if (cursorY > pageHeight - 30) {
        // Break to new page if block exceeds content area
        doc.addPage('a4', 'portrait');
        cursorY = 25;
      }

      if (block.type === 'heading') {
        const isH1 = block.level === 1;
        const isH2 = block.level === 2;
        doc.setFont('times', 'bold');
        doc.setFontSize(isH1 ? 16 : isH2 ? 13 : 11.5);
        doc.setTextColor(isH1 ? 24 : isH2 ? 50 : 80, isH1 ? 21 : isH2 ? 40 : 65, isH1 ? 17 : isH2 ? 30 : 50);
        cursorY += 4;
        const text = stripHtml(block.text || '');
        const headingLines = doc.splitTextToSize(text, contentWidth);
        doc.text(headingLines, margin, cursorY);
        cursorY += headingLines.length * (isH1 ? 7 : 6) + 4;
      } else if (block.type === 'quote') {
        doc.setFont('times', 'italic');
        doc.setFontSize(11);
        doc.setTextColor(140, 95, 46); // bronze gold
        const text = stripHtml(block.text || '');
        const quoteLines = doc.splitTextToSize(text, contentWidth - 10);
        // Left accent bar
        doc.setDrawColor(180, 130, 70);
        doc.setLineWidth(1);
        doc.line(margin, cursorY - 3, margin, cursorY + quoteLines.length * 5 + 1);
        doc.text(quoteLines, margin + 5, cursorY);
        cursorY += quoteLines.length * 5 + 6;
      } else if (block.type === 'list' || (block.type as string) === 'bullet_list') {
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        const items: string[] = Array.isArray(block.items) ? block.items : block.text ? [block.text] : [];
        for (const item of items) {
          const cleanItem = stripHtml(item);
          const itemLines = doc.splitTextToSize(cleanItem, contentWidth - 12);
          const itemHeight = itemLines.length * 5 + 2;

          if (cursorY + itemHeight > pageHeight - 25) {
            doc.addPage('a4', 'portrait');
            cursorY = 25;
          }

          // Bullet icon
          doc.setTextColor(154, 111, 60); // bronze bullet
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text('•', margin + 3, cursorY);

          // Bullet text
          doc.setFont('times', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(40, 36, 32);
          doc.text(itemLines, margin + 9, cursorY);
          cursorY += itemHeight;
        }
        cursorY += 4;
      } else if (block.type === 'callout' || (block.type as string) === 'field_notes') {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(60, 50, 40);
        const text = stripHtml(block.text || '');
        const lines = doc.splitTextToSize(text, contentWidth - 16);
        const boxHeight = lines.length * 5 + 8;
        if (cursorY + boxHeight > pageHeight - 25) {
          doc.addPage('a4', 'portrait');
          cursorY = 25;
        }
        doc.setFillColor(252, 249, 242);
        doc.setDrawColor(218, 204, 185);
        doc.rect(margin, cursorY, contentWidth, boxHeight, 'FD');
        doc.text(lines, margin + 8, cursorY + 6);
        cursorY += boxHeight + 6;
      } else if (block.type === 'divider') {
        doc.setDrawColor(220, 210, 195);
        doc.setLineWidth(0.4);
        doc.line(margin + 25, cursorY + 3, pageWidth - margin - 25, cursorY + 3);
        cursorY += 8;
      } else if (block.type === 'paragraph') {
        doc.setFont('times', 'normal');
        doc.setFontSize(10.5);
        doc.setTextColor(40, 36, 32);
        const text = stripHtml(block.text || '');
        const pLines = doc.splitTextToSize(text, contentWidth);
        doc.text(pLines, margin, cursorY);
        cursorY += pLines.length * 5.2 + 5;
      } else if (block.type === 'image') {
        // Render stylized archival illustration frame with caption
        doc.setDrawColor(220, 210, 200);
        doc.setFillColor(250, 248, 244);
        const frameHeight = 45;
        if (cursorY + frameHeight + 15 > pageHeight - 25) {
          doc.addPage('a4', 'portrait');
          cursorY = 25;
        }
        doc.rect(margin, cursorY, contentWidth, frameHeight, 'FD');
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(120, 110, 100);
        const capText = block.caption ? `[Archival Illustration]: ${stripHtml(block.caption)}` : '[Archival Plate Illustration]';
        const capLines = doc.splitTextToSize(capText, contentWidth - 10);
        doc.text(capLines, margin + 5, cursorY + frameHeight / 2 + 2);
        cursorY += frameHeight + 6;
      }
    }

    // Footer Page Number & Copyright
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(160, 150, 140);
    doc.text('BookGenie Studio Edition', margin, pageHeight - 12);
    doc.text(`${page.pageNumber || idx + 1}`, pageWidth - margin, pageHeight - 12, {
      align: 'right',
    });
  }

  // Return Uint8Array of binary PDF
  const arrayBuffer = doc.output('arraybuffer');
  return new Uint8Array(arrayBuffer);
}
