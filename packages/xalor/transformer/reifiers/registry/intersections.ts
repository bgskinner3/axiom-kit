// transformer/reifiers/registry/intersections.ts
import { registerReifier } from './core';
import { isIntersectionType } from '../../utils';
import { TypeFlags } from 'typescript';

registerReifier((type, checker, next, ctx) => {
  let targetType = type;

  // Alias Resolution (The fix for named types like 'type T = A & B')
  if (!isIntersectionType(targetType) && targetType.aliasSymbol) {
    targetType = checker.getDeclaredTypeOfSymbol(targetType.aliasSymbol);
  }

  if (!isIntersectionType(targetType)) return undefined;
  if (targetType.getFlags() & TypeFlags.Union) return undefined;

  return {
    kind: 'intersection',
    parts: targetType.types.map((t) => next(t, ctx)),
  };
});
