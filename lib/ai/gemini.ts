// lib/ai/gemini.ts
// Google Gemini image provider for clean commercial covers and publication illustrations.

import type { IImageProvider, GenerateImageParams, ImageGenerationResult } from './image-provider';
import { PollinationsImageProvider } from './pollinations';

export class GeminiImageProvider implements IImageProvider {
  private readonly apiKey = process.env.GEMINI_API_KEY?.trim();
  private readonly fallbackProvider = new PollinationsImageProvider();

  async generateImage(params: GenerateImageParams): Promise<ImageGenerationResult> {
    const allowWatermarked = process.env.ALLOW_PROVIDER_WATERMARKED_COVERS === 'true';

    if (this.apiKey) {
      try {
        let visualSubject = params.prompt;

        if (params.isCover) {
          const isTrading = /trading|finance|stock|market|crypto|forex|invest|option|futures|candlestick|technical analysis/i.test(
            `${params.bookTitle} ${params.prompt}`
          );

          if (isTrading) {
            visualSubject =
              'Sophisticated financial-market editorial background, modern executive trading floor, multi-monitor professional market charts with glowing price action vectors, analytical geometry, deep midnight blue, teal, obsidian charcoal and restrained bronze accents, cinematic studio lighting, elegant atmospheric depth with generous clean negative space for overlaid title typography. Completely text-free background artwork, absolutely no words, no letters, no typography, no wax candles, no people holding books, no numbers, no watermarks, no logos.';
          } else {
            visualSubject = `${params.prompt}. High-end editorial book cover background artwork, cinematic lighting, elegant composition with generous negative space for overlaid typography. Completely text-free, no words, no letters, no typography, no logos.`;
          }
        }

        const productionPrompt = `
Style: ${params.style || 'Modern editorial'} book artwork, soft natural lighting, editorial publishing quality.
Subject: ${visualSubject}
${params.characterBible ? `Character Specification: ${JSON.stringify(params.characterBible)}` : ''}
${params.isCover ? 'Composition: Centered portrait, luxury book cover composition with negative space for typography. CRITICAL: Absolutely no text, no title words, no numbers, no watermarks, no logos.' : 'Composition: High-resolution editorial scene. No text, no logos, no borders, no signatures.'}
`.trim();

        const candidateModels = ['gemini-2.5-flash-image', 'gemini-3.1-flash-image'];

        for (const model of candidateModels) {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 25000);

          try {
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: controller.signal,
              body: JSON.stringify({
                contents: [{ parts: [{ text: productionPrompt }] }],
                generationConfig: {
                  responseModalities: ['IMAGE'],
                },
              }),
            });

            if (response.ok) {
              const data = await response.json();
              const imagePart = data.candidates?.[0]?.content?.parts?.find(
                (p: { inlineData?: { data?: string } }) => p.inlineData?.data
              );
              if (imagePart?.inlineData?.data) {
                return {
                  base64: imagePart.inlineData.data,
                  storagePath: `books/${encodeURIComponent(params.bookTitle)}/${Date.now()}.png`,
                  provider: 'gemini-image',
                };
              }
            } else {
              const errBody = await response.text().catch(() => '');
              console.warn(`[GeminiImageProvider] Model ${model} returned HTTP ${response.status}: ${errBody.slice(0, 200)}`);
            }
          } catch (fetchErr) {
            console.warn(`[GeminiImageProvider] Call to ${model} failed:`, fetchErr);
          } finally {
            clearTimeout(timer);
          }
        }
      } catch (err) {
        console.warn('[GeminiImageProvider] Gemini image generation failed:', err);
      }
    }

    // Cover safety enforcement: Pollinations covers are blocked when watermark-free quality is required
    if (params.isCover && !allowWatermarked) {
      throw new Error(
        'Clean commercial cover generation required: Gemini cover generation failed and watermarked fallback covers are blocked (ALLOW_PROVIDER_WATERMARKED_COVERS=false).'
      );
    }

    // Interior illustrations failover to fallback provider
    console.warn('[GeminiImageProvider] Gemini unavailable for interior plate, routing to fallback image provider...');
    return this.fallbackProvider.generateImage(params);
  }
}
