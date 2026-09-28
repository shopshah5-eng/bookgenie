import { createAdminClient } from '@/lib/supabase/admin';
import type { ImageGenerationResult } from '@/lib/ai/image-provider';

export interface PersistedBookAsset {
  id: string;
  storagePath: string;
  url: string;
}

function extensionFor(result: ImageGenerationResult): { extension: string; contentType: string } {
  const provider = result.provider.toLowerCase();
  if (provider.includes('gemini') || provider.includes('png')) {
    return { extension: 'png', contentType: 'image/png' };
  }
  return { extension: 'jpg', contentType: 'image/jpeg' };
}

async function imageBytes(result: ImageGenerationResult): Promise<Buffer> {
  if (result.base64) return Buffer.from(result.base64, 'base64');
  if (result.url) {
    const response = await fetch(result.url);
    if (!response.ok) throw new Error(`Could not download generated image (${response.status}).`);
    return Buffer.from(await response.arrayBuffer());
  }
  throw new Error('Image provider returned neither image bytes nor a URL.');
}

/** Persist provider output as a private Supabase asset and return a fresh URL. */
export async function persistGeneratedImage(params: {
  bookId: string;
  userId: string;
  type: 'cover' | 'illustration' | 'diagram';
  pageNumber?: number;
  prompt: string;
  result: ImageGenerationResult;
}): Promise<PersistedBookAsset> {
  const admin = createAdminClient();
  const bytes = await imageBytes(params.result);
  const { extension, contentType } = extensionFor(params.result);
  const suffix = params.pageNumber ? `page-${params.pageNumber}` : 'cover';
  const storagePath = `${params.userId}/${params.bookId}/${suffix}-${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await admin.storage
    .from('assets')
    .upload(storagePath, bytes, { contentType, cacheControl: '31536000', upsert: false });
  if (uploadError) throw new Error(`Could not persist generated image: ${uploadError.message}`);

  const { data: asset, error: assetError } = await admin
    .from('assets')
    .insert({
      book_id: params.bookId,
      type: params.type,
      storage_path: storagePath,
      prompt: params.prompt,
      provider: params.result.provider,
    })
    .select('id')
    .single();
  if (assetError || !asset) {
    await admin.storage.from('assets').remove([storagePath]);
    throw new Error(`Could not record generated image: ${assetError?.message || 'unknown error'}`);
  }

  const { data: signed, error: signedError } = await admin.storage
    .from('assets')
    .createSignedUrl(storagePath, 60 * 60 * 24);
  if (signedError || !signed?.signedUrl) {
    throw new Error(`Could not create image URL: ${signedError?.message || 'unknown error'}`);
  }

  return { id: asset.id, storagePath, url: signed.signedUrl };
}

export async function signedAssetUrl(storagePath: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from('assets')
    .createSignedUrl(storagePath, 60 * 60 * 24);
  if (error) {
    console.error('Asset URL error:', error);
    return null;
  }
  return data?.signedUrl || null;
}
