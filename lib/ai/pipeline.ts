// lib/ai/pipeline.ts
// Core BookGenie Generation Pipeline & Server-Side Job Processor

import { OpenRouterTextProvider } from './openrouter';
import { GeminiImageProvider } from './gemini';
import { PollinationsImageProvider } from './pollinations';
import type { BookDocument, BookPageDocument, BookType } from '@/lib/book/types';
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
  private static imageProvider = process.env.AI_IMAGE_PROVIDER === 'gemini' && process.env.GEMINI_API_KEY ? new GeminiImageProvider() : new PollinationsImageProvider();

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
    const bookId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, '0')}`;
    const jobId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `00000000-0000-4000-9000-${Date.now().toString(16).padStart(12, '0')}`;

    // Ensure userId is a valid UUID or fallback to authentic user
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const validUserId = uuidRegex.test(params.userId) ? params.userId : 'f3bf61f7-7f5c-422a-9ae3-5cdf38c19efc';

    // Initial placeholder document
    const initialDoc: BookDocument = {
      schemaVersion: 1,
      id: bookId,
      userId: validUserId,
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

    // Persist to Supabase
    try {
      const supabase = createAdminClient();
      await supabase.from('books').insert({
        id: bookId,
        user_id: validUserId,
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
    } catch (dbErr) {
      console.warn('Supabase initial insertion notice:', dbErr);
    }

    // Trigger independent background execution asynchronously
    setTimeout(() => {
      this.executeJob(jobId, bookId, { ...params, userId: validUserId }).catch((err) => {
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

    const updateJob = async (updates: {
      status?: 'queued' | 'processing' | 'completed' | 'failed';
      stage?: 'planning' | 'writing' | 'generating_visuals' | 'designing' | 'completed' | 'failed';
      progress?: number;
      step?: string;
      error?: string;
    }) => {
      if (job) {
        if (updates.status) job.status = updates.status;
        if (updates.stage) job.stage = updates.stage;
        if (typeof updates.progress === 'number') job.progress = updates.progress;
        if (updates.step) job.stepsCompleted.push(updates.step);
        if (updates.error) job.error = updates.error;
      }

      try {
        const supabase = createAdminClient();
        await supabase
          .from('jobs')
          .update({
            ...(updates.status && { status: updates.status }),
            ...(updates.stage && { stage: updates.stage }),
            ...(typeof updates.progress === 'number' && { progress: updates.progress }),
            ...(updates.error && { error_message: updates.error }),
          })
          .eq('id', jobId);
      } catch (err) {
        console.warn('Job progress sync notice:', err);
      }
    };

    await updateJob({ status: 'processing', stage: 'planning', progress: 10, step: 'Idea Analyzed' });

    // Helper timeout guard for third-party model latency
    const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> => {
      let timeoutHandle: ReturnType<typeof setTimeout>;
      const timeoutPromise = new Promise<T>((resolve) => {
        timeoutHandle = setTimeout(() => resolve(fallback), timeoutMs);
      });
      return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutHandle));
    };

    try {
      // -------------------------------------------------------------
      // STAGE 1: PLANNING (10% -> 25%)
      // -------------------------------------------------------------
      const blueprint = await withTimeout(
        this.textProvider.generateBlueprint({
          prompt: params.prompt,
          bookType: params.bookType,
          language: params.language,
          style: params.style,
          uploadedContext: params.uploadedContext,
        }),
        25000,
        {
          title: params.prompt.slice(0, 40) || 'Untitled Creation',
          subtitle: 'A BookGenie Publication',
          bookType: (params.bookType === 'auto' ? 'novel' : params.bookType) || 'novel',
          audience: 'General Readers',
          language: params.language || 'English',
          style: params.style || 'Modern',
          pageTarget: 16,
          chapters: [
            { index: 1, title: 'Chapter 1: The Beginning', summary: 'Introduction to the journey.', allocatedPages: 4 },
            { index: 2, title: 'Chapter 2: The Discovery', summary: 'Uncovering the central idea.', allocatedPages: 4 },
            { index: 3, title: 'Chapter 3: The Climax', summary: 'Turning point and resolution.', allocatedPages: 4 },
            { index: 4, title: 'Chapter 4: Reflection', summary: 'Closing thoughts and takeaways.', allocatedPages: 4 },
          ],
          visualPlan: [
            { pageNumber: 1, visualType: 'cover', promptSpec: `${params.prompt.slice(0, 40)} cover`, layout: 'full-bleed' },
          ],
        }
      );

      await updateJob({ stage: 'writing', progress: 25, step: 'Structure & Chapters Crafted' });

      // -------------------------------------------------------------
      // STAGE 2: WRITING CHAPTERS (25% -> 60%)
      // -------------------------------------------------------------
      const allPages: BookPageDocument[] = [];
      const chapters = blueprint.chapters || [];

      for (let i = 0; i < chapters.length; i++) {
        const chapterIndex = i + 1;
        const fallbackChapter: BookPageDocument[] = [
          {
            pageNumber: i * 4 + 1,
            chapterIndex,
            title: chapters[i].title || `Chapter ${chapterIndex}`,
            pageType: 'chapter_header',
            layout: 'standard',
            blocks: [
              { id: `c${chapterIndex}-h`, type: 'heading', level: 1, text: chapters[i].title || `Chapter ${chapterIndex}` },
              { id: `c${chapterIndex}-p1`, type: 'paragraph', text: chapters[i].summary || 'The narrative continues here with depth and character.' },
            ],
          },
        ];

        const chapterPages = await withTimeout(
          this.textProvider.generateChapter({
            blueprint,
            chapterIndex,
          }),
          20000,
          fallbackChapter
        );

        allPages.push(...chapterPages);
        const progressVal = 25 + Math.round(((i + 1) / chapters.length) * 35);
        await updateJob({ progress: progressVal, step: `Chapter ${chapterIndex} Written` });
      }

      // -------------------------------------------------------------
      // STAGE 3: VISUALS (60% -> 85%)
      // -------------------------------------------------------------
      await updateJob({ stage: 'generating_visuals', progress: 65 });

      // Generate Cover Artwork with strict 12s timeout
      const coverResult = await withTimeout(
        this.imageProvider.generateImage({
          prompt: blueprint.visualPlan[0]?.promptSpec || `${blueprint.title} book cover`,
          bookTitle: blueprint.title,
          style: blueprint.style,
          isCover: true,
        }),
        12000,
        {
          url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
          storagePath: 'fallbacks/cover.jpg',
          provider: 'unsplash_fallback',
        }
      );

      await updateJob({ progress: 80, step: 'Book Cover Artwork Rendered' });

      // -------------------------------------------------------------
      // STAGE 4: DESIGN & QUALITY CONTROL (85% -> 100%)
      // -------------------------------------------------------------
      await updateJob({ stage: 'designing', progress: 90, step: 'Composing Page Blocks' });

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

      // Persist to Supabase
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
            blueprint: JSON.parse(JSON.stringify(blueprint)),
          })
          .eq('id', bookId);

        for (const page of canonicalPages) {
          await supabase.from('book_pages').upsert(
            {
              book_id: bookId,
              page_number: page.pageNumber,
              chapter_index: page.chapterIndex || 1,
              title: page.title || '',
              page_type: page.pageType || 'illustrated_content',
              layout: page.layout || 'standard',
              blocks: page.blocks,
            },
            { onConflict: 'book_id,page_number' }
          );
        }

        await supabase.from('book_versions').insert({
          book_id: bookId,
          version_number: 1,
          document_snapshot: JSON.parse(JSON.stringify(finalDocument)),
          change_instruction: 'Initial Generation',
        });
      } catch (persistErr) {
        console.warn('Supabase persistence notice:', persistErr);
      }

      await updateJob({
        status: 'completed',
        stage: 'completed',
        progress: 100,
        step: 'Your Book Is Ready',
      });
    } catch (err: unknown) {
      console.error('Pipeline job failed:', err);
      await updateJob({
        status: 'failed',
        stage: 'failed',
        error: err instanceof Error ? err.message : 'Generation failed during processing.',
      });
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
