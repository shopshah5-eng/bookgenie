// lib/ai/openrouter.ts
// OpenRouter Multi-Tier Text Provider Implementation

import type { ITextProvider, GenerateBlueprintParams, GenerateChapterParams, RegeneratePagesParams } from './text-provider';
import type { BookBlueprint, BookPageDocument } from '@/lib/book/types';
import { AICostController } from './cost-controller';
import { MockTextProvider } from './mock-provider';

export class OpenRouterTextProvider implements ITextProvider {
  private apiKey: string | undefined;
  private isMockMode: boolean;
  private mockFallback = new MockTextProvider();

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.isMockMode = process.env.GENERATION_MODE === 'mock' || !this.apiKey || this.apiKey.includes('sk-or-v1-placeholder');
  }

  async generateBlueprint(params: GenerateBlueprintParams): Promise<BookBlueprint> {
    if (this.isMockMode || !this.apiKey) {
      return this.mockFallback.generateBlueprint(params);
    }

    const modelConfig = AICostController.selectTextModel('planning', params.bookType === 'auto' ? undefined : params.bookType);

    const systemPrompt = `You are the master publishing strategist for BookGenie.
Analyze the user's prompt and optional source content, then return a strictly valid JSON BookBlueprint matching this exact schema:
{
  "title": string,
  "subtitle": string,
  "bookType": "novel"|"children"|"coloring"|"course"|"guide"|"workbook"|"recipe"|"history"|"journal"|"lifestyle",
  "audience": string,
  "language": string,
  "style": string,
  "pageTarget": number (e.g. 16 to 40),
  "chapters": [
    { "index": number, "title": string, "summary": string, "allocatedPages": number }
  ],
  "visualPlan": [
    { "pageNumber": number, "visualType": "cover"|"illustration"|"diagram", "promptSpec": string, "layout": "image-top"|"image-bottom"|"image-left"|"image-right"|"full-bleed" }
  ],
  "characterBible": Record<string, string> (optional)
}`;

    const userPrompt = `User Prompt: ${params.prompt}
Requested Book Type: ${params.bookType || 'auto'}
Language: ${params.language || 'English'}
Style: ${params.style || 'Modern'}
${params.uploadedContext ? `Uploaded Source Material:\n${params.uploadedContext.slice(0, 3000)}` : ''}`;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://bookgenie.ai',
          'X-Title': 'BookGenie',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelConfig.modelId,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.maxTokens,
        }),
      });

      if (!response.ok) {
        console.warn(`OpenRouter error (${response.status}), falling back to mock provider.`);
        return this.mockFallback.generateBlueprint(params);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      return JSON.parse(content) as BookBlueprint;
    } catch (err) {
      console.warn('OpenRouter blueprint generation exception, using mock fallback:', err);
      return this.mockFallback.generateBlueprint(params);
    }
  }

  async generateChapter(params: GenerateChapterParams): Promise<BookPageDocument[]> {
    if (this.isMockMode || !this.apiKey) {
      return this.mockFallback.generateChapter(params);
    }

    const modelConfig = AICostController.selectTextModel('chapter_writing', params.blueprint.bookType);

    const promptPayload = AICostController.buildCachedPrompt(
      `You are an award-winning publishing writer for BookGenie. Return a JSON object with: { "pages": BookPageDocument[] }`,
      {
        title: params.blueprint.title,
        bookType: params.blueprint.bookType,
        audience: params.blueprint.audience,
        language: params.blueprint.language,
        style: params.blueprint.style,
        characterBible: params.blueprint.characterBible,
      },
      `Write Chapter ${params.chapterIndex}. Generate the full structured page content blocks for the pages allocated to this chapter.`
    );

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://bookgenie.ai',
          'X-Title': 'BookGenie',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelConfig.modelId,
          messages: promptPayload.messages,
          response_format: { type: 'json_object' },
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.maxTokens,
        }),
      });

      if (!response.ok) {
        return this.mockFallback.generateChapter(params);
      }

      const data = await response.json();
      const parsed = JSON.parse(data.choices?.[0]?.message?.content);
      return (parsed.pages || parsed) as BookPageDocument[];
    } catch (err) {
      console.warn('OpenRouter chapter generation exception, using fallback:', err);
      return this.mockFallback.generateChapter(params);
    }
  }

  async regeneratePages(params: RegeneratePagesParams): Promise<{
    pages: BookPageDocument[];
    requiresImageRegeneration: boolean;
    imageInstructions?: Array<{ pageNumber: number; prompt: string }>;
  }> {
    // Check if instruction requests visual modification
    const rawInstruction = params.instruction.toLowerCase();
    const isVisual =
      rawInstruction.includes('image') ||
      rawInstruction.includes('illustration') ||
      rawInstruction.includes('picture') ||
      rawInstruction.includes('drawing') ||
      rawInstruction.includes('color');

    if (this.isMockMode || !this.apiKey) {
      return this.mockFallback.regeneratePages(params);
    }

    const modelConfig = AICostController.selectTextModel(
      isVisual ? 'complex_revision' : 'micro_revision',
      params.blueprint.bookType
    );

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://bookgenie.ai',
          'X-Title': 'BookGenie',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelConfig.modelId,
          messages: [
            {
              role: 'system',
              content: `You are BookGenie's targeted editorial revision engine.
Return a JSON object: { "pages": BookPageDocument[], "requiresImageRegeneration": boolean, "imageInstructions": [{"pageNumber": number, "prompt": string}] }
CRITICAL RULE: Do not regenerate images unless the user explicitly requested visual changes.`,
            },
            {
              role: 'user',
              content: `Instruction: ${params.instruction}
Target Pages: ${JSON.stringify(params.targetPageNumbers || 'all relevant')}
Current Pages: ${JSON.stringify(params.existingPages)}`,
            },
          ],
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        return this.mockFallback.regeneratePages(params);
      }

      const data = await response.json();
      return JSON.parse(data.choices?.[0]?.message?.content);
    } catch {
      return this.mockFallback.regeneratePages(params);
    }
  }
}
