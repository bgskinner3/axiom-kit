// /**
//  * @utilType util
//  * @name getCallerLocation
//  * @category Debug
//  * @description Parses the stack trace to identify the file, line, and column of the calling function.
//  * @link #getcallerlocation
//  *
//  * ## 📍 getCallerLocation — Stack Trace Tracer
//  *
//  * Retrieves the caller's location (file, line, and column).
//  * Useful for automated logging, debugging, and identifying the origin of specific operations.
//  *
//  * @example
//  * ```ts
//  * import { DebugUtils } from '@/utils/core/debug';
//  *
//  * function exampleFunction() {
//  *   console.log(DebugUtils.getCallerLocation());
//  * }
//  *
//  * exampleFunction();
//  * // Example output:
//  * // "src/utils/core/debug.ts:12:5"
//  * ```
//  *
//  * @example
//  * ```ts
//  * // Get the top-most relevant frame (ignoring node_modules)
//  * console.log(DebugUtils.getCallerLocation(3, 2, true));
//  * // Example output:
//  * // "src/server/api/user.ts:88:17"
//  * ```
//  *
//  * @example
//  * ```ts
//  * // Strip out the absolute path prefix for cleaner logs
//  * console.log(DebugUtils.getCallerLocation(3, 2, false, process.cwd()));
//  * // Example output:
//  * // "/src/services/logger.ts:54:9"
//  * ```
//  */
// export const getCallerLocation = (
//   options: TGetCallerLocationOptions,
// ): string => {
//   const {
//     preferredIndex = 3,
//     fallbackIndex = 2,
//     topParent = false,
//     stripPathPrefix = process.cwd(),
//   } = options;

//   const stack = new Error().stack;
//   if (!stack) return 'unknown';

//   const lines = stack
//     .split('\n')
//     .slice(1)
//     .map((line) => line.replace(REGEX_CONSTANTS.stackTracePrefix, '').trim())
//     .filter(Boolean);

//   const line = topParent
//     ? ([...lines].reverse().find((l) => !l.includes('node_modules')) ??
//       lines.at(-1))
//     : (lines[preferredIndex] ?? lines[fallbackIndex] ?? lines.at(-1));

//   return stripPathPrefix
//     ? (line?.replace(stripPathPrefix, '') ?? 'unknown')
//     : (line ?? 'unknown');
// };