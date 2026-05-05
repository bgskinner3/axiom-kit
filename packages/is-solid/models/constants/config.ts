export const IS_SOLID_CONFIG_ITEMS = {
  solidVaultKey: '__SOLID_VAULT__',
  solidVersion: '1.0.0',
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
