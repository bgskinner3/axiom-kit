// src/utils/global
import { IS_SOLID_CONFIG_ITEMS } from '../../../models';
import type { TSolidVaultMap } from '../../../models';

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
  if (globalThis.__SOLID_VAULT__) return globalThis.__SOLID_VAULT__;

  const vault: TSolidVaultMap = {
    items: new Map(),
    errors: new Map(),
  } satisfies TSolidVaultMap;

  globalThis.__SOLID_VAULT__ = vault;
  return vault;
}
