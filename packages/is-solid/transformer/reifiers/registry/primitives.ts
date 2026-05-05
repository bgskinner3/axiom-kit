// transformer/reifiers/registry/primitives.ts
import { TypeFlags } from 'typescript';
import {
  isStringLiteralType,
  isNumberLiteralType,
} from '../../../models/guards/transformer';
import { registerReifier } from './core';
import type { Type } from 'typescript';
/**
 * 🍃 LEAF NODE REIFIER
 *
 * This module handles the registration of all base TypeScript primitives:
 * - string, number, boolean, bigint
 *
 * 💡 NOTE: Literal types (e.g., "admin", 42, true) are also handled here.
 * In our architecture, Literals are treated as "Constant Primitives" and
 * are registered before base types to ensure specificity.
 */
registerReifier((type) => {
  if (isStringLiteralType(type)) return { kind: 'literal', value: type.value };
  if (isNumberLiteralType(type)) return { kind: 'literal', value: type.value };

  // 2. Boolean Literals (true / false)
  if (type.getFlags() & TypeFlags.BooleanLiteral) {
    const { intrinsicName } = type as Type & { intrinsicName: string };
    return { kind: 'literal', value: intrinsicName === 'true' };
  }

  const flags = type.getFlags();

  // 1. Base Primitives
  if (flags & TypeFlags.String) return { kind: 'primitive', type: 'string' };
  if (flags & TypeFlags.Number) return { kind: 'primitive', type: 'number' };
  if (flags & TypeFlags.Boolean) return { kind: 'primitive', type: 'boolean' };
  if (flags & TypeFlags.BigInt) return { kind: 'primitive', type: 'bigint' };

  return undefined;
});
//TODO: REMOVE OLD
// // transformer/reifiers/primitives.ts
// import ts from 'typescript';
// import { isStringLiteralType, isNumberLiteralType } from '../utils';
// import type { TSolidShape } from '../../models/types';

// export function reifyPrimitive(type: ts.Type): TSolidShape {
//   const flags = type.getFlags();

//   // 1. Handle Base Primitives
//   if (flags & ts.TypeFlags.String) {
//     return { kind: 'primitive', type: 'string' };
//   }
//   if (flags & ts.TypeFlags.Number) {
//     return { kind: 'primitive', type: 'number' };
//   }
//   if (flags & ts.TypeFlags.Boolean) {
//     return { kind: 'primitive', type: 'boolean' };
//   }
//   if (flags & ts.TypeFlags.BigInt) {
//     return { kind: 'primitive', type: 'bigint' };
//   }

//   // 2. Handle Literals (using guards)
//   if (isStringLiteralType(type)) {
//     return { kind: 'literal', value: type.value };
//   }
//   if (isNumberLiteralType(type)) {
//     return { kind: 'literal', value: type.value };
//   }

//   // 3. Fallback
//   return { kind: 'primitive', type: 'unknown' };
// }
