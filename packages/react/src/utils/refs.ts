import { isFunction } from '@axiom/guards';
import { isRefObject, isRef } from '../guards';
import type { RefCallback, Ref } from 'react';
import { yieldFiltered } from '@axiom/core';

/**
 * @utilType util
 * @name mergeRefs
 * @category Processors React
 * @description Consolidates multiple React refs (callback or object) into a single functional ref.
 * @link #mergerefs
 *
 * @example
 * ```ts
 * const combinedRef = mergeRefs(forwardedRef, internalRef);
 * <div ref={combinedRef} />
 * ```
 *
 * @param refs - One or more React refs (callback or object refs)
 * @returns A single callback that updates all provided refs with the same value
 */
export const mergeRefs = <T>(
  ...refs: (Ref<T> | undefined)[]
): RefCallback<T> => {
  return (value: T | null) => {
    // 🚀 We pipe the refs through the lazy filter
    for (const ref of yieldFiltered<Ref<T> | undefined, Ref<T>>(refs, isRef)) {
      if (isFunction(ref)) {
        ref(value);
      } else if (isRefObject(ref)) {
        ref.current = value;
      }
    }
  };
};

/**
 * @utilType util
 * @name getRefCurrent
 * @category Processors React
 * @description Safely extracts the current value from either RefObjects or ForwardedRefs.
 * @link #getrefcurrent
 *
 * ## ⚓ getRefCurrent — Safe Ref Access
 *
 * Supports RefObjects (useRef) and ForwardedRefs. Useful in effects to avoid
 * repetitive null-checks and type casting.
 */

export function getRefCurrent<T>(ref: Ref<T> | undefined | null): T | null {
  if (!ref) return null;

  if (isRefObject(ref)) {
    return ref.current;
  }

  // Callback refs (functions) don't have a 'current' property we can synchronously pull
  return null;
}
// /**
//  * @category DeepOperations
//  * @description Lazily crawls a tree structure. Memory usage stays flat
//  * regardless of tree depth.
//  */
// export function* walkTree<T extends { children?: T[] }>(tree: T): Generator<T> {
//   yield tree;
//   if (tree.children) {
//     for (const child of tree.children) {
//       yield* walkTree(child); // 'yield*' delegates to the next generator
//     }
//   }
// }
