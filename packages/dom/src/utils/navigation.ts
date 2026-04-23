// /**
//  * @utilType util
//  * @name stripHash
//  * @category Link
//  * @description Removes the hash fragment (#) from a URL while preserving the path and query parameters.
//  * @link #striphash
//  *
//  * ## ✂️ stripHash — Fragment Remover
//  *
//  * Removes the hash fragment from a URL string.
//  * Fast, SSR-safe, and handles both internal and absolute URLs accurately.
//  *
//  * @param url - The URL to process.
//  */
// export const stripHash = (url?: string): string => {
//   if (!url) return '';

//   // Simple string split is faster and SSR-safe for 90% of cases
//   if (!url.includes('#')) return url;

//   try {
//     // If window exists, we can use the URL constructor for more accuracy
//     const base =
//       typeof window !== 'undefined'
//         ? window.location.origin
//         : 'http://localhost';
//     const parsed = new URL(url, base);

//     // Return path + search (and origin if it's external)
//     const isInternal =
//       typeof window !== 'undefined' && parsed.origin === window.location.origin;
//     return isInternal
//       ? `${parsed.pathname}${parsed.search}`
//       : `${parsed.origin}${parsed.pathname}${parsed.search}`;
//   } catch {
//     // Fallback for malformed URLs
//     return url.split('#')[0];
//   }
// };
//  * @utilType util
//  * @name extractRelativePath
//  * @category Link
//  * @description Safely extracts the pathname from absolute or relative internal URLs, ensuring a leading slash.
//  * @link #extractrelativepath
//  *
//  * ## 🧩 extractRelativePath — Internal Path Extractor
//  *
//  * Extracts the relative path from an internal or absolute URL.
//  * External URLs or invalid inputs are safely resolved to `/`.
//  *
//  * @param url - The input URL string or unknown value.
//  * @returns A string representing the relative path, always starting with `/`.
//  */
// export const extractRelativePath = (url?: unknown): string => {
//   if (!isInternalUrl(url)) return '/';

//   const trimmedUrl = url.trim();
//   if (!trimmedUrl) return '/';

//   if (trimmedUrl.startsWith('/')) return trimmedUrl;

//   if (isAbsoluteUrl(trimmedUrl)) {
//     const parsed = new URL(trimmedUrl);
//     return parsed.pathname || '/';
//   }

//   return `/${trimmedUrl}`;
// };
// /**
//  * @utilType util
//  * @name normalizeImageSrc
//  * @category Dom Media
//  * @description Extracts a clean URL string from various image source types, including bundler imports and static objects.
//  * @link #normalizeImageSrc
//  *
//  *
//  *
//  * Normalizes a variety of image sources into a plain string URL.
//  * @template T - The shape of the image object, defaulting to our base structure.
//  */
// export function normalizeImageSrc<T extends TBaseImageObject>(
//   src: string | T | { default: T } | null | undefined,
// ): string {
//   if (!src) return '';

//   // 1. Handle string URLs
//   if (isString(src)) return src;
//   isKeyInObject('default')(src);
//   // 2. Handle CommonJS/Bundler default exports
//   if (
//     isKeyInObject('default')(src) &&
//     src.default &&
//     isObject(src.default) &&
//     isKeyInObject('src')(src.default)
//   ) {
//     return (src.default as T).src;
//   }

//   // 3. Handle standard objects (Next.js StaticImageData, Vite, etc.)
//   if (isObject(src) && isKeyInObject('src')(src) && isString(src.src)) {
//     return src.src;
//   }

//   return '';
// }
