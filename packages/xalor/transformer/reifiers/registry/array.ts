// transformer/reifiers/registry/array.ts
import { registerReifier } from './core';
import type { TypeReference } from 'typescript';

registerReifier((type, checker, next) => {
  if (checker.isArrayType(type)) {
    const typeRef = type as TypeReference;
    const itemType = typeRef.typeArguments?.[0] ?? checker.getAnyType();

    return {
      kind: 'array',
      items: next(itemType),
    };
  }
  return undefined;
});
