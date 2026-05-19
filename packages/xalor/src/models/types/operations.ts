import type { ISolidRegistry } from './definitions';
import type {
  TTypeGuard,
  TSolidBranded,
  TXalorAuditReport,
} from '../../../shared';
import type {
  TGenerateXalorModes,
  TValidateXalorModes,
  TTransformXalorModes,
} from '../../../shared';

// ====================================================================
// ====================================================================
// GENERATOR XALOR API TYPES
// ====================================================================
// ====================================================================

export type TGenerateXalorResultMap<K extends keyof ISolidRegistry> = {
  default: TSolidBranded<K, ISolidRegistry[K]>;
  mock: TSolidBranded<K, ISolidRegistry[K]>;
  clone: TSolidBranded<K, ISolidRegistry[K]>;
  cast: TSolidBranded<K, ISolidRegistry[K]>;
};
export type TGenerateXalorStrategyEngine<K extends keyof ISolidRegistry> = {
  readonly [P in TGenerateXalorModes]: (
    k: K,
    d: unknown,
  ) => TGenerateXalorResultMap<K>[P];
};
export type TGenerateXalorReturn<
  K extends keyof ISolidRegistry,
  M extends TGenerateXalorModes,
> = TGenerateXalorResultMap<K>[M];

// ====================================================================
// ====================================================================
// VALIDATE XALOR API TYPES
// ====================================================================
// ====================================================================

export type TValidateXalorResultMap<K extends keyof ISolidRegistry> = {
  guard: TTypeGuard<ISolidRegistry[K]>;
  assert: void;
  parse: ISolidRegistry[K];
  parseAsync: Promise<ISolidRegistry[K]>;
  audit: TXalorAuditReport;
};
export type TValidateXalorReturn<
  K extends keyof ISolidRegistry,
  M extends TValidateXalorModes,
> = TValidateXalorResultMap<K>[M];

export type TTValidateStrategyEngine<K extends keyof ISolidRegistry> = {
  readonly [Mode in TValidateXalorModes]: (
    k: K,
    d: unknown,
  ) => TValidateXalorResultMap<K>[Mode];
};

// ====================================================================
// ====================================================================
// TRANSFORM XALOR API TYPES
// ====================================================================
// ====================================================================
// I. DISCRIMINATED CONTEXTS (Explicit Mode Associations)
export type TPickOmitContext<K extends keyof ISolidRegistry> = {
  readonly mode: 'pick' | 'omit';
  readonly data: unknown;
  readonly keys: readonly (keyof ISolidRegistry[K])[];
};
export type TRenameContext = {
  readonly mode: 'rename';
  readonly data: unknown;
  readonly mappings: Record<string, string>;
};
export type TMergeContext = {
  readonly mode: 'merge';
  readonly dataOne: unknown;
  readonly dataTwo: unknown;
};
export type TSimpleDataContext<M extends 'flatten'> = {
  readonly mode: M;
  readonly data: unknown;
};
export type TTransformContext<K extends keyof ISolidRegistry> =
  | TPickOmitContext<K>
  | TRenameContext
  | TMergeContext
  | TSimpleDataContext<'flatten'>;

export type TTransformXalorResultMap<K extends keyof ISolidRegistry> = {
  readonly pick: ISolidRegistry[K];
  readonly omit: ISolidRegistry[K];
  readonly rename: ISolidRegistry[K];
  readonly merge: ISolidRegistry[K];
  /** 📊 Flattened paths result in flat dot-notation analytical dictionaries */
  readonly flatten: Record<string, string | number | boolean>;
};

/** 🎛️ AUTOMATED RETURN TYPE DISPATCHER MAP */
export type TTransformXalorReturn<
  K extends keyof ISolidRegistry,
  M extends TTransformXalorModes,
> = TTransformXalorResultMap<K>[M & keyof TTransformXalorResultMap<K>];

/**
 * 🗺️ FIXED STRATEGY ENGINE CONTRACT
 * Enforces that every method in the lookup map accepts identical argument shapes uniformly.
 */
export type TTransformStrategyEngine<K extends keyof ISolidRegistry> = {
  readonly [Mode in keyof TTransformXalorResultMap<K>]: (
    key: K,
    ctx: TTransformContext<K>,
  ) => TTransformXalorResultMap<K>[Mode];
};

// ====================================================================
// ====================================================================
// Build XALOR API TYPES
// ====================================================================
// ====================================================================
