// transformer/reifiers/reify-type.ts
import type { Type, TypeChecker } from 'typescript';
import type { TSolidShape } from '../../models/types';
import { REIFIERS } from './registry/core';

/**
 * REIFYTYPE
 * The primary entry point for converting a TypeScript Type into a TSolidShape.
 * It implements a "Middleware Dispatcher" pattern, looping through the
 * registered Reifiers until a match is found.
 *
 * @param type - The raw TypeScript Type symbol to be analyzed.
 * @param checker - The Program's TypeChecker for deep metadata extraction.
 * @param seen - A persistent Set used for "Ghost Loop" protection (recursion).
 *
 * @returns {TSolidShape} The serialized JSON-friendly blueprint of the type.
 */
export function reifyType(
  type: Type,
  checker: TypeChecker,
  seen: Set<Type> = new Set(),
): TSolidShape {
  for (const reifier of REIFIERS) {
    const result = reifier(
      type,
      checker,
      (t) => reifyType(t, checker, seen),
      seen,
    );

    if (result) return result;
  }

  return { kind: 'primitive', type: 'unknown' };
}
