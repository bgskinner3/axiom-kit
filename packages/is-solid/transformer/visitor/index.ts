// transformer/visitor/index.ts
import { identifySolidCall } from './detector';
import { reifyType } from '../reifiers';
import { solidVisitorProcessor } from './processor';
import { isSolidCall } from '../../models/guards/transformer';
import {
  addSyntheticLeadingComment,
  visitEachChild,
  SyntaxKind,
} from 'typescript';
import type {
  Program,
  TransformationContext,
  SourceFile,
  Visitor,
  TypeChecker,
  Node,
} from 'typescript';
export function createVisitor(
  program: Program,
  context: TransformationContext,
  sourceFile: SourceFile,
  globalRegistry: Map<string, string>,
): Visitor {
  const checker: TypeChecker = program.getTypeChecker();
  const { factory } = context;

  const visitor: Visitor = (node: Node): Node => {
    // ONE: identify valid isSolid calls using node guards
    if (isSolidCall(node)) {
      // TWO: extract type information for the key and the shape
      const { keyType, shapeType } = identifySolidCall({ node, checker });
      if (keyType.isStringLiteral()) {
        const key = keyType.value;
        const filePath = sourceFile.fileName;
        // THREE: enforce global key uniqueness and track source file for the ambient emitter
        const existing = globalRegistry.get(key);
        if (existing && existing !== filePath)
          throw new Error(`[is-solid] Collision: ${key}`);

        globalRegistry.set(key, filePath);

        // 4: reify the typescript type into a solidified json shape
        // TODO note!: fresh set passed to prevent cross-call recursion leaks
        /* prettier-ignore */ const shape = reifyType(shapeType, checker, new Set());

        // FIVE: transform the call by injecting metadata as the second argument
        /* prettier-ignore */ const updatedCall = solidVisitorProcessor({ shape, factory, key, sourceFile, node });

        // 6: append purity annotation to assist downstream minifiers
        return addSyntheticLeadingComment(
          updatedCall,
          SyntaxKind.MultiLineCommentTrivia,
          '* @__PURE__ ',
          true,
        );
      }
    }

    return visitEachChild(node, visitor, context);
  };

  return visitor;
}

/**
 *
 *
 * TODO: DELETE
 */

// // transformer/visitor.ts
// import ts from 'typescript';
// import { isSolidCall } from './utils/guards';
// import { reifyType } from './reifiers';
// import { generateShapeAST } from './reifiers';

// /**
//  * The Brain of the transformation.
//  * Walks the AST, extracts ghost types, and solidifies them.
//  */
// export function createVisitor(
//   program: ts.Program,
//   context: ts.TransformationContext,
//   sourceFile: ts.SourceFile,
//   globalRegistry: Map<string, string>,
// ): ts.Visitor {
//   const checker = program.getTypeChecker();
//   const { factory: f } = context;

//   const visitor: ts.Visitor = (node: ts.Node): ts.Node => {
//     // 1. Target only 'isSolid' calls
//     if (isSolidCall(node)) {
//       const typeArgs = node.typeArguments;

//       // 2. Ensure we have <Key, Type>
//       if (typeArgs && typeArgs.length >= 2) {
//         const keyNode = typeArgs[0];
//         const shapeNode = typeArgs[1];

//         const keyType = checker.getTypeFromTypeNode(keyNode);
//         const shapeType = checker.getTypeFromTypeNode(shapeNode);

//         if (keyType.isStringLiteral()) {
//           const key = keyType.value;
//           const filePath = sourceFile.fileName;

//           // 3. Collision Policy
//           const existingFile = globalRegistry.get(key);
//           if (existingFile && existingFile !== filePath) {
//             throw new Error(
//               `[is-solid] Collision: Key "${key}" already registered in ${existingFile}. ` +
//                 `Attempted re-registration in ${filePath}`,
//             );
//           }

//           // 4. Update Build Registry for Ambient Emitter
//           globalRegistry.set(key, filePath);

//           // ✨ CHANGE: Pass a 'new Set()' to every top-level call.
//           // This prevents recursion references from leaking between different isSolid calls.
//           const shape = reifyType(shapeType, checker, new Set());

