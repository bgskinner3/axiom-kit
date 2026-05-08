// transformer/reifiers/registry/primitives.ts
import { TypeFlags } from 'typescript';
import { isStringLiteralType, isNumberLiteralType } from '../../utils';
import { registerReifier, maxStringLength } from './core';
import type { Type } from 'typescript';
/**
 * LEAF NODE REIFIER
 *
 * This module handles the registration of all base TypeScript primitives:
 * - string, number, boolean, bigint
 *
 * NOTE: Literal types (e.g., "admin", 42, true) are also handled here.
 * In our architecture, Literals are treated as "Constant Primitives" and
 * are registered before base types to ensure specificity.
 */
registerReifier((type, _checker, _next, _ctx) => {
  if (isStringLiteralType(type)) return { kind: 'literal', value: type.value };
  if (isNumberLiteralType(type)) return { kind: 'literal', value: type.value };

  if (type.getFlags() & TypeFlags.BooleanLiteral) {
    const { intrinsicName } = type as Type & { intrinsicName: string };
    return { kind: 'literal', value: intrinsicName === 'true' };
  }

  const flags = type.getFlags();

  // 2. Handle Base Primitives with Guardrails
  if (flags & TypeFlags.String) {
    return {
      kind: 'primitive',
      type: 'string',
      // ⚖️ ENFORCE LAW: Apply the max length from your config
      maxLength: maxStringLength,
    };
  }

  /* prettier-ignore */
  if (flags & TypeFlags.Number) return { kind: 'primitive', type: 'number' };
  /* prettier-ignore */
  if (flags & TypeFlags.Boolean) return { kind: 'primitive', type: 'boolean' };
  /* prettier-ignore */
  if (flags & TypeFlags.BigInt) return { kind: 'primitive', type: 'bigint' };
  /* prettier-ignore */
  if (flags & (TypeFlags.Null | TypeFlags.Undefined)) return { kind: 'primitive', type: 'unknown' };

  return undefined;
});

// registerReifier((type) => {
//   if (isStringLiteralType(type)) return { kind: 'literal', value: type.value };
//   if (isNumberLiteralType(type)) return { kind: 'literal', value: type.value };

//   if (type.getFlags() & TypeFlags.BooleanLiteral) {
//     const { intrinsicName } = type as Type & { intrinsicName: string };
//     return { kind: 'literal', value: intrinsicName === 'true' };
//   }

//   const flags = type.getFlags();
//   /* prettier-ignore */ if (flags & TypeFlags.Null) return { kind: 'primitive', type: 'unknown' };
//   /* prettier-ignore */ if (flags & TypeFlags.Undefined) return { kind: 'primitive', type: 'unknown' };

//   // 1. Base Primitives
//   /* prettier-ignore */ if (flags & TypeFlags.String) return { kind: 'primitive', type: 'string' };
//   /* prettier-ignore */ if (flags & TypeFlags.Number) return { kind: 'primitive', type: 'number' };
//   /* prettier-ignore */ if (flags & TypeFlags.Boolean) return { kind: 'primitive', type: 'boolean' };
//   /* prettier-ignore */ if (flags & TypeFlags.BigInt) return { kind: 'primitive', type: 'bigint' };

//   return undefined;
// });
