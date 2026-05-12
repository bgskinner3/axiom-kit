import { IS_SOLID_SHAPE_KINDS_CONFIG } from '../../constants';

export type TSolidShape =
  | /* prettier-ignore */ { kind: 'primitive'; type: 'string' | 'number' | 'boolean' | 'bigint' | 'unknown'; }
  | /* prettier-ignore */ { kind: 'literal'; value: string | number | boolean }
  | /* prettier-ignore */ { kind: 'union'; values: TSolidShape[] }
  | /* prettier-ignore */ { kind: 'intersection'; parts: TSolidShape[] }
  | /* prettier-ignore */ { kind: 'branded'; name: string; base: TSolidShape }
  | /* prettier-ignore */ { kind: 'object'; properties: Record<string, TSolidObjectRawShape> }
  | /* prettier-ignore */ { kind: 'array'; items: TSolidShape }
  | /* prettier-ignore */ { kind: 'reference'; name: string };

export type TSolidObjectRawShape = {
  shape: TSolidShape;
  optional: boolean;
  name: string;
};

/**
 * TSolidMetadata
 * -----
 * @KEY - unique identifier used as the UUID to locate this entity in Vault systems
 * @example: "BigTEst"
 *
 * @FILEPATH - absolute path to the source file where this symbol was extracted
 * @example: "/Users/.../is-xalor.test.ts"
 *
 * @AREA - precise source location (file:line:column) where this symbol was found
 * @example: "/Users/.../is-xalor.test.ts:141:5"
 *
 * @SYMBOLNAME - original TypeScript symbol name from the source code
 * @example: "BigTEst"
 *
 * @TYPENAME - raw TypeScript type string as written in code before parsing
 * @example: "{ yourTingWinner: string; moreStuff: { id: string } }"
 *
 * @SHAPE - JSON-like structural blueprint of the TypeScript type after parsing
 * @example: { kind: "object", properties: ... }
 *
 * @VERSION - version of the Solid/Vault extraction system that produced this metadata
 * @example: "1.0.0"
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

export type TSolidError = {
  key: string;
  /** The breadcrumb path to the failure (e.g., "settings.theme") */
  path: string;
  /** The human-readable issue */
  message: string;
  /** What the blueprint required */
  expected: string | TSolidShape;
  /** What the data actually contained */
  received: unknown;
  /** The file:line:char where this export type was defined processor */
  area?: string;
  origin?: string | TVaultManifestEntry;
};
/**
 * 📦 PERSISTENCE SHAPES
 * These are the objects stored inside the Vault drawers.
 */
export type TVaultManifestEntry = { area: string; filePath: string };
export type TVaultRegistryEntry = { symbolName: string; typeName: string };

/**
 * 🗄️ TRIPLE-KV SNAPSHOT (The "Bunker" Schema)
 * Used for JSON Persistence (Stage 4) and Hydration (Stage 5).
 */
export type TTripleKV = {
  blueprints: Record<string, TSolidShape>;
  manifest: Record<string, TVaultManifestEntry>;
  registry: Record<string, TVaultRegistryEntry>;
  version: string;
};

export type TSolidVaultMap = {
  /** 1. BLUEPRINTS: Structural Logic for validation/defaults. */
  blueprints: Map<string, TSolidShape>;

  /** 2. MANIFEST: Traceability data (GPS + FilePath). */
  manifest: Map<string, TVaultManifestEntry>;

  /** 3. REGISTRY: IDE Identity (SymbolName + DNA). */
  registry: Map<string, TVaultRegistryEntry>;

  /** 4. ERROR CACHE: Runtime failure reports. */
  errors: Map<string, TSolidError[]>;

  /** 🔄 INTERNAL: Tracks if Stage 5 Hydration has completed. */
  _isHydrated?: boolean;

  /** @deprecated Use resolve(key) to reconstruct metadata from drawers. */
  // items: Map<string, TSolidMetadata>;
};
/**
 * BRANDING TYPES WAS PART OF OUR ORIGINAL idea
 * helpw ith tracking and managing etc ....
 */
declare const SolidBrand: unique symbol;
export type TSolidBranded<K extends string, T> = T & {
  readonly [SolidBrand]: K;
};
export type TStrictSolidMetaData = {
  // --- additional type move here ----
} & Required<Omit<TSolidMetadata, '_ghost'>>;
/**
 * SHAPE KINDS
 * The exhaustive list of supported type categories in the Solid system.
 */
export type TSolidShapeKinds = keyof typeof IS_SOLID_SHAPE_KINDS_CONFIG;
