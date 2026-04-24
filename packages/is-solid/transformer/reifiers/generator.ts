import ts from 'typescript';
import type { TSolidShape } from '../types';

/**
 * Converts a TSolidShape into a real JavaScript AST node.
 * No 'any', no 'as'. Uses explicit kind-checking.
 */
export function generateShapeAST(
  f: ts.NodeFactory,
  shape: TSolidShape,
): ts.Expression {
  // 1. Handle Primitives
  if (shape.kind === 'primitive') {
    return f.createObjectLiteralExpression([
      f.createPropertyAssignment('kind', f.createStringLiteral('primitive')),
      f.createPropertyAssignment('type', f.createStringLiteral(shape.type)),
    ]);
  }

  // 2. Handle Literals
  if (shape.kind === 'literal') {
    let valueNode: ts.Expression;
    if (typeof shape.value === 'string')
      valueNode = f.createStringLiteral(shape.value);
    else if (typeof shape.value === 'number')
      valueNode = f.createNumericLiteral(shape.value);
    else valueNode = shape.value ? f.createTrue() : f.createFalse();

    return f.createObjectLiteralExpression([
      f.createPropertyAssignment('kind', f.createStringLiteral('literal')),
      f.createPropertyAssignment('value', valueNode),
    ]);
  }

  // 3. Handle Unions
  if (shape.kind === 'union') {
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

  // 4. Handle Branded Types
  if (shape.kind === 'branded') {
    return f.createObjectLiteralExpression([
      f.createPropertyAssignment('kind', f.createStringLiteral('branded')),
      f.createPropertyAssignment('name', f.createStringLiteral(shape.name)),
      f.createPropertyAssignment('base', generateShapeAST(f, shape.base)),
    ]);
  }

  // 5. Handle Objects (The Deep Merges)
  if (shape.kind === 'object') {
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

  // 6. Handle Recursion References
  if (shape.kind === 'reference') {
    return f.createObjectLiteralExpression([
      f.createPropertyAssignment('kind', f.createStringLiteral('reference')),
      f.createPropertyAssignment('name', f.createStringLiteral(shape.name)),
    ]);
  }

  return f.createIdentifier('undefined');
}
