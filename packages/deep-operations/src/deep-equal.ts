import {
  isInstanceOf,
  isDefinedObject,
  isArray,
  isKeyInObject,
} from '@bgskinner2/axiom-kit-guards';
import { ObjectUtils } from '@bgskinner2/axiom-kit-core';
/**
 * @utilType util
 * @name areDeepEqual
 * @category Deep Operations
 * @description Performs a recursive equality check between two values.
 * Supports primitives, nested objects, arrays, and Date objects.
 * Handles NaN and signed zeros correctly via ObjectUtils.is.
 * @link #aredeepequal
 *
 * @param left - The source value to compare.
 * @param right - The value to compare against the source.
 * @returns A boolean indicating if the values are structurally identical.
 *
 * @example
 * const a = { user: { id: 1, tags: [1, 2] } };
 * const b = { user: { id: 1, tags: [1, 2] } };
 * areDeepEqual(a, b); // true
 */
export function areDeepEqual<T>(left: T, right: unknown): right is T {
  // 1. Primitive / reference equality
  if (ObjectUtils.is(left, right)) {
    return true;
  }

  // 2. Date comparison
  if (isInstanceOf(left, Date) && isInstanceOf(right, Date)) {
    return left.getTime() === right.getTime();
  }

  // 3. Array comparison
  if (isArray(left) && isArray(right)) {
    if (left.length !== right.length) return false;

    for (let i = 0; i < left.length; i++) {
      if (!areDeepEqual(left[i], right[i])) return false;
    }

    return true;
  }

  // 4. Object comparison
  if (isDefinedObject(left) && isDefinedObject(right)) {
    const leftKeys = Reflect.ownKeys(left);
    const rightKeys = Reflect.ownKeys(right);

    if (leftKeys.length !== rightKeys.length) {
      return false;
    }

    for (const key of leftKeys) {
      if (!isKeyInObject(key)(right)) return false;

      if (
        !areDeepEqual(ObjectUtils.get(left, key), ObjectUtils.get(right, key))
      ) {
        return false;
      }
    }

    return true;
  }

  return false;
}
