import type { TTypeGuard, TAbsoluteURL, TInternalUrl } from './types';
import { isNonEmptyString } from './primitives';
/**
 * @utilType Guard
 * @name isAbsoluteUrl
 * @category Guards Core
 * @description Validates if a string is a valid absolute URL that can be parsed by the browser's URL constructor.
 * @link #isabsoluteurl
 *
 * ## 🧩 isAbsoluteUrl — Type Guard for Absolute URLs
 *
 * Checks whether a given string is a valid absolute URL. Returns `true` if the string
 * can be parsed as a valid URL, otherwise `false`.
 *
 * @param url - The value to validate as a URL.
 * @returns `true` if `url` is a non-empty valid absolute URL string.
 */
export const isAbsoluteUrl: TTypeGuard<TAbsoluteURL> = (
  url: unknown,
): url is TAbsoluteURL => {
  if (!isNonEmptyString(url)) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
/**
 * @utilType Guard
 * @name isInternalUrl
 * @category Guards Core
 * @description Validates if a URL is relative or matches a specific origin (defaults to window.location).
 * @link #isinternalurl
 *
 * ---
 *
 * ## 🏠 isInternalUrl — Type Guard for Same-Origin or Relative Links
 *
 * Checks if a value is a valid internal URL. A URL is considered "internal" if it:
 * 1. Is a relative path (starts with `/`).
 * 2. Is an absolute URL matching the provided `baseOrigin` or the current `window.location.origin`.
 *
 * This guard is **SSR-safe**; if no window context is found and no `baseOrigin` is provided,
 * it will only validate relative paths.
 *
 * ---
 *
 * ### Example Usage
 * ```ts
 * // Browser context (on https://axiom.dev)
 * isInternalUrl('/dashboard');             // true
 * isInternalUrl('https://axiom.dev'); // true
 * isInternalUrl('https://google.com');    // false
 *
 * // Node/SSR context
 * isInternalUrl('https://axiom.dev', 'https://axiom.dev'); // true
 * ```
 *
 * ---
 *
 * @param url - The value to validate.
 * @param baseOrigin - Optional fallback origin for non-browser environments.
 * @returns `true` if the URL is internal to the specified or current origin.
 */
export const isInternalUrl = (
  url: unknown,
  baseOrigin?: string,
): url is TInternalUrl => {
  if (!isNonEmptyString(url)) return false;

  const currentOrigin =
    baseOrigin || (typeof location !== 'undefined' ? location.origin : null);

  if (!currentOrigin) return url.startsWith('/');

  if (url.startsWith('//')) {
    try {
      const protocol = new URL(currentOrigin).protocol;
      const parsed = new URL(`${protocol}${url}`);
      return parsed.origin === currentOrigin;
    } catch {
      return false;
    }
  }

  if (url.startsWith('/')) return true;

  try {
    const parsed = new URL(url, currentOrigin);
    return parsed.origin === currentOrigin;
  } catch {
    return false;
  }
};
