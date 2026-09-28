// Pollinations.ai FLUX provider. This is a real external provider in live mode.
import type { IImageProvider, GenerateImageParams, ImageGenerationResult } from './image-provider';

export class PollinationsImageProvider implements IImageProvider {
  async generateImage(params: GenerateImageParams): Promise<ImageGenerationResult> {
    const promptText = `${params.prompt}, style: ${params.style} book illustration, soft natural lighting, high resolution editorial publication artwork`;
    const width = params.aspectRatio === '16:9' ? 1024 : params.isCover ? 768 : 800;
    const height = params.aspectRatio === '16:9' ? 576 : params.isCover ? 1024 : 800;
    const seed = Math.floor(Math.random() * 999999);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?width=${width}&height=${height}&model=flux&nologo=true&seed=${seed}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Pollinations returned HTTP ${response.status}.`);
    const buffer = await response.arrayBuffer();
    return {
      base64: Buffer.from(buffer).toString('base64'),
      url,
      storagePath: `books/${encodeURIComponent(params.bookTitle)}/${Date.now()}.jpg`,
      provider: 'pollinations-flux',
    };
  }
}
