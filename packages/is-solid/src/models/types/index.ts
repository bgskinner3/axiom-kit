import type { TSolidShape } from '../../../transformer/types';
/**
 * The runtime representation of a Solidified Type.
 */
export type TSolidMetadata = {
  key: string;
  area: string;
  version: string;
  shape: TSolidShape;
};

/**
 * The type-safe interface for our Global Registry.
 */
export type TSolidVaultMap = {
  /** The actual Type Database */
  items: Map<string, TSolidMetadata>;
  /** The Error Cache */
  errors: Map<string, TSolidError[]>;
};

/**
 * Branding type for the 'isSolid' guard.
 */
declare const SolidBrand: unique symbol;
export type TSolid<K extends string, T> = T & {
  readonly [SolidBrand]: K;
};

export type TValidationContext = {
  // Map of data objects to the shape they were validated against
  seen: Map<unknown, Set<TSolidShape>>;
  // Path for error reporting (e.g., "user.profile.id")
  path: string;
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
  /** The file:line:char where this type was defined */
  area?: string;
};
