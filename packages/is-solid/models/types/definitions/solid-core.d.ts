// models/types/definitions/solid-core.d.ts

/**
 * PILLAR 3: THE AMBIENT BRAND
 * Static definition that allows users to "Solidify" types.
 */
declare global {
  type TSolid<K extends string, T> = T & {
    readonly __brand: K;
  };
}

export {};
// /**
//  * Branding type for the 'isSolid' guard.
//  */
// declare const SolidBrand: unique symbol;
// export type TSolid<K extends string, T> = T & {
//   readonly [SolidBrand]: K;
// };
