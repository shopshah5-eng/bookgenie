// lib/ai/mock-provider.ts
// Deterministic zero-cost local development & testing provider
// Generates realistic structured BookDocuments without making external API calls

import type { ITextProvider, GenerateBlueprintParams, GenerateChapterParams, RegeneratePagesParams } from './text-provider';
import type { IImageProvider, GenerateImageParams, ImageGenerationResult } from './image-provider';
import type { BookBlueprint, BookPageDocument, ContentBlock } from '@/lib/book/types';

export class MockTextProvider implements ITextProvider {
  async generateBlueprint(params: GenerateBlueprintParams): Promise<BookBlueprint> {
    const rawPrompt = params.prompt.toLowerCase();
    const inferredType = params.bookType && params.bookType !== 'auto'
      ? params.bookType
      : rawPrompt.includes('color')
      ? 'coloring'
      : rawPrompt.includes('child') || rawPrompt.includes('fox') || rawPrompt.includes('animal')
      ? 'children'
      : rawPrompt.includes('recipe') || rawPrompt.includes('cook')
      ? 'recipe'
      : rawPrompt.includes('history') || rawPrompt.includes('empire')
      ? 'history'
      : rawPrompt.includes('guide') || rawPrompt.includes('marketing') || rawPrompt.includes('finance')
      ? 'guide'
      : 'novel';

    const title = params.prompt.length > 5 && !params.prompt.startsWith('Create')
      ? params.prompt.slice(0, 45)
      : inferredType === 'children'
      ? 'The Little Fox & The Whispering Woods'
      : inferredType === 'coloring'
      ? 'Jungle Animals & Botanical Patterns'
      : inferredType === 'history'
      ? 'Chronicles of the Silk Road'
      : inferredType === 'recipe'
      ? 'Nourish: Wholesome Everyday Cooking'
      : 'The Architect of Tomorrow';

    return {
      title,
      subtitle: 'A beautifully structured publication created with BookGenie',
      bookType: inferredType,
      audience: 'General / Curious Readers',
      language: params.language || 'English',
      style: params.style || 'Editorial Luxury',
      pageTarget: 16,
      chapters: [
        {
          index: 1,
          title: 'The Journey Begins',
          summary: 'Introduction to our world and key characters as dawn breaks.',
          allocatedPages: 4,
        },
        {
          index: 2,
          title: 'Uncharted Paths',
          summary: 'Navigating unexpected obstacles and uncovering hidden wonders.',
          allocatedPages: 4,
        },
        {
          index: 3,
          title: 'The Great Discovery',
          summary: 'A moment of profound clarity that changes the perspective forever.',
          allocatedPages: 4,
        },
        {
          index: 4,
          title: 'A New Horizon',
          summary: 'Reflecting on the wisdom gained and stepping into the future.',
          allocatedPages: 4,
        },
      ],
      visualPlan: [
        {
          pageNumber: 1,
          visualType: 'cover',
          promptSpec: 'Editorial book cover with gold foil accents and warm natural lighting.',
          layout: 'full-bleed',
        },
        {
          pageNumber: 4,
          visualType: 'illustration',
          promptSpec: 'Soft morning light illuminating an enchanted forest landscape.',
          layout: 'image-right',
        },
        {
          pageNumber: 8,
          visualType: 'illustration',
          promptSpec: 'A gentle character sitting beside a glowing lantern beneath ancient trees.',
          layout: 'image-bottom',
        },
        {
          pageNumber: 13,
          visualType: 'illustration',
          promptSpec: 'Golden sunset breaking through canopy with gentle sparkles in the air.',
          layout: 'image-top',
        },
      ],
      characterBible: {
        protagonist: 'Milo: Curious little red fox with cream chest and a soft blue scarf.',
        tone: 'Warm, heartwarming, inspiring, with gentle pacing.',
      },
    };
  }

