import { ensureGlobalVault } from '../utils';
import type {
  TSolidMetadata,
  TSolidVaultMap,
  TSolidShape,
  TStrictSolidMetaData,
  TVaultRegistryEntry,
  TVaultManifestEntry,
} from '../models/types';
import { preRegisterMetadata, logDev } from '../utils';
import { IS_SOLID_CONFIG_ITEMS } from '../models';

/**
 * XALETHOR VAULT KEEPER
 *
 * ROLE:
 * The central "Librarian" of the Triple-KV system. It owns the raw Map
 * operations in RAM and manages the reification of shredded metadata.
 *
 * WHAT GOES HERE:
 * - Direct interaction with 'globalThis.__SOLID_VAULT__'.
 * - Metadata reconstruction (Stitching blueprints, manifest, and registry).
 * - High-performance 'peek' and 'resolve' methods.
 *
 * WHAT DOES NOT GO HERE:
 * - NO Validation logic (Bouncers don't live in the library).
 * - NO Disk I/O (Librarians don't build the building).
 * - NO Error formatting or panic logic.
 */
export class XalethorVaultKeeper {
  private static solidVersion = IS_SOLID_CONFIG_ITEMS.solidVersion;
  public static get vault(): TSolidVaultMap {
    return ensureGlobalVault();
  }
  /**
   * Registers a single type into the Triple-KV system.
   * Replaces 'Registry.registerShape'.
   */
  public static solidify(rawMetadata: TSolidMetadata): void {
    const metadata = preRegisterMetadata(rawMetadata);
    /* prettier-ignore */ logDev( `[xalor]: parse metaData ${metadata}`, { service: 'vault-keeper.ts/solidifyMeta' });
    const { key, shape, area, filePath, symbolName, typeName } = metadata;

    if (this.vault.blueprints.has(key)) {
      const existing = JSON.stringify(this.vault.blueprints.get(key));
      const incoming = JSON.stringify(shape);

      // If they are identical, just skip the work.
      if (existing === incoming) return;

      /* prettier-ignore */ logDev( `[xalor] 🔄 Updating logic for: ${key}`, { service: 'vault-keeper.ts/Updating' });
    }
    this.vault.blueprints.set(key, shape);
    this.vault.manifest.set(key, { area, filePath });
    this.vault.registry.set(key, { symbolName, typeName });
  }

  /** 📤 RETRIEVAL: Reconstructs the ghost-identity for the API */
  public static resolve(key: string): TStrictSolidMetaData | undefined {
    const shape = this.vault.blueprints.get(key);
    const manifest = this.vault.manifest.get(key);
    const registry = this.vault.registry.get(key);

    if (!shape || !manifest || !registry) return undefined;

    return {
      key,
      shape,
      area: manifest.area,
      filePath: manifest.filePath,
      symbolName: registry.symbolName,
      typeName: registry.typeName,
      version: this.solidVersion,
    };
  }

  /**
   * 🔍 vaultArchive
   *
   * A polymorphic gateway to the Triple-KV Vault.
   * It maps the variant request to the specific internal Map.
   */
  /* prettier-ignore */ public static peek( variant: 'blueprint', key: string): TSolidShape | undefined;
  /* prettier-ignore */ public static peek( variant: 'registry', key: string,): TVaultRegistryEntry | undefined;
  /* prettier-ignore */ public static peek( variant: 'manifest', key: string,): TVaultManifestEntry | undefined;
  public static peek(
    variant: 'blueprint' | 'manifest' | 'registry',
    key: string,
  ): TSolidShape | TVaultManifestEntry | TVaultRegistryEntry | undefined {
    return this.vault[variant].get(key);
  }
}
