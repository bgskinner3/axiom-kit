import type { TGetCallerLocationOptions } from '../../models/types';

/**
 * @utilType util
 * @name getCallerLocation
 * @category Debug
 * @description Parses the stack trace to identify the file, line, and column of the calling function.
 * @link #getcallerlocation
 *
 * ## 📍 getCallerLocation — Stack Trace Tracer
 *
 * Retrieves the caller's location (file, line, and column).
 * Useful for automated logging, debugging, and identifying the origin of specific operations.
 *
 * @example
 * ```ts
 * import { DebugUtils } from '@/utils/core/debug';
 *
 * function exampleFunction() {
 *   console.log(DebugUtils.getCallerLocation());
 * }
 *
 * exampleFunction();
 * // Example output:
 * // "src/utils/core/debug.ts:12:5"
 * ```
 *
 * @example
 * ```ts
 * // Get the top-most relevant frame (ignoring node_modules)
 * console.log(DebugUtils.getCallerLocation(3, 2, true));
 * // Example output:
 * // "src/server/api/user.ts:88:17"
 * ```
 *
 * @example
 * ```ts
 * // Strip out the absolute path prefix for cleaner logs
 * console.log(DebugUtils.getCallerLocation(3, 2, false, process.cwd()));
 * // Example output:
 * // "/src/services/logger.ts:54:9"
 * ```
 */
export const getCallerLocation = (
  options: TGetCallerLocationOptions = {},
): string => {
  const { preferredIndex = 3, fallbackIndex = 2, topParent = false } = options;

  const err = { stack: '' };
  Error.captureStackTrace?.(err, getCallerLocation);
  const stack = err.stack || new Error().stack;
  if (!stack) return 'unknown';

  const lines = stack.split('\n');
  let targetLine: string | undefined;

  if (topParent) {
    // 🕵️‍♂️ Search from the bottom up to find the entry-point
    for (let i = lines.length - 1; i >= 1; i--) {
      const line = lines[i];
      const isInternal = /node_modules|node:internal|jest-/.test(line);
      if (!isInternal && (line.includes('.ts') || line.includes('.js'))) {
        targetLine = line;
        break;
      }
    }
  } else {
    // 🎯 Targeted extraction (usually for isXalor/toXalor calls)
    targetLine = lines[preferredIndex + 1] ?? lines[fallbackIndex + 1];
  }

  if (!targetLine) return 'unknown';

  /**
   * 💎 THE VS CODE GPS FIX
   * We extract the (path:line:char) portion specifically.
   * VS Code requires the format: file:///path/to/file.ts:10:5
   * or simply /path/to/file.ts:10:5 in most terminals.
   */
  const match = targetLine.match(/((?:\/|[A-Z]:\\)[^:]+:\d+:\d+)/);
  if (!match) return targetLine.replace(/^\s*at\s+/, '').trim();

  return match[1]; // Returns the raw path:line:char for perfect clicking
};
// export const getCallerLocation = (
//   options: TGetCallerLocationOptions = {},
// ): string => {
//   const {
//     preferredIndex = 3,
//     fallbackIndex = 2,
//     topParent = false,
//     stripPathPrefix,
//   } = options;

//   // 1. Capture stack without throwing
//   const err = { stack: '' };
//   Error.captureStackTrace?.(err, getCallerLocation); // V8 optimization
//   const stack = err.stack || new Error().stack;

//   if (!stack) return 'unknown';

//   // 2. Use a more efficient extraction logic
//   const lines = stack.split('\n');
//   let targetLine: string | undefined;

//   if (topParent) {
//     for (let i = lines.length - 1; i >= 1; i--) {
//       const line = lines[i];

//       // TODO: EXTEND TO PASS OPTIONALLIBS ?
//       const isLibrary =
//         line.includes('node_modules') ||
//         line.includes('node:internal') ||
//         line.includes('jest-'); // Catches jest-circus, jest-runner, etc.

//       // 🏛️ If it's not a library and looks like a source file, grab it
//       if (!isLibrary && (line.includes('.ts') || line.includes('.js'))) {
//         targetLine = line;
//         break;
//       }
//     }
//   } else {
//     // Direct access with fallback
//     // +1 to skip the "Error" header line
//     targetLine =
//       lines[preferredIndex + 1] ?? lines[fallbackIndex + 1] ?? lines.at(-1);
//   }

//   if (!targetLine) return 'unknown';

//   // 3. Clean up formatting and strip paths
//   const cleanLine = targetLine.replace(/^\s*at\s+/, '').trim();

//   if (stripPathPrefix) {
//     return cleanLine.replace(stripPathPrefix, '');
//   }
//   const defaultStrip = new RegExp(
//     (typeof process !== 'undefined' ? process.cwd() : '').replace(
//       /[.*+?^${}()|[\]\\]/g,
//       '\\$&',
//     ),
//     'g',
//   );
//   return cleanLine.replace(defaultStrip, '');
// };
