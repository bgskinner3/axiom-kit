import type { TToXalorArgs, ISolidRegistry } from '../models/types';
import { XalethorService } from '../xalor-service';
import { isMetaData, markAsSolid } from '../utils';

// /** VII. DEFAULT */
// export function toXalor<K extends keyof ISolidRegistry>(
//   params: { mode: 'default', injectedKey: K }
// ): ISolidRegistry[K];

// /** VIII. MOCK */
// export function toXalor<K extends keyof ISolidRegistry>(
//   params: { mode: 'mock', injectedKey: K }
// ): ISolidRegistry[K];

// /** IX. CLONE / SCRUB */
// export function toXalor<K extends keyof ISolidRegistry>(
//   params: { mode: 'clone', injectedKey: K, data: unknown }
// ): ISolidRegistry[K];

// # 🧠 construction

// ### What it represents:

// Generated outputs derived from type definitions.

// ### Must contain ONLY:

// - `getSolidDefault`

// ### Future additions:

// - `getSolidMock`
// - `getSolidSchema`

// ### Responsibility:

// - Convert type metadata into usable runtime objects
// - Provide zero-value or synthetic data structures

// ### Do NOT include:

// - validation logic
// - registry access logic
// - mutation or state management
//   export function getSolid(key: string): TSolidMetadata | undefined {
//   return Registry.get(key);
//   }
