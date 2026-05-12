import type { TTripleKV, TPersistParams } from '../models/types';
import type { TVaultSyncPayload } from '../../transformer/types';
// import { XALOR_MESSAGE_HANDLER } from '../xalor-auditor';
import { IS_SOLID_CONFIG_ITEMS } from '../models/constants';
import { serialize, yieldEntries } from '../utils';
import * as fs from 'fs';
import * as path from 'path';
import { XalethorVaultKeeper } from './vault-keeper';
export class XalethorVaultArchive {
  // private errorMessageTemp = XALOR_MESSAGE_HANDLER.ERROR;
  private static lifeCyclePaths = IS_SOLID_CONFIG_ITEMS.lifeCyclePaths;

  /**
   * Checks if a Genesis Cache exists on disk.
   */
  public static exists(rootDir: string): boolean {
    return fs.existsSync(
      path.join(
        rootDir,
        this.lifeCyclePaths.cacheDir,
        this.lifeCyclePaths.vaultFile,
      ),
    );
  }

  /**
   * Wipes the local cache entirely.
   */
  public static purge(rootDir: string): void {
    const target = path.join(rootDir, this.lifeCyclePaths.cacheDir);
    if (fs.existsSync(target)) {
      fs.rmSync(target, { recursive: true, force: true });
      console.log('[xalor] 🧹 Cache purged.');
    }
  }

  /**
   * 🏁 STAGE 4: THE PERSISTENCE (THE FLUSH)
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
      manifest: {},
      registry: {},
      version: IS_SOLID_CONFIG_ITEMS.solidVersion,
    } satisfies TTripleKV;

    registry.forEach((meta, key) => {
      snapshot.blueprints[key] = meta.shape;

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

      // 💎 LAW: Zero-Any Serialization
      const solidData = serialize(snapshot);
      fs.writeFileSync(targetFile, solidData, 'utf-8');

      // console.log(
      //   `[xalor] 🏁 STAGE 4: Persistence successful. Shredded ${registry.size} types.`,
      // );
    } catch (error) {
      console.error(`[xalor-persist] Failed to solidify cache: ${error}`);
    }
  }

  /**
   * 🏁 STAGE 5: THE GENESIS HYDRATION (THE SEEDING)
   *
   * STATE:
   * - The process has restarted (e.g., Jest is starting or the App is booting).
   * - The Live Vault (__SOLID_VAULT__) is currently empty.
   * - The Genesis Cache (node_modules/.cache) contains the Stage 4 snapshot.
   *
   * PURPOSE:
   * - Reifies the "Solid" types back into memory from the disk.
   * - Broadcasts the cached metadata into the specialized Triple-KV maps.
   * - Ensures that build-time extraction is available for runtime operations.
   */
  public static hydrateFromGenesis(rootDir: string): void {
    const cacheFile = path.join(
      rootDir,
      this.lifeCyclePaths.cacheDir,
      this.lifeCyclePaths.vaultFile,
    );
    if (!fs.existsSync(cacheFile)) return;

    try {
      const raw = fs.readFileSync(cacheFile, 'utf-8');
      // 1. Parse as the Shredded Triple-KV structure
      const snapshot: TTripleKV = JSON.parse(raw);

      // 2. We use the 'blueprints' drawer as our primary iteration key
      const entries = yieldEntries(
        snapshot.blueprints,
        (_k, v): _k is string => !!v,
      );

      for (const [key, shape] of entries) {
        // 3. RECONSTRUCTION: Stitch the metadata back together for the Vault
        const manifest = snapshot.manifest[key];
        const registry = snapshot.registry[key];

        XalethorVaultKeeper.solidify({
          key,
          shape,
          area: manifest?.area ?? 'unknown',
          filePath: manifest?.filePath ?? 'unknown',
          symbolName: registry?.symbolName ?? 'unknown',
          typeName: registry?.typeName ?? 'unknown',
          version: snapshot.version,
        });
      }
      // console.log(
      //   `[xalor] 🌿 Hydrated ${Object.keys(snapshot.blueprints).length} types from Genesis.`,
      // );
    } catch (error) {
      console.error(`[xalor-stage-5] Genesis Hydration failed: ${error}`);
    }
  }
}
