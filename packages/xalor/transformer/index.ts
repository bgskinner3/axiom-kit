// transformer/index.ts
import './reifiers/registry/index';
import ts from 'typescript';
import type { TVaultSyncPayload } from '../src/models/types';
import {
  bootloader,
  shouldProcessFile,
  runMiningPass,
  handlePersistenceGate,
} from './utils';

/**
 * 💎 XALOR TRANSFORMER ENTRY POINT
 *
 * ROLE:
 * The primary orchestrator for Stage 4 (Build-Time Construction).
 * It manages the lifecycle of type extraction, code injection,
 * and persistent storage.
 */
export default function (
  program: ts.Program,
): ts.TransformerFactory<ts.SourceFile> {
  const rootDir = program.getCompilerOptions().rootDir ?? process.cwd();
  const sessionRegistry = new Map<string, string>();
  const globalKeyRegistry = new Map<string, TVaultSyncPayload>();

  bootloader(rootDir);

  return (context: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile): ts.SourceFile => {
      const snapshotSize = globalKeyRegistry.size;

      /** (Short-Circuit) */
      if (!shouldProcessFile(sourceFile, program)) {
        return handlePersistenceGate(
          sourceFile,
          program,
          rootDir,
          globalKeyRegistry,
          snapshotSize,
        );
      }

      /**  (Extraction & Injection) */
      const transformedFile = runMiningPass(
        program,
        context,
        sourceFile,
        globalKeyRegistry,
        sessionRegistry,
      );
      /** (Persistence Gate) */
      return handlePersistenceGate(
        transformedFile,
        program,
        rootDir,
        globalKeyRegistry,
        snapshotSize,
      );
    };
  };
}

// export default function (
//   program: ts.Program,
// ): ts.TransformerFactory<ts.SourceFile> {
//   const rootDir = program.getCompilerOptions().rootDir ?? process.cwd();
//   const sessionRegistry = new Map<string, string>();
//   const globalKeyRegistry = new Map<string, TVaultSyncPayload>();

//   bootloader(rootDir);

//   return (context: ts.TransformationContext) => {
//     return (sourceFile: ts.SourceFile): ts.SourceFile => {
//       /** (Short-Circuit) */
//       if (!shouldProcessFile(sourceFile, program)) {
//         return handlePersistenceGate(
//           sourceFile,
//           program,
//           rootDir,
//           globalKeyRegistry,
//         );
//       }

//       /**  (Extraction & Injection) */
//       const transformedFile = runMiningPass(
//         program,
//         context,
//         sourceFile,
//         globalKeyRegistry,
//         sessionRegistry,
//       );
//       /** (Persistence Gate) */
//       return handlePersistenceGate(
//         transformedFile,
//         program,
//         rootDir,
//         globalKeyRegistry,
//       );
//     };
//   };
// }
