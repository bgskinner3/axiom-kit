// // // lib/dom/media.ts
// import {
//   isArray,
//   isKeyInObject,
//   isFunction,
//   isString,
//   isObject,
// } from '@axiom/guards';

// const PRELOAD_CACHE = new Map<string, true>();
// const MAX_CACHE_SIZE = 200;

// /**
//  * @utilType util
//  * @name preloadImages
//  * @category Dom Media
//  * @description Preloads and caches images using Image.decode() for non-blocking rendering and LRU management.
//  * @link #preloadImages
//  *
//  *
//  * Preloads images with PRELOAD caching.
//  *
//  * This utility:
//  * - Uses `Image.decode()` if supported by the browser for faster, async decoding.
//  * - Falls back to `onload` / `onerror` events if `decode()` is not available.
//  * - Skips URLs that are already cached in the LRU cache.
//  *
//  * This is useful for preloading images in a performant way, avoiding repeated network requests
//  * and controlling memory usage with an LRU cache.
//  *
//  * @param urls - Array of image URLs to preload
//  * @returns A promise that resolves when all images have been preloaded
//  *
//  * @example
//  * ```ts
//  * import { preloadImages } from './lib/network/images';
//  *
//  * const images = [
//  *   '/images/photo1.jpg',
//  *   '/images/photo2.jpg',
//  *   '/images/photo3.jpg',
//  * ];
//  *
//  * // Preload images before rendering a gallery
//  * await preloadImages(images);
//  * console.log('All images are preloaded and cached!');
//  * ```
//  */
// export async function preloadImages(
//   urls: string | string[],
//   options: { fetchPriority?: HTMLImageElement['fetchPriority'] } = {},
// ): Promise<void> {
//   if (typeof window === 'undefined') return;
//   const { fetchPriority = 'low' } = options;
//   const urlArray = isArray(urls) ? urls : [urls];
//   const tasks = urlArray
//     .filter((src) => !PRELOAD_CACHE.has(src))
//     .map((src) => {
//       return new Promise<void>((resolve) => {
//         const img: HTMLImageElement = new Image();
//         img.fetchPriority = fetchPriority;
//         img.src = src;

//         const done = () => {
//           if (PRELOAD_CACHE.size >= MAX_CACHE_SIZE) {
//             const firstKey = PRELOAD_CACHE.keys().next().value;
//             if (firstKey) PRELOAD_CACHE.delete(firstKey);
//           }

//           PRELOAD_CACHE.set(src, true);
//           resolve();
//         };

//         if (img.complete) {
//           // Already loaded by browser
//           done();
//         } else if (isKeyInObject('decode')(img) && isFunction(img.decode)) {
//           // Decode to ensure image is in memory
//           img.decode().then(done).catch(done);
//         } else {
//           // Fallback
//           img.onload = done;
//           img.onerror = done;
//         }
//       });
//     });

//   if (tasks.length === 0) return;
//   await Promise.all(tasks);
// }
// // /**
// //  * @utilType util
// //  * @name normalizeImageSrc
// //  * @category Dom Media
// //  * @description Extracts a clean URL string from various image source types, including bundler imports and static objects.
// //  * @link #normalizeImageSrc
// //  *
// //  *
// //  *
// //  * Normalizes a variety of image sources into a plain string URL.
// //  * @template T - The shape of the image object, defaulting to our base structure.
// //  */
// // export function normalizeImageSrc<T extends TBaseImageObject>(
// //   src: string | T | { default: T } | null | undefined,
// // ): string {
// //   if (!src) return '';

// //   // 1. Handle string URLs
// //   if (isString(src)) return src;
// //   isKeyInObject('default')(src);
// //   // 2. Handle CommonJS/Bundler default exports
// //   if (
// //     isKeyInObject('default')(src) &&
// //     src.default &&
// //     isObject(src.default) &&
// //     isKeyInObject('src')(src.default)
// //   ) {
// //     return (src.default as T).src;
// //   }

// //   // 3. Handle standard objects (Next.js StaticImageData, Vite, etc.)
// //   if (isObject(src) && isKeyInObject('src')(src) && isString(src.src)) {
// //     return src.src;
// //   }

// //   return '';
// // }
