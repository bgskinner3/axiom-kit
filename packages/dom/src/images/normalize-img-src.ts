import { isString, isKeyInObject, isObject } from '@axiom/guards';
type TBaseImageObject = {
  src: string;
  [key: string]: unknown;
};
/**
 * @utilType util
 * @name normalizeImageSrc
 * @category Dom Media
 * @description Extracts a clean URL string from various image source types, including bundler imports and static objects.
 * @link #normalizeImageSrc
 *
 *
 *
 * Normalizes a variety of image sources into a plain string URL.
 * @template T - The shape of the image object, defaulting to our base structure.
 */
export function normalizeImageSrc<T extends TBaseImageObject>(
  src: string | T | { default: T } | null | undefined,
): string {
  if (!src) return '';
  if (isString(src)) return src;

  if (isObject(src) && isKeyInObject('default')(src)) {
    const def = src.default;
    if (isObject(def) && isKeyInObject('src')(def) && isString(def.src)) {
      return def.src;
    }
  }

  if (isObject(src) && isKeyInObject('src')(src) && isString(src.src)) {
    return src.src;
  }

  return '';
}
