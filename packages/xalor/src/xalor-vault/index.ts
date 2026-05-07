import { ensureGlobalVault } from '../utils';
import type {
  TSolidMetadata,
  TSolidVaultMap,
  TSolidShape,
} from '../models/types';
// import { XALOR_MESSAGE_HANDLER } from '../xalor-auditor';
// import { IS_SOLID_CONFIG_ITEMS } from '../models/constants';
// import { serialize, yieldEntries } from '../utils';
import { produceDefault } from '../generation';
// import * as fs from 'fs';
// import * as path from 'path';

// The Miner extracts the data.
// The Emitter builds the Bridge.
// ==>>>> THIS IS THIS CALSS The Hydrator (this code) puts the data into the three specialized Vault lists.
/**
 * GOALS REFACOTRING THIS
 *  KEEP IN MIND THIS IS THE THE MAIN GATEWAY FOR THE
 *
 * IT SHOUDL ---> A> HYDRATE ...
 */
export class XalethorVault {
  // private static errorMessageTemp = XALOR_MESSAGE_HANDLER.ERROR;
  // private static lifeCyclePaths = IS_SOLID_CONFIG_ITEMS.lifeCyclePaths;

  private static get vault(): TSolidVaultMap {
    return ensureGlobalVault();
  }

  /**
   * Registers a single type into the Triple-KV system.
   * Replaces 'Registry.registerShape'.
   */
  public static solidify(metadata: TSolidMetadata): void {
    const { key, shape, area, symbolName } = metadata;
    if (this.vault.blueprints.has(key)) {
      // const originalPath = this.vault.manifest.get(key) ?? 'unknown';
      throw new Error(
        '  this.errorMessageTemp.COLLISION({ key, msg: originalPath }),',
      );
    }
    this.vault.blueprints.set(key, shape); // 1. Structure (The Blueprint)
    this.vault.manifest.set(key, area); // 2. Location (The Manifest)
    this.vault.registry.set(key, symbolName ?? 'unknown'); // 3. Identity (The Registry)

    this.vault.items.set(key, metadata); // 4. Backward Compatibility
  }

  /**
   * 🌊 HYDRATE
   * Bulk registers types using lazy iteration.
   * Zero memory allocation for intermediate arrays.
   */
  public static hydrate(entries: Iterable<[string, TSolidMetadata]>): void {
    for (const [_, metadata] of entries) {
      this.solidify(metadata);
    }
  }

  /**
   * 🔍 vaultArchive
   *
   * A polymorphic gateway to the Triple-KV Vault.
   * It maps the variant request to the specific internal Map.
   */
  /* prettier-ignore */ public static vaultArchive( variant: 'blueprint', key: string): TSolidShape | undefined;
  /* prettier-ignore */ public static vaultArchive( variant: 'manifest' | 'registry', key: string,): string | undefined;
  public static vaultArchive(
    variant: 'blueprint' | 'manifest' | 'registry',
    key: string,
  ): TSolidShape | string | undefined {
    return this.vault[variant].get(key);
  }

  /**
   * 🚩 HAS
   * Primary existence check. If it's in blueprints, it's "Solid."
   */
  public static has(key: string): boolean {
    return (
      this.vault.blueprints.has(key) &&
      this.vault.manifest.has(key) &&
      this.vault.registry.has(key)
    );
  }

  public static keys(): string[] {
    // 💎 We filter to ensure every key returned has a complete Triple-KV graph
    return Array.from(this.vault.blueprints.keys()).filter((key) =>
      this.has(key),
    );
  }

  /**
   * 🏗️ GET DEFAULT
   * Replaces Registry.getDefault.
   * Directly queries the 'blueprints' vault for the structural logic.
   */
  public static getDefault<T>(key: string): T {
    const shape = this.vault.blueprints.get(key);
    // this.errorWarnMessageTemp.ERROR
    if (!shape) {
      // 🚩 If missing, we use the Manifest to provide a better error message
      const location = this.vault.manifest.get(key);
      const errorMsg = location
        ? 'this.errorMessageTemp.MISSING_VAULT_BLUEPRINT({ key, location })'
        : 'this.errorMessageTemp.MISSING_VAULT_KEY({ key });';

      throw new Error(errorMsg);
    }

    return produceDefault(shape) as T;
  }

  // /**
  //  *
  //  *SECTION name ? turn inot vclass XalethorVaultArchive
  //     -- this section below manages the life cycle of our types form emmeoery to our cache
  //  *
  //  *
  //  */

