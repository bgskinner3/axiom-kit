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
/**
 *  The AST Generator (Build-Time Emission)
 *
 * This module serves as the translation layer between the "Solid Shape"
 * data structures and the TypeScript Compiler's AST (Abstract Syntax Tree).
 *
 * ROLE:
 * It converts a recursive JSON-like blueprint (TSolidShape) into a
 * physical JavaScript Object Literal Expression. This expression is
 * what gets "baked" into the final compiled source code, allowing the
 * Runtime Vault (Pillar 2) to exist without a dependency on the
 * TypeScript Compiler.
 *
 * PROCESS:
 * 1. RECURSION: Deeply traverses nested shapes (Objects, Arrays, Unions).
 * 2. MAPPING: Uses the NodeFactory to create exact JS syntax for every type.
 * 3. SAFETY: Implements an exhaustive check to ensure every new 'kind' added
 *    to the system is handled, preventing silent failures during emission.
 *
 * @param f - The TypeScript NodeFactory used to create syntax nodes.
 * @param shape - The solidified blueprint to be converted into JS code.
 * @returns {Expression} A TypeScript AST Expression representing the shape.
 */
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
    const propNodes = Object.entries(shape.properties).map(([key, meta]) => {
      return f.createPropertyAssignment(
        f.createStringLiteral(key),
        f.createObjectLiteralExpression([
          f.createPropertyAssignment('shape', generateShapeAST(f, meta.shape)),
          f.createPropertyAssignment(
            'optional',
            meta.optional ? f.createTrue() : f.createFalse(),
          ),
          f.createPropertyAssignment('name', f.createStringLiteral(meta.name)), // ✨ Added
        ]),
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