//           // 6. Create Metadata Object
//           const { line, character } = sourceFile.getLineAndCharacterOfPosition(
//             node.getStart(),
//           );
//           const areaString = `${filePath}:${line + 1}:${character + 1}`;

//           const metadata = f.createObjectLiteralExpression([
//             f.createPropertyAssignment('key', f.createStringLiteral(key)),
//             f.createPropertyAssignment(
//               'area',
//               f.createStringLiteral(areaString),
//             ),
//             f.createPropertyAssignment('shape', generateShapeAST(f, shape)),
//           ]);

//           // ✨ CHANGE: Strict Argument Slotting.
//           // Your runtime signature is isSolid(data, injected).
//           // If the user calls isSolid<K, T>(), we must inject 'undefined' into slot 0
//           // to ensure 'metadata' always lands in slot 1 (the 'injected' param).
//           const finalArgs =
//             node.arguments.length === 0
//               ? [f.createIdentifier('undefined'), metadata]
//               : [node.arguments[0], metadata];

//           // ✨ CHANGE: Mark the call as Pure.
//           // This allows build tools (esbuild/terser) to remove the call if the result
//           // isn't used, which is common when isSolid is used just for registration.
//           const updatedCall = f.updateCallExpression(
//             node,
//             node.expression,
//             node.typeArguments,
//             finalArgs,
//           );

//           return ts.addSyntheticLeadingComment(
//             updatedCall,
//             ts.SyntaxKind.MultiLineCommentTrivia,
//             '* @__PURE__ ',
//             true,
//           );
//         }
//       }
//     }

//     return ts.visitEachChild(node, visitor, context);
//   };

//   return visitor;
// }
// TODO: REOMVE OLD v2
// export function createVisitor(
//   program: ts.Program,
//   context: ts.TransformationContext,
//   sourceFile: ts.SourceFile,
//   globalRegistry: Map<string, string>,
// ): ts.Visitor {
//   const checker = program.getTypeChecker();
//   const { factory: f } = context;

//   const visitor: ts.Visitor = (node: ts.Node): ts.Node => {
//     if (isSolidCall(node)) {
//       const typeArgs = node.typeArguments;

//       if (typeArgs && typeArgs.length >= 2) {
//         const keyNode = typeArgs[0];
//         const shapeNode = typeArgs[1];

//         const keyType = checker.getTypeFromTypeNode(keyNode);
//         const shapeType = checker.getTypeFromTypeNode(shapeNode);

//         if (keyType.isStringLiteral()) {
//           const key = keyType.value;

//           // 1. Get the Absolute Path (unique across monorepo)
//           const filePath = sourceFile.fileName;

//           // 2. Get the Line/Character for precise debugging
//           const { line, character } = sourceFile.getLineAndCharacterOfPosition(
//             node.getStart(),
//           );
//           const areaString = `${filePath}:${line + 1}:${character + 1}`;

//           // 🚨 Strict Collision Policy (using absolute path)
//           const existingFile = globalRegistry.get(key);
//           if (existingFile && existingFile !== filePath) {
//             throw new Error(
//               `[is-solid] Collision: Key "${key}" already registered in ${existingFile}. ` +
//                 `Attempted re-registration in ${filePath}`,
//             );
//           }
//           globalRegistry.set(key, filePath);

//           const shape = reifyType(shapeType, checker);

//           return f.updateCallExpression(
//             node,
//             node.expression,
//             node.typeArguments,
//             [
//               ...node.arguments,
//               f.createObjectLiteralExpression([
//                 f.createPropertyAssignment('key', f.createStringLiteral(key)),
//                 // 3. Inject the unique Area string
//                 f.createPropertyAssignment(
//                   'area',
//                   f.createStringLiteral(areaString),
//                 ),
//                 // f.createPropertyAssignment(
//                 //   'version',
//                 //   f.createStringLiteral(SOLID_CONFIG.version),
//                 // ),
//                 f.createPropertyAssignment('shape', generateShapeAST(f, shape)),
//               ]),
//             ],
//           );
//         }
//       }
//     }

//     return ts.visitEachChild(node, visitor, context);
//   };

//   return visitor;
// }
// TODO: REOMVE OLD OLD
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
