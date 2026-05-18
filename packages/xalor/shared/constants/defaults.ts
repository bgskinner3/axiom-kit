/**
 * ⚙️ SHAPE KIND CONFIGURATION
 *
 * Defines the definitive list of data "Kinds" recognized by the Xalor engine.
 * This object acts as the central source of truth for both the Miner and
 * the Validator, ensuring that kind-string comparisons remain consistent
 * and protected from accidental mutation at runtime.
 */
export const IS_SOLID_SHAPE_KINDS_CONFIG = Object.freeze({
  primitive: 'primitive',
  literal: 'literal',
  union: 'union',
  intersection: 'intersection',
  branded: 'branded',
  object: 'object',
  array: 'array',
  reference: 'reference',
} as const);
/**
 * 🎨 ANSI TERMINAL COLOR CODES
 *
 * ROLE:
 * Raw terminal styling escape sequences for layout rendering.
 *
 * STRATEGY:
 * Maps standard terminal escape keys to predictable names. It uses compile-time
 * 'as const' literal typing to ensure arbitrary invalid strings cannot be fed
 * into stream pipelines.
 */
export const ANSI_COLOR_CODES = {
  reset: '\x1b[0m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m',
  underline: '\x1b[4m',
} as const;
/**
 * 🗺️ DEFAULT LOGGING COLOR ROUTER
 *
 * ROLE:
 * Maps discrete event severity logs to deterministic visual priorities.
 *
 * STRATEGY:
 * Leverages the TS 'satisfies' keyword to validate that every status variant
 * perfectly pairs with an active key in the ANSI map, completely ruling out
 * 'any' fallback traps while preserving tight literal types.
 */
export const DEFAULT_TYPE_COLORS: Record<
  string,
  keyof typeof ANSI_COLOR_CODES
> = {
  info: 'cyan',
  error: 'red',
  debug: 'magenta',
  warn: 'yellow',
  log: 'yellow',
} satisfies Record<string, keyof typeof ANSI_COLOR_CODES>;
