// models/utils/global/index.ts
import { IS_SOLID_CONFIG_ITEMS } from '../../constants';
import type { TSolidVaultMap } from '../../types';
// ====================================================================
/**
 * GLOBAL VAULT ACCESSORS
 *
 * These utilities manage the library's "Live Memory." By attaching the Vault
 * to 'globalThis', we ensure that metadata and error states persist across
 * different modules, bundles, and execution contexts (like HMR or Jest).
 */

// ====================================================================
/**
 * GET GLOBAL VAULT
 * Safely attempts to retrieve the existing Vault singleton.
 * Returns 'undefined' if no types have been solidified yet, preventing
 * unnecessary memory allocation during passive lookups.
 */
export function getGlobalVault(): TSolidVaultMap | undefined {
  return globalThis[IS_SOLID_CONFIG_ITEMS.solidVaultKey];
}
/**
 * ENSURE GLOBAL VAULT
 * Guarantees the existence of the Vault singleton.
 * If the Vault doesn't exist, it initializes the 'items' and 'errors' maps
 * and attaches them to the global scope. This is the primary "Bootloader"
 * for Pillar 2 (The Vault).
 */
export function ensureGlobalVault(): TSolidVaultMap {
  // 1. Initialize the root if it's missing
  if (!globalThis.__SOLID_VAULT__) {
    globalThis.__SOLID_VAULT__ = {
      items: new Map(),
      errors: new Map(),
    };
  }

  const vault = globalThis.__SOLID_VAULT__;

  // 2. 💎 THE RESILIENCY FIX (Pillar 2)
  // If an edge case (or external lib) set these to null/undefined,
  // we repair them using standard instanceof checks.
  if (!(vault.items instanceof Map)) {
    vault.items = new Map(); // Note: Internal repair still needs one-time safety or @ts-ignore
  }

  if (!(vault.errors instanceof Map)) {
    vault.errors = new Map();
  }

  return vault;
}
// export function ensureGlobalVault(): TSolidVaultMap {
//   const g = globalThis as any;
//   if (!g.__SOLID_VAULT__) {
//     g.__SOLID_VAULT__ = { items: new Map(), errors: new Map() };
//   }

//   const vault = g.__SOLID_VAULT__;
//   // 💎 THE FIX: If an edge case set these to null, repair them NOW
//   if (!(vault.items instanceof Map)) vault.items = new Map();
//   if (!(vault.errors instanceof Map)) vault.errors = new Map();

//   return vault;
// }
// export function ensureGlobalVault(): TSolidVaultMap {
//   if (globalThis.__SOLID_VAULT__) return globalThis.__SOLID_VAULT__;

//   const vault: TSolidVaultMap = {
//     items: new Map(),
//     errors: new Map(),
//   } satisfies TSolidVaultMap;

//   globalThis.__SOLID_VAULT__ = vault;
//   return vault;
// }
// export function ensureGlobalVault(): TSolidVaultMap {
//   // 1. Initialize if cold-starting
//   if (!globalThis.__SOLID_VAULT__) {
//     globalThis.__SOLID_VAULT__ = {
//       items: new Map(),
//       errors: new Map(),
//     };
//   }

//   const vault = globalThis.__SOLID_VAULT__;

//   // 2. 🛡️ THE RESILIENCY REPAIR
//   // Self-healing logic for the Edge Case tests (handling null/undefined properties)
//   if (!(vault.items instanceof Map)) {
//     // @ts-ignore - Only needed to fix intentional corruption from tests
//     vault.items = new Map();
//   }

//   if (!(vault.errors instanceof Map)) {
//     // @ts-ignore
//     vault.errors = new Map();
//   }

//   return vault;
// }
