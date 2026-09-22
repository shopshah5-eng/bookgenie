// lib/ai/image-provider.ts
// Image AI Provider Interface

export interface GenerateImageParams {
  prompt: string;
  bookTitle: string;
  style: string;
  aspectRatio?: '1:1' | '3:4' | '16:9';
  characterBible?: Record<string, string>;
  isCover?: boolean;
}

export interface ImageGenerationResult {
  url?: string;
  base64?: string;
  storagePath: string;
  provider: string;
}

export interface IImageProvider {
  generateImage(params: GenerateImageParams): Promise<ImageGenerationResult>;
}
