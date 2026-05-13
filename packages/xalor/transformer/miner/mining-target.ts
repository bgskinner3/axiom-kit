import type { Node } from 'typescript';
import ts from 'typescript';

/**
 * RESOLVE MINING TARGET
 *
 * ROLE:
 * The "Switchboard." It determines the extraction strategy based on the
 * call signature of 'registerXalor'.
 *
 * STRATEGY:
 * - Path A (Static): Extracts the 'Key' and 'Type' directly from generic slots.
 * - Path B (Dynamic): Extracts the 'Key' from generics, but sniffs the 'Type'
 *   from the physical JavaScript argument using the TypeChecker.
 *
 * WHY:
 * This allows Xalor to support both declarative interface registration
 * and "on-the-fly" registration of existing data objects.
 *
 * @see registerXalor
 */
export function resolveMiningTarget(node: Node, checker: ts.TypeChecker) {
  if (!ts.isCallExpression(node)) return null;

  const typeArgs = node.typeArguments;
  const args = node.arguments;

  // Path A: Explicit Registration <'KEY', Type>()
  // 📍 CHANGE: Ensure we only proceed if [0] is a string literal
  if (typeArgs && typeArgs.length >= 2) {
    const keyNode = typeArgs[0];
    const shapeNode = typeArgs[1];

    const keyType = checker.getTypeFromTypeNode(keyNode);
    const shapeType = checker.getTypeFromTypeNode(shapeNode);
    return {
      keyType,
      shapeType,
    };
  }

  // Path B: Inferred Registration <'KEY'>(data)
  // 📍 CHANGE: Targets index [0] of physical arguments
  if (typeArgs && typeArgs.length === 1 && args.length >= 1) {
    return {
      // 1. Still a Type (The literal 'KEY' type)
      keyType: checker.getTypeFromTypeNode(typeArgs[0]),
      // 2. 🎯 SYNC: Get the inferred Type of the physical data node
      shapeType: checker.getTypeAtLocation(args[0]),
    };
  }

  return null;
}