  // /**
  //  * 🏁 STAGE 4: THE PERSISTENCE (THE FLUSH)
  //  *
  //  * STATE:
  //  * - The Miner has finished scanning the Abstract Syntax Tree (AST).
  //  * - The Accumulator (globalKeyRegistry) is full of "Ghost" metadata.
  //  *
  //  * PURPOSE:
  //  * - Bridges the gap between the Compiler's RAM and the Disk's Persistence.
  //  * - Seeds the "Genesis Cache" in node_modules so Jest/Runtime can wake up "Solid."
  //  * - Converts the Triple-KV Map into a normalized JSON-safe snapshot.
  //  */
  // public static persist(
  //   rootDir: string,
  //   registry: Map<string, TSolidMetadata>,
  // ): void {
  //   const cacheDir = path.join(rootDir, this.lifeCyclePaths.cacheDir);
  //   const targetFile = path.join(cacheDir, this.lifeCyclePaths.vaultFile);

  //   // 1. Convert Map to an Object for the JSON drawer
  //   const snapshot: Record<string, TSolidMetadata> = {};
  //   registry.forEach((value, key) => {
  //     snapshot[key] = value;
  //   });
  //   try {
  //     if (!fs.existsSync(cacheDir)) {
  //       fs.mkdirSync(cacheDir, { recursive: true });
  //     }

  //     // 💎 LAW: Zero-Any Serialization
  //     // Uses your 'serialize' util to handle BigInts and JSON normalization.
  //     const solidData = serialize(snapshot);

  //     fs.writeFileSync(targetFile, solidData, 'utf-8');
  //   } catch (error) {
  //     console.error(`[xalor-persist] Failed to solidify cache: ${error}`);
  //   }
  // }
  // /**
  //  * 🏁 STAGE 5: THE GENESIS HYDRATION (THE SEEDING)
  //  *
  //  * STATE:
  //  * - The process has restarted (e.g., Jest is starting or the App is booting).
  //  * - The Live Vault (__SOLID_VAULT__) is currently empty.
  //  * - The Genesis Cache (node_modules/.cache) contains the Stage 4 snapshot.
  //  *
  //  * PURPOSE:
  //  * - Reifies the "Solid" types back into memory from the disk.
  //  * - Broadcasts the cached metadata into the specialized Triple-KV maps.
  //  * - Ensures that build-time extraction is available for runtime operations.
  //  */
  // public static hydrateFromGenesis(rootDir: string): void {
  //   const cacheFile = path.join(
  //     rootDir,
  //     this.lifeCyclePaths.cacheDir,
  //     this.lifeCyclePaths.vaultFile,
  //   );

  //   // 1. Safety Check: If the Bunker is empty, we remain in "Ghost" mode.
  //   if (!fs.existsSync(cacheFile)) return;

  //   try {
  //     // 💎 LAW: Zero-Any Parsing
  //     // We parse the snapshot back into a structured object.
  //     const raw = fs.readFileSync(cacheFile, 'utf-8');
  //     const snapshot: Record<string, TSolidMetadata> = JSON.parse(raw);

  //     // 💎 LAW: Lazy Iteration
  //     // We use yieldEntries to stream the snapshot into our solidify logic.
  //     const entries = yieldEntries(snapshot, (k, v): k is string => !!v);

  //     for (const [_, metadata] of entries) {
  //       this.solidify(metadata);
  //     }
  //   } catch (error) {
  //     // 🚩 Traceability: The Auditor will eventually catch this "Corrupted Seed."
  //     console.error(`[xalor-stage-5] Genesis Hydration failed: ${error}`);
  //   }
  // }
}

/**
 DRAWING IT OUT by way of methods and functions ? 
 */

// import * as fs from 'fs';
// import * as path from 'path';
// import { XALOR_PATHS } from '../models/constants';
// import { XalethorVaultArchive } from './vaultArchive';

// /**
//  * 🛰️ GENESIS HYDRATION
//  *
//  * Reifies the Triple-KV Vault from the persistent node_modules cache.
//  * This bridges the gap between the Build-time Miner and the Runtime Engine.
//  */
// export function hydrateFromCache(rootDir: string): void {
//   const cachePath = path.join(rootDir, XALOR_PATHS.cacheDir, XALOR_PATHS.vaultFile);

//   // 1. Safety Check: If no cache exists, we start fresh (Normal behavior)
//   if (!fs.existsSync(cachePath)) return;

//   try {
//     const rawData = fs.readFileSync(cachePath, 'utf-8');
//     const snapshot = JSON.parse(rawData);

//     // 2. Hydrate the Archive (Broadcasting to the 3 Vaults)
//     // We use the hydrate method we built earlier to maintain integrity
//     XalethorVaultArchive.hydrate(Object.entries(snapshot.blueprints));

//     // Note: We'll need to ensure the snapshot stores the full Metadata
//     // object so solidify() can split it into Manifest and Registry.
//   } catch (err) {
//     console.warn(`[xalor] ⚠️ Genesis Hydration failed: ${err}`);
//   }
// }

