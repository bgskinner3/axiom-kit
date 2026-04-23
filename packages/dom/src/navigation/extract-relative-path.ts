import { isInternalUrl, isAbsoluteUrl } from '@axiom/guards';
/**
 * @utilType util
 * @name extractRelativePath
 * @category Link
 * @description Safely extracts the pathname from absolute or relative internal URLs, ensuring a leading slash.
 * @link #extractrelativepath
 *
 * ## 🧩 extractRelativePath — Internal Path Extractor
 *
 * Extracts the relative path from an internal or absolute URL.
 * External URLs or invalid inputs are safely resolved to `/`.
 *
 * @param url - The input URL string or unknown value.
 * @returns A string representing the relative path, always starting with `/`.
 */
export const extractRelativePath = (url?: unknown): string => {
  if (!isInternalUrl(url)) return '/';

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return '/';

  if (trimmedUrl.startsWith('/')) return trimmedUrl;

  if (isAbsoluteUrl(trimmedUrl)) {
    const parsed = new URL(trimmedUrl);
    return parsed.pathname || '/';
  }

  return `/${trimmedUrl}`;
};
