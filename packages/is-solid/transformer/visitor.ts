import ts from 'typescript';
import { isSolidCall } from './utils/guards';
import { reifyType } from './reifiers';
import { generateShapeAST } from './reifiers';

/**
 * The Brain of the transformation.
 * Walks the AST, extracts ghost types, and solidifies them.
 */
export function createVisitor(
  program: ts.Program,
  context: ts.TransformationContext,
  sourceFile: ts.SourceFile,
  globalRegistry: Map<string, string>,
): ts.Visitor {
  const checker = program.getTypeChecker();
  const { factory: f } = context;

  const visitor: ts.Visitor = (node: ts.Node): ts.Node => {
    if (isSolidCall(node)) {
      const typeArgs = node.typeArguments;

      if (typeArgs && typeArgs.length >= 2) {
        const keyNode = typeArgs[0];
        const shapeNode = typeArgs[1];

        const keyType = checker.getTypeFromTypeNode(keyNode);
        const shapeType = checker.getTypeFromTypeNode(shapeNode);

        if (keyType.isStringLiteral()) {
          const key = keyType.value;

          // 1. Get the Absolute Path (unique across monorepo)
          const filePath = sourceFile.fileName;

          // 2. Get the Line/Character for precise debugging
          const { line, character } = sourceFile.getLineAndCharacterOfPosition(
            node.getStart(),
          );
          const areaString = `${filePath}:${line + 1}:${character + 1}`;

          // 🚨 Strict Collision Policy (using absolute path)
          const existingFile = globalRegistry.get(key);
          if (existingFile && existingFile !== filePath) {
            throw new Error(
              `[is-solid] Collision: Key "${key}" already registered in ${existingFile}. ` +
                `Attempted re-registration in ${filePath}`,
            );
          }
          globalRegistry.set(key, filePath);

          const shape = reifyType(shapeType, checker);

          return f.updateCallExpression(
            node,
            node.expression,
            node.typeArguments,
            [
              ...node.arguments,
              f.createObjectLiteralExpression([
                f.createPropertyAssignment('key', f.createStringLiteral(key)),
                // 3. Inject the unique Area string
                f.createPropertyAssignment(
                  'area',
                  f.createStringLiteral(areaString),
                ),
                f.createPropertyAssignment('shape', generateShapeAST(f, shape)),
              ]),
            ],
          );
        }
      }
    }

    return ts.visitEachChild(node, visitor, context);
  };

  return visitor;
}
// export function createVisitor(
//   program: ts.Program,
//   context: ts.TransformationContext,
//   sourceFile: ts.SourceFile,
//   globalRegistry: Map<string, string>,
// ): ts.Visitor {
//   const checker = program.getTypeChecker();
//   const { factory: f } = context;

//   const visitor: ts.Visitor = (node: ts.Node): ts.Node => {
//     // 1. Identification: Search for the Ghost
//     if (isSolidCall(node)) {
//       const typeArgs = node.typeArguments;

//       // isSolid requires <Key, Type>
//       if (typeArgs && typeArgs.length >= 2) {
//         const keyNode = typeArgs[0];
//         const shapeNode = typeArgs[1];

//         // 2. Extract Types safely
//         const keyType = checker.getTypeFromTypeNode(keyNode);
//         const shapeType = checker.getTypeFromTypeNode(shapeNode);

//         if (keyType.isStringLiteral()) {
//           const key = keyType.value;

//           // 🚨 Strict Collision Policy
//           const existingFile = globalRegistry.get(key);
//           if (existingFile && existingFile !== sourceFile.fileName) {
//             throw new Error(
//               `[is-solid] Collision: Key "${key}" is already registered in ${existingFile}. ` +
//                 `Duplicates are forbidden in the Global Vault.`,
//             );
//           }
//           globalRegistry.set(key, sourceFile.fileName);

//           // 3. Reification: Mine the complex type metadata
//           // No any/as - reifyType returns a strict TSolidShape
//           const shape = reifyType(shapeType, checker);

//           // 4. Solidification: Swap the Ghost for a Solid Call
//           // We update the call to: isSolid(data, { ...metadata })
//           return f.updateCallExpression(
//             node,
//             node.expression,
//             node.typeArguments,
//             [
//               ...node.arguments, // Keep original data argument
//               f.createObjectLiteralExpression([
//                 f.createPropertyAssignment('key', f.createStringLiteral(key)),
//                 f.createPropertyAssignment(
//                   'area',
//                   f.createStringLiteral(sourceFile.fileName),
//                 ),
//                 f.createPropertyAssignment('shape', generateShapeAST(f, shape)),
//               ]),
//             ],
//           );
//         }
//       }
//     }

//     // 5. Delegation: Continue walking the tree
//     // This is the recursive "yield" equivalent for ASTs
//     return ts.visitEachChild(node, visitor, context);
//   };

//   return visitor;
// }
