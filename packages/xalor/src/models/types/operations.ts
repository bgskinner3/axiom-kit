import type { ISolidRegistry } from './definitions';
import type { TTypeGuard, TSolidBranded, TXalorAuditReport } from './shared';

// ====================================================================
// ====================================================================
// GENERATOR XALOR API TYPES
// ====================================================================
// ====================================================================

export type TGenerateXalorModes = 'default' | 'mock' | 'clone' | 'cast';
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

export type TValidateXalorModes =
  | 'guard'
  | 'assert'
  | 'parse'
  | 'parseAsync'
  | 'audit';

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
    data: unknown,
    key: K,
  ) => TValidateXalorResultMap<K>[Mode];
};

// ====================================================================
// ====================================================================
// TRANSFORM XALOR API TYPES
// ====================================================================
// ====================================================================

// ====================================================================
// ====================================================================
// Build XALOR API TYPES
// ====================================================================
// ====================================================================
