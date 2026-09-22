// lib/utils/sanitize.ts
// Comprehensive sanitization and HTML escaping to prevent XSS in rendered documents

/**
 * Escapes characters with special meaning in HTML to prevent XSS
 */
export function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  const text = String(str);
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };

  return text.replace(/[&<>"'`=/]/g, (char) => htmlEscapes[char] || char);
}

/**
 * Strips HTML tags entirely for plain text contexts
 */
export function stripHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  return String(str).replace(/<[^>]*>/g, '').trim();
}

/**
 * Sanitizes a title for safe use in Content-Disposition filenames
 */
export function sanitizeFilename(title: unknown, fallback = 'book'): string {
  if (!title || typeof title !== 'string') return fallback;
  const clean = title
    .toLowerCase()
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/[^a-z0-9_-]/g, '-') // keep only alphanumeric and safe dashes
    .replace(/-+/g, '-') // collapse consecutive dashes
    .replace(/^-|-$/g, '') // trim leading/trailing dashes
    .slice(0, 50); // limit length

  return clean || fallback;
}
