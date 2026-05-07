// transformer/reifiers/registry/array.ts
import { registerReifier } from './core';
import { isTypeReference } from '../../utils';

registerReifier((type, checker, next) => {
  if (checker.isArrayType(type) && isTypeReference(type)) {
    // getTypeArguments is public and returns Type[]
    const typeArgs = checker.getTypeArguments(type);
    const itemType = typeArgs[0] ?? checker.getAnyType();

    return {
      kind: 'array',
      items: next(itemType),
    };
  }
  return undefined;
});
