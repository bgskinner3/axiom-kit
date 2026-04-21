// // lib/dom/media.ts
// import {
//   isArray,
//   isKeyInObject,
//   isFunction,
//   isString,
//   isObject,
// } from '../guards';
// import type { TBaseImageObject } from '../../types';

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
