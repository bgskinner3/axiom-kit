// transformer/reifiers/generator.ts
import type { NodeFactory, Expression } from 'typescript';
import type { TSolidShape } from '../../models/types';
import {
  isPrimitiveShape,
  isLiteralShape,
  isObjectShape,
  isArrayShape,
  isBrandedShape,
  isIntersectionShape,
  isUnionShape,
  isReferenceShape,
} from '../../models/guards';

export function generateShapeAST(
  f: NodeFactory,
  shape: TSolidShape,
): Expression {
  const _exhaustive: TSolidShape = shape;
  if (isPrimitiveShape(shape)) {
    return f.createObjectLiteralExpression([
      f.createPropertyAssignment('kind', f.createStringLiteral('primitive')),
      f.createPropertyAssignment('type', f.createStringLiteral(shape.type)),
    ]);
  }
  if (isArrayShape(shape)) {
    return f.createObjectLiteralExpression([
      f.createPropertyAssignment('kind', f.createStringLiteral('array')),
      f.createPropertyAssignment('items', generateShapeAST(f, shape.items)),
    ]);
  }

  // 2. Handle Literals
  if (isLiteralShape(shape)) {
    let valueNode: Expression;
    /* prettier-ignore */ if (typeof shape.value === 'string') valueNode = f.createStringLiteral(shape.value);
    else if (typeof shape.value === 'number') valueNode = f.createNumericLiteral(String(shape.value));
    else valueNode = shape.value ? f.createTrue() : f.createFalse();
    return f.createObjectLiteralExpression([
      f.createPropertyAssignment('kind', f.createStringLiteral('literal')),
      f.createPropertyAssignment('value', valueNode),
    ]);
  }
  if (isUnionShape(shape)) {
    return f.createObjectLiteralExpression([
      f.createPropertyAssignment('kind', f.createStringLiteral('union')),
      f.createPropertyAssignment(
        'values',
        f.createArrayLiteralExpression(
          shape.values.map((v) => generateShapeAST(f, v)),
        ),
      ),
    ]);
  }
  if (isIntersectionShape(shape)) {
    return f.createObjectLiteralExpression([
      f.createPropertyAssignment('kind', f.createStringLiteral('intersection')),
      f.createPropertyAssignment(
        'parts',
        f.createArrayLiteralExpression(
          shape.parts.map((p) => generateShapeAST(f, p)),
        ),
      ),
    ]);
  }
  if (isBrandedShape(shape)) {
    return f.createObjectLiteralExpression([
      f.createPropertyAssignment('kind', f.createStringLiteral('branded')),
      f.createPropertyAssignment('name', f.createStringLiteral(shape.name)),
      f.createPropertyAssignment('base', generateShapeAST(f, shape.base)),
    ]);
  }

  if (isObjectShape(shape)) {
    const propNodes = Object.entries(shape.properties).map(([key, val]) => {
      return f.createPropertyAssignment(
        f.createStringLiteral(key),
        generateShapeAST(f, val),
      );
    });
    return f.createObjectLiteralExpression([
      f.createPropertyAssignment('kind', f.createStringLiteral('object')),
      f.createPropertyAssignment(
        'properties',
        f.createObjectLiteralExpression(propNodes),
      ),
    ]);
  }

  if (isReferenceShape(shape)) {
    return f.createObjectLiteralExpression([
      f.createPropertyAssignment('kind', f.createStringLiteral('reference')),
      f.createPropertyAssignment('name', f.createStringLiteral(shape.name)),
    ]);
  }

  throw new Error(`[is-solid] Unhandled shape kind: ${_exhaustive.kind}`);
}

// export function generateShapeAST(
//   f: ts.NodeFactory,
//   shape: TSolidShape,
// ): ts.Expression {
//   // 1. Handle Primitives
//   if (shape.kind === 'primitive') {
//     return f.createObjectLiteralExpression([
//       f.createPropertyAssignment('kind', f.createStringLiteral('primitive')),
//       f.createPropertyAssignment('type', f.createStringLiteral(shape.type)),
//     ]);
//   }
//   if (shape.kind === 'array') {
//     return f.createObjectLiteralExpression([
//       f.createPropertyAssignment('kind', f.createStringLiteral('array')),
//       f.createPropertyAssignment('items', generateShapeAST(f, shape.items)),
//     ]);
//   }
//   // 2. Handle Literals
//   if (shape.kind === 'literal') {
//     let valueNode: ts.Expression;
//     if (typeof shape.value === 'string')
//       valueNode = f.createStringLiteral(shape.value);
//     else if (typeof shape.value === 'number')
//       valueNode = f.createNumericLiteral(shape.value);
//     else valueNode = shape.value ? f.createTrue() : f.createFalse();

//     return f.createObjectLiteralExpression([
//       f.createPropertyAssignment('kind', f.createStringLiteral('literal')),
//       f.createPropertyAssignment('value', valueNode),
//     ]);
//   }
//   if (shape.kind === 'intersection') {
//     return f.createObjectLiteralExpression([
//       f.createPropertyAssignment('kind', f.createStringLiteral('intersection')),
//       f.createPropertyAssignment(
//         'parts',
//         f.createArrayLiteralExpression(
//           shape.parts.map((p) => generateShapeAST(f, p)),
//         ),
//       ),
//     ]);
//   }
//   // 3. Handle Unions
//   if (shape.kind === 'union') {
//     return f.createObjectLiteralExpression([
//       f.createPropertyAssignment('kind', f.createStringLiteral('union')),
//       f.createPropertyAssignment(
//         'values',
//         f.createArrayLiteralExpression(
//           shape.values.map((v) => generateShapeAST(f, v)),
//         ),
//       ),
//     ]);
//   }

//   // 4. Handle Branded Types
//   if (shape.kind === 'branded') {
//     return f.createObjectLiteralExpression([
//       f.createPropertyAssignment('kind', f.createStringLiteral('branded')),
//       f.createPropertyAssignment('name', f.createStringLiteral(shape.name)),
//       f.createPropertyAssignment('base', generateShapeAST(f, shape.base)),
//     ]);
//   }

//   // 5. Handle Objects (The Deep Merges)
//   if (shape.kind === 'object') {
//     const propNodes = Object.entries(shape.properties).map(([key, val]) => {
//       return f.createPropertyAssignment(
//         f.createStringLiteral(key),
//         generateShapeAST(f, val),
//       );
//     });

//     return f.createObjectLiteralExpression([
//       f.createPropertyAssignment('kind', f.createStringLiteral('object')),
//       f.createPropertyAssignment(
//         'properties',
//         f.createObjectLiteralExpression(propNodes),
//       ),
//     ]);
//   }

//   // 6. Handle Recursion References
//   if (shape.kind === 'reference') {
//     return f.createObjectLiteralExpression([
//       f.createPropertyAssignment('kind', f.createStringLiteral('reference')),
//       f.createPropertyAssignment('name', f.createStringLiteral(shape.name)),
//     ]);
//   }

//   return f.createIdentifier('undefined');
// }
