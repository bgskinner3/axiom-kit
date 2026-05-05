import type { Type, TypeChecker } from 'typescript';
import {
  isIntersectionType,
  isObjectType,
  isStringLiteralType,
} from '../utils/guards';

/**
 * Extracts the brand name from an Intersection type safely.
 * Example: string & { __brand: "UserId" } -> "UserId"
 */
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
