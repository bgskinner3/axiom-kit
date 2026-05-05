import { IS_SOLID_CONFIG_ITEMS } from '../models';
import type { TSolidVaultMap } from '../models';

/**
 * Helper to safely access the global vault without 'any'.
 */
export function getGlobalVault(): TSolidVaultMap | undefined {
  return globalThis[IS_SOLID_CONFIG_ITEMS.solidVaultKey];
}
/**
 * Helper to initialize the global vault safely.
 */
export function ensureGlobalVault(): TSolidVaultMap {
  const current = globalThis.__SOLID_VAULT__;

  if (current) return current;

  // Initialize the two "Drawers" of the Database
  const vault: TSolidVaultMap = {
    items: new Map(),
    errors: new Map(),
  };

  globalThis.__SOLID_VAULT__ = vault;

  return vault;
}
