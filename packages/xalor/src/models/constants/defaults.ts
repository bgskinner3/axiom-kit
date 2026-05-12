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

export const PRIMITIVE_DEFAULTS = {
  string: '',
  number: 0,
  boolean: false,
  bigint: BigInt(0),
  unknown: undefined,
} as const;

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
