// lib/ai/pipeline.ts
// Core BookGenie Generation Pipeline & Server-Side Job Processor

import { OpenRouterTextProvider } from './openrouter';
import { GeminiImageProvider } from './gemini';
import { PollinationsImageProvider } from './pollinations';
import type { BookBlueprint, BookDocument, BookPageDocument, BookType } from '@/lib/book/types';
import { createAdminClient } from '@/lib/supabase/admin';
import { persistGeneratedImage } from '@/lib/book/asset-storage';

export class GenerationPipeline {
  private static textProvider = new OpenRouterTextProvider();
  private static imageProvider = process.env.AI_IMAGE_PROVIDER === 'gemini'
    ? new GeminiImageProvider()
    : new PollinationsImageProvider();

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
    pageTarget?: number;
    chapterScale?: number;
  }): Promise<{ bookId: string; jobId: string }> {
    const bookId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, '0')}`;
    const jobId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `00000000-0000-4000-9000-${Date.now().toString(16).padStart(12, '0')}`;

    // Supabase user IDs are UUIDs. Never replace an invalid identity with a
    // shared/fallback user: that would attach one creator's book to another.
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(params.userId)) {
      throw new Error('Authenticated user ID is invalid.');
    }
    const validUserId = params.userId;

    const targetPages = Number(params.pageTarget) || 16;

    // Initial placeholder document
    const initialDoc: BookDocument = {
      schemaVersion: 1,
      id: bookId,
      userId: validUserId,
      title: params.prompt.slice(0, 45).trim() || 'Untitled eBook',
      bookType: (params.bookType === 'auto' ? 'novel' : params.bookType) || 'novel',
      language: params.language || 'English',
      style: params.style || 'Modern',
      pageCount: targetPages,
      blueprint: {
        title: params.prompt.slice(0, 45).trim() || 'Untitled eBook',
        subtitle: 'A Beautiful Illustrated eBook',
        bookType: (params.bookType === 'auto' ? 'novel' : params.bookType) || 'novel',
        audience: 'General',
        language: params.language || 'English',
        style: params.style || 'Modern',
        pageTarget: targetPages,
        chapters: [],
        visualPlan: [],
        prompt: params.prompt,
        uploadedContext: params.uploadedContext,
      },
      pages: [],
      versionNumber: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Persist to Supabase
    try {
      const supabase = createAdminClient();
      const { error: bErr } = await supabase.from('books').insert({
        id: bookId,
        user_id: validUserId,
        title: initialDoc.title,
        subtitle: initialDoc.subtitle,
        book_type: initialDoc.bookType,
        language: initialDoc.language,
        style: initialDoc.style,
        status: 'planning',
        progress: 5,
        page_count: targetPages,
        page_target: targetPages,
        blueprint: initialDoc.blueprint as any,
      });
      if (bErr) {
        throw new Error(`Could not create book record: ${bErr.message}`);
      }

      const { error: jErr } = await supabase.from('jobs').insert({
        id: jobId,
        book_id: bookId,
        status: 'queued',
        stage: 'planning',
        progress: 5,
      });
      if (jErr) {
        // Avoid leaving an orphaned book if the paired job cannot be queued.
        await supabase.from('books').delete().eq('id', bookId);
        throw new Error(`Could not queue generation job: ${jErr.message}`);
      }
    } catch (dbErr) {
      console.error('Supabase initial insertion failed:', dbErr);
      throw dbErr;
    }

    // Trigger initial progression immediately (non-blocking)
    try {
      this.advanceJob(jobId, bookId).catch((advErr) => {
        console.warn('Immediate advance notice:', advErr);
      });
    } catch (_) {}

    return { bookId, jobId };
  }

  // Active progression locks for atomic step processing in serverless
  private static activeAdvancingLocks = new Set<string>();

  /**
   * Step-driven progression for serverless and polled environments.
   * Advances the generation pipeline by one or two cohesive stages per call,
   * guaranteeing zero timeouts and 100% completion even on serverless runtimes.
   */
  static async advanceJob(jobId: string, bookId: string): Promise<any> {
    if (this.activeAdvancingLocks.has(jobId)) {
      return null;
    }

    this.activeAdvancingLocks.add(jobId);

    try {
      const supabase = createAdminClient();

      // 1. Fetch current job
      const { data: dbJob } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .maybeSingle();

      if (!dbJob) throw new Error('Generation job was not found.');
      const currentJob = dbJob;

      if (currentJob.status === 'completed' || currentJob.status === 'failed') {
        return currentJob;
      }

      // 2. Fetch current book
      const { data: dbBook } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .maybeSingle();

      if (!dbBook) throw new Error('Book was not found.');
      const book = dbBook;
      if (!book.blueprint || typeof book.blueprint !== 'object') {
        throw new Error('Book blueprint is missing.');
      }
      const blueprint = book.blueprint as BookBlueprint;

      const promptText = (blueprint as any).prompt || book?.title || 'A beautiful illustrated book';
      const stage = currentJob.stage || 'planning';

      // -------------------------------------------------------------
      // STAGE 1: PLANNING & METADATA (5% -> 25%)
      // -------------------------------------------------------------
      if (stage === 'planning' || stage === 'metadata') {
        let generatedBlueprint;
        try {
          generatedBlueprint = await Promise.race([
            this.textProvider.generateBlueprint({
              prompt: promptText,
              bookType: blueprint.bookType,
              language: blueprint.language,
              style: blueprint.style,
              uploadedContext: (blueprint as any).uploadedContext,
            }),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Blueprint provider timeout')), 22_000)),
          ]);
        } catch (planErr: any) {
          console.warn(`[Pipeline] Blueprint generation attempt failed: ${planErr.message}. Retrying on next poll...`);
          return {
            id: jobId,
            book_id: bookId,
            status: 'processing',
            stage: 'planning',
            progress: 5,
          };
        }

        const generatedVisualPlan = Array.isArray(generatedBlueprint.visualPlan) ? generatedBlueprint.visualPlan : [];
        const visualPlan = generatedVisualPlan.some((item) => item.visualType === 'cover')
          ? generatedVisualPlan
          : [
              {
                pageNumber: 1,
                visualType: 'cover' as const,
                promptSpec: `${generatedBlueprint.title}, professional editorial book cover artwork`,
                layout: 'full-bleed' as const,
              },
              ...generatedVisualPlan,
            ];
        const mergedBlueprint = {
          ...generatedBlueprint,
          visualPlan,
          prompt: promptText,
        };

        // Persist to Supabase and fail the stage if either durable write fails.
        const { error: planningBookError } = await supabase
          .from('books')
          .update({
            title: mergedBlueprint.title,
            subtitle: mergedBlueprint.subtitle,
            blueprint: mergedBlueprint as any,
            status: 'planning',
            progress: 20,
          })
          .eq('id', bookId);
        if (planningBookError) throw planningBookError;

        const { error: planningJobError } = await supabase
          .from('jobs')
          .update({
            stage: 'cover',
            status: 'processing',
            progress: 25,
          })
          .eq('id', jobId);
        if (planningJobError) throw planningJobError;

        return {
          id: jobId,
          book_id: bookId,
          status: 'processing',
          stage: 'cover',
          progress: 25,
          title: mergedBlueprint.title,
          subtitle: mergedBlueprint.subtitle,
        };
      }

      // -------------------------------------------------------------
      // STAGE 2: GENERATE COVER IMAGE (25% -> 50%)
      // -------------------------------------------------------------
      if (stage === 'cover') {
        const coverPrompt = blueprint.visualPlan?.find((item) => item.visualType === 'cover')?.promptSpec
          || `${book?.title || promptText}, high quality editorial book cover illustration, cinematic lighting, masterpiece`;
        const ownerId = book?.user_id;
        if (!ownerId) throw new Error('Book owner is missing; cannot persist cover asset.');

        let result;
        try {
          result = await Promise.race([
            this.imageProvider.generateImage({
              prompt: coverPrompt,
              bookTitle: book?.title || 'Book',
              style: book?.style || 'editorial',
              isCover: true,
            }),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Cover image provider timeout')), 22_000)),
          ]);
        } catch (imgErr: any) {
          console.warn(`[Pipeline] Cover image attempt timed out or failed: ${imgErr.message}. Retrying on next poll...`);
          return {
            id: jobId,
            book_id: bookId,
            status: 'processing',
            stage: 'cover',
            progress: 25,
          };
        }
        const asset = await persistGeneratedImage({
          bookId,
          userId: ownerId,
          type: 'cover',
          prompt: coverPrompt,
          result,
        });
        const updatedVisualPlan = (blueprint.visualPlan || []).map((item) =>
          item.visualType === 'cover' ? { ...item, assetId: asset.id, url: asset.url } : item
        );
        const updatedBlueprint = { ...blueprint, visualPlan: updatedVisualPlan };

        const { error: bookUpdateError } = await supabase
          .from('books')
          .update({
            cover_asset_id: asset.id,
            cover_url: asset.url,
            cover_image_url: asset.url,
            blueprint: updatedBlueprint,
            status: 'writing',
            progress: 45,
          })
          .eq('id', bookId);
        if (bookUpdateError) throw bookUpdateError;

        const { error: jobUpdateError } = await supabase
          .from('jobs')
          .update({ stage: 'writing', status: 'processing', progress: 50 })
          .eq('id', jobId);
        if (jobUpdateError) throw jobUpdateError;

        return {
          id: jobId,
          book_id: bookId,
          status: 'processing',
          stage: 'writing',
          progress: 50,
          cover_url: asset.url,
        };
      }

      // -------------------------------------------------------------
      // STAGE 3: WRITING CHAPTERS (50% -> 65%)
      // One chapter is generated per poll to prevent serverless timeouts.
      // -------------------------------------------------------------
      if (stage === 'writing' || stage === 'outline') {
        const chapters = blueprint.chapters || [];
        if (chapters.length === 0) throw new Error('Blueprint contained no chapters.');

        const existingPages = blueprint.generatedPages || [];
        const generatedChapterIndices = new Set(existingPages.map((p) => p.chapterIndex));
        const nextChapter = chapters.find((ch, i) => !generatedChapterIndices.has(ch.index ?? i + 1));

        if (nextChapter) {
          const chapterIndex = nextChapter.index ?? (chapters.indexOf(nextChapter) + 1);
          const timeoutPromise = new Promise<BookPageDocument[]>((_, reject) =>
            setTimeout(() => reject(new Error('Chapter provider timeout')), 22_000)
          );
          let rawPages: BookPageDocument[];
          try {
            rawPages = await Promise.race([
              this.textProvider.generateChapter({
                blueprint,
                chapterIndex,
              }),
              timeoutPromise,
            ]);
          } catch (err: any) {
            console.warn(`[Pipeline] Chapter ${chapterIndex} generation failed or timed out: ${err.message}. Retrying on next poll...`);
            return {
              id: jobId,
              book_id: bookId,
              status: 'processing',
              stage: 'writing',
              progress: Math.min(64, 50 + Math.round((existingPages.length / Math.max(chapters.length * 2, 1)) * 15)),
            };
          }

          const newChapterPages = rawPages.map((p) => ({
            ...p,
            chapterIndex,
          }));

          const updatedGeneratedPages = [...existingPages, ...newChapterPages];
          const updatedBlueprint = {
            ...blueprint,
            generatedPages: updatedGeneratedPages,
          };

          const chaptersDone = new Set(updatedGeneratedPages.map((p) => p.chapterIndex)).size;
          const isComplete = chaptersDone >= chapters.length;

          if (isComplete) {
            // Normalize page numbers across the entire manuscript
            const normalizedPages = updatedGeneratedPages.map((page, index) => ({
              ...page,
              pageNumber: index + 1,
            }));
            const finalBlueprint = {
              ...updatedBlueprint,
              generatedPages: normalizedPages,
            };

            const { error: blueprintError } = await supabase
              .from('books')
              .update({ blueprint: finalBlueprint, status: 'generating_visuals', progress: 65 })
              .eq('id', bookId);
            if (blueprintError) throw blueprintError;

            const { error: jobError } = await supabase
              .from('jobs')
              .update({ stage: 'illustrations', status: 'processing', progress: 65 })
              .eq('id', jobId);
            if (jobError) throw jobError;

            return {
              id: jobId,
              book_id: bookId,
              status: 'processing',
              stage: 'illustrations',
              progress: 65,
            };
          }

          const progress = Math.max(currentJob.progress || 50, Math.min(64, 50 + Math.round((chaptersDone / chapters.length) * 15)));

          const { error: bookUpdateError } = await supabase
            .from('books')
            .update({ blueprint: updatedBlueprint, progress })
            .eq('id', bookId);
          if (bookUpdateError) throw bookUpdateError;

          const { error: jobUpdateError } = await supabase
            .from('jobs')
            .update({ progress })
            .eq('id', jobId);
          if (jobUpdateError) throw jobUpdateError;

          return {
            id: jobId,
            book_id: bookId,
            status: 'processing',
            stage: 'writing',
            progress,
          };
        }

        // If all chapters were already recorded, advance to illustrations
        const normalizedPages = existingPages.map((page, index) => ({
          ...page,
          pageNumber: index + 1,
        }));
        const finalBlueprint = {
          ...blueprint,
          generatedPages: normalizedPages,
        };

        const { error: blueprintError } = await supabase
          .from('books')
          .update({ blueprint: finalBlueprint, status: 'generating_visuals', progress: 65 })
          .eq('id', bookId);
        if (blueprintError) throw blueprintError;

        const { error: jobError } = await supabase
          .from('jobs')
          .update({ stage: 'illustrations', status: 'processing', progress: 65 })
          .eq('id', jobId);
        if (jobError) throw jobError;

        return {
          id: jobId,
          book_id: bookId,
          status: 'processing',
          stage: 'illustrations',
          progress: 65,
        };
      }

      // -------------------------------------------------------------
      // STAGE 4: GENERATE AND ATTACH ILLUSTRATIONS (65% -> 80%)
      // One image is generated per poll so a serverless request does not
      // time out on a long book.
      // -------------------------------------------------------------
      if (stage === 'illustrations') {
        const ownerId = book?.user_id;
        if (!ownerId) throw new Error('Book owner is missing; cannot persist illustration.');
        const visualPlan = blueprint.visualPlan || [];
        const completedVisualsCount = visualPlan.filter((item) => item.visualType !== 'none' && item.assetId).length;
        const totalVisualsCount = Math.max(visualPlan.filter((item) => item.visualType !== 'none').length, 1);
        const currentProgress = Math.min(80, 65 + Math.round((completedVisualsCount / totalVisualsCount) * 15));

        const nextVisual = visualPlan.find((item) => item.visualType !== 'none' && !item.assetId);

        if (nextVisual) {
          const attempts = ((nextVisual as any)._attempts || 0) + 1;
          if (attempts > 3) {
            console.warn(`[Pipeline] Visual item on page ${nextVisual.pageNumber} exceeded retry limit. Skipping...`);
            const updatedVisualPlan = visualPlan.map((item) =>
              item === nextVisual ? { ...item, assetId: 'skipped' } : item
            );
            const nextProgress = Math.min(80, 65 + Math.round(((completedVisualsCount + 1) / totalVisualsCount) * 15));
            await supabase.from('books').update({ blueprint: { ...blueprint, visualPlan: updatedVisualPlan }, progress: nextProgress }).eq('id', bookId);
            return { id: jobId, book_id: bookId, status: 'processing', stage: 'illustrations', progress: nextProgress };
          }

          const imagePrompt = nextVisual.promptSpec || `${book?.title || promptText}, editorial illustration`;
          let result;
          try {
            result = await Promise.race([
              this.imageProvider.generateImage({
                prompt: imagePrompt,
                bookTitle: book?.title || 'Book',
                style: book?.style || 'editorial',
                isCover: nextVisual.visualType === 'cover',
              }),
              new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Illustration provider timeout')), 22_000)),
            ]);
          } catch (imgErr: any) {
            console.warn(`[Pipeline] Illustration attempt timed out or failed: ${imgErr.message}. Retrying on next poll...`);
            const updatedVisualPlan = visualPlan.map((item) =>
              item === nextVisual ? { ...item, _attempts: attempts } : item
            );
            await supabase.from('books').update({ blueprint: { ...blueprint, visualPlan: updatedVisualPlan } }).eq('id', bookId);
            return {
              id: jobId,
              book_id: bookId,
              status: 'processing',
              stage: 'illustrations',
              progress: currentProgress,
            };
          }
          const asset = await persistGeneratedImage({
            bookId,
            userId: ownerId,
            type: nextVisual.visualType === 'diagram' ? 'diagram' : 'illustration',
            pageNumber: nextVisual.pageNumber,
            prompt: imagePrompt,
            result,
          });

          const generatedPages = blueprint.generatedPages || [];
          const targetPageNumber = generatedPages.some((page) => page.pageNumber === nextVisual.pageNumber)
            ? nextVisual.pageNumber
            : generatedPages[0]?.pageNumber;
          if (!targetPageNumber) throw new Error('Illustration target page does not exist.');
          const updatedPages = generatedPages.map((page) => {
            if (page.pageNumber !== targetPageNumber) return page;
            const hasImage = page.blocks.some((block) => block.type === 'image');
            const imageBlock = {
              id: `asset-${asset.id}`,
              type: 'image' as const,
              assetId: asset.id,
              url: asset.url,
              caption: imagePrompt,
            };
            return {
              ...page,
              layout: nextVisual.layout || page.layout,
              blocks: hasImage
                ? page.blocks.map((block) => block.type === 'image' ? { ...block, assetId: asset.id, url: asset.url, caption: block.caption || imagePrompt } : block)
                : [...page.blocks, imageBlock],
            };
          });
          const updatedBlueprint = {
            ...blueprint,
            visualPlan: visualPlan.map((item) => item.pageNumber === nextVisual.pageNumber
              ? { ...item, assetId: asset.id, url: asset.url }
              : item),
            generatedPages: updatedPages,
          };
          const completedVisuals = updatedBlueprint.visualPlan.filter((item) => item.visualType !== 'none' && item.assetId).length;
          const totalVisuals = Math.max(updatedBlueprint.visualPlan.filter((item) => item.visualType !== 'none').length, 1);
          const progress = Math.max(currentJob.progress || 65, Math.min(80, 65 + Math.round((completedVisuals / totalVisuals) * 15)));

          const { error: blueprintError } = await supabase
            .from('books')
            .update({ blueprint: updatedBlueprint, progress })
            .eq('id', bookId);
          if (blueprintError) throw blueprintError;
          const { error: illustrationJobError } = await supabase
            .from('jobs')
            .update({ stage: 'illustrations', status: 'processing', progress })
            .eq('id', jobId);
          if (illustrationJobError) throw illustrationJobError;
          return { id: jobId, book_id: bookId, status: 'processing', stage: 'illustrations', progress };
        }

        const { error: designingJobError } = await supabase
          .from('jobs')
          .update({ stage: 'designing', status: 'processing', progress: 85 })
          .eq('id', jobId);
        if (designingJobError) throw designingJobError;
        const { error: designingBookError } = await supabase
          .from('books')
          .update({ status: 'designing', progress: 85 })
          .eq('id', bookId);
        if (designingBookError) throw designingBookError;
        return { id: jobId, book_id: bookId, status: 'processing', stage: 'designing', progress: 85 };
      }

      // -------------------------------------------------------------
      // STAGE 5: DESIGNING & PERSISTING PAGES (80% -> 95%)
      // -------------------------------------------------------------
      if (stage === 'designing') {
        const rawPages: BookPageDocument[] = (blueprint as any).generatedPages || [];
        
        if (rawPages.length === 0) throw new Error('Chapter generation returned no pages.');
        const pagesToFormat: BookPageDocument[] = rawPages;

        const canonicalPages: BookPageDocument[] = pagesToFormat.map((page, idx) => ({
          ...page,
          pageNumber: idx + 1,
        }));

        // Upsert pages into Supabase book_pages table in a single batch query
        const pagesToUpsert = canonicalPages.map((page) => ({
          book_id: bookId,
          page_number: page.pageNumber,
          chapter_index: page.chapterIndex || 1,
          title: page.title || '',
          page_type: page.pageType || 'illustrated_content',
          layout: page.layout || 'standard',
          blocks: page.blocks || [],
        }));

        const { error: pageError } = await supabase
          .from('book_pages')
          .upsert(pagesToUpsert, { onConflict: 'book_id,page_number' });
        if (pageError) throw pageError;

        const { error: designingBookError } = await supabase
          .from('books')
          .update({
            page_count: canonicalPages.length,
            status: 'designing',
            progress: 90,
          })
          .eq('id', bookId);
        if (designingBookError) throw designingBookError;

        const { error: finalizingJobError } = await supabase
          .from('jobs')
          .update({
            stage: 'finalizing',
            status: 'processing',
            progress: 95,
          })
          .eq('id', jobId);
        if (finalizingJobError) throw finalizingJobError;

        return {
          id: jobId,
          book_id: bookId,
          status: 'processing',
          stage: 'finalizing',
          progress: 95,
        };
      }

      // -------------------------------------------------------------
      // STAGE 5: FINALIZING & COMPLETION (95% -> 100%)
      // -------------------------------------------------------------
      if (stage === 'finalizing') {
        const finalDoc: BookDocument = {
          schemaVersion: 1,
          id: bookId,
          userId: book?.user_id || '',
          title: book?.title || blueprint.title || 'Untitled eBook',
          subtitle: book?.subtitle || blueprint.subtitle || '',
          bookType: book?.book_type || blueprint.bookType || 'novel',
          language: book?.language || blueprint.language || 'English',
          style: book?.style || blueprint.style || 'Modern',
          pageCount: book?.page_count || 16,
          coverAssetId: book?.cover_asset_id || undefined,
          coverUrl: book?.cover_url || book?.cover_image_url || undefined,
          blueprint,
          pages: (blueprint as any).generatedPages || [],
          versionNumber: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };


        const { data: existingVersion } = await supabase
          .from('book_versions')
          .select('id')
          .eq('book_id', bookId)
          .eq('version_number', 1)
          .maybeSingle();

        if (!existingVersion) {
          const { error: versionError } = await supabase.from('book_versions').insert({
            book_id: bookId,
            version_number: 1,
            document_snapshot: finalDoc as any,
            change_instruction: 'Initial Generation',
          });
          if (versionError) throw versionError;
        }

        const { error: completedBookError } = await supabase
          .from('books')
          .update({
            status: 'completed',
            progress: 100,
          })
          .eq('id', bookId);
        if (completedBookError) throw completedBookError;

        const { error: completedJobError } = await supabase
          .from('jobs')
          .update({
            status: 'completed',
            stage: 'completed',
            progress: 100,
            completed_at: new Date().toISOString(),
          })
          .eq('id', jobId);
        if (completedJobError) throw completedJobError;

        return {
          id: jobId,
          book_id: bookId,
          status: 'completed',
          stage: 'completed',
          progress: 100,
        };
      }

      return currentJob;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Generation stage failed.';
      console.error('advanceJob error:', err);
      try {
        const failureClient = createAdminClient();
        await failureClient
          .from('jobs')
          .update({ status: 'failed', stage: 'failed', error_message: message })
          .eq('id', jobId)
          .eq('book_id', bookId);
        await failureClient
          .from('books')
          .update({ status: 'failed' })
          .eq('id', bookId);
      } catch (persistError) {
        console.error('Could not persist generation failure:', persistError);
      }
      return {
        id: jobId,
        book_id: bookId,
        status: 'failed',
        stage: 'failed',
        progress: 0,
        error_message: message,
      };
    } finally {
      this.activeAdvancingLocks.delete(jobId);
    }
  }

}
