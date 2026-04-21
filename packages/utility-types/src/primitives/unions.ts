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
  
/**
 * @internal
 * Converts a readonly array of strings into a union of template literal patterns.
 * Example: ['data-', 'on'] -> `data-${string}` | `on${string}`
 */
type TPrefixUnion<T extends readonly string[]> = T extends readonly [infer F, ...infer R]
  ? F extends string
    ? `${F}${string}` | TPrefixUnion<R extends readonly string[] ? R : []>
    : never
  : never;
export type { TUnionToIntersection, TPrefixUnion };
