import type { TPersistParams } from '../models/types';
import type { TTripleKV, TSolidShape } from '../../shared';
import { IS_SOLID_CONFIG_ITEMS, logDev } from '../../shared';
import { serialize } from '../utils';
import { EXTRACT_SHAPE_NORMALIZERS, BUILD_SHAPE_INFLATORS } from '../mappers';
import * as fs from 'fs';
import * as path from 'path';
import { XalethorVaultKeeper } from './vault-keeper';
/**
 * XALETHOR VAULT ARCHIVE
 *
 * ROLE:
 * The "Banker" of the Bunker. It manages the physical preservation of
 * the DNA on the disk to ensure the library survives restarts.
 *
 * WHAT GOES HERE:
 * - File system operations (fs.writeFileSync / fs.readFileSync).
 * - Serialization and normalization of paths for portability.
 * - Stage 4 (Persist) and Stage 5 (Hydrate) lifecycle triggers.
 *
 * WHAT DOES NOT GO HERE:
 * - NO Runtime logic or type guarding.
 * - NO Metadata extraction (The Banker doesn't mine the gold).
 * - NO Global state initialization (handled by utils).
 */
export class XalethorVaultArchive {
  private static lifeCyclePaths = IS_SOLID_CONFIG_ITEMS.lifeCyclePaths;

