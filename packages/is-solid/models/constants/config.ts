const SOLID_GLOBAL_KEYS = {
  solidVaultKey: '__SOLID_VAULT__',
  solidVersion: '1.0.0',
} as const;
/**
 * Configuration for the Ambient Type Emitter.
 * Handles the generation of the .d.ts database.
 */
const SOLID_EMITTER_KEYS = {
  /** Relative path to the package distribution folder where types are injected. */
  targetDir: 'node_modules/@bgskinner2/is-solid/dist',

  /** The specific declaration file name that powers IDE autocomplete. */
  fileName: 'solid-env.d.ts',

  /** The library name used in the 'declare module' wrapper. */
  moduleName: 'is-solid',

  /** Warning header placed at the very top of the generated file. */
  banner: `/** 💎 SOLIDIFIED TYPE DATABASE (AUTO-GENERATED) */`,

  /** ESLint rules to suppress within the generated file to avoid linting errors. */
  eslintDisabled: [
    '@typescript-eslint/no-unused-vars',
    '@typescript-eslint/no-explicit-any',
  ],

  /** Internal type imports required for the ambient declarations to resolve. */
  imports: ["import type { ISolidRegistry, TSolid } from './index';"],
} as const;

export const IS_SOLID_CONFIG_ITEMS = {
  ...SOLID_GLOBAL_KEYS,
  // EMITTER I>E DATAASE FILE BUILD
  emitter: {
    ...SOLID_EMITTER_KEYS,
  },
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
