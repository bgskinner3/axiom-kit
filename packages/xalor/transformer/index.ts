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

      if (isLastFile || (isTest && globalKeyRegistry.size >= 0)) {
        const archive = new XalethorVaultArchive();

        // 🏁 FLUSH A: The Genesis Cache (Saves to Disk)
        archive.persist(rootDir, globalKeyRegistry);

        // 🏁 FLUSH B: The Ghost Bridge (Saves to .d.ts)
        hydrateIntellisenseBridge(rootDir, globalKeyRegistry);

        // 🚀 NEW - THE INJECTION: Populate Memory immediately for Tests
        if (isTest && globalKeyRegistry.size > 0) {
          globalKeyRegistry.forEach((payload) => {
            // 💎 This maps the Miner's payload to the Triple-KV Vaults
            XalethorVault.solidify(payload);
          });
          console.log(
            `[xalor] 🚀 FORCED SYNC: Solidified ${globalKeyRegistry.size} types in RAM.`,
          );
        }
      }

      return transformedFile;
    };
  };
}
