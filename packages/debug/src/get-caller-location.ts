type TGetCallerLocationOptions = {
  preferredIndex?: number;
  /** Fallback index if preferredIndex is not available (default: 2) */
  fallbackIndex?: number;
  /** Whether to get the top-level parent function instead of preferredIndex (default: false) */
  topParent?: boolean;
  /** Path prefix to strip from the returned line (default: process.cwd()) */
  stripPathPrefix?: string;
};

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
  const {
    preferredIndex = 3,
    fallbackIndex = 2,
    topParent = false,
    stripPathPrefix,
  } = options;

  // 1. Capture stack without throwing
  const err = { stack: '' };
  Error.captureStackTrace?.(err, getCallerLocation); // V8 optimization
  const stack = err.stack || new Error().stack;

  if (!stack) return 'unknown';

  // 2. Use a more efficient extraction logic
  const lines = stack.split('\n');
  let targetLine: string | undefined;

  if (topParent) {
    // Search backwards for the first non-node_modules line
    for (let i = lines.length - 1; i >= 1; i--) {
      if (!lines[i].includes('node_modules')) {
        targetLine = lines[i];
        break;
      }
    }
  } else {
    // Direct access with fallback
    // +1 to skip the "Error" header line
    targetLine =
      lines[preferredIndex + 1] ?? lines[fallbackIndex + 1] ?? lines.at(-1);
  }

  if (!targetLine) return 'unknown';

  // 3. Clean up formatting and strip paths
  const cleanLine = targetLine.replace(/^\s*at\s+/, '').trim();

  if (stripPathPrefix) {
    return cleanLine.replace(stripPathPrefix, '');
  }
  const defaultStrip = new RegExp(
    (typeof process !== 'undefined' ? process.cwd() : '').replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    ),
    'g',
  );
  return cleanLine.replace(defaultStrip, '');
};
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
//     .map((line) => line.replace(/^\s*at\s+/, '').trim())
//     .filter(Boolean);

//   const line = topParent
//     ? ([...lines].reverse().find((l) => !l.includes('node_modules')) ??
//       lines.at(-1))
//     : (lines[preferredIndex] ?? lines[fallbackIndex] ?? lines.at(-1));

//   return stripPathPrefix
//     ? (line?.replace(stripPathPrefix, '') ?? 'unknown')
//     : (line ?? 'unknown');
// };
