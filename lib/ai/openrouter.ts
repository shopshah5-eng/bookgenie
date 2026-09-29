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
    const bp = params.blueprint;
    const chapters = bp.chapters || [];
    const chapter =
      chapters.find((c) => (c.index ?? 0) === params.chapterIndex) ||
      chapters[params.chapterIndex - 1] || {
        title: `Chapter ${params.chapterIndex}`,
        summary: 'Provide comprehensive in-depth content.',
      };
    const pagesForThisChapter = Math.max(
      1,
      Math.min(4, Math.round((bp.pageTarget || 16) / Math.max(1, chapters.length)))
    );

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
            content:
              'You are an award-winning publishing writer. Return only valid JSON: {"pages": BookPageDocument[]}. Every page must have pageNumber, chapterIndex, pageType ("chapter"|"content"), layout ("standard"|"quote-callout"|"split-horizontal"), and blocks: [{"id": string, "type": "heading"|"paragraph"|"quote", "text": string}]. Keep formatting clean, engaging, and publication-ready.',
          },
          {
            role: 'user',
            content: `Book: "${bp.title || 'Mastering Trading'}" (${bp.subtitle || ''})\nGenre: ${bp.bookType || 'general'}\nStyle: ${bp.style || 'modern'}\nLanguage: ${bp.language || 'English'}\n\nTask: Write exactly ${pagesForThisChapter} structured page(s) for Chapter ${params.chapterIndex}: "${chapter.title}".\nSummary: ${chapter.summary}`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: modelConfig.temperature,
        max_tokens: Math.min(modelConfig.maxTokens, 2000),
      }),
    });
    if (!response.ok) throw new Error(`OpenRouter returned HTTP ${response.status}.`);
    const data = await response.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}');
    const rawPages = parsed.pages || (Array.isArray(parsed) ? parsed : []);
    if (!Array.isArray(rawPages) || rawPages.length === 0) {
      throw new Error('OpenRouter returned no chapter pages.');
    }

    // Ensure every page conforms to the BookPageDocument interface with proper block structure
    return rawPages.map((page: Record<string, unknown>, idx: number) => {
      const pageBlocks = Array.isArray(page.blocks)
        ? page.blocks.map((b: Record<string, unknown>, bIdx: number) => ({
            id: String(b.id || `blk-${params.chapterIndex}-${idx + 1}-${bIdx + 1}`),
            type: (b.type as 'heading' | 'paragraph' | 'quote') || 'paragraph',
            text: String(b.text || b.content || ''),
            level: typeof b.level === 'number' ? b.level : undefined,
          }))
        : [
            {
              id: `blk-${params.chapterIndex}-${idx + 1}-1`,
              type: 'heading' as const,
              text: String(page.title || chapter.title),
              level: 2,
            },
            {
              id: `blk-${params.chapterIndex}-${idx + 1}-2`,
              type: 'paragraph' as const,
              text: String(page.content || chapter.summary || 'Detailed narrative content.'),
            },
          ];

      return {
        pageNumber: typeof page.pageNumber === 'number' ? page.pageNumber : idx + 1,
        chapterIndex: params.chapterIndex,
        pageType: (page.pageType as 'title' | 'chapter' | 'content') || 'content',
        layout: (page.layout as 'standard' | 'quote-callout' | 'split-horizontal') || 'standard',
        title: typeof page.title === 'string' ? page.title : chapter.title,
        blocks: pageBlocks,
      } as BookPageDocument;
    });
  }

  async regeneratePages(params: RegeneratePagesParams): Promise<{
    pages: BookPageDocument[];
    requiresImageRegeneration: boolean;
    imageInstructions?: Array<{ pageNumber: number; prompt: string }>;
  }> {
    const apiKey = this.requireApiKey();
    const rawInstruction = params.instruction.toLowerCase();
    const isVisual = ['image', 'illustration', 'picture', 'drawing', 'color'].some((word) => rawInstruction.includes(word));
    const modelConfig = AICostController.selectTextModel(isVisual ? 'complex_revision' : 'micro_revision', params.blueprint?.bookType);

    // Filter to targeted/relevant pages to avoid huge prompt payloads and response truncation
    let pagesToConsider = params.existingPages || [];
    if (params.targetPageNumbers && params.targetPageNumbers.length > 0) {
      pagesToConsider = pagesToConsider.filter((p) => params.targetPageNumbers!.includes(p.pageNumber));
    } else if (rawInstruction.includes('chapter 1') || rawInstruction.includes('heading') || rawInstruction.includes('title')) {
      const ch1Pages = pagesToConsider.filter((p) => p.chapterIndex === 1);
      pagesToConsider = ch1Pages.length > 0 ? ch1Pages.slice(0, 2) : pagesToConsider.slice(0, 2);
    } else {
      pagesToConsider = pagesToConsider.slice(0, 3);
    }

    const compactPages = pagesToConsider.map((p) => ({
      pageNumber: p.pageNumber,
      chapterIndex: p.chapterIndex,
      title: p.title,
      layout: p.layout,
      blocks: (p.blocks || []).map((b) => ({
        id: b.id,
        type: b.type,
        level: b.level,
        text: b.text?.slice(0, 300),
      })),
    }));

    const callOpenRouter = async (payloadPages: unknown[], timeoutMs: number) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
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
                content:
                  'You are BookGenie’s targeted editorial revision engine. Return only JSON: {"pages": BookPageDocument[], "requiresImageRegeneration": boolean, "imageInstructions": [{"pageNumber": number, "prompt": string}]}. In "pages", return ONLY the pages that are modified by the instruction. Never request new images unless the instruction explicitly changes a visual.',
              },
              {
                role: 'user',
                content: `Instruction: ${params.instruction}\nPages to revise: ${JSON.stringify(payloadPages)}`,
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
    };

    try {
      return await callOpenRouter(compactPages, 12_000);
    } catch (firstErr) {
      console.warn('[OpenRouter] Initial revision attempt failed, retrying with minimal target page:', firstErr);
      try {
        const minimalPage = compactPages.slice(0, 1);
        return await callOpenRouter(minimalPage, 10_000);
      } catch (secondErr) {
        console.warn('[OpenRouter] Second revision attempt failed:', secondErr);
        // Fallback for simple heading/title changes if AI endpoints are experiencing upstream timeouts
        const titleMatch = params.instruction.match(/(?:heading|title)\s+(?:to\s*:?|is\s*:?)\s*([^\n\r]+)/i);
        if (titleMatch && titleMatch[1]) {
          const newTitle = titleMatch[1].trim().replace(/^["']|["']$/g, '');
          const targetPage = pagesToConsider[0];
          if (targetPage) {
            return {
              pages: [
                {
                  ...targetPage,
                  title: newTitle,
                  blocks: (targetPage.blocks || []).map((b) =>
                    b.type === 'heading' ? { ...b, text: newTitle } : b
                  ),
                },
              ],
              requiresImageRegeneration: false,
            };
          }
        }
        throw secondErr;
      }
    }
  }
}
