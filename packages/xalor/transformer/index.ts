// transformer/index.ts
import './reifiers/registry/index';
import ts from 'typescript';
import { createVisitor } from './visitor';
import { hydrateIntellisenseBridge } from './emitters';

export default function (
  program: ts.Program,
): ts.TransformerFactory<ts.SourceFile> {
  const globalKeyRegistry = new Map<string, string>();
  const rootDir = program.getCurrentDirectory();
  const sourceFiles = program.getSourceFiles();

  // 🚩 DEBUG: Transformer Initialization
  console.log(
    `[xalor] Transformer initialized. Total files in program: ${sourceFiles.length}`,
  );

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

      if (isLastFile) {
        console.log(
          `[xalor] Build Complete. Found ${globalKeyRegistry.size} solid types.`,
        );

        if (globalKeyRegistry.size > 0) {
          hydrateIntellisenseBridge(rootDir, globalKeyRegistry);
          console.log(
            `[xalor] ✨ Ambient .d.ts database updated at ${rootDir}`,
          );
        } else {
          console.warn(
            `[xalor] ⚠️ No types were registered. Check if 'isSolid' calls are being detected.`,
          );
        }
      }

      return result;
    };
  };
}
