// transformer/index.ts
import './reifiers/registry';
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
/**
 // transformer/index.ts
import * as fs from 'fs';
import * as path from 'path';

export default function (program: ts.Program) {
  return (context: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile) => {
      // 1. Run the visitor as usual
      const visitor = createVisitor(program, context, sourceFile, globalKeyRegistry);
      const transformedFile = ts.visitNode(sourceFile, visitor) as ts.SourceFile;

      // 2. EMIT AMBIENT TYPES (The Phonebook)
      // We write this to the models folder so the IDE sees it
      const modelsPath = path.join(program.getCurrentDirectory(), 'models', 'solid-env.d.ts');
      
      let dtsContent = `// 💎 SOLIDIFIED TYPE DATABASE\nimport type { TSolid } from './index';\ndeclare module 'is-solid' {\n`;
      
      globalKeyRegistry.forEach((filePath, key) => {
        // We use 'any' for the type in the .d.ts because the runtime 
        // will handle the actual validation via the injected JSON.
        dtsContent += `  export function isSolid(data: unknown): data is TSolid<'${key}', any>;\n`;
      });
      
      dtsContent += `}`;

      // Write file (ensure models dir exists)
      if (!fs.existsSync(path.dirname(modelsPath))) fs.mkdirSync(path.dirname(modelsPath));
      fs.writeFileSync(modelsPath, dtsContent);

      return transformedFile;
    };
  };
}

 */
