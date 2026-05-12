import { ensureGlobalVault } from '../utils';
import type {
  TSolidMetadata,
  TSolidVaultMap,
  TSolidShape,
  TStrictSolidMetaData,
  TVaultRegistryEntry,
  TVaultManifestEntry,
} from '../models/types';
import { preRegisterMetadata } from '../utils';
import { IS_SOLID_CONFIG_ITEMS } from '../models';

/**
 * 🏛️ XalethorVaultKeeper
 *
 * ROLE: The "Librarian."
 * It manages the raw I/O for the Triple-KV drawers. It is the only class
 * that physically touches the Maps in RAM.
 */
export class XalethorVaultKeeper {
  private static solidVersion = IS_SOLID_CONFIG_ITEMS.solidVersion;
  private static get vault(): TSolidVaultMap {
    return ensureGlobalVault();
  }
  /**
   * Registers a single type into the Triple-KV system.
   * Replaces 'Registry.registerShape'.
   */
  public static solidify(rawMetadata: TSolidMetadata): void {
    const metadata = preRegisterMetadata(rawMetadata);

    const { key, shape, area, filePath, symbolName, typeName } = metadata;

    if (this.vault.blueprints.has(key)) {
      const existing = JSON.stringify(this.vault.blueprints.get(key));
      const incoming = JSON.stringify(shape);

      // If they are identical, just skip the work.
      if (existing === incoming) return;

      // If they changed, log it so you know the Miner is updating the Bunker.
      console.log(`[xalor] 🔄 Updating logic for: ${key}`);
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
