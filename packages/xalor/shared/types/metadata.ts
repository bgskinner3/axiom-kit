import {
  IS_SOLID_SHAPE_KINDS_CONFIG,
  IS_SOLID_CONFIG_ITEMS,
} from '../constants';
import type { TSolidShape } from './blueprints';
import type { TSolidError } from './vault';

/**
 * 🛰️ TSOLID METADATA
 * The master transport object for type DNA.
 */
export type TSolidMetadata<K extends string = string, T = unknown> = {
  key: K;
  area: string;
  version: string;
  shape: TSolidShape;
  readonly _ghost?: T;
  symbolName?: string;
  filePath?: string;
  typeName?: string;
};
/**
 * 💎 TSTRICT SOLID METADATA
 *
 * ROLE:
 * The "Final Form" of a type's DNA within the Vault Service.
 *
 * STRATEGY:
 * This type acts as the post-extraction, pre-registration contract.
 * It takes the loose `TSolidMetadata` and enforces absolute presence of
 * all traceability fields (filePath, typeName, etc.).
 *
 * WHY:
 * Ensures the Runtime Engine and Auditor never encounter "undefined"
 * when attempting to resolve GPS coordinates or structural blueprints.
 * It is the internal standard for all Triple-KV drawer operations.
 */
export type TStrictSolidMetaData = {
  // --- additional type move here ----
} & Required<Omit<TSolidMetadata, '_ghost'>>;

/**
 * 💎 TSOLID BRANDED
 * A nominal type wrapper that "seals" validated data.
 */
// declare const SolidBrand: unique symbol;
// export type TSolidBranded<K extends string, T> = T & {
//   readonly [SolidBrand]: K;
// };

export type TSolidBranded<K extends string, T> = T & {
  readonly [IS_SOLID_CONFIG_ITEMS.solidBrandKey]: K;
};

/**
 * 🌊 VAULT SYNC PAYLOAD
 * Replica of TSolidMetadata used by the transformer pipeline for
 * syncing and transporting metadata between systems.
 *
 * This format mirrors the core metadata structure but includes
 * additional resolver fields (filePath, typeName) required for
 * serialization, mapping, and vault synchronization.
 */
export type TVaultSyncPayload = {
  readonly filePath: string;
  readonly typeName: string;
  readonly key: string;
  readonly area: string;
  readonly symbolName: string;
  readonly shape: TSolidShape;
  readonly version: string;
};
/**
 * SHAPE KINDS
 * The exhaustive list of supported type categories in the Solid system.
 */
export type TSolidShapeKinds = keyof typeof IS_SOLID_SHAPE_KINDS_CONFIG;

/**
 * 🛰️ TVALIDATION_CONTEXT
 *
 * ROLE:
 * The live state tracker for Category 2 (Validation API) execution passes.
 * Collects structural errors linearly, manages real-time nested path tracking,
 * and implements graph safety limits to enforce memory boundary thresholds.
 *
 * STRATEGY:
 * - Cyclic Memory Guard: Uses the 'seen' Map to track evaluated object references
 *   against structural schemas, short-circuiting infinite loops on graph loops.
 * - Flat Diagnostics Array: Gathers violation issues synchronously, avoiding complex
 *   exception state jumps to preserve sub-microsecond validation speeds.
 */
export type TValidationContext = {
  seen: Map<unknown, Set<TSolidShape>>;
  path: string;
  errors: TSolidError[];
  currentKey?: string;
  depth: number;
};
