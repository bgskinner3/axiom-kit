import type { TSolidShape } from '../../../../shared';
import type { TTransformDependency } from '../mappers';

// ========================================================================
// 🎛️ I. PUBLIC DEVELOPER API BOUNDARY CONTRACTS
// ========================================================================

/** 🎛️ UNIVERSAL TRANSFORM PREDICATE CLOSURE ENGINE CONTRACT */
export type TTransformPredicate = (
  key: string,
  propertiesSet: Set<string> | Record<string, string>,
) => boolean;

/** 📥 Params for public service method XalethorVaultTransformer.transformPickAndOmit */
export type TTransformPickAndOmit = {
  readonly data: unknown;
  readonly shape: TSolidShape;
  readonly filterSet: Set<string>;
  readonly predicate: TTransformPredicate;
};

/** 🚀 Params for public service method XalethorVaultTransformer.transformRename */
export type TTransformRename = {
  readonly data: unknown;
  readonly shape: TSolidShape;
  readonly mappings: Record<string, string>;
};

/** 🧬 Params for public service method XalethorVaultTransformer.transformMerge */
export type TTransformMerge = {
  readonly dataOne: unknown;
  readonly dataTwo: unknown;
  readonly shape: TSolidShape;
};

// ========================================================================
// 🎛️ III. SHARED RECURSIVE ENGINE INTERNAL CONTEXT CONTRACTS
// ========================================================================

/**
 * 🎛️ TSanitizeTransformBase
 *
 * ROLE:
 * Base shared parameter context driving internal transformation loops.
 */
export type TSanitizeTransformBase = {
  readonly val: unknown;
  readonly currentShape: TSolidShape;
  readonly dependency: TTransformDependency; // 🚀 Unified tracking container union
  readonly depth: number;
};

/** 📥 Internal parameter context wrapper for your object slicing worker */
export type TSanitizeSlicedObject = {
  readonly currentShape: Extract<TSolidShape, { kind: 'object' }>;
  readonly seenObjectsMap: Map<unknown, unknown>;
  readonly predicate?: TTransformPredicate;
} & TSanitizeTransformBase;

/** 📥 Internal parameter context wrapper for your core sanitizer gate */
export type TTransformSanitize = {
  readonly seenObjectsMap: Map<unknown, unknown>;
  readonly predicate?: TTransformPredicate;
} & TSanitizeTransformBase;
