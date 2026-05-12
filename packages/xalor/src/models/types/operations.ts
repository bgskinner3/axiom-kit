import type { ISolidRegistry } from './definitions';
import type {
  TSolidMetadata,
  TStrictSolidMetaData,
  TSolidBranded,
} from './shared';

// type TIsXalorModes = 'meta' | 'guard' | 'parse' | 'parseAsync';

export type TIsXalorArgs<K extends keyof ISolidRegistry> =
  | /* prettier-ignore */ { mode?: never; injectedKey?: never; data?: undefined; injected?: TSolidMetadata } // Registration
  | /* prettier-ignore */ { mode: 'meta'; injectedKey: K; data?: never; injected?: never } // Resolution
  | /* prettier-ignore */ { mode: 'guard'; injectedKey: K; data: unknown; injected?: never } // Validation
  | /* prettier-ignore */ { mode: 'assert'; injectedKey: K; data: unknown; injected?: never } // Assertion
  | /* prettier-ignore */ { mode: 'parse'; injectedKey: K; data: unknown }
  | /* prettier-ignore */ { mode: 'parseAsync'; injectedKey: K; data: unknown };

export type TReturnTypeIsXalor<K extends keyof ISolidRegistry> =
  | void
  | boolean
  | TStrictSolidMetaData
  | TSolidBranded<K, ISolidRegistry[K]>
  | Promise<TSolidBranded<K, ISolidRegistry[K]>>;

export type TToXalorArgs<K extends keyof ISolidRegistry> =
  | { mode: 'default'; injectedKey: K; data?: never } // The "Zero-Value" Object
  | { mode: 'mock'; injectedKey: K; data?: never } // Random/Realistic Data
  | { mode: 'clone'; injectedKey: K; data: unknown } // Deep Clone + Strip extra keys
  | { mode: 'cast'; injectedKey: K; data: unknown }; // Force-fix data to fit shape
