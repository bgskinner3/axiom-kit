import type { TTypeGuard, TAbsoluteURL, TInternalUrl } from '../models';
import { isNonEmptyString } from '@axiom/guards';

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
 * @description Checks if a URL is a relative path or an absolute URL matching the current window's origin.
 * @link #isinternalurl
 *
 * ## 🏠 isInternalUrl — Type Guard for Same-Origin or Relative Links
 *
 * Checks if a value is a valid internal URL. A URL is considered "internal" if it
 * is a relative path (starts with `/`) or an absolute URL that matches the
 * current window's origin.
 *
 * @param url - The value to validate as an internal link.
 * @returns `true` if `url` is a non-empty string belonging to the current origin.
 */
export const isInternalUrl: TTypeGuard<TInternalUrl> = (
  url: unknown,
): url is TInternalUrl => {
  if (
    typeof window === 'undefined' ||
    typeof location === 'undefined' ||
    !isNonEmptyString(url)
  ) {
    return false;
  }
  if (url.startsWith('/')) return true;
  try {
    const parsed = new URL(url, location.origin);
    return parsed.hostname === location.hostname;
  } catch {
    return false;
  }
};
