import type { BookDocument, ContentBlock } from './types';

/** Convert a canonical document to the intentionally small public representation. */
export function toPublicBookDocument(book: BookDocument): BookDocument {
  const { prompt: _prompt, uploadedContext: _uploadedContext, generatedPages: _generatedPages, ...blueprintWithoutPrivateFields } = book.blueprint;
  const blueprint = {
    ...blueprintWithoutPrivateFields,
    visualPlan: (book.blueprint.visualPlan || []).map(({ assetId: _assetId, ...item }) => item),
  };

  const { coverAssetId: _coverAssetId, ...bookWithoutAssetId } = book;
  return {
    ...bookWithoutAssetId,
    userId: 'verified-creator',
    shareToken: undefined,
    blueprint,
    pages: book.pages.map((page) => ({
      ...page,
      blocks: page.blocks.map((block): ContentBlock => {
        const { assetId: _blockAssetId, ...publicBlock } = block;
        return publicBlock;
      }),
    })),
  };
}
