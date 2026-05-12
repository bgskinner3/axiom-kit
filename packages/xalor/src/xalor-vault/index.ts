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
import { validateShape, createInitialContext } from '../validation';
import { produceDefault } from '../generation';

class XalethorVault {
  // private static errorMessageTemp = XALOR_MESSAGE_HANDLER.ERROR;
  // private static lifeCyclePaths = IS_SOLID_CONFIG_ITEMS.lifeCyclePaths;

  private static get vault(): TSolidVaultMap {
    return ensureGlobalVault();
  }
  public static verify(data: unknown, key: string): boolean {
    const shape = this.vault.blueprints.get(key);
    if (!shape) return false;

    // Reset errors for this specific key before a new run
    this.vault.errors.delete(key);

    const ctx = createInitialContext();
    const isValid = validateShape(data, shape, ctx);

    // If it failed, we save the errors so the Auditor can find them
    if (!isValid) this.vault.errors.set(key, ctx.errors);

    return isValid;
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

  /**
   * 📦 RESOLVE
   * Reconstructs the full TSolidMetadata package from specialized vaults.
   * This replaces the deprecated 'items' lookup.
   */
  public static resolve(key: string): TStrictSolidMetaData | undefined {
    const shape = this.vault.blueprints.get(key);
    const area = this.vault.manifest.get(key);

    if (!shape || !area) return undefined;
    //TODO FIX
    const registry = this.vault.registry.get(key);

    return {
      key,
      shape,
      area: area.area,
      filePath: area.filePath,
      version: '1.0.0', // You can add a 'versions' Map to the vault if needed
      symbolName: registry?.symbolName ?? '',
      typeName: registry?.typeName ?? '',
    };
  }
  /**
   * 🔍 vaultArchive
   *
   * A polymorphic gateway to the Triple-KV Vault.
   * It maps the variant request to the specific internal Map.
   */
  /* prettier-ignore */ public static vaultArchive( variant: 'blueprint', key: string): TSolidShape | undefined;
  /* prettier-ignore */ public static vaultArchive( variant: 'registry', key: string,): TVaultRegistryEntry | undefined;
  /* prettier-ignore */ public static vaultArchive( variant: 'manifest', key: string,): TVaultManifestEntry | undefined;
  public static vaultArchive(
    variant: 'blueprint' | 'manifest' | 'registry',
    key: string,
  ): TSolidShape | TVaultManifestEntry | TVaultRegistryEntry | undefined {
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
}
