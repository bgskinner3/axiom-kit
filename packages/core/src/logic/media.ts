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
