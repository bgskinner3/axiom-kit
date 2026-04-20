import type { TPrettify } from '../../primitives';

type TArrayItems<T extends Array<unknown>> =
  T extends Array<infer TItems> ? TItems : never;
/**
 * @utilType type
 * @name TFixedLengthArray
 * @category Advanced Type Utilities
 * @description Creates an immutable-length array type that prevents mutation methods like push or pop while preserving numeric indexing.
 * @link #tfixedlengtharray
 *
 * ## 📏 TFixedLengthArray — Immutable-Length Array Utility
 *
 * Transforms a tuple into an array-like structure that treats 'length' as a fixed
 * numeric literal. It effectively strips methods that would modify the array's size
 * (like `.push()`, `.pop()`, or `.splice()`), ensuring data integrity for fixed sets.
 *
 * @template T - A tuple type representing the fixed structure (e.g., [string, number]).
 *
 * @example
 * ```ts
 * type Coordinate = [number, number];
 * type FixedCoord = TFixedLengthArray<Coordinate>;
 *
 * const point: FixedCoord = [10, 20];
 * point.push(30); // ❌ Error: Property 'push' does not exist
 * ```
 */
type TFixedLengthArray<T extends unknown[]> = TPrettify<
  {
    // Filter to only keep numeric keys (indices)
    [K in keyof T as K extends `${number}` ? K : never]: T[K];
  } & {
    [Symbol.iterator]: () => IterableIterator<TArrayItems<T>>;
    length: number;
  }
>;

export type { TFixedLengthArray };
