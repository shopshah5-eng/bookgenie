// Pollinations.ai FLUX provider. This is a real external provider in live mode.
import type { IImageProvider, GenerateImageParams, ImageGenerationResult } from './image-provider';
import { MockImageProvider } from './mock-provider';

export class PollinationsImageProvider implements IImageProvider {
  private readonly mockFallback = new MockImageProvider();

  async generateImage(params: GenerateImageParams): Promise<ImageGenerationResult> {
    if (process.env.GENERATION_MODE === 'mock') {
      return this.mockFallback.generateImage(params);
    }

    const promptText = `${params.prompt}, style: ${params.style} book illustration, soft natural lighting, beautiful high resolution editorial book illustration, masterpiece`;
    const width = params.aspectRatio === '16:9' ? 1024 : params.isCover ? 768 : 800;
    const height = params.aspectRatio === '16:9' ? 576 : params.isCover ? 1024 : 800;
    const seed = Math.floor(Math.random() * 999999);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?width=${width}&height=${height}&model=flux&nologo=true&seed=${seed}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Pollinations HTTP error ${res.status}`);
      const buffer = await res.arrayBuffer();
      return {
        base64: Buffer.from(buffer).toString('base64'),
        url,
        storagePath: `books/${encodeURIComponent(params.bookTitle)}/${Date.now()}.jpg`,
        provider: 'pollinations-flux',
      };
    } catch (err) {
      console.error('Pollinations image generation failed:', err);
      throw err;
    }
  }
}
