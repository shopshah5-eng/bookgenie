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
    const targetPages = params.pageTarget || 16;
    const systemPrompt = `You are the master publishing strategist, editorial researcher, and trend analyst for BookGenie. Return ONLY valid JSON (no commentary, no markdown) matching this schema:
{
  "title": string,
  "subtitle": string,
  "bookType": "${effectiveType}",
  "audience": string,
  "language": "${params.language || 'English'}",
  "style": "${params.style || 'Modern'}",
  "pageTarget": ${targetPages},
  "enhancedEditorialPrompt": string,
  "nicheAnalysis": {
    "coreReaderIntent": string,
    "trendingStructuralPatterns": string[],
    "competitiveDifferentiator": string
  },
  "chapters": [
    { "index": 1, "title": string, "summary": string, "allocatedPages": 4 }
  ],
  "visualPlan": [
    { "pageNumber": 1, "visualType": "cover", "promptSpec": string, "layout": "full-bleed" }
  ]
}
EDITORIAL INSTRUCTIONS:
1. DECODE INTENT & NICHE: Analyze the user's prompt, identify the exact target audience, and research trending best-selling ebook patterns in that niche (Amazon KDP, Gumroad, field guides).
2. STRUCTURE RULES:
   - For Self-Care/Fitness/Glow-Up: Ground rules, baseline audit, daily base operating system, 2-day spreads with checkboxes [ ], WHO 2026 plate heuristic, troubleshooting detours, 30-day habit sheet, verified citations [01-17].
   - For Trading/Finance: Market mechanics, order book dynamics, candlestick geometry, position sizing math, trade plans with invalidation levels, risk checklists.
   - For Digital Products/Business: 2-weekend validation test, 30+ platform fees, organic flywheels, ad setups, 90-day plan.
3. PAGE BUDGET: The sum of all chapter "allocatedPages" MUST equal exactly ${targetPages}.
${isTrading ? 'CRITICAL: For trading/finance books, all visualPlan items MUST specify technical candlestick diagrams, support/resistance structure, or risk/reward charts. NEVER specify people, anime, cartoons, or sketches.' : ''}`;

    const userPrompt = `User Prompt: ${params.prompt}
Requested Book Type: ${params.bookType || 'auto'}
Target Pages: ${targetPages}
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

    const pagesForThisChapter = chapter.allocatedPages || Math.max(
      1,
      Math.min(4, Math.round((bp.pageTarget || 16) / Math.max(1, chapters.length)))
    );

    const isChildren = bp.bookType === 'children';
    const isFiction = bp.bookType === 'novel';

    let systemPrompt = '';
    let userPrompt = '';

    if (isChildren) {
      systemPrompt = `You are an acclaimed children's book author and illustrator-storyteller for BookGenie.
Return ONLY valid JSON: {"pages": BookPageDocument[]}.

MANDATORY CHILDREN'S STORY STANDARDS:
1. Warm, delightful, heartwarming storytelling prose suitable for children and bedtime reading.
2. Rich dialogue, gentle pacing, expressive characters, and imaginative world details.
3. NEVER include worksheets, checklists [ ], time-limits (e.g. 15 MIN), exercises, or technical/financial boilerplate.
4. STRUCTURE: Every page must have pageNumber, chapterIndex: ${params.chapterIndex}, pageType ("content"), layout ("standard"), and blocks: Array<{"id": string, "type": "heading"|"paragraph"|"quote", "text": string}>.`;

      userPrompt = `Book Title: "${bp.title || 'Children Story'}"
Genre: Children's Story
Chapter ${params.chapterIndex}: "${chapter.title}"
Chapter Story Beats: ${chapter.summary}
Target Pages for this chapter: ${pagesForThisChapter}

Write ${pagesForThisChapter} enchanting storytelling page(s) with warm dialogue and heartwarming scenes.`;
    } else if (isFiction) {
      systemPrompt = `You are an acclaimed fiction novelist and literary master for BookGenie.
Return ONLY valid JSON: {"pages": BookPageDocument[]}.

MANDATORY FICTION STANDARDS:
1. Compelling scene work, atmospheric worldbuilding, natural character dialogue, and dramatic tension.
2. NEVER include worksheets, checkboxes [ ], field checklists, or technical bullet points.
3. STRUCTURE: Every page must have pageNumber, chapterIndex: ${params.chapterIndex}, pageType ("content"), layout ("standard"), and blocks: Array<{"id": string, "type": "heading"|"paragraph"|"quote", "text": string}>.`;

      userPrompt = `Book Title: "${bp.title || 'Novel'}"
Genre: Fiction
Chapter ${params.chapterIndex}: "${chapter.title}"
Chapter Scene Outline: ${chapter.summary}
Target Pages for this chapter: ${pagesForThisChapter}

Write ${pagesForThisChapter} captivating fiction page(s) with immersive dialogue and dynamic narrative pacing.`;
    } else {
      systemPrompt = `You are an elite non-fiction book author, field guide designer, and publishing specialist.
Return ONLY valid JSON: {"pages": BookPageDocument[]}.

MANDATORY RULES:
1. SIMPLE WORDS ACCORDING TO GENRE: Write with supreme clarity in accessible, engaging words.
2. CONTENT DENSITY & VALUE: Every page must contain meaningful words or dense structured content. Never output sparse or empty pages.
3. RICH PUBLISHING BLOCKS: Include headings, subheadings, paragraphs, actionable lists, and callouts.
4. BAN ON REPETITIVE CLICHES: Do NOT repeat template formulas or generic buzzwords.
5. FACTUAL INTEGRITY: In financial or risk sections, use exact formulas: Position Size = (Account Capital * Risk %) / (Entry - Stop Loss). In health/fitness, adhere to WHO guidelines.
6. STRUCTURE: Every page has pageNumber, chapterIndex: ${params.chapterIndex}, pageType ("chapter"|"content"), layout ("standard"|"quote-callout"|"split-horizontal"), and blocks: Array<{"id": string, "type": "heading"|"paragraph"|"quote"|"list"|"callout", "text"?: string, "items"?: string[]}>.`;

      userPrompt = `Book Title: "${bp.title || 'Practical Field Guide'}" (${bp.subtitle || ''})
Genre / Book Type: ${bp.bookType || 'guide'}
Chapter ${params.chapterIndex}: "${chapter.title}"
Chapter Focus & Summary: ${chapter.summary}
${bp.enhancedEditorialPrompt ? `Editorial Blueprint: ${bp.enhancedEditorialPrompt}` : ''}
Target Pages for this chapter: ${pagesForThisChapter}

Write ${pagesForThisChapter} dense, highly actionable, deeply insightful, publishable page(s) in simple, accessible, high-impact words.`;
    }

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
