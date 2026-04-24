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
// export function isSolid<K extends string, T>(
//   data: unknown,
//   injected?: TSolidMetadata,
// ): data is TSolid<K, T> {
//   // 1. Capture and Register
//   // If the transformer ran, it passed the metadata here.
//   if (injected) {
//     Registry.register(injected);
//   }

//   // 2. Lookup Fallback
//   // If 'injected' is missing (e.g., dynamic call), check the Vault for the shape.
//   // Note: We'll need a way to pass the 'Key' if injected is missing,
//   // but for the standard build-time flow, 'injected' is always there.

//   // 3. Validation Logic
//   // For the MVP, if we have metadata and the data isn't null, we "trust" it.
//   // We will build the full Validation Engine in the next pillar.
//   return data !== undefined && data !== null && !!injected;
// }

/**
 * Public Query API
 * Allows developers to "peek" into the Database of Types.
 */
export function getSolid(key: string): TSolidMetadata | undefined {
  return Registry.get(key);
}
