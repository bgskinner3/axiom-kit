// transformer/reifiers/reify-type.ts
import type { Type, TypeChecker } from 'typescript';
import type { TSolidShape } from '../../models/types';
import ts from 'typescript';
import { isUnionType, isIntersectionType, isObjectType } from '../utils/guards';
import { reifyPrimitive } from './primitives';
import { reifyUnion } from './unions';
import { reifyObject } from './objects';
import { getBrandName } from './branded';
export function reifyType(
  type: Type,
  checker: TypeChecker,
  seen: Set<Type> = new Set<Type>(),
): TSolidShape {
  if (checker.isArrayType(type)) {
    const typeRef = type as ts.TypeReference;
    const itemType = typeRef.typeArguments?.[0] ?? checker.getAnyType();
    return {
      kind: 'array',
      items: reifyType(itemType, checker, seen),
    };
  }
  // 1. Handle Unions ('A' | 'B')
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

  // 3. Handle Objects (Interfaces, Literals, Recursive types)
  if (isObjectType(type)) return reifyObject(type, checker, seen);

  // 4. Default to Primitives (string, number, boolean)
  return reifyPrimitive(type);
}
