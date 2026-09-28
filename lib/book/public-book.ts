import type { BookDocument, ContentBlock } from './types';

/**
 * Convert a canonical document to the intentionally small public representation.
 * Prompt/source material and asset foreign keys are private author data and do
 * not belong in a shared page response.
 */
export function toPublicBookDocument(book: BookDocument): BookDocument {
  const { prompt: _prompt, uploadedContext: _uploadedContext, generatedPages: _generatedPages, ...publicBlueprint } = book.blueprint;

  return {
    ...book,
    userId: 'verified-creator',
    shareToken: undefined,
    blueprint: publicBlueprint,
    pages: book.pages.map((page) => ({
      ...page,
      blocks: page.blocks.map((block): ContentBlock => {
        const { assetId: _assetId, ...publicBlock } = block;
        return publicBlock;
      }),
    })),
  };
}
