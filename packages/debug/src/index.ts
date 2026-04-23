export * from './get-caller-location';

// import {
//   isString,
//   isUndefined,
//   isBigInt,
//   isObject,
//   isKeyOfArray,
// } from '../guards/core';
// import { REGEX_CONSTANTS, ANSI_COLOR_CODES, LOG_TYPES } from '../../constants';
// import {
//   TGetCallerLocationOptions,
//   TLogOptions,
//   THighlighterMap,
//   TLogType,
//   TTableItem,
// } from '../../types';
// import { ArrayUtils } from '../common';

// /**
//  * @utilType util
//  * @name highlight
//  * @category Debug
//  * @description Wraps text in ANSI color codes for stylized terminal output.
//  * @link #highlight
//  *
//  * ## 🖍️ highlight — Terminal Text Colorizer
//  *
//  * Applies ANSI color codes to a string for readable console logging.
//  *
//  * @param text - The content to colorize.
//  * @param colorCode - The color key (e.g., 'yellow', 'red', 'cyan').
//  * @returns The color-wrapped string.
//  */
// export function highlight(
//   text: string,
//   colorCode: keyof typeof ANSI_COLOR_CODES = 'yellow',
// ) {
//   return `${ANSI_COLOR_CODES[colorCode]}${text}${ANSI_COLOR_CODES.reset}`;
// }

// /**
//  * @utilType util
//  * @name serialize
//  * @category Debug
//  * @description Safely serializes any value, including BigInts and circular structures, into a pretty-printed string.
//  * @link #serialize
//  *
//  * ## 🗂️ serialize — Safe Data Stringifier
//  *
//  * Converts values into readable JSON. Gracefully handles types that normally
//  * break `JSON.stringify`, like BigInts, and provides clean indentation.
//  *
//  * @param data - The value to serialize.
//  * @returns A formatted string representation.
//  */
// export const serialize = (data: unknown): string => {
//   if (isUndefined(data)) return '';
//   if (isString(data)) return data;

//   try {
//     return JSON.stringify(
//       data,
//       (_, value) => (isBigInt(value) ? value.toString() : value),
//       2,
//     );
//   } catch {
//     return String(data);
//   }
// };

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

// /**
//  * @utilType util
//  * @name logDev
//  * @category Debug
//  * @description Environment-aware logger that restricts output to development mode, supports semantic log types, and auto-formats table data.
//  * @link #logdev
//  *
//  * ## 🚀 logDev — Environment-Safe Logger
//  *
//  * Logs messages to the console **only in development** unless explicitly overridden.
//  * It acts as a smart wrapper around `console`, providing:
//  * - **Semantic Types**: Supports 'info', 'warn', 'error', 'debug', and 'table'.
//  * - **Auto-Serialization**: Automatically runs `serialize()` on objects and BigInts.
//  * - **Table Formatting**: Specialized handling for structured timing/performance data.
//  * - **ANSI Highlighting**: Color-codes output based on the log type for better visibility.
//  *
//  * @param options.enabled - Toggle logging off for specific calls.
//  * @param options.overrideDev - Force the log to show in production (use sparingly).
//  * @param args - The data to log. If the first argument is a `TLogType`, it sets the console method.
//  *
//  * @example
//  * ```ts
//  * logDev({}, 'info', 'App initialized');
//  * logDev({ overrideDev: true }, 'error', 'Critical production failure');
//  * ```
//  */
// export const logDev = (options: TLogOptions, ...args: unknown[]) => {
//   const isDev = process.env.NODE_ENV !== 'production';
//   const { enabled = true, overrideDev = false } = options;

//   if (!enabled) return;
//   if (!isDev && !overrideDev) return;

//   //   // Determine log type
//   let type: TLogType = 'log';
//   const currentType = args[0];
//   if (isString(currentType) && isKeyOfArray(LOG_TYPES)(currentType)) {
//     type = currentType;
//   }

//   // Handle table logs separately
//   if (type === 'table') {
//     // skip first argument, which is the log type string
//     const tableData = ArrayUtils.map(args.slice(1), (item: unknown) => {
//       if (item && isObject(item) && 'current' in item) {
//         const curr = (item as { current: TTableItem[] }).current;
//         return curr.map((l) => ({
//           key: l.key,
//           duration:
//             l.end != null && l.start != null
//               ? `${(l.end - l.start).toFixed(2)}ms`
//               : 'in progress',
//         }));
//       }
//       return item;
//     });
//     console.table(tableData.flat());
//     return;
//   }
//   const logTypeHighlighters: THighlighterMap = {
//     log: (t) => highlight(t, 'yellow'),
//     info: (t) => highlight(t, 'cyan'),
//     error: (t) => highlight(t, 'red'),
//     debug: (t) => highlight(t, 'magenta'),
//     warn: (t) => highlight(t, 'yellow'),
//     table: (t) => t,
//   };
//   const highlighter = logTypeHighlighters[type];
//   const messages = args.map((msg) => {
//     let text = isObject(msg) ? serialize(msg) : String(msg);

//     return highlighter ? highlighter(text) : text;
//   });

//   (console[type] ?? console.log)(...messages);
// };
