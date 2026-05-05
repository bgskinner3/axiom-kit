// transformer/utils/guards/nodes.ts
import ts from 'typescript';

/**
 * Checks if a node is the 'isSolid' function call.
 */
export function isSolidCall(node: ts.Node): node is ts.CallExpression {
  return (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === 'isSolid'
  );
}

/**
 * Checks if a node is a specific identifier.
 */
export function isIdentifier(
  node: ts.Node,
  text: string,
): node is ts.Identifier {
  return ts.isIdentifier(node) && node.text === text;
}
