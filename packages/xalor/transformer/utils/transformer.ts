// utils/transformer.ts
import ts from 'typescript';
import { theMiner } from '../miner';
import { hydrateIntellisenseBridge } from '../emitters';
import type { TVaultSyncPayload } from '../../shared';
import { visitNode } from 'typescript';
import { XalethorService } from '../../src/xalor-service';
import {
  logDev,
  SENTRY_TRIGGER_NAMES,
  IS_SOLID_CONFIG_ITEMS,
  processGenesisHydration,
} from '../../shared';
import * as fs from 'fs';
import * as path from 'path';
import { ensureBaselineCache } from './guards';
/**
 *
 * ROLE:
 * Ensures the Transformer is "Hydrated" before it begins.
 *
 * PURPOSE:
 * Reads existing blueprints from the Bunker so the Transformer
 * is aware of pre-registered UUIDs and avoids collisions.
 */
export function bootloader(
  rootDir: string,
  globalKeyRegistry: Map<string, TVaultSyncPayload>,
): void {
  /* prettier-ignore */ const localCacheDir = path.join(rootDir, IS_SOLID_CONFIG_ITEMS.lifeCyclePaths.cacheDir);
  /* prettier-ignore */ let cacheFile = path.join(localCacheDir, IS_SOLID_CONFIG_ITEMS.lifeCyclePaths.vaultFile);

  if (!fs.existsSync(cacheFile)) {
    /* prettier-ignore */ const templateSnapshotPath = path.join(__dirname, '../static-templates/vault-snapshot.json');
    cacheFile = ensureBaselineCache(localCacheDir, templateSnapshotPath);
  }

  if (!fs.existsSync(cacheFile)) return;

  try {
    const rawContent = fs.readFileSync(cacheFile, 'utf-8');

    // 🚀 Execute the Shared Pure Parsing Engine
    processGenesisHydration(rawContent, (metadata) => {
      globalKeyRegistry.set(metadata.key, metadata as TVaultSyncPayload);
    });
  } catch (error) {
    // 📢 INTERCEPT COMPILER ERRORS CLEANLY
    // Captures structural runtime JSON syntax panics or file corruption issues gracefully.
    /* prettier-ignore */
    logDev(`[xalor:boot] 🚨 Genesis file serialization or hydration parse failure: ${error instanceof Error ? error.message : String(error)}`, { type: 'error', service: 'transformer/boot', override: true });
  }
}
//ORGINAL
// TODO: REMOVE
// export function bootloader(rootDir: string): void {
//   try {
//     const archive = new XalethorService();
//     archive.hydrateFromGenesis(rootDir);
//     /* prettier-ignore */ logDev(`[xalor:stage-4.5] ⚡ Bootloader: Vault hydrated from Genesis.`, { service: 'transformer/index.ts' });
//   } catch {
//     /* prettier-ignore */ logDev( `[xalor:stage-4.5] 🌬️ Bootloader: No Genesis Cache found. Starting volatile.`, { service: 'transformer/index.ts', type: 'warn', override: true }, );
//   }
// }

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

  const triggers = SENTRY_TRIGGER_NAMES;
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
  previousSize: number,
): ts.SourceFile {
  const isTest = process.env.NODE_ENV === 'test';

  const allFiles = program.getSourceFiles();
  const isLastFile = allFiles[allFiles.length - 1]?.fileName === file.fileName;

  const hasNewRegistrations = registry.size > previousSize;

  const shouldFlush =
    isLastFile || hasNewRegistrations || (isTest && registry.size > 0);

  if (shouldFlush) {
    const archive = new XalethorService();
    archive.persist({ rootDir, registry });

    hydrateIntellisenseBridge(rootDir, registry);

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
