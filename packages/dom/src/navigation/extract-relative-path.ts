import { isInternalUrl } from '@bgskinner2/axiom-kit-guards';
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
  if (typeof url !== 'string' || !url.trim()) return '/';
  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);
    const path = parsed.pathname;

    const isAbsolute = trimmed.includes('://');

    if (isAbsolute && !isInternalUrl(trimmed)) {
      return '/';
    }

    return path;
  } catch {
    const clean = trimmed.split('?')[0].split('#')[0];
    return clean.startsWith('/') ? clean : `/${clean}`;
  }
};
