// transformer/reifiers/registry/intersections.ts
import { registerReifier } from './core';
import { isIntersectionType } from '../../utils/guards';

registerReifier((type, _checker, next) => {
  if (!isIntersectionType(type)) return undefined;

  return {
    kind: 'intersection',
    parts: type.types.map((t) => next(t)),
  };
});
//TODO: REMOVE OLD
/**
   if (isUnionType(type)) return reifyUnion(type);

  // 2. Handle Intersections & Brands (string & { __brand: 'ID' })
  if (isIntersectionType(type)) {
    const brandName = getBrandName(type, checker);

    if (brandName) {
      // Find the base type (the part of the intersection that ISN'T the brand object)
      // Usually the first part, like 'string' in 'string & { __brand: string }'
      const basePart =
        type.types.find((t) => !isObjectType(t)) ?? type.types[0];

      return {
        kind: 'branded',
        name: brandName,
        // We recurse back into reifyType to get the shape of the base (string/number)
        base: reifyType(basePart, checker, seen),
      };
    }
  }

  export function getBrandName(
  type: Type,
  checker: TypeChecker,
): string | undefined {
  if (!isIntersectionType(type)) return undefined;

  for (const part of type.types) {
    if (isObjectType(part)) {
      const brandProp = checker.getPropertyOfType(part, '__brand');
      if (brandProp && brandProp.valueDeclaration) {
        const propType = checker.getTypeOfSymbolAtLocation(
          brandProp,
          brandProp.valueDeclaration,
        );

        if (isStringLiteralType(propType)) {
          return propType.value;
        }
      }
    }
  }
  return;
}
 */
