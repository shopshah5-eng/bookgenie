import fs from 'fs/promises';
import path from 'path';

export interface BinaryAsset {
  bytes: Buffer;
  contentType: string;
}

export async function loadBinaryAsset(url?: string): Promise<BinaryAsset | null> {
  if (!url) return null;

  try {
    if (url.startsWith('data:')) {
      const match = url.match(/^data:([^;,]+)?(;base64)?,([\s\S]*)$/);
      if (!match) return null;
      const contentType = match[1] || 'image/jpeg';
      const bytes = match[2]
        ? Buffer.from(match[3], 'base64')
        : Buffer.from(decodeURIComponent(match[3]), 'utf8');
      return { bytes, contentType };
    }
    if (url.startsWith('/')) {
      const filePath = path.join(process.cwd(), 'public', url);
      const bytes = await fs.readFile(filePath);
      const extension = path.extname(filePath).toLowerCase();
      const contentType = extension === '.png' ? 'image/png' : extension === '.webp' ? 'image/webp' : 'image/jpeg';
      return { bytes, contentType };
    }

    const response = await fetch(url);
    if (!response.ok) return null;
    const contentType = response.headers.get('content-type')?.split(';')[0] || 'image/jpeg';
    return { bytes: Buffer.from(await response.arrayBuffer()), contentType };
  } catch (error) {
    console.warn('Could not load image asset:', error);
    return null;
  }
}

export async function loadImageDataUri(url?: string): Promise<string | null> {
  const asset = await loadBinaryAsset(url);
  if (!asset) return null;
  return `data:${asset.contentType};base64,${asset.bytes.toString('base64')}`;
}

export function extensionForContentType(contentType: string): string {
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('webp')) return 'webp';
  return 'jpg';
}
