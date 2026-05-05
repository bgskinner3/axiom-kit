// models/guards/transformer/nodes.ts
import ts from 'typescript';

/**
 * # IS SOLID CALL #####
 * Identifies the 'isSolid' function call within the AST.
 * This is the primary "Trigger" for the Miner; when this is found,
 * the transformer begins the reification process for the attached types.
 */
export function isSolidCall(node: ts.Node): node is ts.CallExpression {
  return (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === 'isSolid'
  );
}

/**
 * IS IDENTIFIER
 * Validates if a node is a TypeScript Identifier with a specific name.
 * Used to target internal keywords or specific brand names during AST walking.
 */
export function isIdentifier(
  node: ts.Node,
  text: string,
): node is ts.Identifier {
  return ts.isIdentifier(node) && node.text === text;
}
