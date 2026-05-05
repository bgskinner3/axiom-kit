const SOLID_GLOBAL_KEYS = {
  solidVaultKey: '__SOLID_VAULT__',
  solidVersion: '1.0.0',
} as const;
const SOLID_EMITTER_KEYS = {
  targetDir: 'node_modules/@bgskinner2/is-solid/dist',
  fileName: 'solid-env.d.ts',
  moduleName: 'is-solid',
  banner: `/** 💎 SOLIDIFIED TYPE DATABASE (AUTO-GENERATED) */`,
  eslintDisabled: [
    '@typescript-eslint/no-unused-vars',
    '@typescript-eslint/no-explicit-any',
  ],
  imports: ["import type { ISolidRegistry, TSolid } from './index';"],
} as const;
export const IS_SOLID_CONFIG_ITEMS = {
  ...SOLID_GLOBAL_KEYS,
  // EMITTER I>E DATAASE FILE BUILD
  emitter: {
    ...SOLID_EMITTER_KEYS,
  },
  // ambientFileName: 'solid-env.d.ts',
  // modelsDirName: 'node_modules/@bgskinner2/is-solid/dist',
  // banner: `/** 💎 SOLIDIFIED TYPE DATABASE (AUTO-GENERATED) */\n`,
  // emitterEslintDisabled: [
  //   '@typescript-eslint/no-unused-vars',
  //   '@typescript-eslint/no-explicit-any',
  // ],
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
