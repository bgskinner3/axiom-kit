// transformer/index.ts
import './reifiers/registry/index';
import ts from 'typescript';
import { createVisitor } from './visitor';
import { emitAmbientTypes } from './emitter';

// The build-wide registry to track keys and paths
// const globalKeyRegistry = new Map<string, string>();
// export default function (
//   program: ts.Program,
// ): ts.TransformerFactory<ts.SourceFile> {
//   const globalKeyRegistry = new Map<string, string>();
//   const rootDir = program.getCurrentDirectory();

//   return (context: ts.TransformationContext) => {
//     return (sourceFile: ts.SourceFile): ts.SourceFile => {
//       if (!program || typeof program.getTypeChecker !== 'function')
//         return sourceFile;

//       const visitor = createVisitor(
//         program,
//         context,
//         sourceFile,
//         globalKeyRegistry,
//       );
//       const result = ts.visitNode(sourceFile, visitor) as ts.SourceFile;

//       // 💎 THE FIX: We need to know if this is the "last" file.
//       // In a test/build, we can trigger the emit manually at the end,
//       // but for the transformer, we should check if the registry is being built.

//       // If we are in the last file of the program, emit the full registry.
//       const isLastFile =
//         program.getSourceFiles().at(-1)?.fileName === sourceFile.fileName;

//       if (isLastFile && globalKeyRegistry.size > 0) {
//         emitAmbientTypes(rootDir, globalKeyRegistry);
//       }

//       return result;
//     };
//   };
// }
export default function (
  program: ts.Program,
): ts.TransformerFactory<ts.SourceFile> {
  // 💎 SCOPED REGISTRY: Every build starts fresh
  const globalKeyRegistry = new Map<string, string>();
  const rootDir = program.getCurrentDirectory();
  const sourceFiles = program.getSourceFiles();

  return (context: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile): ts.SourceFile => {
      if (!program || typeof program.getTypeChecker !== 'function')
        return sourceFile;

      const visitor = createVisitor(
        program,
        context,
        sourceFile,
        globalKeyRegistry,
      );
      const result = ts.visitNode(sourceFile, visitor) as ts.SourceFile;

      // 💎 EMIT LOGIC: Emit only on the last file of the program
      const isLastFile =
        sourceFiles[sourceFiles.length - 1]?.fileName === sourceFile.fileName;

      if (isLastFile && globalKeyRegistry.size > 0) {
        emitAmbientTypes(rootDir, globalKeyRegistry);
      }

      return result;
    };
  };
}
// export default function (
//   program: ts.Program,
// ): ts.TransformerFactory<ts.SourceFile> {
//   const globalKeyRegistry = new Map<string, string>();
//   // if (!program || typeof program.getTypeChecker !== 'function') {
//   //   return (_context: ts.TransformationContext) => (node: ts.Node) => node;
//   // }

//   return (context: ts.TransformationContext) => {
//     return (sourceFile: ts.SourceFile) => {
//       if (!program || typeof program.getTypeChecker !== 'function') {
//         return sourceFile;
//       }
//       const visitor = createVisitor(
//         program,
//         context,
//         sourceFile,
//         globalKeyRegistry,
//       );
//       const result = ts.visitNode(sourceFile, visitor) as ts.SourceFile;

//       if (globalKeyRegistry.size > 0) {
//         emitAmbientTypes(program.getCurrentDirectory(), globalKeyRegistry);
//       }

//       return result;
//     };
//   };
// }
