// /**
//  * @utilType util
//  * @name normalizeUrl
//  * @category Link
//  * @description Standardizes various URL inputs (strings, URL instances, or objects) into a single clean string URL.
//  * @link #normalizeurl
//  *
//  * ## 🔗 normalizeUrl — Universal URL Stringifier
//  *
//  * Normalize various URL inputs to a string.
//  * Supports native URL objects, Next.js style query objects, and standard strings.
//  *
//  * @param href - The input URL (string, URL instance, or object with pathname/query/hash).
//  * @returns A normalized string URL.
//  */
// export function normalizeUrl(
//   href?: string | URL | TGenericUrlObject | null,
// ): string {
//   if (!isDefined(href)) return '';

//   // 1. Handle simple strings
//   if (isString(href)) return href;

//   // 2. Handle native URL instances
//   if (href instanceof URL) return href.toString();

//   // 3. Handle UrlObjects (Next.js / Node)
//   if (
//     isObject(href) &&
//     (isKeyInObject('pathname')(href) || isKeyInObject('query')(href))
//   ) {
//     const { pathname = '', query, hash = '' } = href;

//     let queryString = '';

//     if (isObject(query)) {
//       const params = new URLSearchParams();

//       // Cleanly iterate and append valid query params
//       ObjectUtils.entries(query).forEach(([key, value]) => {
//         if (isDefined(value)) {
//           // Handle arrays (e.g. ?tag=a&tag=b) or primitives
//           if (isArray(value)) {
//             ArrayUtils.forEach(value, (v) => params.append(key, String(v)));
//           } else {
//             params.append(key, String(value));
//           }
//         }
//       });

//       const search = params.toString();
//       if (search) queryString = `?${search}`;
//     }

//     const cleanPath = pathname || '';
//     const cleanHash = hash && !hash.startsWith('#') ? `#${hash}` : hash || '';

//     return `${cleanPath}${queryString}${cleanHash}`;
//   }

//   return '';
// }
// /**
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
// /**
//  * @utilType util
//  * @name handleInternalHashScroll
//  * @category Link
//  * @description Manages smooth scrolling for internal anchor links with cross-browser safety checks.
//  * @link #handleinternalhashscroll
//  *
//  * ## 📜 handleInternalHashScroll — Smooth Fragment Scrolling
//  *
//  * Intercepts anchor clicks to perform smooth scrolling to a target ID.
//  * Includes built-in exclusions for iOS Safari where native scroll behavior is often inconsistent.
//  *
//  * @param options.href - The hash ID (e.g. '#target').
//  * @param options.behavior - The scroll timing ('smooth' | 'auto').
//  */
// export const handleInternalHashScroll = ({
//   event,
//   href,
//   behavior = 'smooth',
//   block = 'start',
// }: THashScrollOptions): boolean => {
//   if (typeof window === 'undefined') return false;
//   if (!href.startsWith('#')) return false;

//   // iOS Safari has broken scrollIntoView behavior
//   const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
//   if (isIOS) return false;

//   const id = href.replace(/^#/, '');
//   const element = document.getElementById(id);
//   if (!element) return false;

//   event?.preventDefault();

//   element.scrollIntoView({
//     behavior,
//     block,
//   });

//   return true;
// };
