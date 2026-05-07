// transformer/index.ts
import './reifiers/registry/index';
// import {
//   SourceFile,
//   TransformerFactory,
//   Program,
//   TransformationContext,
// } from 'typescript';
import ts from 'typescript';
import { theMiner } from './miner';
import { hydrateIntellisenseBridge } from './emitters';
import type { TVaultSyncPayload } from './types';
import { visitNode } from 'typescript';
import { XalethorVaultArchive } from '../src/xalor-vault/vault-archive';

export default function (
  program: ts.Program,
): ts.TransformerFactory<ts.SourceFile> {
  const rootDir = program.getCompilerOptions().rootDir ?? process.cwd();
  const sourceFiles = program.getSourceFiles();
  // The strictly-typed in-memory manifest for this build session.
  const globalKeyRegistry = new Map<string, TVaultSyncPayload>();

  return (context: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile): ts.SourceFile => {
      if (!program || typeof program.getTypeChecker !== 'function') {
        console.warn(
          `[xalor] ⚠️ TypeChecker not found for: ${sourceFile.fileName}`,
        );
        return sourceFile;
      }

      // 1. Traverse the AST and extract the metadata
      const visitor = theMiner(program, context, sourceFile, globalKeyRegistry);
      const transformedFile = visitNode(sourceFile, visitor) as ts.SourceFile;

      // 2. STAGE 4 TRIGGER: The Final Flush
      const lastFile = sourceFiles[sourceFiles.length - 1];
      const isLastFile = lastFile?.fileName === sourceFile.fileName;
      const isTest = process.env.NODE_ENV === 'test';
      if (isLastFile || (isTest && globalKeyRegistry.size >= 0)) {
        const archive = new XalethorVaultArchive();

        // 🏁 FLUSH A: The Genesis Cache (For Jest/Runtime)
        archive.persist(rootDir, globalKeyRegistry);

        // 🏁 FLUSH B: The Ghost Bridge (For the IDE)
        hydrateIntellisenseBridge(rootDir, globalKeyRegistry);
        console.log(
          `[xalor] 🚀 FORCED SYNC: Generated ${globalKeyRegistry.size} types in test mode.`,
        );
      }

      return transformedFile;
    };
  };
  // return (context: TransformationContext) => (sourceFile: SourceFile) => {
  // if (!program || typeof program.getTypeChecker !== 'function') {
  //   console.warn(
  //     `[xalor] ⚠️ TypeChecker not found for: ${sourceFile.fileName}`,
  //   );
  //   return sourceFile;
  // }

  // // 1. Traverse the AST and extract the metadata
  // const visitor = theMiner(program, context, sourceFile, globalKeyRegistry);
  // const transformedFile = visitNode(sourceFile, visitor) as SourceFile;

  // // 2. STAGE 4 TRIGGER: The Final Flush
  // const lastFile = sourceFiles[sourceFiles.length - 1];
  // const isLastFile = lastFile?.fileName === sourceFile.fileName;
  // const isTest = process.env.NODE_ENV === 'test';
  // if (isLastFile || (isTest && globalKeyRegistry.size >= 0)) {
  //   const archive = new XalethorVaultArchive();

  //   // 🏁 FLUSH A: The Genesis Cache (For Jest/Runtime)
  //   archive.persist(rootDir, globalKeyRegistry);

  //   // 🏁 FLUSH B: The Ghost Bridge (For the IDE)
  //   hydrateIntellisenseBridge(rootDir, globalKeyRegistry);
  //   console.log(
  //     `[xalor] 🚀 FORCED SYNC: Generated ${globalKeyRegistry.size} types in test mode.`,
  //   );
  // }

  // return transformedFile;
  // };
}
// TODO: DELETE
// import { identifySolidCall } from './detector';
// import { solidVisitorProcessor } from './processor';
// import { visitEachChild } from 'typescript';
// import { reifyType } from '../reifiers';
// import { isSolidCall } from '../utils';
// import type {
//   Program,
//   TransformationContext,
//   SourceFile,
//   Visitor,
//   Node,
// } from 'typescript';
// import { IS_SOLID_CONFIG_ITEMS } from '../../src/models/constants';
// import { markAsPure, syncVault, getSpatialIdentity } from './resolvers';
// import type { TVaultSyncPayload } from '../types';
// /**
//  * The Miner (Build-Time Extraction)
//  *
//  * The createVisitor function orchestrates the transformation process. It scans
//  * the Abstract Syntax Tree (AST), identifies `isSolid` calls, and bridges
//  * the gap between static TypeScript types and runtime JavaScript metadata.
//  *
//  * Workflow:
//  * 1. SCAN: Traverses the file node by node.
//  * 2. IDENTIFY: Uses `isSolidCall` to find the target function.
//  * 3. ANALYZE: Queries the TypeChecker to resolve the generic <Key, Type>.
//  * 4. REGISTRY: Logs the Key and its origin file to the Global Vault Index.
//  * 5. REIFY: Recursively converts the TS Type into a JSON-friendly "Solid Shape".
//  * 6. PROCESS: Replaces the original call with optimized runtime registration logic.
//  */

// export function theMiner(
//   program: Program,
//   context: TransformationContext,
//   sourceFile: SourceFile,
//   globalRegistry: Map<string, TVaultSyncPayload>,
// ): Visitor {
//   const checker = program.getTypeChecker();
//   const { factory } = context;

//   const visitor: Visitor = (node: Node): Node => {
//     // 🚩 CHECKPOINT 1: Is the Detector seeing the function name?
//     if (!isSolidCall(node, checker)) {
//       return visitEachChild(node, visitor, context);
//     }

//     // 🚩 CHECKPOINT 2: Are the Generics missing?
//     if (!node.typeArguments || node.typeArguments.length < 2) return node;

//     const { keyType, shapeType } = identifySolidCall({ node, checker });
//     const shape = reifyType(shapeType, checker, new Set());

//     if (keyType.isStringLiteral()) {
//       const key = keyType.value;
//       const identity = getSpatialIdentity({
//         node,
//         sourceFile,
//         shapeType,
//         checker,
//       });
//       const payload = {
//         key,
//         filePath: sourceFile.fileName,
//         area: identity.area,
//         symbolName: identity.symbolName,
//         typeName: identity.typeName,
//         shape,
//         version: IS_SOLID_CONFIG_ITEMS.solidVersion,
//       };

//       /* prettier-ignore */ syncVault({ registry: globalRegistry, payload });
//       /* prettier-ignore */ const updatedCall = solidVisitorProcessor({ shape, factory, key, sourceFile, node,});
//       return markAsPure(updatedCall);
//     }

//     return visitEachChild(node, visitor, context);
//   };

//   return visitor;
// }
