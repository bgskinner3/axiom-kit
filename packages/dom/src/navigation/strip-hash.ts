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
  if (!url.includes('#')) return url;

  try {
    const isRelative = !url.includes('://') && !url.startsWith('//');
    const base = 'http://temp.com';
    const parsed = new URL(url, base);

    // Reconstruct without the hash
    const pathAndQuery = `${parsed.pathname}${parsed.search}`;

    if (isRelative) {
      // Logic: Ensure we don't add a leading slash if the original didn't have one
      return url.startsWith('/')
        ? pathAndQuery
        : pathAndQuery.replace(/^\//, '');
    }

    // Logic: Remove the trailing slash added by the URL constructor
    // ONLY if the original URL didn't have one before the hash.
    const originAndPath = `${parsed.origin}${pathAndQuery}`;
    const originalNoHash = url.split('#')[0];

    if (!originalNoHash.endsWith('/') && originAndPath.endsWith('/')) {
      return originAndPath.slice(0, -1);
    }

    return originAndPath;
  } catch {
    // Ultimate fallback for mangled strings
    return url.split('#')[0];
  }
};
