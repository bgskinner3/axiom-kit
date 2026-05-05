// transformer/reifiers/objects.ts
import type { Type, TypeChecker } from 'typescript';
import { isObjectType } from '../utils/guards';
import type { TSolidShape } from '../../models/types';
import { reifyType } from './index';

export function reifyObject(
  type: Type,
  checker: TypeChecker,
  seen: Set<Type> = new Set<Type>(),
): TSolidShape {
  // 1. Check for recursion (The Ghost Loop Fix)
  const symbol = type.getSymbol();
  if (seen.has(type)) {
    return {
      kind: 'reference',
      name: symbol ? symbol.getName() : 'Recursive',
    };
  }

  // 2. Strict Narrowing to Object
  if (!isObjectType(type)) {
    return { kind: 'primitive', type: 'unknown' };
  }

  seen.add(type);

  const properties = checker.getPropertiesOfType(type);
  const shapeProperties: Record<string, TSolidShape> = {};

  for (const prop of properties) {
    const propName = prop.getName();

    // 3. Safe Declaration Check (Removes '!')
    const declaration = prop.valueDeclaration;

    if (declaration) {
      const propType = checker.getTypeOfSymbolAtLocation(prop, declaration);

      if (propType) {
        // 4. Recursive call to Master Resolver (must return TSolidShape)
        shapeProperties[propName] = reifyType(propType, checker, seen);
      }
    }
  }

  return {
    kind: 'object',
    properties: shapeProperties,
  };
}
