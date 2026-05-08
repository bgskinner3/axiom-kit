// transformer/reifiers/registry/array.ts
import { registerReifier, maxObjectProperties } from './core';
import { isTypeReference } from '../../utils';

registerReifier((type, checker, next, ctx) => {
  if (checker.isArrayType(type) && isTypeReference(type)) {
    const typeArgs = checker.getTypeArguments(type);
    const itemType = typeArgs[0] ?? checker.getAnyType();

    return {
      kind: 'array',
      // We increment depth and update the parentKey so the Auditor
      // can trace errors to specifically "BigTEst.items[]"
      items: next(itemType, {
        ...ctx,
        depth: ctx.depth + 1,
        parentKey: `${ctx.parentKey}[]`,
      }),
      maxItems: maxObjectProperties,
    };
  }

  return undefined;
});
