// src/vault.ts
import { IS_SOLID_CONFIG_ITEMS } from './models/constants';
import { getGlobalVault, ensureGlobalVault, getCallerLocation } from './utils';
import { produceDefault } from './generation';
import type { TSolidMetadata, TSolidError } from './models/types';

// public static register(metadata: TSolidMetadata): void {
//   const vault = ensureGlobalVault();

//   // 🛡️ THE COLLISION GUARD
//   if (vault.blueprints.has(metadata.key)) {
//     throw new Error(`[xalor] 🚨 Collision! The key "${metadata.key}" is already registered in the vault.`);
//   }

//   // Populate the Triple-KV Lists
//   vault.blueprints.set(metadata.key, metadata.shape);
//   vault.manifest.set(metadata.key, metadata.area);
//   // Using the generic-linked metadata symbolName
//   vault.registry.set(metadata.key, (metadata as any).symbolName ?? 'unknown');
// }

export class Registry {
  public static registerShape(metadata: TSolidMetadata): void {
    const { version, key, shape } = metadata;
    const vault = ensureGlobalVault();
    // 1. VERSION CHECK
    if (version !== IS_SOLID_CONFIG_ITEMS.solidVersion) {
      const errorMsg = `Version mismatch for "${key}". Expected ${IS_SOLID_CONFIG_ITEMS.solidVersion}, got ${version}.`;
      console.error(`[xalor] ${errorMsg}`);
      vault.errors.set(key, [
        {
          key: key,
          path: '$',
          message: errorMsg,
          expected: IS_SOLID_CONFIG_ITEMS.solidVersion,
          received: version,
          area: metadata.area,
        },
      ]);
      return;
    }

    // 2. THE COLLISION GUARD (The "Teeth")
    if (vault.blueprints.has(key)) {
      throw new Error(
        `[xalor] 🚨 Collision! Key "${key}" is already registered. Check: ${vault.manifest.get(key)}`,
      );
    }

    // 3. FALLBACK AREA (Source Location)
    if (!metadata.area || metadata.area === 'unknown') {
      metadata.area = getCallerLocation({ topParent: true });
    }

    // 4. POPULATE THE TRIPLE-KV LISTS
    vault.blueprints.set(key, shape);
    vault.manifest.set(key, metadata.area);
    vault.registry.set(key, metadata.symbolName ?? 'unknown');

    // 5. LEGACY SUPPORT (Keep existing IDE/Tests happy)
    vault.items.set(key, metadata);
  }

  // OLDDD
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
    if (vault.items.has(metadata.key)) {
      // const existing = vault.items.get(metadata.key);

      // 💡 Option A: Throw if you want to be strict
      // throw new Error(`[xalor] Duplicate registration for key: ${metadata.key}`);

      // 💡 Option B: Log a warning and track in the errors map
      console.warn(
        `[xalor] ⚠️ Collision detected for key "${metadata.key}". Overwriting existing entry.`,
      );
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
