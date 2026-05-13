import type { ISolidRegistry } from './definitions';
import type {
  TTypeGuard,
  TAssert,
  TXalorRuleKind,
  TSolidBranded,
  TXalorAuditReport,
} from './shared';

// type TIsXalorModes = 'meta' | 'guard' | 'parse' | 'parseAsync';

export type TToXalorArgs<K extends keyof ISolidRegistry> =
  | { mode: 'default'; injectedKey: K; data?: never } // The "Zero-Value" Object
  | { mode: 'mock'; injectedKey: K; data?: never } // Random/Realistic Data
  | { mode: 'clone'; injectedKey: K; data: unknown } // Deep Clone + Strip extra keys
  | { mode: 'cast'; injectedKey: K; data: unknown }; // Force-fix data to fit shape

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

// HELPERS

export type TReturnValidationTools<K extends keyof ISolidRegistry> = {
  guard: TTypeGuard<ISolidRegistry[K]>;
  assert: TAssert<ISolidRegistry[K]>;
};

export type TRuleAuditorMapper = readonly [readonly string[], TXalorRuleKind][];
