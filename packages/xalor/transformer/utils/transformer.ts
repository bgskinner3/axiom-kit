// utils/transformer.ts
import ts from 'typescript';
import { theMiner } from '../miner';
import { hydrateIntellisenseBridge } from '../emitters';
import type { TVaultSyncPayload } from '../../src/models/types';
import { visitNode } from 'typescript';
import { XalethorService } from '../../src/xalor-service';
import { logDev } from '../../src/utils';
import { IS_SOLID_CONFIG_ITEMS } from '../../src/models/constants';

/**
 *
 * ROLE:
 * Ensures the Transformer is "Hydrated" before it begins.
 *
 * PURPOSE:
 * Reads existing blueprints from the Bunker so the Transformer
 * is aware of pre-registered UUIDs and avoids collisions.
 */
export function bootloader(rootDir: string): void {
  try {
    const archive = new XalethorService();
    archive.hydrateFromGenesis(rootDir);
    /* prettier-ignore */ logDev(`[xalor:stage-4.5] ⚡ Bootloader: Vault hydrated from Genesis.`, { service: 'transformer/index.ts' });
  } catch {
    /* prettier-ignore */ logDev( `[xalor:stage-4.5] 🌬️ Bootloader: No Genesis Cache found. Starting volatile.`, { service: 'transformer/index.ts', type: 'warn', override: true }, );
  }
}
/**
 *
 * ROLE:
 * Performance Bailout / First-Pass Filter.
 *
 * STRATEGY:
 * Uses 'sentryTriggers' (isXalor, toXalor) to perform a raw string search.
 * This avoids the astronomical cost of AST walking for files that
 * don't interact with the library.
 */
export function shouldProcessFile(
  file: ts.SourceFile,
  program: ts.Program,
): boolean {
  if (!program || typeof program.getTypeChecker !== 'function') return false;

  const triggers = IS_SOLID_CONFIG_ITEMS.sentryTriggers;
  return triggers.some((fn) => file.text.includes(fn));
}
/**
 *
 * ROLE:
 * The AST Transformation Engine.
 *
 * STRATEGY:
 * Visits every node to reify TypeScript types into JSON-friendly shapes.
 * It simultaneously rewrites calls to inject the extracted metadata
 * as runtime arguments.
 */
export function runMiningPass(
  program: ts.Program,
  context: ts.TransformationContext,
  sourceFile: ts.SourceFile,
  globalRegistry: Map<string, TVaultSyncPayload>,
  sessionRegistry: Map<string, string>,
): ts.SourceFile {
  const visitor = theMiner({
    program,
    context,
    sourceFile,
    globalRegistry,
    sessionRegistry,
  });
  return visitNode(sourceFile, visitor) as ts.SourceFile;
}
/**
 *
 * ROLE:
 * Persistence and Bridge Synchronization.
 *
 * STRATEGY:
 * Monitors the file stream. When the 'Last File' is reached, it flushes
 * the in-memory registry to the disk (Bunker) and updates the Ghost Types (Bridge).
 * In test environments, it also populates the RAM for immediate execution.
 */
export function handlePersistenceGate(
  file: ts.SourceFile,
  program: ts.Program,
  rootDir: string,
  registry: Map<string, TVaultSyncPayload>,
): ts.SourceFile {
  const allFiles = program.getSourceFiles();
  const isLastFile = allFiles[allFiles.length - 1]?.fileName === file.fileName;
  const isTest = process.env.NODE_ENV === 'test';

  /** ⚖️ Determine if we should trigger the Stage 4 Persistence */
  const shouldFlush = isLastFile || (isTest && registry.size > 0);

  if (shouldFlush) {
    const archive = new XalethorService();

    // 💾 FLUSH TO DISK: node_modules/.cache/xalor/vault-snapshot.json
    archive.persist({ rootDir, registry });

    // 🌉 SYNC BRIDGE: src/.xalor/solid-env.d.ts
    hydrateIntellisenseBridge(rootDir, registry);

    // 🚀 INJECT RAM: Populate Vault for Test Runners (Jest/Vitest)
    if (isTest) {
      registry.forEach((payload) => XalethorService.solidify(payload));
      logDev(
        `[xalor] 📦 Test Environment Synced: ${registry.size} types cached & injected.`,
        { service: 'transformer/index.ts' },
      );
    }
  }

  return file;
}
