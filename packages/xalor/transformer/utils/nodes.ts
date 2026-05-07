// models/guards/transformer/nodes.ts
import ts from 'typescript';
import { IS_SOLID_CONFIG_ITEMS } from '../../src/models/constants';
/**
 * # IS SOLID CALL #####
 * Identifies the 'isSolid' function call within the AST.
 * ======
 * This is the primary "Trigger" for the Miner. When this is found,
 * the transformer begins reifying the attached types into Solid Shapes.
 * ===
 * (Identity Verification):
 * We don't just check the name 'isSolid'. We use the TypeChecker to verify
 * that the call belongs to our library. If a developer defines a local
 * function with the same name (Shadowing), this guard will return 'false'
 * to prevent accidental transformation of non-library code.
 */
export function isSolidCall(
  node: ts.Node,
  checker?: ts.TypeChecker,
): node is ts.CallExpression {
  // 1. Structural Integrity Check
  if (!ts.isCallExpression(node) || !ts.isIdentifier(node.expression))
    return false;
  // 2. Name-Based Sentry Check
  const triggers: Readonly<string[]> = IS_SOLID_CONFIG_ITEMS.sentryTriggers;
  const functionName = node.expression.text;

  if (!triggers.includes(functionName)) return false;

  // 3. Identity Verification (The "Shadow" Shield)
  if (checker) {
    const symbol = checker.getSymbolAtLocation(node.expression);
    const declaration = symbol?.valueDeclaration;

    if (declaration && ts.isFunctionDeclaration(declaration)) {
      const declFile = declaration.getSourceFile().fileName;
      const callFile = node.getSourceFile().fileName;

      /**
       * 💎 LOGIC:
       * If the function is declared in the SAME file where it's called,
       * it is a "Fake" or "Shadow" function. We skip it.
       *
       * If they differ, it's an external import (our Library),
       * so we trigger the Miner.
       */
      if (declFile === callFile) {
        return false;
      }
    }
  }

  return true;
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
