// lib/ai/cost-controller.ts
// Intelligent multi-tier router & cost controller for BookGenie
// Determines the cheapest acceptable model for each task and manages prompt caching

import type { BookType } from '@/lib/book/types';

export type TextTaskType =
  | 'classification'
  | 'planning'
  | 'chapter_writing'
  | 'qc_check'
  | 'micro_revision'
  | 'complex_revision';

export interface ModelSelection {
  tier: 'free_or_cheap' | 'standard' | 'premium';
  modelId: string;
  maxTokens: number;
  temperature: number;
}

export class AICostController {
  /**
   * Selects the most cost-effective text model based on task complexity and book type
   */
  static selectTextModel(task: TextTaskType, bookType?: BookType): ModelSelection {
    const devModel = process.env.AI_TEXT_MODEL_DEV || 'openrouter/free';
    const standardModel = process.env.AI_TEXT_MODEL_STANDARD || 'meta-llama/llama-3.3-70b-instruct';
    const premiumModel = process.env.AI_TEXT_MODEL_PREMIUM || 'anthropic/claude-3.5-sonnet';

    // Tier 1: Cheap / Free for deterministic metadata, classification & QC
    if (task === 'classification' || task === 'qc_check' || task === 'micro_revision') {
      return {
        tier: 'free_or_cheap',
        modelId: devModel,
        maxTokens: 1200,
        temperature: 0.2, // low temp for deterministic JSON extraction
      };
    }

    // Tier 3: Premium for complex novels, rich children's books, or heavy revisions
    if (
      (bookType === 'novel' || bookType === 'children') &&
      task === 'chapter_writing'
    ) {
      return {
        tier: 'premium',
        modelId: premiumModel,
        maxTokens: 4000,
        temperature: 0.7,
      };
    }

    // Tier 2: Standard for planning, guides, recipes, workbooks, history
    return {
      tier: 'standard',
      modelId: standardModel,
      maxTokens: 3500,
      temperature: 0.6,
    };
  }

  /**
   * Builds prompt-cached payload structure for OpenRouter
   * OpenRouter caches repeated prefixes, significantly slashing prompt token costs
   */
  static buildCachedPrompt(
    systemPrompt: string,
    bookContext: {
      title: string;
      bookType: string;
      audience: string;
      language: string;
      style: string;
      characterBible?: Record<string, string>;
    },
    dynamicContentPrompt: string
  ) {
    const cachedPrefix = `
[SYSTEM INSTRUCTION & CACHED RULES]
${systemPrompt}

[BOOK SPECIFICATION]
Title: ${bookContext.title}
Genre: ${bookContext.bookType}
Audience: ${bookContext.audience}
Language: ${bookContext.language}
Style: ${bookContext.style}
${
  bookContext.characterBible
    ? `\n[CHARACTER BIBLE]\n${JSON.stringify(bookContext.characterBible, null, 2)}`
    : ''
}
`.trim();

    return {
      messages: [
        {
          role: 'system',
          content: cachedPrefix,
        },
        {
          role: 'user',
          content: dynamicContentPrompt,
        },
      ],
    };
  }

  /**
   * Estimates cost before generation to protect operational margins
   */
  static estimateGenerationCost(params: {
    pageTarget: number;
    estimatedImages: number;
    bookType: BookType;
  }): { estimatedCostUsd: number; imageBudget: number } {
    // Smart visual planner allocation: ~1 image per 3-5 pages or cover + key scenes
    let imageBudget = 1; // cover
    if (params.bookType === 'children') {
      imageBudget = Math.min(Math.max(Math.round(params.pageTarget / 2), 6), 16);
    } else if (params.bookType === 'coloring') {
      imageBudget = Math.min(params.pageTarget - 2, 25);
    } else {
      imageBudget = Math.min(Math.max(Math.round(params.pageTarget / 5), 2), 10);
    }

    // Estimate: $0.002 per 1k text tokens, ~$0.04 per Gemini/Fal image
    const estimatedTokens = params.pageTarget * 350;
    const textCost = (estimatedTokens / 1000) * 0.002;
    const imageCost = imageBudget * 0.04;

    return {
      estimatedCostUsd: Number((textCost + imageCost).toFixed(4)),
      imageBudget,
    };
  }
}
