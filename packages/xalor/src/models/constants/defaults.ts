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
