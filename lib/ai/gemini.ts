// Google Gemini image provider.
import type { IImageProvider, GenerateImageParams, ImageGenerationResult } from './image-provider';

export class GeminiImageProvider implements IImageProvider {
  private readonly apiKey = process.env.GEMINI_API_KEY?.trim();

  async generateImage(params: GenerateImageParams): Promise<ImageGenerationResult> {
    if (!this.apiKey) throw new Error('GEMINI_API_KEY is not configured.');
    const productionPrompt = `
Style: ${params.style} book illustration, soft natural lighting, editorial publishing quality.
Subject: ${params.prompt}
Book: "${params.bookTitle}"
${params.characterBible ? `Character Specification: ${JSON.stringify(params.characterBible)}` : ''}
${params.isCover ? 'Composition: Centered portrait, luxury book cover composition with negative space for typography.' : 'Composition: High-resolution editorial scene.'}
`.trim();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateImages?key=${this.apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: productionPrompt,
        numberOfImages: 1,
        aspectRatio: params.aspectRatio === '16:9' ? '16:9' : params.isCover ? '3:4' : '1:1',
      }),
    });
    if (!response.ok) throw new Error(`Gemini Image API returned HTTP ${response.status}.`);
    const data = await response.json();
    const b64Data = data.generatedImages?.[0]?.image?.imageBytes;
    if (!b64Data) throw new Error('Gemini returned no image data.');
    return {
      base64: b64Data,
      storagePath: `books/${encodeURIComponent(params.bookTitle)}/${Date.now()}.png`,
      provider: 'gemini-3.1-flash-image',
    };
  }
}
