// transformer/reifiers/registry/objects.ts
import { isObjectType } from '../../utils/guards';
import { registerReifier } from './core';
import type { TSolidObjectRawShape } from '../../../models/types';
import { SymbolFlags } from 'typescript';
/**
 * STRUCTURAL REIFIER (OBJECTS & INTERFACES)
 *
 * This module handles the registration of complex structures:
 * - Interfaces, Type Literals, and Class shapes.
 *
 *  RECURSION MANAGEMENT:
 * It utilizes the 'seen' Set to detect circular references. When a
 * loop is detected, it emits a 'reference' kind, preventing
 * infinite crawls and enabling the "Ambient Database" to link
 * types together via named pointers.
 */
registerReifier((type, checker, next, seen) => {
  // 1. Confirm it's an object BEFORE doing anything else
  if (!isObjectType(type)) return undefined;

  const symbol = type.getSymbol();
  const name = symbol ? symbol.getName() : 'Anonymous';

  // THIS IS THE REFERENCE LOGIC
  if (seen.has(type)) return { kind: 'reference', name };
  seen.add(type);

  const shapeProperties: Record<string, TSolidObjectRawShape> = {};
  const properties = checker.getPropertiesOfType(type);

  for (const prop of properties) {
    const declaration = prop.valueDeclaration;
    if (declaration) {
      const propType = checker.getTypeOfSymbolAtLocation(prop, declaration);
      const isOptional = !!(prop.flags & SymbolFlags.Optional);
      const propName = prop.getName(); // Get the key name

      shapeProperties[propName] = {
        shape: next(propType),
        optional: isOptional,
        name: propName, // ✨ Satisfies the model requirement
      };
    }
  }

  return {
    kind: 'object',
    properties: shapeProperties,
  };
});
//TODO: REMOVE OLD
// // transformer/reifiers/objects.ts
// import type { Type, TypeChecker } from 'typescript';
// import { isObjectType } from '../utils/guards';
// import type { TSolidShape } from '../../models/types';
// import { reifyType } from './index';

// export function reifyObject(
//   type: Type,
//   checker: TypeChecker,
//   seen: Set<Type> = new Set<Type>(),
// ): TSolidShape {
//   // 1. Check for recursion (The Ghost Loop Fix)
//   const symbol = type.getSymbol();
//   if (seen.has(type)) {
//     return {
//       kind: 'reference',
//       name: symbol ? symbol.getName() : 'Recursive',
//     };
//   }

//   // 2. Strict Narrowing to Object
//   if (!isObjectType(type)) {
//     return { kind: 'primitive', type: 'unknown' };
//   }

//   seen.add(type);

//   const properties = checker.getPropertiesOfType(type);
//   const shapeProperties: Record<string, TSolidShape> = {};

//   for (const prop of properties) {
//     const propName = prop.getName();

//     // 3. Safe Declaration Check (Removes '!')
//     const declaration = prop.valueDeclaration;

//     if (declaration) {
//       const propType = checker.getTypeOfSymbolAtLocation(prop, declaration);

//       if (propType) {
//         // 4. Recursive call to Master Resolver (must return TSolidShape)
//         shapeProperties[propName] = reifyType(propType, checker, seen);
//       }
//     }
//   }

//   return {
//     kind: 'object',
//     properties: shapeProperties,
//   };
// }
