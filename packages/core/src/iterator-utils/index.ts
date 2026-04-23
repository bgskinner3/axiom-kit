/**
 * @utilType util
 * @name yieldFiltered
 * @category Iteration
 * @description Lazily yields items from a collection that pass a specific guard.
 * Zero memory allocation for intermediate arrays.
 */
export function* yieldFiltered<T, S extends T>(
  items: Iterable<T>,
  guard: (item: T) => item is S,
): Generator<S> {
  for (const item of items) {
    if (guard(item)) {
      yield item;
    }
  }
}

/**
 * @utilType util
 * @name yieldEntries
 * @category Iteration
 * @description Lazily yields [key, value] pairs from an object that pass a type guard.
 *
 * @example
 * ```ts
 * interface Device {
 *   id: number;
 *   model: string;
 *   isOnline: boolean;
 * }
 *
 * const laptop: Device = { id: 101, model: "X1", isOnline: true };
 *
 * // Example: A guard that only yields string-based properties
 * const isStringProp = (key: keyof Device, value: any): key is "model" =>
 *   typeof value === 'string';
 *
 * const entries = yieldEntries(laptop, isStringProp);
 *
 * for (const [key, value] of entries) {
 *   console.log(key);   // type: "model"
 *   console.log(value); // type: string
 * }
 * ```
 */
export function* yieldEntries<T extends object, K extends keyof T>(
  obj: T,
  guard: (key: keyof T, value: T[keyof T]) => key is K,
): Generator<[K, T[K]]> {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (guard(key, obj[key])) {
        yield [key, obj[key]];
      }
    }
  }
}
