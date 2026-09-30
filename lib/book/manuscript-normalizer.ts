import type { BookPageDocument, ContentBlock } from '@/lib/book/types';

export interface NormalizationContext {
  title?: string;
  prompt?: string;
  bookType?: string;
}

/**
 * Normalizes generated manuscript pages:
 * 1. Removes completely empty pages (zero blocks or zero substantive content).
 * 2. Deduplicates consecutive identical headings within a page.
 * 3. Preserves distinct page structure across all genres (children's books, fiction, workbooks, etc.).
 * 4. Ensures strict global uniqueness for every block ID.
 * 5. Re-indexes page numbers sequentially (1, 2, 3...).
 */
export function normalizeManuscriptPages(
  pages: BookPageDocument[],
  context: NormalizationContext
): BookPageDocument[] {
  if (!pages || pages.length === 0) return [];

  const combinedText = `${context.title || ''} ${context.prompt || ''}`.toLowerCase();
  const isChildrenOrFiction = context.bookType === 'children' || context.bookType === 'novel';
  const isTradingBook =
    !isChildrenOrFiction &&
    /\b(trading|forex|crypto|stocks|investing|day trading|swing trading|candlestick|technical analysis)\b/i.test(
      combinedText
    );

  // 1. Filter out completely empty pages
  const validPages = pages.filter((page) => {
    if (!page.blocks || !Array.isArray(page.blocks) || page.blocks.length === 0) {
      return false;
    }
    return page.blocks.some(
      (block) =>
        (typeof block.text === 'string' && block.text.trim().length > 0) ||
        (Array.isArray(block.items) && block.items.length > 0) ||
        block.type === 'image' ||
        Boolean(block.url || block.imageUrl)
    );
  });

  if (validPages.length === 0) return pages;

  // 2. Clean blocks inside each page and assign globally unique block IDs
  const cleanedPages: BookPageDocument[] = [];
  let globalBlockIndex = 0;

  for (let pIdx = 0; pIdx < validPages.length; pIdx++) {
    const page = validPages[pIdx];
    const seenHeadings = new Set<string>();
    const cleanedBlocks: ContentBlock[] = [];
    const normalizedPageTitle = (page.title || '').trim().toLowerCase();

    for (const block of page.blocks) {
      globalBlockIndex++;
      const uniqueId = `blk-p${pIdx + 1}-${globalBlockIndex}-${Math.random().toString(36).slice(2, 6)}`;

      if (block.type === 'heading') {
        const normalized = (block.text || '').trim().toLowerCase();
        // Skip duplicate identical headings on the same page
        if (!normalized || seenHeadings.has(normalized) || (normalizedPageTitle && normalized === normalizedPageTitle && cleanedBlocks.length > 0)) {
          continue;
        }
        seenHeadings.add(normalized);
      }

      // Format bullet lists cleanly
      if (block.type === 'paragraph' && (block.text?.trim().startsWith('•') || block.text?.trim().startsWith('- '))) {
        block.type = 'list';
      }

      if (block.type === 'list' || (block.type as string) === 'bullet_list') {
        if (!block.items || block.items.length === 0) {
          const raw = block.text || '';
          const parsed = raw
            .split(/(?:\r?\n|(?<=\.)\s*,\s*|(?<=\.)\s*(?=[A-Z])|;\s*)/)
            .map((s) => s.replace(/^[•\-\*\d\.\)\s]+/, '').trim())
            .filter((s) => s.length > 0);
          if (parsed.length > 0) {
            block.items = parsed;
          }
        }
      }

      cleanedBlocks.push({
        ...block,
        id: uniqueId,
      });
    }

    if (cleanedBlocks.length > 0) {
      cleanedPages.push({
        ...page,
        blocks: cleanedBlocks,
      });
    }
  }

  // 3. Ensure financial/trading books contain an educational risk disclaimer
  if (isTradingBook && cleanedPages.length > 0) {
    const hasExistingDisclaimer = cleanedPages.some((p) =>
      p.blocks.some((b) => {
        const text = (b.text || '').toLowerCase();
        return text.includes('educational') && text.includes('disclaimer');
      })
    );

    if (!hasExistingDisclaimer && cleanedPages[0]) {
      const disclaimerBlock: ContentBlock = {
        id: `disclaimer-notice-${Math.random().toString(36).slice(2, 6)}`,
        type: 'quote',
        text: 'EDUCATIONAL DISCLAIMER: This guide is published exclusively for educational, informational, and research purposes. It does not constitute investment advice, financial planning, or professional trade solicitation. Trading financial instruments involves significant risk of capital loss.',
      };
      cleanedPages[0].blocks.unshift(disclaimerBlock);
    }
  }

  // 4. Re-index page numbers sequentially across entire book
  return cleanedPages.map((page, index) => ({
    ...page,
    pageNumber: index + 1,
  }));
}
