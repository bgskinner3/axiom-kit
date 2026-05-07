import type { TSolidShape } from '../shared';
/**
 * 🛡️ SHAPE GATE TYPES
 *
 * These utility types extract specific variants from the master TSolidShape union.
 * They are used to type-gate sub-validator functions, ensuring that a logic
 * block specifically designed for an "object" or "array" only receives the
 * corresponding shape metadata.
 */
/* prettier-ignore */ export type TSolidPrimitiveShape = Extract<TSolidShape, { kind: 'primitive' }>;
/* prettier-ignore */ export type TSolidLiteralShape   = Extract<TSolidShape, { kind: 'literal' }>;
/* prettier-ignore */ export type TSolidUnionShape     = Extract<TSolidShape, { kind: 'union' }>;
/* prettier-ignore */ export type TSolidObjectShape    = Extract<TSolidShape, { kind: 'object' }>;
/* prettier-ignore */ export type TSolidArrayShape     = Extract<TSolidShape, { kind: 'array' }>;
/* prettier-ignore */ export type TSolidBrandedShape   = Extract<TSolidShape, { kind: 'branded' }>;
/* prettier-ignore */ export type TSolidIntersectionShape = Extract<TSolidShape, { kind: 'intersection' }>;
/* prettier-ignore */ export type TSolidReferenceShape = Extract<TSolidShape, { kind: 'reference' }>;

/**
 * 🛠️ GENERIC UTIL TYPES
 *
 * A collection of fundamental TypeScript patterns used throughout the engine.
 * These provide a consistent contract for type guards, assertions, and
 * primitive handling, ensuring linter-safe execution across both the
 * Transformer and the Runtime.
 */

/* prettier-ignore */ export type TTypeGuard<T> = (value: unknown) => value is T;
/* prettier-ignore */ export type TPrimitive = string | number | boolean | bigint;
/* prettier-ignore */ export type TAnyFunction = (...args: unknown[]) => unknown;
/* prettier-ignore */ export type TAssert<T> = (value: unknown) => asserts value is T;
