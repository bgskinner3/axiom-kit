// transformer/reifiers/registry/objects.ts
import { isObjectType } from '../../utils';
import { registerReifier, maxObjectProperties } from './core';
import { SymbolFlags } from 'typescript';
import type { TSolidObjectRawShape } from '../../../shared';

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
registerReifier((type, checker, next, ctx) => {
  if (!isObjectType(type)) return undefined;

  // 🔄 RECURSION CHECK (Using the context's seen set)
  if (ctx.seen.has(type)) {
    return {
      kind: 'reference',
      name: type.getSymbol()?.getName() || 'Circular',
    };
  }
  ctx.seen.add(type);

  const shapeProperties: Record<string, TSolidObjectRawShape> = {};
  const properties = checker.getPropertiesOfType(type);

  // 📏 LIMIT: Max Properties check
  const propsToProcess = properties.slice(0, maxObjectProperties);

  for (const prop of propsToProcess) {
    const propType = checker.getTypeOfSymbolAtLocation(
      prop,
      prop.valueDeclaration!,
    );
    const propName = prop.getName();

    shapeProperties[propName] = {
      // 📏 DEPTH SYNC: Increment depth and update parentKey for the next level
      shape: next(propType, {
        ...ctx,
        depth: ctx.depth + 1,
        parentKey: `${ctx.parentKey}.${propName}`,
      }),
      optional: !!(prop.flags & SymbolFlags.Optional),
      name: propName,
    };
  }

  return { kind: 'object', properties: shapeProperties };
});
