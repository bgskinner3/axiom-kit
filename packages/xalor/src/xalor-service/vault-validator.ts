import { ensureGlobalVault } from '../utils';
import type { TSolidVaultMap } from '../models/types';
import { validateShape, createInitialContext } from '../validation';

export class XalethorVaultValidator {
  private static get vault(): TSolidVaultMap {
    return ensureGlobalVault();
  }
  private static has(key: string): boolean {
    return (
      this.vault.blueprints.has(key) &&
      this.vault.manifest.has(key) &&
      this.vault.registry.has(key)
    );
  }
  public static validateShape(data: unknown, key: string): boolean {
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
  public static validateKey(key: string): void {
    if (!this.has(key)) {
      // 🚩 In production, we'll use the Auditor to provide the exact fix
      throw new Error(
        `[xalor] 🚨 MISSING BLUEPRINT: The key "${key}" is not registered in the Vault. ` +
          `Ensure you have a build-time isXalor<'${key}', Type>() call.`,
      );
    }
  }
}
