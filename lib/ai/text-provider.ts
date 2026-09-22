// lib/ai/text-provider.ts
// Text AI Gateway Interface

import type { BookBlueprint, BookPageDocument, BookType } from '@/lib/book/types';

export interface GenerateBlueprintParams {
  prompt: string;
  uploadedContext?: string;
  bookType?: BookType | 'auto';
  language?: string;
  style?: string;
}

export interface GenerateChapterParams {
  blueprint: BookBlueprint;
  chapterIndex: number;
}

export interface RegeneratePagesParams {
  blueprint: BookBlueprint;
  existingPages: BookPageDocument[];
  instruction: string;
  targetPageNumbers?: number[];
}

export interface ITextProvider {
  generateBlueprint(params: GenerateBlueprintParams): Promise<BookBlueprint>;
  generateChapter(params: GenerateChapterParams): Promise<BookPageDocument[]>;
  regeneratePages(params: RegeneratePagesParams): Promise<{
    pages: BookPageDocument[];
    requiresImageRegeneration: boolean;
    imageInstructions?: Array<{ pageNumber: number; prompt: string }>;
  }>;
}
