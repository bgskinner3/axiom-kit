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
 *
 * 💎 FIX: Added <K, T> generics to allow the Emitter
 * to link the metadata to the specific Type in the IDE.
 */
export type TSolidMetadata<K extends string = string, T = unknown> = {
  key: K; // 👈 Now uses the Generic K
  area: string;
  version: string;
  shape: TSolidShape;
  readonly _ghost?: T;
  symbolName?: string;
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
};

export type TSolidVaultMap = {
  /**
   * @deprecated
   */
  items: Map<string, TSolidMetadata>;
  /**
   * 1. BLUEPRINTS (The Shape Map)
   * The JSON-ified structure used for validation and defaults.
   */
  blueprints: Map<string, TSolidShape>;

  /**
   * 2. MANIFEST (The Area Map)
   * Tracks 'file:line' for every key to satisfy Commandment VI (Traceability).
   */
  manifest: Map<string, string>;

  /**
   * 3. REGISTRY (The Symbol Map)
   * Maps keys back to TS names (e.g., 'User') to power the IDE Bridge.
   */
  registry: Map<string, string>;

  /**
   * 4. ERROR CACHE
   * Stores the breadcrumb failure reports from runtime checks.
   */
  errors: Map<string, TSolidError[]>;
};
/**
 * BRANDING TYPES WAS PART OF OUR ORIGINAL idea
 * helpw ith tracking and managing etc ....
 */
declare const SolidBrand: unique symbol;
export type TSolid<K extends string, T> = T & {
  readonly [SolidBrand]: K;
};

/**
 * SHAPE KINDS
 * The exhaustive list of supported type categories in the Solid system.
 */
export type TSolidShapeKinds = keyof typeof IS_SOLID_SHAPE_KINDS_CONFIG;
