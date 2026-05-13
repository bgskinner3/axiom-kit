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

  // --- PATH A: <'KEY', Type>() ---
  if (typeArgs && typeArgs.length >= 2) {
    const keyType = checker.getTypeFromTypeNode(typeArgs[0]);
    const shapeType = checker.getTypeFromTypeNode(typeArgs[1]);

    // 🎯 THE FIX: Ensure we extract the physical string value
    if (!keyType.isStringLiteral()) return null;

    return {
      keyName: keyType.value, // This is the physical string 'USER_TEST'
      keyType,
      shapeType,
    };
  }

  // --- PATH B: <'KEY'>(data) ---
  if (typeArgs && typeArgs.length === 1 && args.length >= 1) {
    const keyType = checker.getTypeFromTypeNode(typeArgs[0]);
    const shapeType = checker.getTypeAtLocation(args[0]);

    if (!keyType.isStringLiteral()) return null;

    return {
      keyName: keyType.value, // This is the physical string
      keyType,
      shapeType,
    };
  }

  return null;
}
