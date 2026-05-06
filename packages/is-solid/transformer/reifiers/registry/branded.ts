// transformer/reifiers/registry/branded.ts
import {
  isIntersectionType,
  isStringLiteralType,
} from '../../../models/guards/transformer';
import { registerReifier } from './core';

/**
 * Extracts the brand name from an Intersection type safely.
 * Example: string & { __brand: "UserId" } -> "UserId"
 */
registerReifier((type, checker, next, seen) => {
  const brandSymbol = checker.getPropertyOfType(type, '__brand');
  if (!brandSymbol || !brandSymbol.valueDeclaration) return undefined;

  const brandType = checker.getTypeOfSymbolAtLocation(
    brandSymbol,
    brandSymbol.valueDeclaration,
  );
  if (!isStringLiteralType(brandType)) return undefined;

  const brandName = brandType.value;

  // 💎 THE FIX: If it's a flattened object (Interface), we need to
  // reify it as an object but WITHOUT re-triggering this branded check.
  // We can do this by manually calling the Object Reifier logic or
  // by ensuring 'seen' doesn't block the structural crawl.

  if (isIntersectionType(type)) {
    const basePart =
      type.types.find((t) => !checker.getPropertyOfType(t, '__brand')) ??
      type.types[0];
    return { kind: 'branded', name: brandName, base: next(basePart) };
  }

  // For Flattened Interfaces:
  // We mark it as branded, but we must reach into the object properties.
  // Since 'seen' contains 'type', we temporarily remove it to allow
  // the structural crawl, then add it back.
  seen.delete(type);
  const baseShape = next(type);
  seen.add(type);

  return {
    kind: 'branded',
    name: brandName,
    base: baseShape,
  };
});

// registerReifier((type, checker, next) => {
//   if (!isIntersectionType(type)) return undefined;

//   // Internal helper logic (migrated from your old branded.ts)
//   let brandName: string | undefined;
//   for (const part of type.types) {
//     if (isObjectType(part)) {
//       const brandProp = checker.getPropertyOfType(part, '__brand');
//       if (brandProp && brandProp.valueDeclaration) {
//         const propType = checker.getTypeOfSymbolAtLocation(
//           brandProp,
//           brandProp.valueDeclaration,
//         );
//         if (isStringLiteralType(propType)) brandName = propType.value;
//       }
//     }
//   }

//   if (!brandName) return undefined;

//   const basePart = type.types.find((t) => !isObjectType(t)) ?? type.types[0];
//   return {
//     kind: 'branded',
//     name: brandName,
//     base: next(basePart),
//   };
// });
