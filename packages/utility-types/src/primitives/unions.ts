/**
 * @utilType type
 * @name TUnionToIntersection
 * @category Primitive Type Utilities
 * @description Transforms a union type (A | B) into an intersection type (A & B) using function parameter variance.
 * @link #tuniontointersection
 *
 * ## 🔗 TUnionToIntersection — Type-Safe Union Converter
 *
 * Transforms a union type (`A | B`) into an intersection type (`A & B`).
 * This is a powerful advanced utility that leverages how TypeScript handles
 * function parameter positions to collapse multiple types into one.
 *
 * @template U - The union to be transformed.
 */
type TUnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type { TUnionToIntersection };
