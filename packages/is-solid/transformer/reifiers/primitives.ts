import ts from 'typescript';
import { isStringLiteralType, isNumberLiteralType } from '../utils';
import type { TSolidShape } from '../types';

export function reifyPrimitive(type: ts.Type): TSolidShape {
  const flags = type.getFlags();

  // 1. Handle Base Primitives
  if (flags & ts.TypeFlags.String) {
    return { kind: 'primitive', type: 'string' };
  }
  if (flags & ts.TypeFlags.Number) {
    return { kind: 'primitive', type: 'number' };
  }
  if (flags & ts.TypeFlags.Boolean) {
    return { kind: 'primitive', type: 'boolean' };
  }
  if (flags & ts.TypeFlags.BigInt) {
    return { kind: 'primitive', type: 'bigint' };
  }

  // 2. Handle Literals (using guards)
  if (isStringLiteralType(type)) {
    return { kind: 'literal', value: type.value };
  }
  if (isNumberLiteralType(type)) {
    return { kind: 'literal', value: type.value };
  }

  // 3. Fallback
  return { kind: 'primitive', type: 'unknown' };
}
