import type { ISolidRegistry } from './definitions';
import type { TTypeGuard, TSolidBranded, TXalorAuditReport } from './shared';

// ====================================================================
// ====================================================================
// GENERATOR XALOR API TYPES
// ====================================================================
// ====================================================================

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
  parse: TSolidBranded<K, ISolidRegistry[K]>;
  parseAsync: Promise<TSolidBranded<K, ISolidRegistry[K]>>;
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
