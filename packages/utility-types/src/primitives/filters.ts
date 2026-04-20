/**
 * @utilType type
 * @name TFilterKeysByValue
 * @category Primitive Type Utilities
 * @description Extracts only the keys of an object whose values match a specific type.
 * @link #tfilterkeysbyvalue
 *
 * ## 🔑 TFilterKeysByValue — Type-Based Key Selector
 *
 * Scans an interface or object type and returns a union of keys that match the
 * provided value type `U`.
 *
 * @template T - The source object type.
 * @template U - The value type to filter by (e.g., string, number).
 *
 * @example
 * ```ts
 * interface Profile { id: number; bio: string; age: number; }
 * type NumericKeys = TFilterKeysByValue<Profile, number>;
 * // → 'id' | 'age'
 * ```
 */
type TFilterKeysByValue<T, U> = {
  // The "-?" strips the optionality during the mapping phase
  [K in keyof T]-?: NonNullable<T[K]> extends U ? K : never;
}[keyof T];

/**
 * @utilType type
 * @name TStripType
 * @category Primitive Type Utilities
 * @description Creates a new type by removing all properties that match a specific value type.
 * @link #tstriptype
 *
 * ## ✂️ TStripType — Type-Based Property Filter
 *
 * The inverse of a selective "Pick". It creates a new object type by excluding
 * any properties where the value extends type `U`.
 *
 * @template T - The source object type.
 * @template U - The value type to remove.
 *
 * @example
 * ```ts
 * interface Todo { id: string; completed: boolean; createdAt: Date; }
 * type WithoutBooleans = TStripType<Todo, boolean>;
 * // → { id: string; createdAt: Date; }
 * ```
 */
type TStripType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

export type { TFilterKeysByValue, TStripType };
