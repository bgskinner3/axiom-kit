import type { TGenericUrlObject } from './types';
/**
 * @utilType util
 * @name normalizeUrl
 * @category Link
 * @description Standardizes various URL inputs (strings, URL instances, or objects) into a single clean string URL.
 * @link #normalizeurl
 *
 * ---
 *
 * ## 🔗 normalizeUrl — Universal URL Stringifier
 *
 * A high-performance utility to standardize URL inputs into a clean string.
 * It gracefully handles:
 * 1. **Native URL Instances**: Converts to string automatically.
 * 2. **Next.js Style Objects**: Merges `pathname`, `query`, and `hash`.
 * 3. **Query Arrays**: Corrects `?tag=a&tag=b` serialization for array values.
 * 4. **Hash Normalization**: Ensures hashes always start with `#`.
 *
 * ---
 *
 * ### Example Usage
 * ```ts
 * // 1. From Object
 * normalizeUrl({
 *   pathname: '/search',
 *   query: { q: 'axiom', tags: ['ts', 'core'] },
 *   hash: 'results'
 * }); // "/search?q=axiom&tags=ts&tags=core#results"
 *
 * // 2. From URL Instance
 * normalizeUrl(new URL('https://axiom.dev')); // "https://axiom.dev"
 * ```
 *
 * ---
 *
 * @param href - The input URL (string, URL instance, or TGenericUrlObject).
 * @returns A normalized string URL or an empty string if input is nullish.
 */
export function normalizeUrl(
  href?: string | URL | TGenericUrlObject | null,
): string {
  if (!href) return '';
  if (typeof href === 'string') return href;
  if (href instanceof URL) {
    const result = href.toString();
    return result.endsWith('/') &&
      href.pathname === '/' &&
      !result.includes('?')
      ? result.slice(0, -1)
      : result;
  }
  if (typeof href !== 'object') return '';

  const { pathname = '', query, hash } = href;

  let search = '';
  if (query && typeof query === 'object') {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;

      if (Array.isArray(value)) {
        for (const item of value) params.append(key, String(item));
      } else {
        params.set(key, String(value));
      }
    }

    const qs = params.toString();
    if (qs) search = `?${qs}`;
  }

  // 🚀 Optimization: Template literal with pre-calculated hash
  const cleanHash = hash ? (hash.startsWith('#') ? hash : `#${hash}`) : '';

  return `${pathname}${search}${cleanHash}`;
}
