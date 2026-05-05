export const IS_SOLID_CONFIG_ITEMS = {
  // GLOBAL KEYS
  solidVaultKey: '__SOLID_VAULT__',
  solidVersion: '1.0.0',
  // EMITTER I>E DATAASE FILE BUILD
  ambientFileName: 'solid-env.d.ts',
  modelsDirName: 'models',
  banner: `/** 💎 SOLIDIFIED TYPE DATABASE (AUTO-GENERATED) */\n`,
} as const;
/**
 * CONFIG OBJECT DICATING THE AVIALBLE KINDS
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
