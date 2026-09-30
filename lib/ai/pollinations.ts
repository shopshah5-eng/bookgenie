// Pollinations.ai provider with multi-model fallback and cloud-resilience.
import type { IImageProvider, GenerateImageParams, ImageGenerationResult } from './image-provider';

export class PollinationsImageProvider implements IImageProvider {
  async generateImage(params: GenerateImageParams): Promise<ImageGenerationResult> {
    const allowWatermarked = process.env.ALLOW_PROVIDER_WATERMARKED_COVERS === 'true';
    if (params.isCover && !allowWatermarked) {
      throw new Error(
        'Clean commercial cover generation required: Pollinations cover generation is blocked when watermark-free quality is required (ALLOW_PROVIDER_WATERMARKED_COVERS=false).'
      );
    }

    const isTrading = /trading|finance|stock|market|crypto|forex|invest|option|futures|candlestick|technical analysis/i.test(
      `${params.bookTitle || ''} ${params.prompt || ''}`
    );

    const promptText = isTrading
      ? `Clean institutional financial market technical analysis chart diagram, candlestick price action, support and resistance levels, high-contrast dark Bloomberg terminal style, vector trading visualization. No people, no anime, no cartoons, no text, no watermark, no logos`
      : `${params.prompt}, style: ${params.style || 'editorial'} book illustration, soft natural lighting, high resolution editorial publication artwork`;
    const width = params.aspectRatio === '16:9' ? 1024 : params.isCover ? 768 : 800;
    const height = params.aspectRatio === '16:9' ? 576 : params.isCover ? 1024 : 800;
    const seed = Math.floor(Math.random() * 999999);
    const encodedPrompt = encodeURIComponent(promptText);

    // Endpoints in order of availability on cloud/datacenter runtimes:
    // 'turbo' and standard models do not block cloud IPs with 402.
    const candidateUrls = [
      `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=turbo&nologo=true&seed=${seed}`,
      `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${seed}`,
      `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}`,
      `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=flux&seed=${seed}`,
    ];

    let lastError: Error | null = null;

    for (const url of candidateUrls) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 18000);

      try {
        const response = await fetch(url, { signal: controller.signal });
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          if (buffer.byteLength > 1000) {
            return {
              base64: Buffer.from(buffer).toString('base64'),
              url,
              storagePath: `books/${encodeURIComponent(params.bookTitle || 'Book')}/${Date.now()}.jpg`,
              provider: 'pollinations',
            };
          }
        } else {
          lastError = new Error(`Pollinations endpoint returned HTTP ${response.status}`);
          console.warn(`[Pollinations] Endpoint ${url.slice(0, 80)} returned ${response.status}`);
        }
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(`[Pollinations] Call failed for ${url.slice(0, 80)}:`, lastError.message);
      } finally {
        clearTimeout(timer);
      }
    }

    throw lastError || new Error('Image generation provider unavailable.');
  }
}

