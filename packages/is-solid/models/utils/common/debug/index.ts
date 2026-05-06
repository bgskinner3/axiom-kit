import { isBigInt, isString, isUndefined } from '../../../guards';
import type { TGetCallerLocationOptions } from '../../../types';
/**
 * @utilType util
 * @name serialize
 * @category Debug
 * @description Safely serializes any value, including BigInts and circular structures, into a pretty-printed string.
 * @link #serialize
 *
 * ## 🗂️ serialize — Safe Data Stringifier
 *
 * Converts values into readable JSON. Gracefully handles types that normally
 * break `JSON.stringify`, like BigInts, and provides clean indentation.
 *
 * @param data - The value to serialize.
 * @returns A formatted string representation.
 */
export const serialize = (data: unknown): string => {
  if (isUndefined(data)) return 'undefined';
  if (isString(data)) return `"${data}"`;
  if (typeof data === 'bigint') return `${data.toString()}n`;
  if (typeof data === 'symbol') return data.toString();
  try {
    return JSON.stringify(
      data,
      (_, value) => (isBigInt(value) ? value.toString() : value),
      2,
    );
  } catch {
    return String(data);
  }
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
