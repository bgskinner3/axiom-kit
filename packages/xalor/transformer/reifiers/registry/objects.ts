// transformer/reifiers/registry/objects.ts
import { isObjectType } from '../../../models/guards/transformer';
import { registerReifier } from './core';
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
  // Confirm it's an object BEFORE doing anything else
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
      const propName = prop.getName();

      shapeProperties[propName] = {
        shape: next(propType),
        optional: isOptional,
        name: propName,
      };
    }
  }

  return {
    kind: 'object',
    properties: shapeProperties,
  };
});
