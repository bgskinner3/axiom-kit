// models/types/definitions/solid-vault.d.ts
import type { TSolidVaultMap } from '../processor';

declare global {
  /**
   * Augmenting globalThis to include our Solid Vault.
   * This removes the need for any casting in our utils.
   */
  var __SOLID_VAULT__: TSolidVaultMap | undefined;
}

// Ensure this file is treated as a module
export {};
