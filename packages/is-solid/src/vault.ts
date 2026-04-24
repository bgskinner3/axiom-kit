import { IS_SOLID_CONFIG_ITEMS } from './models';
import { getGlobalVault, ensureGlobalVault } from './utils/global';
import type { TSolidMetadata } from './models';

export class Registry {
  /**
   * Registers metadata into the Global Vault.
   * Injected by the transformer during build/HMR.
   */
  public static register(metadata: TSolidMetadata): void {
    // 1. Strict Version Check
    if (metadata.version !== IS_SOLID_CONFIG_ITEMS.solidVersion) {
      console.error(
        `[is-solid] Version mismatch for key "${metadata.key}". ` +
          `Expected ${IS_SOLID_CONFIG_ITEMS.solidVersion}, but received ${metadata.version}. ` +
          `Please clear your cache and rebuild.`,
      );
      return;
    }

    // 2. Access/Initialize the Vault
    const vault = ensureGlobalVault();

    // 3. Check-in the Metadata
    // In Dev Mode, this allows "Hot Swapping" on save.
    vault.set(metadata.key, metadata);
  }

  /**
   * Retrieves a shape by its unique key.
   */
  public static get(key: string): TSolidMetadata | undefined {
    return getGlobalVault()?.get(key);
  }

  /**
   * Returns all registered keys (useful for debugging or exports).
   */
  public static keys(): string[] {
    const vault = getGlobalVault();
    return vault ? Array.from(vault.keys()) : [];
  }
}

/**
 public static register(metadata: SolidMetadata): void {
  if (metadata.version !== SOLID_VERSION) {
    console.warn(
      `[is-solid] Version mismatch! Expected ${SOLID_VERSION}, got ${metadata.version}. ` +
      `Please rebuild your project.`
    );
    return;
  }
  // ... proceed to register
}
 */
