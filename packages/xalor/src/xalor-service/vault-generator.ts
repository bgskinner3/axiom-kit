import { XalethorVaultKeeper } from './vault-keeper';
import { XalethorVaultAuditor } from './vault-auditor';
import {
  produceDefault,
  markAsSolid,
  produceMock,
  produceClone,
} from '../utils';
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

  /**
   * 🎲 GET MOCK
   *
   * ROLE: The "Simulacrum."
   * Generates realistic, randomized data structures including optional
   * fields and variable array lengths for testing and prototyping.
   *
   * @param key - The unique identifier of the type in the Registry.
   * @returns {ISolidRegistry[K]} - A randomized, branded instance of the type.
   */
  public static getMock<K extends keyof ISolidRegistry>(
    key: K,
  ): ISolidRegistry[K] {
    const shape = XalethorVaultKeeper.peek('blueprint', key);

    if (!shape) {
      XalethorVaultAuditor.panic(
        key,
        'Mocking failed: Blueprint missing from Vault.',
      );
    }

    const data = produceMock(shape);

    // 💎 Bridge the 'unknown' data to the Branded Registry Type
    if (markAsSolid<K, ISolidRegistry[K]>(data)) {
      return data;
    }

    throw new Error(`[xalor] Failed to brand mock object for ${key}`);
  }
  /**
   * 🧼 GET CLONE (The Sanitizer)
   *
   * ROLE: The "Clean Room."
   * Takes raw, untrusted data and returns a deep-copy that is physically
   * guaranteed to only contain properties defined in the TypeScript interface.
   *
   * STRATEGY:
   * - Graph Integrity: Uses internal Map tracking to handle circular references.
   * - Prototype Preservation: Maintains class instances where possible.
   * - Key Scrubbing: Iterates the Blueprint, not the Data, to ensure purity.
   *
   * @param data - The raw input object to be purified.
   * @param key - The unique identifier of the target blueprint.
   */
  public static getClone<K extends keyof ISolidRegistry>(
    data: unknown,
    key: K,
  ): ISolidRegistry[K] {
    const shape = XalethorVaultKeeper.peek('blueprint', key);

    if (!shape) {
      XalethorVaultAuditor.panic(
        key,
        'Cloning failed: Blueprint missing from Vault.',
      );
    }

    // 🛡️ Fresh 'seen' map for each top-level operation
    const cleanData = produceClone(data, shape, new Map());

    // 💎 Bridge the 'unknown' data to the Branded Registry Type
    if (markAsSolid<K, ISolidRegistry[K]>(cleanData)) {
      return cleanData;
    }

    throw new Error(`[xalor] Failed to brand purified clone for ${key}`);
  }
  // public static getCast() {}
}
