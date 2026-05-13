// import type { TToXalorArgs, ISolidRegistry } from '../models/types';
// import { XalethorService } from '../xalor-service';
// import { isMetaData, markAsSolid } from '../utils';

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
// ## 🏗️ Category 3: Generator API (The Factory Layer)

// **Role:**
// The generative framework used to construct new objects or reshape existing data to structurally align with a specified blueprint.

// ### Current Implementations

// - `toXalor({ mode: 'default', ... })`
//   Materializes a fresh "Zero-State" object utilizing primitive default values based on required fields.

// - `toXalor({ mode: 'mock', ... })`
//   Materializes stochastic (randomized) data that respects blueprint limits (`maxLength`, union choices) for UI testing and load testing.

// - `toXalor({ mode: 'clone', ... })`
//   Deep-copies data safely using your circularity protection seen map while physically scrubbing away properties missing from the TypeScript interface.

// - `toXalor({ mode: 'cast', ... })`
//   Coerces loose data into valid types (e.g., safely turning the string `"123"` into the number `123` if the blueprint demands it).

// ### Future Enterprise Additions

// - `toXalor({ mode: 'template', baselineData })`
//   Merges user properties into a type-safe template, injecting required defaults if values are omitted.

// - `toXalor({ mode: 'fixture', seed })`
//   Deterministic mock generation where providing a specific seed returns the exact same dataset every time—critical for reliable unit testing graphs.
