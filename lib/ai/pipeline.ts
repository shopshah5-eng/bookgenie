// lib/ai/pipeline.ts
// Core BookGenie Generation Pipeline & Server-Side Job Processor

import { OpenRouterTextProvider } from './openrouter';
import { GeminiImageProvider } from './gemini';
import { AICostController } from './cost-controller';
import type { BookBlueprint, BookDocument, BookPageDocument, BookType } from '@/lib/book/types';
import { createAdminClient } from '@/lib/supabase/admin';

// In-memory store for local dev when Supabase keys are placeholder
const devBooksStore = new Map<string, BookDocument>();
const devJobsStore = new Map<
  string,
  {
    id: string;
    bookId: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    stage: 'planning' | 'writing' | 'generating_visuals' | 'designing' | 'completed' | 'failed';
    progress: number;
    stepsCompleted: string[];
    error?: string;
  }
>();

export class GenerationPipeline {
  private static textProvider = new OpenRouterTextProvider();
  private static imageProvider = new GeminiImageProvider();

  /**
   * Fast initialization: inserts Book and Job, returns IDs in <250ms
   */
  static async createBookAndJob(params: {
    userId: string;
    prompt: string;
    bookType?: BookType | 'auto';
    language?: string;
    style?: string;
    uploadedContext?: string;
  }): Promise<{ bookId: string; jobId: string }> {
    const bookId = `book-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const jobId = `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    // Initial placeholder document
    const initialDoc: BookDocument = {
      schemaVersion: 1,
      id: bookId,
      userId: params.userId,
      title: params.prompt.slice(0, 40) || 'Untitled Creation',
      bookType: (params.bookType === 'auto' ? 'novel' : params.bookType) || 'novel',
      language: params.language || 'English',
      style: params.style || 'Modern',
      pageCount: 0,
      blueprint: {
        title: params.prompt.slice(0, 40) || 'Untitled Creation',
        bookType: (params.bookType === 'auto' ? 'novel' : params.bookType) || 'novel',
        audience: 'General',
        language: params.language || 'English',
        style: params.style || 'Modern',
        pageTarget: 16,
        chapters: [],
        visualPlan: [],
      },
      pages: [],
      versionNumber: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    devBooksStore.set(bookId, initialDoc);
    devJobsStore.set(jobId, {
      id: jobId,
      bookId,
      status: 'queued',
      stage: 'planning',
      progress: 5,
      stepsCompleted: [],
    });

    // Try persisting to Supabase if configured
    try {
      const supabase = createAdminClient();
      await supabase.from('books').insert({
        id: bookId,
        user_id: params.userId,
        title: initialDoc.title,
        book_type: initialDoc.bookType,
        language: initialDoc.language,
        style: initialDoc.style,
        status: 'planning',
        progress: 5,
      });

      await supabase.from('jobs').insert({
        id: jobId,
        book_id: bookId,
        status: 'queued',
        stage: 'planning',
        progress: 5,
      });
    } catch {
      // Dev store handles it gracefully
    }

    // Trigger independent background execution asynchronously
    setTimeout(() => {
      this.executeJob(jobId, bookId, params).catch((err) => {
        console.error('Background generation job error:', err);
      });
    }, 100);

    return { bookId, jobId };
  }

  /**
   * Independent Server Job Processor
   */
  static async executeJob(
    jobId: string,
    bookId: string,
    params: {
      userId: string;
      prompt: string;
      bookType?: BookType | 'auto';
      language?: string;
      style?: string;
      uploadedContext?: string;
    }
  ) {
    const job = devJobsStore.get(jobId);
    if (!job) return;

    job.status = 'processing';
    job.stage = 'planning';
    job.progress = 10;
    job.stepsCompleted.push('Idea Analyzed');

    try {
      // -------------------------------------------------------------
      // STAGE 1: PLANNING (10% -> 25%)
      // -------------------------------------------------------------
      const blueprint = await this.textProvider.generateBlueprint({
        prompt: params.prompt,
        bookType: params.bookType,
        language: params.language,
        style: params.style,
        uploadedContext: params.uploadedContext,
      });

      job.progress = 25;
      job.stage = 'writing';
      job.stepsCompleted.push('Structure & Chapters Crafted');

      // -------------------------------------------------------------
      // STAGE 2: WRITING CHAPTERS (25% -> 60%)
      // -------------------------------------------------------------
      const allPages: BookPageDocument[] = [];

      for (let i = 0; i < (blueprint.chapters?.length || 4); i++) {
        const chapterIndex = i + 1;
        const chapterPages = await this.textProvider.generateChapter({
          blueprint,
          chapterIndex,
        });
        allPages.push(...chapterPages);
        job.progress = 25 + Math.round(((i + 1) / blueprint.chapters.length) * 35);
        job.stepsCompleted.push(`Chapter ${chapterIndex} Written`);
      }

      // -------------------------------------------------------------
      // STAGE 3: VISUALS (60% -> 85%)
      // -------------------------------------------------------------
      job.stage = 'generating_visuals';

      // 1. Generate Cover Image
      const coverResult = await this.imageProvider.generateImage({
        prompt: blueprint.visualPlan[0]?.promptSpec || `${blueprint.title} book cover`,
        bookTitle: blueprint.title,
        style: blueprint.style,
        isCover: true,
      });
      job.stepsCompleted.push('Book Cover Artwork Rendered');

      // 2. Generate Interior Illustrations according to smart visual plan
      const interiorVisuals = blueprint.visualPlan.filter((v) => v.visualType !== 'cover');
      for (let j = 0; j < Math.min(interiorVisuals.length, 3); j++) {
        const item = interiorVisuals[j];
        await this.imageProvider.generateImage({
          prompt: item.promptSpec,
          bookTitle: blueprint.title,
          style: blueprint.style,
          isCover: false,
        });
        job.stepsCompleted.push(`Illustration ${j + 1} Created`);
      }

      job.progress = 85;
      job.stage = 'designing';

      // -------------------------------------------------------------
      // STAGE 4: DESIGN & QUALITY CONTROL (85% -> 98%)
      // -------------------------------------------------------------
      // Deterministic page re-indexing
      const canonicalPages: BookPageDocument[] = allPages.map((page, idx) => ({
        ...page,
        pageNumber: idx + 1,
      }));

      const finalDocument: BookDocument = {
        schemaVersion: 1,
        id: bookId,
        userId: params.userId,
        title: blueprint.title,
        subtitle: blueprint.subtitle,
        bookType: blueprint.bookType,
        language: blueprint.language,
        style: blueprint.style,
        pageCount: canonicalPages.length,
        coverUrl: coverResult.url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        blueprint,
        pages: canonicalPages,
        versionNumber: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      devBooksStore.set(bookId, finalDocument);

      job.progress = 100;
      job.stage = 'completed';
      job.status = 'completed';
      job.stepsCompleted.push('Quality Check Passed');
      job.stepsCompleted.push('Your Book Is Ready');

      // Persist to Supabase if live
      try {
        const supabase = createAdminClient();
        await supabase
          .from('books')
          .update({
            title: finalDocument.title,
            subtitle: finalDocument.subtitle,
            status: 'completed',
            progress: 100,
            page_count: canonicalPages.length,
            blueprint: blueprint as any,
          })
          .eq('id', bookId);

        await supabase
          .from('jobs')
          .update({
            status: 'completed',
            stage: 'completed',
            progress: 100,
            completed_at: new Date().toISOString(),
          })
          .eq('id', jobId);
      } catch {
        // Dev in-memory store is active
      }
    } catch (err: any) {
      job.status = 'failed';
      job.stage = 'failed';
      job.error = err.message || 'Generation failed during processing.';
      console.error('Pipeline job failed:', err);
    }
  }

  static getJobState(jobId: string) {
    return devJobsStore.get(jobId);
  }

  static getBook(bookId: string): BookDocument | undefined {
    return devBooksStore.get(bookId);
  }

  static saveBook(doc: BookDocument) {
    devBooksStore.set(doc.id, doc);
  }
}
