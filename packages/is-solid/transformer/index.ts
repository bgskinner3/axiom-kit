import ts from 'typescript';
import { createVisitor } from './visitor';

// The build-wide registry to track keys and paths
const globalKeyRegistry = new Map<string, string>();

export default function (program: ts.Program) {
  return (context: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile) => {
      const visitor = createVisitor(
        program,
        context,
        sourceFile,
        globalKeyRegistry,
      );
      return ts.visitNode(sourceFile, visitor);
    };
  };
}