/**
 *
 *
 *
 *
 *
 *
 */
// export function hydrateVault(
//   minedEntries: Iterable<[string, TRegistryEntry]>,
// ): void {
//   const vault = ensureGlobalVault();

//   for (const [key, metadata] of minedEntries) {
//     // 🛡️ THE COLLISION GUARD (Commandment I)
//     if (vault.blueprints.has(key)) {
//       throw new Error(
//         XALOR_MESSAGE_HANDLER.ERROR.COLLISION({
//           key,
//           msg: vault.manifest.get(key),
//         }),
//       );
//     }

//     // 💎 BROADCAST TO TRIPLE-KV
//     vault.blueprints.set(key, metadata.shape);
//     vault.manifest.set(key, metadata.filePath);
//     vault.registry.set(key, metadata.symbolName);

//     // Legacy support
//     vault.items.set(key, metadata as any); // (Exception: Bridge to legacy)
//   }
// }
/**

  public static resolve(key: string): TSolidMetadata | undefined {
    return this.vault.items.get(key);
  }

  public static inspect(key: string): TSolidShape | undefined {
    return this.vault.blueprints.get(key);
  }
 */
// import { IS_SOLID_CONFIG_ITEMS } from './models/constants';
// import { XALOR_MESSAGE_HANDLER } from './models/messages';
// import { getGlobalVault, ensureGlobalVault, getCallerLocation } from './utils';
// import { produceDefault } from './generation';
// import type { TSolidMetadata, TSolidError } from './models/types';

// export class Registry {
//   /**
//    * ⚡ HYDRATE
//    * Bulk registers metadata using your 'yield' lazy iteration pattern.
//    */
//   public static hydrate(entries: Iterable<[string, TSolidMetadata]>): void {
//     for (const [_, metadata] of entries) {
//       this.registerShape(metadata);
//     }
//   }

//   /**
//    * 💎 REGISTER SHAPE
//    * The primary entry point for Pillar 2. Populates the Triple-KV Vault.
//    */
//   public static registerShape(metadata: TSolidMetadata): void {
//     const { key, shape, version, area } = metadata;
//     const vault = ensureGlobalVault();
//     const { ERROR } = XALOR_MESSAGE_HANDLER;

//     // 1. VERSION CHECK (Commandment VI)
//     if (version !== IS_SOLID_CONFIG_ITEMS.solidVersion) {
//       const msg = ERROR.DATABASE_VERSION_MIS_MATCH({ key, version });
//       console.error(msg);
//       this.setErrors(key, [{ key, path: '$', message: msg, expected: IS_SOLID_CONFIG_ITEMS.solidVersion, received: version, area }]);
//       return;
//     }

//     // 2. THE COLLISION GUARD (The "Teeth")
//     if (vault.blueprints.has(key)) {
//       const originalArea = vault.manifest.get(key) || 'unknown location';
//       throw new Error(ERROR.COLLISION({ key, msg: originalArea }));
//     }

//     // 3. FALLBACK AREA
//     const resolvedArea = (!area || area === 'unknown')
//       ? getCallerLocation({ topParent: true })
//       : area;

//     // 4. POPULATE TRIPLE-KV (Commandment I)
//     vault.blueprints.set(key, shape);
//     vault.manifest.set(key, resolvedArea);
//     vault.registry.set(key, metadata.symbolName ?? 'unknown');

//     // 5. LEGACY SUPPORT
//     vault.items.set(key, { ...metadata, area: resolvedArea });
//   }

//   /**
//    * 🔍 GET
//    * Retrieves the full metadata package for a key.
//    */
//   public static get(key: string): TSolidMetadata | undefined {
//     return ensureGlobalVault().items.get(key);
//   }

//   /**
//    * 🛠️ GET DEFAULT
//    * Generates a "Zero-Value" object based on the Solid Shape.
//    */
//   public static getDefault<T>(key: string): T {
//     const shape = ensureGlobalVault().blueprints.get(key);
//     if (!shape) throw new Error(XALOR_MESSAGE_HANDLER.ERROR.MISSING_BLUEPRINT({ key }));

//     return produceDefault(shape) as T;
//   }

//   // --- INTERNAL HELPERS ---
//   public static has(key: string): boolean {
//     return ensureGlobalVault().blueprints.has(key);
//   }

//   public static keys(): string[] {
//     return Array.from(ensureGlobalVault().blueprints.keys());
//   }

//   public static getErrors(key: string): TSolidError[] {
//     return ensureGlobalVault().errors.get(key) ?? [];
//   }

//   public static setErrors(key: string, errors: TSolidError[]): void {
//     ensureGlobalVault().errors.set(key, errors);
//   }
// }
