// import type { TFixedLengthArray } from '@axiom/utility-types';

export class ArrayUtils {
  /**
   * @utilType util
   * @name includes
   * @category ArrayUtils
   * @description Type-safe wrapper for Array.prototype.includes that acts as a type guard.
   * @link #includes
   */
  static includes<T extends U, U>(arr: ReadonlyArray<T>, el: U): el is T {
    return arr.includes(el as T);
  }

  /**
   * @utilType util
   * @name createFixedLengthArray
   * @category ArrayUtils
   * @description Validates and returns an array with a fixed numeric length at the type level.
   * @link #createfixedlengtharray
   */
  // static createFixedLengthArray<T>(
  //   items: T[],
  //   length: number,
  // ): TFixedLengthArray<T[]> {
  //   if (items.length !== length) {
  //     throw new Error(`Array must have exactly ${length} elements`);
  //   }
  //   return items satisfies TFixedLengthArray<T[]>;
  // }

  /**
   * @utilType util
   * @name readAllItems
   * @category ArrayUtils
   * @description Returns a shallow copy of an array to prevent unintended mutations of the original.
   * @link #readallitems
   */
  static readAllItems<T>(arr: ReadonlyArray<T>): T[] {
    return [...arr]; // Simply returns a shallow copy of the array
  }
  /**
   * @utilType util
   * @name map
   * @category ArrayUtils
   * @description Safe map wrapper providing consistent type inference for ReadonlyArrays.
   * @link #map
   */
  static map<T, U>(
    arr: ReadonlyArray<T>,
    fn: (value: T, index: number, array: ReadonlyArray<T>) => U,
  ): U[] {
    return arr.map(fn);
  }
  /**
   * @utilType util
   * @name forEachUnion
   * @category ArrayUtils
   * @description Iterates over single arrays or unions of arrays, flattening them for uniform processing.
   * @link #foreachunion
   *
   * @typeParam T - The type of array elements.
   *
   * @param arr - The array or array of arrays to iterate over.
   * @param fn - Callback executed for each element.
   *
   * @example
   * // Single array
   * const numbers = [1, 2, 3];
   * ArrayUtils.forEachUnion(numbers, (num, idx) => {
   *   console.log(num * 2, idx);
   * });
   *
   * @example
   * // Union of arrays
   * const arrays: number[][] = [[1, 2], [3, 4]];
   * ArrayUtils.forEachUnion(arrays, (num, idx) => {
   *   console.log(num * 2, idx);
   * });
   */
  static forEachUnion<T>(
    arr: T[] | T[][],
    fn: (item: T, index: number) => void,
  ): void {
    // Flatten the array if it’s an array of arrays
    const flatArr: T[] = Array.isArray(arr[0])
      ? ([] as T[]).concat(...(arr as T[][]))
      : (arr as T[]);
    flatArr.forEach(fn);
  }
  /**
   * @utilType util
   * @name forEach
   * @category ArrayUtils
   * @description Safe forEach wrapper with correct type inference for ReadonlyArrays.
   * @link #foreach
   */
  static forEach<T>(
    arr: ReadonlyArray<T>,
    fn: (value: T, index: number, array: ReadonlyArray<T>) => void,
  ): void {
    arr.forEach(fn);
  }

  /**
   * @utilType util
   * @name reduce
   * @category ArrayUtils
   * @description Safe reduce wrapper with correct type inference for ReadonlyArrays.
   * @link #reduce
   */
  static reduce<T, U>(
    arr: ReadonlyArray<T>,
    fn: (
      accumulator: U,
      current: T,
      index: number,
      array: ReadonlyArray<T>,
    ) => U,
    initialValue: U,
  ): U {
    return arr.reduce(fn, initialValue);
  }
  /**
   * @utilType util
   * @name flat
   * @category ArrayUtils
   * @description Type-safe flat for 1-level nested arrays using reduce.
   * @link #flat
   */
  static flat<T>(arr: ReadonlyArray<T | T[]>): T[] {
    return arr.reduce<T[]>((acc, val) => acc.concat(val as T | T[]), []);
  }

  /**
   * @utilType util
   * @name flatMap
   * @category ArrayUtils
   * @description Type-safe flatMap implementation for environments lacking native support.
   * @link #flatmap
   */
  static flatMap<T, U>(
    arr: ReadonlyArray<T>,
    fn: (item: T, index: number) => U | U[],
  ): U[] {
    return arr.reduce<U[]>((acc, item, i) => {
      const result = fn(item, i);
      return acc.concat(result as U[]);
    }, []);
  }

  /**
   * @utilType util
   * @name filter
   * @category ArrayUtils
   * @description Type-safe filter wrapper that preserves TypeScript type guards and inference.
   * @link #filter
   */
  static filter<T, S extends T>(
    arr: ReadonlyArray<T>,
    predicate: (value: T, index: number, array: ReadonlyArray<T>) => value is S,
  ): S[];
  static filter<T>(
    arr: ReadonlyArray<T>,
    predicate: (value: T, index: number, array: ReadonlyArray<T>) => boolean,
  ): T[];
  static filter<T>(
    arr: ReadonlyArray<T>,
    predicate: (value: T, index: number, array: ReadonlyArray<T>) => boolean,
  ): T[] {
    return arr.filter(predicate);
  }
  /**
   * @utilType util
   * @name filterNonNullable
   * @category ArrayUtils
   * @description Shortcut utility to filter out all null and undefined values from an array.
   * @link #filternonnullable
   */
  static filterNonNullable<T>(arr: ReadonlyArray<T | null | undefined>): T[] {
    return ArrayUtils.filter(arr, (item): item is T => item != null);
  }
  /**
   * @utilType util
   * @name every
   * @category ArrayUtils
   * @description Safe every wrapper that supports both Type Guards and standard boolean checks.
   * @link #every
   */
  static every<T, S extends T>(
    arr: ReadonlyArray<T>,
    predicate: (value: T, index: number, array: ReadonlyArray<T>) => value is S,
  ): arr is ReadonlyArray<S>;
  static every<T>(
    arr: ReadonlyArray<T>,
    predicate: (value: T, index: number, array: ReadonlyArray<T>) => boolean,
  ): boolean;
  static every<T>(
    arr: ReadonlyArray<T>,
    predicate: (value: T, index: number, array: ReadonlyArray<T>) => boolean,
  ): boolean {
    return arr.every(predicate);
  }
  /**
   * @utilType util
   * @name some
   * @category ArrayUtils
   * @description Safe some wrapper with correct type inference for ReadonlyArrays.
   * @link #some
   */
  static some<T>(
    arr: ReadonlyArray<T>,
    predicate: (value: T, index: number, array: ReadonlyArray<T>) => boolean,
  ): boolean {
    return arr.some(predicate);
  }
}
