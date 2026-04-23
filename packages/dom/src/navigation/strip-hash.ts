/**
 * @utilType util
 * @name stripHash
 * @category Link
 * @description Removes the hash fragment (#) from a URL while preserving the path and query parameters.
 * @link #striphash
 *
 * ## ✂️ stripHash — Fragment Remover
 *
 * Removes the hash fragment from a URL string.
 * Fast, SSR-safe, and handles both internal and absolute URLs accurately.
 *
 * @param url - The URL to process.
 */
export const stripHash = (url?: string): string => {
  if (!url) return '';

  // Simple string split is faster and SSR-safe for 90% of cases
  if (!url.includes('#')) return url;

  try {
    // If window exists, we can use the URL constructor for more accuracy
    const base =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost';
    const parsed = new URL(url, base);

    // Return path + search (and origin if it's external)
    const isInternal =
      typeof window !== 'undefined' && parsed.origin === window.location.origin;
    return isInternal
      ? `${parsed.pathname}${parsed.search}`
      : `${parsed.origin}${parsed.pathname}${parsed.search}`;
  } catch {
    // Fallback for malformed URLs
    return url.split('#')[0];
  }
};
