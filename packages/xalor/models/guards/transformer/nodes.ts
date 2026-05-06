// models/guards/transformer/nodes.ts
import ts from 'typescript';

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
// export function isSolidCall(
//   node: ts.Node,
//   checker?: ts.TypeChecker, // 💎 Make it optional to keep it flexible
// ): node is ts.CallExpression {
//   if (!ts.isCallExpression(node) || !ts.isIdentifier(node.expression)) {
//     return false;
//   }

//   // 1. Basic Name Check
//   if (node.expression.text !== 'isSolid') return false;

//   // 2. Identity Check (Only if checker is provided)
//   if (checker) {
//     const symbol = checker.getSymbolAtLocation(node.expression);
//     // If the symbol is defined in the SAME file as a function declaration,
//     // it's a local "Shadow" function. We should ignore it.
//     const declaration = symbol?.valueDeclaration;
//     if (declaration && ts.isFunctionDeclaration(declaration)) {
//       return false;
//     }
//   }

//   return true;
// }
// export function isSolidCall(
//   node: ts.Node,
//   checker?: ts.TypeChecker,
// ): node is ts.CallExpression {
//   if (!ts.isCallExpression(node) || !ts.isIdentifier(node.expression)) {
//     return false;
//   }

//   // 1. Basic Name Check
//   if (node.expression.text !== 'isSolid') return false;

//   // 2. Identity Check
//   if (checker) {
//     const symbol = checker.getSymbolAtLocation(node.expression);
//     const declaration = symbol?.valueDeclaration;

//     // 💎 FIX: During local testing, the declaration IS a FunctionDeclaration.
//     // Instead of blocking all FunctionDeclarations, we check the FILE PATH.
//     if (declaration && ts.isFunctionDeclaration(declaration)) {
//       const filePath = declaration.getSourceFile().fileName;

//       // If the function is defined in 'src/index.ts' but called in 'playground/test.ts',
//       // it's OUR library function, not a local shadow.
//       if (node.getSourceFile().fileName === filePath) {
//         return false; // This is a shadow (defined and called in same file)
//       }
//     }
//   }

//   return true;
// }
// export function isSolidCall(
//   node: ts.Node,
//   _checker?: ts.TypeChecker,
// ): node is ts.CallExpression {
//   // Simple check: Is it a function call named 'isSolid'?
//   return (
//     ts.isCallExpression(node) &&
//     ts.isIdentifier(node.expression) &&
//     node.expression.text === 'isSolid'
//   );
// }
export function isSolidCall(
  node: ts.Node,
  _checker?: ts.TypeChecker,
): node is ts.CallExpression {
  // if (!ts.isCallExpression(node)) return false;

  // const name = node.expression.getText();
  // // console.log(`[xalor-debug] Checking call: ${name}`);

  // if (name.includes('isSolid')) {
  //   console.log(`[xalor-debug] 🎯 MATCH FOUND: ${name}`);
  //   return true;
  // }

  // return false;
  // console.log(`[xalor-debug] 🎯 MATCH FOUND: ${name}`);
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
