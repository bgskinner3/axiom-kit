// transformer/reifiers/registry/unions.ts
import ts from 'typescript';
import {
  isStringLiteralType,
  isNumberLiteralType,
  isUnionType,
} from '../../utils';
import { registerReifier } from './core';
/**
 * Extracts literal values without using 'any' or 'as'.
 */
export function getUnionValues(type: ts.Type): (string | number | boolean)[] {
  const values: (string | number | boolean)[] = [];

  // Helper to process individual parts of a union safely
  const processType = (t: ts.Type) => {
    if (isStringLiteralType(t) || isNumberLiteralType(t)) {
      values.push(t.value);
    } else if (t.getFlags() & ts.TypeFlags.BooleanLiteral) {
      // TypeScript internal: boolean literals have 'intrinsicName'
      // We check the flag and then the name string safely.
      const name = (t as { intrinsicName?: string }).intrinsicName;
      if (name === 'true') values.push(true);
      if (name === 'false') values.push(false);
    }
  };

  if (isUnionType(type)) {
    type.types.forEach(processType);
  } else {
    processType(type);
  }

  return values;
}

/**
 * Generates the JS check: [vals].includes(value)
 * Uses strict mapping for AST node generation.
 */
export function createUnionCheck(
  f: ts.NodeFactory,
  val: ts.Expression,
  values: (string | number | boolean)[],
): ts.CallExpression {
  const nodes = values.map((v) => {
    if (typeof v === 'string') return f.createStringLiteral(v);
    if (typeof v === 'number') return f.createNumericLiteral(v);
    return v ? f.createTrue() : f.createFalse();
  });

  return f.createCallExpression(
    f.createPropertyAccessExpression(
      f.createArrayLiteralExpression(nodes),
      f.createIdentifier('includes'),
    ),
    undefined,
    [val],
  );
}

registerReifier((type, _checker, next) => {
  if (!isUnionType(type)) return undefined;

  // 1. Try to extract simple literals (for Enums/Status strings)
  const literals = getUnionValues(type);

  if (literals.length > 0 && literals.length === type.types.length) {
    return {
      kind: 'union',
      values: literals.map((v) => ({ kind: 'literal', value: v })),
    };
  }

  // 2. If it's a complex union (e.g., Cat | Dog), recurse using 'next'
  return {
    kind: 'union',
    values: type.types.map((t) => next(t)),
  };
});

//TODO: REMOVE OLD

// // transformer/reifiers/unions.ts
// import ts from 'typescript';
// import {
//   isStringLiteralType,
//   isNumberLiteralType,
//   isUnionType,
// } from '../utils';
// import type { TSolidShape } from '../../models/types';
// /**
//  * Extracts literal values without using 'any' or 'as'.
//  */
// export function getUnionValues(type: ts.Type): (string | number | boolean)[] {
//   const values: (string | number | boolean)[] = [];

//   // Helper to process individual parts of a union safely
//   const processType = (t: ts.Type) => {
//     if (isStringLiteralType(t) || isNumberLiteralType(t)) {
//       values.push(t.value);
//     } else if (t.getFlags() & ts.TypeFlags.BooleanLiteral) {
//       // TypeScript internal: boolean literals have 'intrinsicName'
//       // We check the flag and then the name string safely.
//       const name = (t as { intrinsicName?: string }).intrinsicName;
//       if (name === 'true') values.push(true);
//       if (name === 'false') values.push(false);
//     }
//   };

//   if (isUnionType(type)) {
//     type.types.forEach(processType);
//   } else {
//     processType(type);
//   }

//   return values;
// }

// /**
//  * Generates the JS check: [vals].includes(value)
//  * Uses strict mapping for AST node generation.
//  */
// export function createUnionCheck(
//   f: ts.NodeFactory,
//   val: ts.Expression,
//   values: (string | number | boolean)[],
// ): ts.CallExpression {
//   const nodes = values.map((v) => {
//     if (typeof v === 'string') return f.createStringLiteral(v);
//     if (typeof v === 'number') return f.createNumericLiteral(v);
//     return v ? f.createTrue() : f.createFalse();
//   });

//   return f.createCallExpression(
//     f.createPropertyAccessExpression(
//       f.createArrayLiteralExpression(nodes),
//       f.createIdentifier('includes'),
//     ),
//     undefined,
//     [val],
//   );
// }
// export function reifyUnion(type: ts.Type): TSolidShape {
//   const values = getUnionValues(type);

//   return {
//     kind: 'union',
//     values: values.map((v) => {
//       return { kind: 'literal', value: v };
//     }),
//   };
// }
