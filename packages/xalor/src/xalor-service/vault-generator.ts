import { XalethorVaultKeeper } from './vault-keeper';
import { XalethorVaultAuditor } from './vault-auditor';
import { produceDefault, markAsSolid } from '../utils';
import type { ISolidRegistry } from '../models/types';
/**
 * XALETHOR VAULT GENERATOR
 *
 * ROLE:
 * The "Factory." It uses Blueprints to materialize brand-new
 * JavaScript objects from thin air.
 *
 * WHAT GOES HERE:
 * - 'getDefault' materialization.
 * - Mocking, Templating, and Data Casting.
 * - Sanitization logic (cloning objects to strip extra keys).
 *
 * WHAT DOES NOT GO HERE:
 * - NO Validation (Factories don't inspect; they build).
 * - NO GPS or Traceability logic.
 * - NO Disk persistence.
 */
export class XalethorVaultGenerator {
  public static getDefault<K extends keyof ISolidRegistry>(
    key: K,
  ): ISolidRegistry[K] {
    const shape = XalethorVaultKeeper.peek('blueprint', key);

    if (!shape) {
      // 🕵️‍♂️ Now passes the specific error message to the Auditor
      XalethorVaultAuditor.panic(
        key,
        'Generation failed: Blueprint missing from Vault.',
      );
    }
    const data = produceDefault(shape);
    // 💎 Use the Type Guard to narrow 'unknown' to the Registry Type
    // This removes the need for 'as any' entirely.
    if (markAsSolid<K, ISolidRegistry[K]>(data)) {
      return data;
    }

    throw new Error(`[xalor] Failed to brand default object for ${key}`);
  }

  // public static produceMock() {}
  // public static produceClone() {}
}
