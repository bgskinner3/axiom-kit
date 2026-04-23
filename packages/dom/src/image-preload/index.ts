import { isArray, isKeyInObject, isFunction } from '@axiom/guards';

/**
 * Map preserves insertion order, making LRU logic O(1).
 */
const PRELOAD_CACHE = new Map<string, true>();
const MAX_CACHE_SIZE = 200;

/**
 * Ensures the cache doesn't exceed memory limits via LRU eviction.
 */
const commitToCache = (src: string): void => {
  if (PRELOAD_CACHE.has(src)) return;

  if (PRELOAD_CACHE.size >= MAX_CACHE_SIZE) {
    const firstKey = PRELOAD_CACHE.keys().next().value;
    if (firstKey) PRELOAD_CACHE.delete(firstKey);
  }

  PRELOAD_CACHE.set(src, true);
};

/**
 * Lazily yields unique URLs that need preloading.
 */
function* yieldUniqueUrls(urls: string[]): Generator<string> {
  for (const src of urls) {
    if (src && !PRELOAD_CACHE.has(src)) {
      yield src;
    }
  }
}
/**
 * @utilType util
 * @name preloadImages
 * @category Dom Media
 * @description High-performance async image preloading using a worker pool and lazy generator.
 * @link #preloadimages
 *
 * ---
 *
 * ## 🖼️ preloadImages — Non-blocking Asset Hydration
 *
 * This utility optimizes image preloading by:
 * 1. Using a **Worker Pool** to maintain a constant concurrency pipeline.
 * 2. Utilizing **Lazy Generators** to avoid intermediate array allocations.
 * 3. Leveraging `Image.decode()` to move pixel decoding off the main thread.
 * 4. Managing memory with an internal **LRU Cache** (max 200 items).
 *
 * ---
 *
 * ### Example Usage
 * ```ts
 * const gallery = ['/img1.jpg', '/img2.jpg', '/img3.jpg'];
 *
 * // Preload with 4 simultaneous workers
 * await preloadImages(gallery, { concurrency: 4, fetchPriority: 'high' });
 * ```
 *
 * ---
 *
 * @param urls - String or Array of strings representing image source URLs.
 * @param options - Configuration for fetchPriority and worker concurrency.
 * @returns A promise that resolves when the worker pool has processed all tasks.
 */
export async function preloadImages(
  urls: string | string[],
  options: {
    fetchPriority?: HTMLImageElement['fetchPriority'];
    concurrency?: number;
  } = {},
): Promise<void> {
  // 1. SSR Safety
  if (typeof window === 'undefined') return;

  const { fetchPriority = 'low', concurrency = 6 } = options;
  const urlArray = isArray(urls) ? urls : [urls];

  // 2. Initialize lazy task stream
  const taskGenerator = yieldUniqueUrls(urlArray);

  const worker = async () => {
    for (const src of taskGenerator) {
      const img = new Image();
      img.fetchPriority = fetchPriority;
      img.src = src;

      try {
        // Modern async decoding (off-main-thread)
        if (isKeyInObject('decode')(img) && isFunction(img.decode)) {
          await img.decode();
        } else {
          await new Promise((res) => {
            img.onload = img.onerror = res;
          });
        }

        commitToCache(src);
      } catch {
        // Fail silent: keep worker moving if one image 404s
      }
    }
  };

  const pool = Array.from(
    { length: Math.min(concurrency, urlArray.length) },
    worker,
  );

  await Promise.all(pool);
}
