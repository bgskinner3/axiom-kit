// transformer/index.ts
import './reifiers/registry/index';
import ts from 'typescript';
import { createVisitor } from './visitor';
import { hydrateIntellisenseBridge } from './emitters';
const globalKeyRegistry = new Map<string, string>();
export default function (
  program: ts.Program,
): ts.TransformerFactory<ts.SourceFile> {
  const rootDir = program.getCurrentDirectory();
  const sourceFiles = program.getSourceFiles();

  // 🚩 DEBUG: Transformer Initialization
  // console.log(
  //   `[xalor] Transformer initialized. Total files in program: ${sourceFiles.length}`,
  //   `GLOBAL KEY REGIATED ${globalKeyRegistry.size}`,
  //   `GLOBAL KEY CHECK ${globalKeyRegistry.size > 0}`,
  // );

  return (context: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile): ts.SourceFile => {
      // 1. Safety Guard
      if (!program || typeof program.getTypeChecker !== 'function') {
        console.warn(
          `[xalor] ⚠️ TypeChecker not found for: ${sourceFile.fileName}`,
        );
        return sourceFile;
      }

      // 🚩 DEBUG: File Entry
      // console.log(`[xalor] Processing: ${sourceFile.fileName}`);

      const visitor = createVisitor(
        program,
        context,
        sourceFile,
        globalKeyRegistry,
      );

      const result = ts.visitNode(sourceFile, visitor) as ts.SourceFile;

      // 2. Identification of the "Final" file for Emission
      // We use the file name of the last file in the compiler's list.
      const lastFile = sourceFiles[sourceFiles.length - 1];
      const isLastFile = lastFile?.fileName === sourceFile.fileName;
      const isTest = process.env.NODE_ENV === 'test';

      if (isLastFile || (isTest && globalKeyRegistry.size >= 0)) {
        // ⚡ FORCE THE EMISSION
        hydrateIntellisenseBridge(rootDir, globalKeyRegistry);
        console.log(
          `[xalor] 🚀 FORCED SYNC: Generated ${globalKeyRegistry.size} types in test mode.`,
        );
      }
      // if (isLastFile || (isTest && globalKeyRegistry.size > 0)) {
      //   if (globalKeyRegistry.size > 0) {
      //     hydrateIntellisenseBridge(rootDir, globalKeyRegistry);

      //     // Only log once at the very end
      //     console.log(
      //       `[xalor] 🏁 Build Sync: ${globalKeyRegistry.size} types solidified.`,
      //     );
      //   }
      // }
      // if (isLastFile) {
      //   console.log(
      //     `[xalor] Build Complete. Found ${globalKeyRegistry.size} solid types.`,
      //   );
      //   const isJest = process.env.JEST_WORKER_ID !== undefined;
      //   if (globalKeyRegistry.size > 0) {
      //     hydrateIntellisenseBridge(rootDir, globalKeyRegistry);
      //     console.log(
      //       `[xalor] ✨ Ambient .d.ts database updated at ${rootDir}`,
      //     );
      //   } else {
      //     console.warn(
      //       `[xalor] ⚠️ No types were registered. Check if 'isSolid' calls are being detected.`,
      //     );
      //   }
      // }

      return result;
    };
  };
}
