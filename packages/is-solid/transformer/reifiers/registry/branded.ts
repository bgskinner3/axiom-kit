// transformer/reifiers/registry/branded.ts
import {
  isIntersectionType,
  isObjectType,
  isStringLiteralType,
} from '../../../models/guards/transformer';
import { registerReifier } from './core';

/**
 * Extracts the brand name from an Intersection type safely.
 * Example: string & { __brand: "UserId" } -> "UserId"
 */
registerReifier((type, checker, next) => {
  if (!isIntersectionType(type)) return undefined;

  // Internal helper logic (migrated from your old branded.ts)
  let brandName: string | undefined;
  for (const part of type.types) {
    if (isObjectType(part)) {
      const brandProp = checker.getPropertyOfType(part, '__brand');
      if (brandProp && brandProp.valueDeclaration) {
        const propType = checker.getTypeOfSymbolAtLocation(
          brandProp,
          brandProp.valueDeclaration,
        );
        if (isStringLiteralType(propType)) brandName = propType.value;
      }
    }
  }

  if (!brandName) return undefined;

  const basePart = type.types.find((t) => !isObjectType(t)) ?? type.types[0];
  return {
    kind: 'branded',
    name: brandName,
    base: next(basePart),
  };
});
//TODO: REMOVE OLD
// // transformer/reifiers/branded.ts
// import type { Type, TypeChecker } from 'typescript';
// import {
//   isIntersectionType,
//   isObjectType,
//   isStringLiteralType,
// } from '../utils/guards';

// /**
//  * Extracts the brand name from an Intersection type safely.
//  * Example: string & { __brand: "UserId" } -> "UserId"
//  */
// export function getBrandName(
//   type: Type,
//   checker: TypeChecker,
// ): string | undefined {
//   if (!isIntersectionType(type)) return undefined;

//   for (const part of type.types) {
//     if (isObjectType(part)) {
//       const brandProp = checker.getPropertyOfType(part, '__brand');
//       if (brandProp && brandProp.valueDeclaration) {
//         const propType = checker.getTypeOfSymbolAtLocation(
//           brandProp,
//           brandProp.valueDeclaration,
//         );

//         if (isStringLiteralType(propType)) {
//           return propType.value;
//         }
//       }
//     }
//   }
//   return;
// }
