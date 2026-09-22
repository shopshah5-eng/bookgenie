// lib/ai/gemini.ts
// Google Gemini 3.1 Flash Image Provider

import type { IImageProvider, GenerateImageParams, ImageGenerationResult } from './image-provider';
import { MockImageProvider } from './mock-provider';

export class GeminiImageProvider implements IImageProvider {
  private apiKey: string | undefined;
  private isMockMode: boolean;
  private mockFallback = new MockImageProvider();

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.isMockMode = process.env.GENERATION_MODE === 'mock' || !this.apiKey || this.apiKey.includes('placeholder');
  }

  async generateImage(params: GenerateImageParams): Promise<ImageGenerationResult> {
    if (this.isMockMode || !this.apiKey) {
      return this.mockFallback.generateImage(params);
    }

    try {
      // Formulate production-quality prompt with character consistency and luxury editorial aesthetic
      const productionPrompt = `
Style: ${params.style} book illustration, soft natural lighting, editorial publishing quality.
Subject: ${params.prompt}
Book: "${params.bookTitle}"
${params.characterBible ? `Character Specification: ${JSON.stringify(params.characterBible)}` : ''}
${params.isCover ? 'Composition: Centered portrait, luxury book cover composition with negative space for typography.' : 'Composition: High-resolution editorial scene.'}
`.trim();

      // Call Google Gemini Image API
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateImages?key=${this.apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: productionPrompt,
          numberOfImages: 1,
          aspectRatio: params.aspectRatio === '16:9' ? '16:9' : params.isCover ? '3:4' : '1:1',
        }),
      });

      if (!response.ok) {
        console.warn(`Gemini Image API response error (${response.status}), using mock fallback.`);
        return this.mockFallback.generateImage(params);
      }

      const data = await response.json();
      const b64Data = data.generatedImages?.[0]?.image?.imageBytes;

      if (b64Data) {
        return {
          base64: b64Data,
          storagePath: `books/${encodeURIComponent(params.bookTitle)}/${Date.now()}.png`,
          provider: 'gemini-3.1-flash-image',
        };
      }

      return this.mockFallback.generateImage(params);
    } catch (err) {
      console.warn('Gemini Image API exception, using mock fallback:', err);
      return this.mockFallback.generateImage(params);
    }
  }
}
