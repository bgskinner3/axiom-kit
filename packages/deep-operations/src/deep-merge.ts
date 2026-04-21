import type { TTupleToIntersection } from '@axiom/utility-types';
import { isObject, isArray, isRecord, hasOwnProperty } from '@axiom/guards';
import { ObjectUtils } from '@axiom/core';

function shallowCopyForMerge<T>(value: T, pastCopies: unknown[]): T {
  if (isObject(value) && !pastCopies.includes(value)) {
    if (isArray(value)) {
      const copy = [...value];
      pastCopies.push(copy);
      // TODO: FIX AS CASTING
      return copy as unknown as T;
    }

    const copy = {
      __proto__: Object.getPrototypeOf(value),
      ...value,
    };
    pastCopies.push(copy);
    return copy;
  }
  return value;
}
function mergeHelper<T extends Record<string, unknown>>(
  target: T,
  source: Record<string, unknown>,
  pastCopies: unknown[],
  visited: Map<unknown, unknown>,
): T {
  let activeTarget: Record<string, unknown> = target;

  visited.set(source, activeTarget);

  if (Object.isExtensible && !Object.isExtensible(activeTarget)) {
    activeTarget = shallowCopyForMerge(activeTarget, pastCopies);
  }

  ObjectUtils.keys(source).forEach((sourceKey) => {
    const key = String(sourceKey);
    const sourceValue = source[key];

    // IDENTITY CHECK: If we've seen this source before,
    // link to the already-created target instead of recursing.
    if (visited.has(sourceValue)) {
      activeTarget[key] = visited.get(sourceValue);
      return;
    }

    if (hasOwnProperty(target, sourceKey)) {
      const targetValue = activeTarget[key];

      if (sourceValue !== targetValue) {
        const nextTarget = shallowCopyForMerge(targetValue, pastCopies);

        if (isRecord(nextTarget) && isRecord(sourceValue)) {
          /* prettier-ignore */ activeTarget[key] = mergeHelper(nextTarget, sourceValue, pastCopies, visited);
        } else {
          /* prettier-ignore */ activeTarget[key] = sourceValue;
        }
      }
    } else {
      activeTarget[key] = sourceValue;
    }
  });
  // TODO: FIX AS CASTING
  return activeTarget as T;
}

/**
 * @utilType util
 * @name mergeDeepArray
 * @category Deep Operations
 * @description Deeply merges an array of objects into a single object.
 * Successive objects in the array overwrite properties of previous ones.
 *
 * @example
 * ```ts
 * const base = { a: 1, b: { c: 2 } };
 * const extra = { b: { d: 3 }, e: 4 };
 * const result = mergeDeepArray([base, extra]);
 * // Result: { a: 1, b: { c: 2, d: 3 }, e: 4 }
 * ```
 *
 * @param {T[]} sources - An array of objects to merge.
 * @returns {T | Record<string, never>} A new object containing the merged result.
 */
export function mergeDeepArray<T extends Record<string, unknown>>(
  sources: T[],
): T | Record<string, never> {
  const first = sources[0];
  if (!first) return {};

  const pastCopies: unknown[] = [];
  const visited = new Map<unknown, unknown>();

  // 1. Create a blank shell or simple copy
  let target: T = shallowCopyForMerge(first, pastCopies);

  // 2. IMPORTANT: Use mergeHelper on the FIRST object itself
  // to re-wire its own circular references to the new target.
  target = mergeHelper(target, first, pastCopies, visited);

  for (let i = 1; i < sources.length; i++) {
    const source = sources[i];
    if (isObject(source)) {
      target = mergeHelper<T>(target, source, pastCopies, visited);
    }
  }

  return target;
}
/**
 * @utilType util
 * @name mergeDeep
 * @category Object Manipulators
 * @description Deeply merges multiple objects passed as individual arguments.
 * Uses type intersection to provide accurate return types for the combined results.
 *
 * @example
 * ```ts
 * const result = mergeDeep({ a: 1 }, { b: 2 }, { a: 3 });
 * // Result: { a: 3, b: 2 }
 * ```
 *
 * @param {...T} sources - Variadic list of objects to merge.
 * @returns {TTupleToIntersection<T>} The intersection of all input object types.
 */
export function mergeDeep<T extends Record<string, unknown>[]>(
  ...sources: T
): TTupleToIntersection<T> {
  // Casting to 'any' or 'never' here is usually necessary because
  // TypeScript struggles to map a tuple intersection back to the array implementation.
  // TODO: FIX AS CASTING
  return mergeDeepArray(sources) as TTupleToIntersection<T>;
}
