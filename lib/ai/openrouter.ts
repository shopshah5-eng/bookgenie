// OpenRouter text provider used for blueprinting, writing, and revision.
import type { ITextProvider, GenerateBlueprintParams, GenerateChapterParams, RegeneratePagesParams } from './text-provider';
import type { BookBlueprint, BookPageDocument } from '@/lib/book/types';
import { AICostController } from './cost-controller';

export class OpenRouterTextProvider implements ITextProvider {
  private readonly apiKey = process.env.OPENROUTER_API_KEY?.trim();

  private requireApiKey(): string {
    if (!this.apiKey) throw new Error('OPENROUTER_API_KEY is not configured.');
    return this.apiKey;
  }

  async generateBlueprint(params: GenerateBlueprintParams): Promise<BookBlueprint> {
    const apiKey = this.requireApiKey();
    const modelConfig = AICostController.selectTextModel('planning', params.bookType === 'auto' ? undefined : params.bookType);
    const systemPrompt = `You are the master publishing strategist for BookGenie.
Analyze the user's prompt and optional source content, then return strictly valid JSON matching this schema:
{
  "title": string,
  "subtitle": string,
  "bookType": "novel"|"children"|"coloring"|"course"|"guide"|"workbook"|"recipe"|"history"|"journal"|"lifestyle",
  "audience": string,
  "language": string,
  "style": string,
  "pageTarget": number,
  "chapters": [{ "index": number, "title": string, "summary": string, "allocatedPages": number }],
  "visualPlan": [{ "pageNumber": number, "visualType": "cover"|"illustration"|"diagram"|"none", "promptSpec": string, "layout": "standard"|"image-top"|"image-bottom"|"image-left"|"image-right"|"full-bleed" }]
}
Do not include markdown fences or commentary.`;
    const userPrompt = `User Prompt: ${params.prompt}
Requested Book Type: ${params.bookType || 'auto'}
Language: ${params.language || 'English'}
Style: ${params.style || 'Modern'}
${params.uploadedContext ? `Uploaded Source Material:\n${params.uploadedContext.slice(0, 3000)}` : ''}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://bookgenie.ai',
        'X-Title': 'BookGenie',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelConfig.modelId,
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        response_format: { type: 'json_object' },
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.maxTokens,
      }),
    });
    if (!response.ok) throw new Error(`OpenRouter returned HTTP ${response.status}.`);
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== 'string') throw new Error('OpenRouter returned no blueprint content.');
    return JSON.parse(content) as BookBlueprint;
  }

  async generateChapter(params: GenerateChapterParams): Promise<BookPageDocument[]> {
    const apiKey = this.requireApiKey();
    const modelConfig = AICostController.selectTextModel('chapter_writing', params.blueprint.bookType);
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://bookgenie.ai',
        'X-Title': 'BookGenie',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelConfig.modelId,
        messages: [
          {
            role: 'system',
            content: 'You are an award-winning publishing writer. Return only JSON in the form {"pages": BookPageDocument[]}. Every page must have pageNumber, chapterIndex, pageType, layout, blocks, and every block must have an id and type.',
          },
          {
            role: 'user',
            content: `Book specification: ${JSON.stringify(params.blueprint)}\nWrite chapter ${params.chapterIndex} with complete structured page content.`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.maxTokens,
      }),
    });
    if (!response.ok) throw new Error(`OpenRouter returned HTTP ${response.status}.`);
    const data = await response.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}');
    const pages = parsed.pages || parsed;
    if (!Array.isArray(pages) || pages.length === 0) throw new Error('OpenRouter returned no chapter pages.');
    return pages as BookPageDocument[];
  }

  async regeneratePages(params: RegeneratePagesParams): Promise<{
    pages: BookPageDocument[];
    requiresImageRegeneration: boolean;
    imageInstructions?: Array<{ pageNumber: number; prompt: string }>;
  }> {
    const apiKey = this.requireApiKey();
    const rawInstruction = params.instruction.toLowerCase();
    const isVisual = ['image', 'illustration', 'picture', 'drawing', 'color'].some((word) => rawInstruction.includes(word));
    const modelConfig = AICostController.selectTextModel(isVisual ? 'complex_revision' : 'micro_revision', params.blueprint.bookType);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20_000);
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://bookgenie.ai',
          'X-Title': 'BookGenie',
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: modelConfig.modelId,
          messages: [
            {
              role: 'system',
              content: 'You are BookGenie’s targeted editorial revision engine. Return only JSON: {"pages": BookPageDocument[], "requiresImageRegeneration": boolean, "imageInstructions": [{"pageNumber": number, "prompt": string}]}. Never request new images unless the instruction explicitly changes a visual.',
            },
            {
              role: 'user',
              content: `Instruction: ${params.instruction}\nTarget pages: ${JSON.stringify(params.targetPageNumbers || 'all relevant')}\nCurrent pages: ${JSON.stringify(params.existingPages)}`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.maxTokens,
        }),
      });
      if (!response.ok) throw new Error(`OpenRouter returned HTTP ${response.status}.`);
      const data = await response.json();
      const result = JSON.parse(data.choices?.[0]?.message?.content || '{}');
      if (!Array.isArray(result.pages)) throw new Error('OpenRouter returned no revised pages.');
      return result;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
