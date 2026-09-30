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
    const isTrading = /trading|finance|stock|market|crypto|forex|invest|option|futures|candlestick|technical analysis/i.test(
      params.prompt
    );
    const effectiveType = params.bookType === 'auto' || !params.bookType
      ? (isTrading ? 'guide' : undefined)
      : params.bookType;
    const modelConfig = AICostController.selectTextModel('planning', effectiveType, params.planId);

    const systemPrompt = `You are the master publishing strategist for BookGenie.
Analyze the user's prompt and optional source content, then return strictly valid JSON matching this schema:
{
  "title": string,
  "subtitle": string,
  "bookType": "guide"|"course"|"workbook"|"novel"|"children"|"coloring"|"recipe"|"history"|"journal"|"lifestyle",
  "audience": string,
  "language": string,
  "style": string,
  "pageTarget": number,
  "chapters": [{ "index": number, "title": string, "summary": string, "allocatedPages": number }],
  "visualPlan": [{ "pageNumber": number, "visualType": "cover"|"illustration"|"diagram"|"none", "promptSpec": string, "layout": "standard"|"image-top"|"image-bottom"|"image-left"|"image-right"|"full-bleed" }]
}
CRITICAL RULES FOR BOOK TYPE AND CURRICULUM:
1. When Requested Book Type is "auto" and the topic is trading, investing, finance, crypto, forex, stocks, or technical analysis, you MUST set "bookType" to "guide", "course", or "workbook". NEVER output "novel" for financial, educational, or instructional subjects.
2. For trading and financial education books, the chapters curriculum MUST comprehensively span:
   - Beginner foundations & market mechanics
   - Market types and financial instruments (stocks, ETFs, futures, options)
   - Orders, order book dynamics, and trade execution
   - Candlesticks, price action, and bar analysis
   - Technical analysis principles
   - Support, resistance, supply, and demand
   - Trends, swing structure, and market cycles
   - Technical indicators (moving averages, RSI, MACD, volume)
   - Capital preservation and risk management
   - Position sizing formulas and risk-to-reward ratios
   - Leverage mechanics and margin liquidation risks
   - Transaction fees, commissions, and execution slippage
   - Trading psychology, discipline, and emotional biases
   - Backtesting rules and performance evaluation
   - Strategy development and trade planning
   - Advanced case studies and market scenario breakdowns
   - Practical exercises and actionable trader checklists
   - Comprehensive financial glossary
3. For trading, finance, and technical guides, all visualPlan items MUST specify precise technical chart diagrams, candlestick price action geometry, support/resistance breakouts, or risk/reward schematics. NEVER specify drawings of people, anime, cartoons, people reading notebooks, or generic office scenes.
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
    const modelConfig = AICostController.selectTextModel('chapter_writing', params.blueprint.bookType, params.blueprint.planId);
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

    const isTrading = /trading|market|stock|finance|crypto|forex|invest|option|futures/i.test(
      `${bp.title || ''} ${bp.subtitle || ''} ${chapter.title || ''} ${chapter.summary || ''}`
    );

    const systemPrompt = `You are an elite non-fiction book author, technical editor, and publishing specialist.
Return strictly valid JSON: {"pages": BookPageDocument[]}.

MANDATORY EDITORIAL STANDARDS:
1. WORD DENSITY & VALUE: Every page must contain approximately 240 to 380 substantive, high-value words across multiple well-developed paragraphs, checklists, or step-by-step guides. Never leave pages sparse or half-empty.
2. STRICT BAN ON REPETITIVE CLICHES:
   - NEVER use the formula: "X is not just a [pattern/tool], it's an opportunity to..."
   - NEVER use the formula: "By mastering the art of X, you will gain a competitive edge..."
   - NEVER use the formula: "Remember, X are not random events; they often follow predictable patterns..."
   - NEVER repeat the phrase: "manage risk, manage expectations, and manage emotions."
   Every section must provide unique, actionable, technical, or practical instructions.
3. TOPIC SPECIFICITY: Do not repeat generic risk/fees boilerplate in every chapter. Focus strictly on the specific chapter topic:
   - Structure chapters: Explain Swing High/Low mechanics, Break of Structure (BOS), Change of Character (CHOCH), Fair Value Gap (3-candle imbalance: Candle 1 wick to Candle 3 wick gap).
   - Setup chapters: Give concrete trade rules with: 1) Market Context, 2) Entry Trigger, 3) Invalidation/Stop Loss level, 4) Take Profit target (1:2 to 1:3 R:R).
   - Math & Risk chapters: Use exact mathematics. Formula: Position Size = (Account Capital * Risk %) / (Entry Price - Stop Loss Price).
     Example: $10,000 account, 1% risk = $100 max risk. Entry at $50, stop loss at $48 ($2 risk/share) -> Position Size = $100 / $2 = 50 shares ($2,500 position). NEVER say a $1,000 stop loss on a $10,000 account is within a 1% risk rule!
   - Psychology chapters: Address cognitive bias, revenge trading triggers, FOMO mitigation, and journaling protocols.
   - Routine chapters: Step-by-step 15-minute pre-market routine, watchlist curation, and execution checklists.
4. STRUCTURE: Every page must have pageNumber, chapterIndex, pageType ("chapter"|"content"), layout ("standard"|"quote-callout"|"split-horizontal"), and blocks: Array<{"id": string, "type": "heading"|"paragraph"|"quote"|"list"|"callout", "text"?: string, "items"?: string[]}>. When creating lists, provide items as an array of distinct strings.`;

    const userPrompt = `Book: "${bp.title || 'Practical Guide'}" (${bp.subtitle || ''})
Chapter ${params.chapterIndex}: "${chapter.title}"
Chapter Focus & Summary: ${chapter.summary}
Target Pages for this chapter: ${pagesForThisChapter}

Write ${pagesForThisChapter} dense, deeply insightful, publishable page(s). Include exact tactical rules, step-by-step procedures, and zero repetitive filler.`;

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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: modelConfig.temperature,
        max_tokens: Math.min(modelConfig.maxTokens, 3500),
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
    const modelConfig = AICostController.selectTextModel(isVisual ? 'complex_revision' : 'micro_revision', params.blueprint?.bookType, params.blueprint?.planId);

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
