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
export type TSolidVaultMap = Map<string, TSolidMetadata>;

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