  async generateChapter(params: GenerateChapterParams): Promise<BookPageDocument[]> {
    const chapter = params.blueprint.chapters.find((c) => c.index === params.chapterIndex) || {
      index: params.chapterIndex,
      title: `Chapter ${params.chapterIndex}`,
      summary: 'A compelling exploration of ideas and narrative depth.',
      allocatedPages: 4,
    };

    const startPage = (params.chapterIndex - 1) * 4 + 1;
    const pages: BookPageDocument[] = [];

    // Page 1: Chapter Opener
    pages.push({
      pageNumber: startPage,
      chapterIndex: chapter.index,
      title: chapter.title,
      pageType: 'chapter_header',
      layout: 'standard',
      blocks: [
        {
          id: `b-${startPage}-1`,
          type: 'heading',
          level: 1,
          text: `Chapter ${chapter.index}: ${chapter.title}`,
        },
        {
          id: `b-${startPage}-2`,
          type: 'quote',
          text: '“Every voyage begins with the simple courage to take a solitary step.”',
        },
        {
          id: `b-${startPage}-3`,
          type: 'paragraph',
          text: `The morning air carried the scent of pine and damp earth. In this opening chapter, we explore how early beginnings shape everything that follows. The quiet stillness before action is often where true purpose takes root.`,
        },
      ],
    });

    // Page 2: Narrative / Content
    pages.push({
      pageNumber: startPage + 1,
      chapterIndex: chapter.index,
      pageType: 'content',
      layout: 'text-only',
      blocks: [
        {
          id: `b-${startPage + 1}-1`,
          type: 'paragraph',
          text: `As the path wound deeper into the valley, light filtered through the canopy in delicate amber rays. There is an unmistakable rhythm to genuine exploration—one that asks us to slow down, observe the subtle patterns, and listen closely.`,
        },
        {
          id: `b-${startPage + 1}-2`,
          type: 'paragraph',
          text: `Key discoveries rarely announce themselves with thunderous fanfare. Instead, they arrive as quiet realizations: a shift in the breeze, an unexpected turn in the trail, or a sudden insight that reframes the entire quest.`,
        },
      ],
    });

    // Page 3: Illustrated Narrative
    const visual = params.blueprint.visualPlan.find((v) => v.pageNumber === startPage + 2);
    pages.push({
      pageNumber: startPage + 2,
      chapterIndex: chapter.index,
      pageType: visual ? 'illustrated_content' : 'content',
      layout: visual?.layout || 'image-right',
      blocks: [
        {
          id: `b-${startPage + 2}-1`,
          type: 'heading',
          level: 2,
          text: 'The Turning of the Trail',
        },
        {
          id: `b-${startPage + 2}-2`,
          type: 'paragraph',
          text: `Here, amid ancient stone arches and blossoming flora, our characters encountered the first true sign of what lay ahead. It stood as a silent testament to the travelers who came before.`,
        },
        ...(visual
          ? [
              {
                id: `b-${startPage + 2}-img`,
                type: 'image' as const,
                caption: visual.promptSpec,
              },
            ]
          : []),
      ],
    });

    // Page 4: Reflection & Key Takeaways
    pages.push({
      pageNumber: startPage + 3,
      chapterIndex: chapter.index,
      pageType: 'content',
      layout: 'standard',
      blocks: [
        {
          id: `b-${startPage + 3}-1`,
          type: 'heading',
          level: 3,
          text: 'Reflections & Insights',
        },
        {
          id: `b-${startPage + 3}-2`,
          type: 'list',
          items: [
            'Courage is not the absence of doubt, but action in its presence.',
            'Patience reveals details that haste habitually overlooks.',
            'The company you keep on the journey determines the joy of arrival.',
          ],
        },
        {
          id: `b-${startPage + 3}-3`,
          type: 'paragraph',
          text: `With these principles firmly in hand, our characters turned their gaze forward, prepared for the mysteries awaiting in the next chapter.`,
        },
      ],
    });

    return pages;
  }

  async regeneratePages(params: RegeneratePagesParams): Promise<{
    pages: BookPageDocument[];
    requiresImageRegeneration: boolean;
    imageInstructions?: Array<{ pageNumber: number; prompt: string }>;
  }> {
    const rawInstruction = params.instruction.toLowerCase();
    const isImageInstruction =
      rawInstruction.includes('image') ||
      rawInstruction.includes('illustration') ||
      rawInstruction.includes('picture') ||
      rawInstruction.includes('color') ||
      rawInstruction.includes('visual');

    const updated = params.existingPages.map((page) => {
      // If target pages specified and not this page, keep unchanged
      if (params.targetPageNumbers && !params.targetPageNumbers.includes(page.pageNumber)) {
        return page;
      }

      // Modify blocks with refined tone
      const revisedBlocks: ContentBlock[] = page.blocks.map((block) => {
        if (block.type === 'paragraph' && block.text) {
          return {
            ...block,
            text: `${block.text} [Revised: ${params.instruction}]`,
          };
        }
        return block;
      });

      return {
        ...page,
        blocks: revisedBlocks,
      };
    });

    return {
      pages: updated,
      requiresImageRegeneration: isImageInstruction,
      imageInstructions: isImageInstruction
        ? [
            {
              pageNumber: params.targetPageNumbers?.[0] || 1,
              prompt: `Modified according to: ${params.instruction}`,
            },
          ]
        : undefined,
    };
  }
}

export class MockImageProvider implements IImageProvider {
  async generateImage(params: GenerateImageParams): Promise<ImageGenerationResult> {
    const seed = encodeURIComponent(params.prompt.slice(0, 30));
    // Curated high quality royalty-free placeholder image URL
    const demoUrl = params.isCover
      ? `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80`
      : `https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80`;

    return {
      url: demoUrl,
      storagePath: `mock-assets/${seed}.jpg`,
      provider: 'mock',
    };
  }
}
