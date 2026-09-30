// lib/ai/nvidia.ts
// NVIDIA NIM Text AI Provider for high-performance free-credit inference
// Supports OpenAI-compatible chat completions with automatic OpenRouter fallback.

import type { ITextProvider, GenerateBlueprintParams, GenerateChapterParams, RegeneratePagesParams } from './text-provider';
import type { BookBlueprint, BookPageDocument } from '@/lib/book/types';
import { OpenRouterTextProvider } from './openrouter';

function cleanJsonOutput(raw: string): string {
  let cleaned = raw.trim();
  // Strip Markdown code fences if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
  }
  return cleaned;
}

export class NvidiaTextProvider implements ITextProvider {
  private readonly apiKey = (process.env.NVIDIA_API_KEY || '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').trim();
  private readonly baseUrl = (process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1').replace(/\/+$/, '');
  private readonly defaultModel = process.env.AI_TEXT_MODEL_NVIDIA || 'meta/llama-3.2-11b-vision-instruct';
  private readonly fallbackProvider = new OpenRouterTextProvider();

  private getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  async generateBlueprint(params: GenerateBlueprintParams): Promise<BookBlueprint> {
    const isTrading = /trading|finance|stock|market|crypto|forex|invest|option|futures|candlestick|technical analysis/i.test(
      params.prompt
    );
    const effectiveType = params.bookType === 'auto' || !params.bookType
      ? (isTrading ? 'guide' : 'guide')
      : params.bookType;

    const systemPrompt = `You are the master publishing strategist for BookGenie. Return ONLY valid JSON (no commentary, no markdown) matching this schema:
{
  "title": string,
  "subtitle": string,
  "bookType": "${effectiveType}",
  "audience": string,
  "language": "${params.language || 'English'}",
  "style": "${params.style || 'Modern'}",
  "pageTarget": 16,
  "chapters": [
    { "index": 1, "title": string, "summary": string, "allocatedPages": 4 }
  ],
  "visualPlan": [
    { "pageNumber": 1, "visualType": "cover", "promptSpec": string, "layout": "full-bleed" }
  ]
}`;

    const userPrompt = `User Prompt: ${params.prompt}
Requested Book Type: ${params.bookType || 'auto'}
Language: ${params.language || 'English'}
Style: ${params.style || 'Modern'}
${params.uploadedContext ? `Uploaded Context:\n${params.uploadedContext.slice(0, 3000)}` : ''}`;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 22000);

      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        signal: controller.signal,
        body: JSON.stringify({
          model: this.defaultModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.15,
          max_tokens: 2000,
        }),
      });

      clearTimeout(timer);

      if (!res.ok) {
        throw new Error(`NVIDIA NIM HTTP ${res.status}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('NVIDIA NIM returned empty response');

      const parsed = JSON.parse(cleanJsonOutput(content)) as BookBlueprint;
      if (!parsed.title || !Array.isArray(parsed.chapters)) {
        throw new Error('NVIDIA NIM response missing title or chapters');
      }
      return parsed;
    } catch (err) {
      console.warn('[NvidiaTextProvider] Blueprint generation error, failing over to OpenRouter:', err);
      return this.fallbackProvider.generateBlueprint(params);
    }
  }

  async generateChapter(params: GenerateChapterParams): Promise<BookPageDocument[]> {
    const bp = params.blueprint;
    const chapters = bp.chapters || [];
    const chapter =
      chapters.find((c) => (c.index ?? 0) === params.chapterIndex) ||
      chapters[params.chapterIndex - 1] || {
        title: `Chapter ${params.chapterIndex}`,
        summary: 'Provide comprehensive in-depth publication content.',
      };

    const pagesForThisChapter = Math.max(
      1,
      Math.min(4, Math.round((bp.pageTarget || 16) / Math.max(1, chapters.length)))
    );

    const systemPrompt = `You are a master non-fiction book author and publishing writer.
Return ONLY valid JSON: {"pages": BookPageDocument[]}.
Mandatory Rules:
1. Every page must contain 140 to 260 meaningful words across multiple well-developed paragraphs.
2. Structure: Every page has pageNumber, chapterIndex: ${params.chapterIndex}, pageType ("chapter"|"content"), layout ("standard"|"quote-callout"|"split-horizontal"), and blocks: Array<{"id": string, "type": "heading"|"paragraph"|"quote", "text": string}>.
3. No markdown fences, no commentary outside the JSON object.`;

    const userPrompt = `Book: "${bp.title || 'Practical Guide'}" (${bp.subtitle || ''})
Chapter ${params.chapterIndex}: "${chapter.title}"
Chapter Summary: ${chapter.summary}
Target Pages for this chapter: ${pagesForThisChapter}
Write complete, high quality, publishable pages.`;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 24000);

      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        signal: controller.signal,
        body: JSON.stringify({
          model: this.defaultModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
          max_tokens: 3000,
        }),
      });

      clearTimeout(timer);

      if (!res.ok) {
        throw new Error(`NVIDIA NIM HTTP ${res.status}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('NVIDIA NIM returned empty chapter content');

      const parsed = JSON.parse(cleanJsonOutput(content));
      if (!Array.isArray(parsed.pages) || parsed.pages.length === 0) {
        throw new Error('NVIDIA NIM response missing pages array');
      }
      return parsed.pages as BookPageDocument[];
    } catch (err) {
      console.warn('[NvidiaTextProvider] Chapter generation error, failing over to OpenRouter:', err);
      return this.fallbackProvider.generateChapter(params);
    }
  }

  async regeneratePages(params: RegeneratePagesParams): Promise<{
    pages: BookPageDocument[];
    requiresImageRegeneration: boolean;
    imageInstructions?: Array<{ pageNumber: number; prompt: string }>;
  }> {
    // For revisions, use OpenRouter or fallback directly
    return this.fallbackProvider.regeneratePages(params);
  }
}
