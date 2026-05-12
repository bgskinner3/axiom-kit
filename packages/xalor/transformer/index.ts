// transformer/index.ts
import './reifiers/registry/index';
import ts from 'typescript';
import { theMiner } from './miner';
import { hydrateIntellisenseBridge } from './emitters';
import type { TVaultSyncPayload } from './types';
import { visitNode } from 'typescript';
import { XalethorVaultArchive } from '../src/xalor-vault/vault-archive';
import { XalethorVault } from '../src/xalor-vault';

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

      /**
       * 🏁 STAGE 4 TRIGGER: THE PERSISTENCE GATE
       *
       * We trigger the flush if:
       * 1. It's the last file of a full production build.
       * 2. We are in a Test Environment AND we actually found types to save.
       */
      const shouldFlush = isLastFile || (isTest && globalKeyRegistry.size > 0);

      if (shouldFlush) {
        const archive = new XalethorVaultArchive();

        // 💾 PERSISTENCE: Create node_modules/.cache/xalor/vault-snapshot.json
        archive.persist(rootDir, globalKeyRegistry);

        // 🌉 BRIDGE: Create src/.xalor/solid-env.d.ts
        hydrateIntellisenseBridge(rootDir, globalKeyRegistry);

        // 🚀 INJECTION: If testing, populate RAM so the current test passes
        if (isTest) {
          globalKeyRegistry.forEach((payload) => {
            XalethorVault.solidify(payload);
          });

          // Log only once per file to keep output clean
          console.log(
            `[xalor] 📦 Test Environment Synced: ${globalKeyRegistry.size} types cached & injected.`,
          );
        }
      }

      return transformedFile;
    };
  };
}
