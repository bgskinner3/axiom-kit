// transformer/reifiers/registry/intersections.ts
import { registerReifier } from './core';
import { isIntersectionType } from '../../utils';
import { TypeFlags } from 'typescript';

registerReifier((type, checker, next) => {
  let targetType = type;

  // Alias Resolution (The fix for named types like 'type T = A & B')
  if (!isIntersectionType(targetType) && targetType.aliasSymbol) {
    targetType = checker.getDeclaredTypeOfSymbol(targetType.aliasSymbol);
  }

  // Guard: If it's not an intersection, we can't process it here
  if (!isIntersectionType(targetType)) return undefined;

  // AGGRESSIVE ADDITION: Union Check
  // If the intersection has already been "flattened" into a union by the compiler,
  // we step aside and let the Union Reifier handle it for better accuracy.
  // if (targetType.isUnion()) return undefined;
  if (targetType.getFlags() & TypeFlags.Union) return undefined;
  return {
    kind: 'intersection',
    parts: targetType.types.map((t) => next(t)),
  };
});
