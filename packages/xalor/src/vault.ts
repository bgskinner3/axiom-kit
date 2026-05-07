// src/vault.ts
import { IS_SOLID_CONFIG_ITEMS } from './models/constants';
import { getGlobalVault, ensureGlobalVault, getCallerLocation } from './utils';
import { produceDefault } from './generation';
import type { TSolidMetadata, TSolidError } from './models/types';
export class Registry {
  /**
   * Registers metadata into the Global Vault's items map.
   */
  public static register(metadata: TSolidMetadata): void {
    const vault = ensureGlobalVault();
    if (metadata.version !== IS_SOLID_CONFIG_ITEMS.solidVersion) {
      const errorMessage = `Version mismatch for key "${metadata.key}". Expected ${IS_SOLID_CONFIG_ITEMS.solidVersion}, received ${metadata.version}.`;

      console.error(`[xalor] ${errorMessage}`);

      vault.errors.set(metadata.key, [
        {
          key: metadata.key,
          path: '$',
          message: errorMessage,
          expected: IS_SOLID_CONFIG_ITEMS.solidVersion,
          received: metadata.version,
          area: metadata.area,
        },
      ]);

      return;
    }
    if (!metadata.area || metadata.area === 'unknown') {
      metadata.area = getCallerLocation({ topParent: true });
    }
    vault.items.set(metadata.key, metadata);
  }

  /**
   * Retrieves a shape by its unique key from the items map.
   */
  public static get(key: string): TSolidMetadata | undefined {
    return getGlobalVault()?.items.get(key);
  }
  public static has(key: string): boolean {
    return getGlobalVault()?.items.has(key) ?? false;
  }
  /**
   * Returns all registered blueprint keys.
   */
  public static keys(): string[] {
    const vault = getGlobalVault();
    return vault ? Array.from(vault.items.keys()) : [];
  }

  /**
   *
   * Retrieves the last validation error(s) for a specific key.
   */
  public static getErrors(key: string): TSolidError[] {
    return getGlobalVault()?.errors.get(key) ?? [];
  }

  /**
   * Internal: Sets the errors for a specific key in the errors map.
   */
  public static setErrors(key: string, errors: TSolidError[]): void {
    const vault = ensureGlobalVault();
    vault.errors.set(key, errors);
  }
  public static getDefault<T>(key: string): T {
    const metadata = this.get(key);
    if (!metadata) throw new Error(`[xalor] Key "${key}" not found.`);

    // We return the unknown result.
    // The <T> from the function signature handles the call-site typing.
    return produceDefault(metadata.shape) as T;
  }
}
