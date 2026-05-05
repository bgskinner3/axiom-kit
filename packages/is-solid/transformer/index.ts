// transformer/index.ts
import './reifiers/registry';
import ts from 'typescript';
import { createVisitor } from './visitor';
import { emitAmbientTypes } from './emitter';

// The build-wide registry to track keys and paths
const globalKeyRegistry = new Map<string, string>();

export default function (program: ts.Program) {
  if (!program || typeof program.getTypeChecker !== 'function') {
    return (_context: ts.TransformationContext) => (node: ts.Node) => node;
  }
  return (context: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile) => {
      // 1. Mine the file for Solid types
      const visitor = createVisitor(
        program,
        context,
        sourceFile,
        globalKeyRegistry,
      );
      const result = ts.visitNode(sourceFile, visitor) as ts.SourceFile;

      if (globalKeyRegistry.size > 0) {
        emitAmbientTypes(program.getCurrentDirectory(), globalKeyRegistry);
      }

      return result;
    };
  };
}
