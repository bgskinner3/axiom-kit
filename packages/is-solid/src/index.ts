import { Registry } from './vault';
import type { TSolid, TSolidMetadata } from './models';
import { createInitialContext } from './validation/context';
import { validate } from './validation';
/**
 * The 'isSolid' runtime implementation.
 * @param data - The value to validate.
 * @param injected - The metadata automatically injected by the Transformer.
 */
export function isSolid<K extends string, T>(
  data: unknown,
  injected?: TSolidMetadata,
): data is TSolid<K, T> {
  // 1. If transformer injected metadata, register it
  if (injected) {
    Registry.register(injected);
  }

  // 2. Determine the shape to check against
  // Priority: Injected metadata > Vault lookup
  const shape = injected?.shape;

  if (!shape) {
    // If no shape found, we cannot validate
    return false;
  }

  // 3. Run the Engine
  return validate(data, shape, createInitialContext());
}

/**
 * Public Query API
 * Allows developers to "peek" into the Database of Types.
 */
export function getSolid(key: string): TSolidMetadata | undefined {
  return Registry.get(key);
}
