// Google Gemini image provider with automatic FLUX failover.
import type { IImageProvider, GenerateImageParams, ImageGenerationResult } from './image-provider';
import { PollinationsImageProvider } from './pollinations';

export class GeminiImageProvider implements IImageProvider {
  private readonly apiKey = process.env.GEMINI_API_KEY?.trim();
  private readonly fallbackProvider = new PollinationsImageProvider();

  async generateImage(params: GenerateImageParams): Promise<ImageGenerationResult> {
    if (this.apiKey) {
      try {
        const productionPrompt = `
Style: ${params.style} book illustration, soft natural lighting, editorial publishing quality.
Subject: ${params.prompt}
Book: "${params.bookTitle}"
${params.characterBible ? `Character Specification: ${JSON.stringify(params.characterBible)}` : ''}
${params.isCover ? 'Composition: Centered portrait, luxury book cover composition with negative space for typography.' : 'Composition: High-resolution editorial scene.'}
`.trim();

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${this.apiKey}`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3500);
        let response: Response;
        try {
          response = await fetch(endpoint, {
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
        } finally {
          clearTimeout(timer);
        }

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
          console.warn(`[GeminiImageProvider] Gemini returned HTTP ${response.status}. Failing over to FLUX provider.`);
        }
      } catch (err) {
        console.warn('[GeminiImageProvider] Error generating with Gemini, failing over to FLUX provider:', err);
      }
    }

    // Failover: generate real publication artwork via FLUX
    return this.fallbackProvider.generateImage(params);
  }
}

