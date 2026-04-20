/**
 * @utilType type
 * @name TPrettify
 * @category Primitive Type Utilities
 * @description Flattens complex type intersections into a single readable object for better IDE IntelliSense.
 * @link #tprettify
 *
 */
type TPrettify<T> = { [K in keyof T]: T[K] } & {};
/**
 * @utilType type
 * @name TMerge
 * @category Primitive Type Utilities
 * @description Merges two types, allowing properties in the second type to override those in the first.
 * @link #tmerge
 *
 * ## 🤝 TMerge — Type Override Utility
 *
 * Combines two object types. If both types share a key, the type from the second
 * object (O2) takes precedence. Useful for defining "Update" or "Patch" types.
 *
 * @template O1 - The base object type.
 * @template O2 - The overriding object type.
 */
type TMerge<O1, O2> = O2 & Omit<O1, keyof O2>;

/**
 * @utilType type
 * @name TCreateDiff
 * @category Primitive Type Utilities
 * @description Identifies the unique properties that exist in one type or the other, but not both.
 * @link #tcreatediff
 *
 * ## ⚖️ TCreateDiff — Symmetric Difference Utility
 *
 * Extracts the properties that are unique to each type. If a key exists in both `T`
 * and `U`, it is excluded from the resulting type.
 *
 * @template T - The first type.
 * @template U - The second type.
 */
type TCreateDiff<T, U> = Omit<T, keyof U> & Omit<U, keyof T>;

/**
 * @utilType type
 * @name TBigIntToggle
 * @category Primitive Type Utilities
 * @description Bidirectionally toggles a type between bigint and string for safe JSON serialization mapping.
 * @link #tbiginttoggle
 *
 * ## 🔄 TBigIntToggle — Serialization Transformer
 *
 * A utility for handling BigInt IDs. It maps `bigint` to `string` for frontend
 * consumption (JSON safety) and maps `string` back to `bigint` for database operations.
 *
 * @template T - The type to toggle (must be string or bigint).
 */
type TBigIntToggle<T extends string | bigint> = T extends string
  ? bigint
  : string;

export type { TCreateDiff, TMerge, TPrettify, TBigIntToggle };
