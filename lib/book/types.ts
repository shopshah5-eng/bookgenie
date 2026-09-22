// lib/book/types.ts
// Canonical BookDocument Specification (schemaVersion: 1)
// "The database is storage; BookDocument is the canonical application representation."

export type BookType =
  | 'novel'
  | 'children'
  | 'coloring'
  | 'course'
  | 'guide'
  | 'workbook'
  | 'recipe'
  | 'history'
  | 'journal'
  | 'lifestyle';

export type PageLayout =
  | 'standard'
  | 'text-only'
  | 'image-top'
  | 'image-bottom'
  | 'image-left'
  | 'image-right'
  | 'full-bleed'
  | 'two-column';

export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'quote'
  | 'image'
  | 'callout'
  | 'list'
  | 'divider';

export interface ContentBlock {
  id: string;
  type: BlockType;
  level?: 1 | 2 | 3;
  text?: string;
  assetId?: string; // Foreign key to public.assets.id
  caption?: string;
  items?: string[];
}

export interface BookPageDocument {
  pageNumber: number;
  chapterIndex: number;
  title?: string;
  pageType: 'cover' | 'title' | 'toc' | 'chapter_header' | 'content' | 'illustrated_content' | 'back_cover';
  layout: PageLayout;
  blocks: ContentBlock[];
}

export interface ChapterOutline {
  index: number;
  title: string;
  summary: string;
  allocatedPages: number;
}

export interface VisualPlanItem {
  pageNumber: number;
  visualType: 'cover' | 'illustration' | 'diagram' | 'none';
  promptSpec: string;
  layout: PageLayout;
}

export interface BookBlueprint {
  title: string;
  subtitle?: string;
  bookType: BookType;
  audience: string;
  language: string;
  style: string;
  pageTarget: number;
  chapters: ChapterOutline[];
  visualPlan: VisualPlanItem[];
  characterBible?: Record<string, string>;
}

export interface BookDocument {
  schemaVersion: 1;
  id: string;
  userId: string;
  title: string;
  subtitle?: string;
  bookType: BookType;
  language: string;
  style: string;
  pageCount: number;
  coverAssetId?: string;
  coverUrl?: string; // Resolved signed or demo URL for rendering
  blueprint: BookBlueprint;
  pages: BookPageDocument[];
  versionNumber: number;
  isShared?: boolean;
  shareToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobState {
  id: string;
  bookId: string;
  type: 'full_generation' | 'page_regeneration';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  stage: 'planning' | 'writing' | 'generating_visuals' | 'designing' | 'completed' | 'failed';
  progress: number; // 0 to 100
  errorMessage?: string;
}
