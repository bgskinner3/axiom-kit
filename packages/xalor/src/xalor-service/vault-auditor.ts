import { ensureGlobalVault } from '../utils';
import type { TSolidError, TSolidVaultMap } from '../models/types';

/**
 * 🕵️‍♂️ XALETHOR AUDITOR
 *
 * The system's central inspector. It monitors the health of the
 * Triple-KV Archive and records validation failures in the Vault.
 */
export class XalethorVaultAuditor {
  private static get errorVault(): TSolidVaultMap['errors'] {
    return ensureGlobalVault().errors;
  }

  public static getErrors(key: string): TSolidError[] {
    return this.errorVault.get(key) ?? [];
  }
  public static clearErrors(key?: string): void {
    if (key) this.errorVault.delete(key);
    if (!key) this.errorVault.clear();
  }
  /**
   * Internal: Sets the errors for a specific key in the errors map.
   */
  public static setErrors(key: string, errors: TSolidError[]): void {
    this.errorVault.set(key, errors);
  }

  public static record(error: TSolidError): void {
    const currentErrors = this.getErrors(error.key);
    currentErrors.push(error);
    this.setErrors(error.key, currentErrors);
  }
  public static formatReport(key: string): string {
    const errors = this.getErrors(key);
    if (errors.length === 0) return '';

    const header = `\n[xalor] 🛑 SOLIDITY BREAK: "${key}"\n`;

    const body = errors
      .map((err) => {
        // We pull the 'origin' which we stored during validation
        const origin =
          typeof err.origin === 'object' ? err.origin.area : err.origin;

        return [
          `  ❌ Path: $.${err.path}`,
          `     Expected: ${err.expected}`,
          `     Received: ${JSON.stringify(err.received)}`,
          `     📍 Origin: ${origin || 'unknown'}`, // Where the type is defined
          `     ⚡ Failed: ${err.area || 'unknown'}`, // Where the data hit the engine
        ].join('\n');
      })
      .join('\n\n');

    return `${header}${body}\n`;
  }
  public static panic(key: string): never {
    const report = this.formatReport(key);
    // Clear the errors after panicking to keep the next run clean
    this.clearErrors(key);
    throw new Error(
      report || `[xalor] Unknown assertion failure for key: ${key}`,
    );
  }
}