  /**
   * RECURSIVE RE-SHREDDER
   *
   * ROLE:
   * Deeply normalizes structural objects into a flat content-addressable pool.
   *
   * STRATEGY:
   * - Structural Shredding: Only 'object' kinds are replaced with 'sh_' reference keys.
   * - Value Inlining: Primitives, Literals, Unions, Arrays, and Brands maintain inline
   *   payload positioning to prevent intermediate map hop overhead during system boots.
   */
  private static extractAndNormalizeShape(
    shape: TSolidShape,
    flatPool: Record<string, TSolidShape>,
  ): TSolidShape {
    if (!shape) return shape;

    const executeNormalizer = <K extends TSolidShape['kind']>(
      kind: K,
      targetShape: Extract<TSolidShape, { kind: K }>,
    ): TSolidShape => {
      const normalizer = EXTRACT_SHAPE_NORMALIZERS[kind];
      return normalizer(
        targetShape,
        flatPool,
        this.extractAndNormalizeShape.bind(this),
      );
    };

    return executeNormalizer(shape.kind, shape);
  }
  /**
   * RECURSIVE RE-ASSEMBLER
   *
   * ROLE:
   * Deeply inflates content-addressable reference hashes into fully expanded,
   * nested layout graphs ready for active RAM lookups.
   *
   * STRATEGY:
   * - Relational Expansion: Follows storage references ('sh_') and rebuilds full parent maps.
   * - Performance Shielding: Unpacks structures *prior* to runtime cache insertions,
   *   ensuring the Bouncer validation engine can perform linear synchronous checks.
   */
  private static inflateAndNormalizeShape(
    shape: TSolidShape,
    blueprintsPool: Record<string, TSolidShape>,
  ): TSolidShape {
    if (!shape) return shape;

    const executeInflator = <K extends TSolidShape['kind']>(
      kind: K,
      targetShape: Extract<TSolidShape, { kind: K }>,
    ): TSolidShape => {
      const inflator = BUILD_SHAPE_INFLATORS[kind];
      return inflator(
        targetShape,
        blueprintsPool,
        this.inflateAndNormalizeShape.bind(this), // Pass continuation loop
      );
    };

    return executeInflator(shape.kind, shape);
  }
  /**
   * 🛠️ WORKER: ENSURE BASELINE CACHE (Cold-Start Guard)
   *
   * ROLE:
   * Generates project-local directory trees and drops empty baseline type bridges
   * onto the user's filesystem immediately during initial boot if the cache is missing.
   *
   * STRATEGY:
   * Solves cold-start IDE import resolution breaks cleanly by copying ready-to-go templates,
   * then returning the redirected snapshot path string back to the hydration caller.
   */
  private static ensureBaselineCache(
    localCacheDir: string,
    fallbackSnapshotPath: string,
  ): string {
    try {
      // 1. Create the local project cache directory folder tree structure immediately
      if (!fs.existsSync(localCacheDir)) {
        fs.mkdirSync(localCacheDir, { recursive: true });
      }

      // Resolve relative path pointers for the static templates bundled inside your npm package
      /* prettier-ignore */ const templateBridgePath = path.join(__dirname,'../static-templates/solid-env.d.ts.template',);
      /* prettier-ignore */ const localBridgeFile = path.join(localCacheDir, 'solid-env.d.ts');

      // Physical file copy of the ghost bridge directly to disk
      /* prettier-ignore */ if (fs.existsSync(templateBridgePath) && !fs.existsSync(localBridgeFile)) {
        fs.copyFileSync(templateBridgePath, localBridgeFile);
      }

      /* prettier-ignore */ logDev(`[xalor:genesis] ❄️ Local cache empty. Initialized cold-start baseline templates.`, { service: 'vault-archive.ts-hydrateFromGenesis' });

      // redirected target pointer to point straight to the packaged JSON template
      return fallbackSnapshotPath;
    } catch (seedError) {
      /* prettier-ignore */ logDev(`[xalor:genesis] ⚠️ Ambient preloading failed: Unable to write workspace folder tree configurations. (${seedError})`,{ type: 'error', service: 'vault-archive.ts-hydrateFromGenesis', override: true });
      // Fallback: Return the original path location parameter if file operations error out
      return fallbackSnapshotPath;
    }
  }
  /**
   * THE PERSISTENCE (THE FLUSH)
   *
   * STATE:
   * - The Miner has finished scanning the Abstract Syntax Tree (AST).
   * - The Accumulator (globalKeyRegistry) is full of "Ghost" metadata.
   *
   * PURPOSE:
   * - Bridges the gap between the Compiler's RAM and the Disk's Persistence.
   * - Seeds the "Genesis Cache" in node_modules so Jest/Runtime can wake up "Solid."
   * - Converts the Triple-KV Map into a normalized JSON-safe snapshot.
   */
  public static persist({ rootDir, registry }: TPersistParams): void {
    const cacheDir = path.join(rootDir, this.lifeCyclePaths.cacheDir);
    const targetFile = path.join(cacheDir, this.lifeCyclePaths.vaultFile);

    const snapshot: TTripleKV = {
      blueprints: {},
      references: {},
      manifest: {},
      registry: {},
      version: IS_SOLID_CONFIG_ITEMS.solidVersion,
    } satisfies TTripleKV;

    registry.forEach((meta, key) => {
      // 🚀 Run the deep normalization pass
      const pointerReference = this.extractAndNormalizeShape(
        meta.shape,
        snapshot.blueprints,
      );

      // If the top level became a reference pointer, record its pointer name string
      snapshot.references[key] =
        pointerReference.kind === 'reference' ? pointerReference.name : key;

      snapshot.manifest[key] = {
        area: meta.area,
        filePath: path
          .relative(rootDir, meta.filePath)
          .split(path.sep)
          .join('/'),
      };

      snapshot.registry[key] = {
        symbolName: meta.symbolName ?? 'unknown',
        typeName: meta.typeName,
      };
    });

    try {
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      fs.writeFileSync(targetFile, serialize(snapshot), 'utf-8');
      /* prettier-ignore */
      /* prettier-ignore */ logDev( `[xalor:stage-4] 🏁 Persistence Complete. Bunker sealed at: ${this.lifeCyclePaths.cacheDir}`, { service: 'vault-archive.ts-persist' });
      /* prettier-ignore */ logDev( `[xalor:stage-4] 🧬 Shredded & Saved: [${Array.from(registry.keys()).join(', ')}]`, { service: 'vault-archive.ts-persist' });
    } catch (error) {
      /* prettier-ignore */ logDev(`[xalor-persist] Failed to solidify cache: ${error}`, { type: 'error', service: 'vault-archive.ts-persist', override: true });
    }
  }
  /**
   * 🌿 STAGE 5: THE GENESIS HYDRATION (THE SEEDING)
   *
   * ROLE:
   * The "Decompressor." It reifies the content-addressable disk database
   * back into fast, fully-inlined execution graphs in live RAM.
   *
   * STRATEGY:
   * - Separation of Concerns: Resolves internal structural pointers *before*
   *   feeding the Keeper, ensuring the runtime engine remains simple and fast.
   * - In-Memory Unpacking: Traverses internal pointer links recursively
   *   to rebuild deep nested objects into flat runtime dictionaries.
   */
  public static hydrateFromGenesis(rootDir: string): void {
    const localCacheDir = path.join(rootDir, this.lifeCyclePaths.cacheDir);
    let cacheFile = path.join(localCacheDir, this.lifeCyclePaths.vaultFile);
    // 🎯 THE BASELINE FALLBACK HOOK:
    if (!fs.existsSync(cacheFile)) {
      /* prettier-ignore */ const templateSnapshotPath = path.join(__dirname, '../static-templates/vault-snapshot.json');
      /* prettier-ignore */ cacheFile = this.ensureBaselineCache(localCacheDir, templateSnapshotPath);
    }
    // Defensive execution boundary brake
    if (!fs.existsSync(cacheFile)) return;

    try {
      const raw = fs.readFileSync(cacheFile, 'utf-8');
      const snapshot: TTripleKV = JSON.parse(raw);
      const nominalKeys = Object.keys(
        snapshot.references || snapshot.blueprints,
      );
      // 🔄 THE RECONSTRUCTION LOOP
      for (const key of nominalKeys) {
        const shapeHash = snapshot.references ? snapshot.references[key] : key;
        const rawShape = snapshot.blueprints[shapeHash];
        const manifest = snapshot.manifest[key];
        const registry = snapshot.registry[key];

        if (!rawShape) continue;

        // Expand the content addressable hash into a complete, raw reference tree
        const fullyInflatedShape = this.inflateAndNormalizeShape(
          rawShape,
          snapshot.blueprints,
        );

        XalethorVaultKeeper.solidify({
          key,
          shape: fullyInflatedShape,
          area: manifest?.area ?? 'unknown:0:0',
          filePath: manifest?.filePath ?? 'unknown_file.ts',
          symbolName: registry?.symbolName ?? 'unknown',
          typeName: registry?.typeName ?? '{ ... }',
          version: snapshot.version,
        });
      }
      /* prettier-ignore */ logDev( `[xalor] 🌿 Hydrated ${Object.keys(snapshot.blueprints).length} types from Genesis`, { service: 'vault-archive.ts-hydrateFromGenesis' });
    } catch (error) {
      /* prettier-ignore */ logDev(`[xalor-stage-5] Genesis Hydration failed: ${error}`, { type: 'error', service: 'vault-archive.ts-hydrateFromGenesis', override: true });
    }
  }
}
// /**
//  * Checks if a Genesis Cache exists on disk.
//  */
// public static exists(rootDir: string): boolean {
//   return fs.existsSync(
//     path.join(
//       rootDir,
//       this.lifeCyclePaths.cacheDir,
//       this.lifeCyclePaths.vaultFile,
//     ),
//   );
// }
// /**
//  * Wipes the local cache entirely.
//  */
// public static purge(rootDir: string): void {
//   const target = path.join(rootDir, this.lifeCyclePaths.cacheDir);
//   if (fs.existsSync(target)) {
//     fs.rmSync(target, { recursive: true, force: true });
//     console.log('[xalor] 🧹 Cache purged.');
//   }
// }
