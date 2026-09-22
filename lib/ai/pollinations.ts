// lib/ai/pollinations.ts
// Pollinations.ai FLUX Provider - 100% Free, High Quality, No API Key Required

import type { IImageProvider, GenerateImageParams, ImageGenerationResult } from './image-provider';

export class PollinationsImageProvider implements IImageProvider {
  async generateImage(params: GenerateImageParams): Promise<ImageGenerationResult> {
    try {
      const promptText = `${params.prompt}, style: ${params.style} book illustration, soft natural lighting, beautiful high resolution editorial book illustration, masterpiece`;
      const width = params.aspectRatio === '16:9' ? 1024 : params.isCover ? 768 : 800;
      const height = params.aspectRatio === '16:9' ? 576 : params.isCover ? 1024 : 800;
      const seed = Math.floor(Math.random() * 999999);

      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?width=${width}&height=${height}&model=flux&nologo=true&seed=${seed}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Pollinations HTTP error ${res.status}`);
      }

      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');

      return {
        base64,
        url,
        storagePath: `books/${encodeURIComponent(params.bookTitle)}/${Date.now()}.jpg`,
        provider: 'pollinations-flux',
      };
    } catch (err) {
      console.warn('Pollinations image error:', err);
      // Return a beautiful editorial SVG fallback if offline
      return {
        url: `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80`,
        storagePath: `books/${encodeURIComponent(params.bookTitle)}/${Date.now()}.jpg`,
        provider: 'pollinations-fallback',
      };
    }
  }
}
