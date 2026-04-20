/**
 * @utilType type
 * @name TUnpackObject
 * @category Primitive Type Utilities
 * @description Extracts a union of all possible property values from an object, interface, or array.
 * @link #tunpackobject
 *
 * ## 📦 TUnpackObject — Property Value Extractor
 *
 * Extracts a union of all values contained within an object or array.
 * Perfect for creating types based on the data within a constant map or config object.
 *
 * @template T - The source object or array type.
 */
type TUnpackObject<T> =
  T extends Array<infer U> ? U : T extends object ? T[keyof T] : never;

/**
 * @utilType type
 * @name TWriteable
 * @category Primitive Type Utilities
 * @description Removes the 'readonly' modifier from the top-level properties of a type to allow mutation.
 * @link #twriteable
 *
 * ## ✏️ TWriteable — Shallow Mutability Utility
 *
 * Removes the `readonly` constraint from the immediate keys of an object.
 * This allows you to modify properties on an object that was previously marked as immutable.
 *
 * @template T - The type to make mutable.
 */
type TWriteable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * @utilType type
 * @name TEnsure
 * @category Primitive Type Utilities
 * @description Makes a specific subset of optional keys required while preserving the rest of the object structure.
 * @link #tensure
 *
 * ## 🔒 TEnsure — Selective Requirement Utility
 *
 * Takes a type and forces specific keys (`K`) to be required. This is highly
 * useful for validation layers where you know certain optional fields have been filled.
 *
 * @template T - The source type.
 * @template K - The keys to be made required.
 */
type TEnsure<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type { TEnsure, TUnpackObject, TWriteable };
