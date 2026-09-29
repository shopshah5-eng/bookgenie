import type { BookPageDocument, ContentBlock } from '@/lib/book/types';

export interface NormalizationContext {
  title?: string;
  prompt?: string;
  bookType?: string;
}

/**
 * Normalizes generated manuscript pages:
 * 1. Removes empty pages (no substantive text or images).
 * 2. Deduplicates repeated consecutive headings and redundant titles.
 * 3. Merges sparse pages (heading-only or quote-only pages) into substantive content pages.
 * 4. Ensures financial/trading books contain an educational-only risk disclaimer on page 1.
 * 5. Re-indexes page numbers sequentially (1, 2, 3...).
 */
export function normalizeManuscriptPages(
  pages: BookPageDocument[],
  context: NormalizationContext
): BookPageDocument[] {
  if (!pages || pages.length === 0) return [];

  const combinedText = `${context.title || ''} ${context.prompt || ''}`.toLowerCase();
  const isTradingBook =
    combinedText.includes('trading') ||
    combinedText.includes('market') ||
    combinedText.includes('stock') ||
    combinedText.includes('investing') ||
    combinedText.includes('finance') ||
    combinedText.includes('forex') ||
    combinedText.includes('crypto') ||
    combinedText.includes('options');

  // 1. Remove empty pages
  const nonEmptyPages = pages.filter((page) => {
    if (!page.blocks || !Array.isArray(page.blocks) || page.blocks.length === 0) {
      return false;
    }
    return page.blocks.some(
      (block) => (block.text && block.text.trim().length > 0) || block.type === 'image'
    );
  });

  if (nonEmptyPages.length === 0) return pages;

  // 2. Clean blocks inside each page: deduplicate duplicate headings,
  // remove headings that repeat the page/chapter title, and trim whitespace
  const cleanedPages: BookPageDocument[] = [];
  for (const page of nonEmptyPages) {
    const seenHeadings = new Set<string>();
    const cleanedBlocks: ContentBlock[] = [];
    const normalizedPageTitle = (page.title || '').trim().toLowerCase();

    for (const block of page.blocks) {
      if (block.type === 'heading') {
        const normalized = (block.text || '').trim().toLowerCase();
        // Skip duplicate headings or headings that blindly repeat the page title
        if (!normalized || seenHeadings.has(normalized) || (normalizedPageTitle && normalized === normalizedPageTitle)) {
          continue;
        }
        seenHeadings.add(normalized);
      }
      cleanedBlocks.push(block);
    }

    cleanedPages.push({
      ...page,
      blocks: cleanedBlocks,
    });
  }

  // 3. Merge sparse pages:
  // - Pages with ONLY a heading or ONLY a quote
  // - Pages with < 70 total words and no image (unless marked full-bleed/callout)
  const substantivePages: BookPageDocument[] = [];
  for (let i = 0; i < cleanedPages.length; i++) {
    const page = cleanedPages[i];
    const hasImage = page.blocks.some((b) => b.type === 'image' || Boolean(b.url || b.imageUrl));
    const wordCount = page.blocks.reduce((acc, b) => {
      return acc + (b.text ? b.text.trim().split(/\s+/).filter(Boolean).length : 0);
    }, 0);

    const isSubstantive = hasImage || wordCount >= 70 || page.layout === 'full-bleed';

    if (!isSubstantive && substantivePages.length > 0) {
      // Merge blocks into the preceding substantive page
      const target = substantivePages[substantivePages.length - 1];
      target.blocks = [...target.blocks, ...page.blocks];
    } else {
      substantivePages.push(page);
    }
  }

  // 4. Ensure Trading books have an Educational-Only Risk Disclaimer on page 1
  if (isTradingBook && substantivePages.length > 0) {
    const hasExistingDisclaimer = substantivePages.some((p) =>
      p.blocks.some((b) => {
        const text = (b.text || '').toLowerCase();
        return text.includes('educational') && text.includes('disclaimer');
      })
    );

    if (!hasExistingDisclaimer) {
      const disclaimerBlock: ContentBlock = {
        id: 'disclaimer-regulatory-notice',
        type: 'quote',
        text: 'EDUCATIONAL DISCLAIMER: This guide is published exclusively for educational, informational, and research purposes. It does not constitute investment advice, financial planning, or professional trade solicitation. Trading financial instruments involves significant risk of capital loss. Never trade with money you cannot afford to lose. Past market performance is never indicative of future results.',
      };

      if (substantivePages[0]) {
        substantivePages[0].blocks.unshift(disclaimerBlock);
      }
    }
  }

  // 5. Re-index page numbers sequentially across entire book
  return substantivePages.map((page, index) => ({
    ...page,
    pageNumber: index + 1,
  }));
}
