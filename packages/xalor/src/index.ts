// src/index.ts
import { Registry } from './vault';
import type {
  ISolidRegistry,
  TSolid,
  TSolidMetadata,
  TSolidError,
} from '../models';
import { createInitialContext } from './validation/context';
import { validate } from './validation';
// import { isXalor } from './operations/core/is-xalor';

/* prettier-ignore */ export function isSolid<_K extends string, _T>(data?: undefined, injected?: TSolidMetadata): true;
/* prettier-ignore */ export function isSolid<K extends string, T>(data: unknown,injected?: TSolidMetadata): data is TSolid<K, T>;
/* prettier-ignore */ export function isSolid<K extends keyof ISolidRegistry>(data: unknown): data is TSolid<K, ISolidRegistry[K]>;
export function isSolid(data?: unknown, injected?: TSolidMetadata): boolean {
  /* prettier-ignore */ if (injected) Registry.register(injected);
  /* prettier-ignore */ if (arguments.length === 0 || (arguments.length === 1 && data === undefined)) return true;

  // Active Validation: Lookup shape if it wasn't injected in this specific call
  const key = injected?.key ?? '';
  const shape = injected?.shape || Registry.get(injected?.key ?? '')?.shape;
  if (!shape) {
    console.warn(
      `[xalor] Validation skipped: No shape found for key "${key || 'unknown'}". ` +
        `Ensure the type has been registered or the transformer is active.`,
    );
    return false;
  }
  const ctx = createInitialContext();
  ctx.currentKey = key;

  const isValid = validate(data, shape, ctx);

  if (ctx.currentKey) {
    // Overwrite with current errors (or an empty array if valid)
    Registry.setErrors(ctx.currentKey, isValid ? [] : ctx.errors);
  }

  return isValid;
}
/**
 * CLEAN PUBLIC API
 * Notice: No mention of TSolidMetadata in the signatures.
 */

// 1. Ghost Call
// export function isSolid<K extends string, T>(data?: undefined): true;

// // 2. Validation Type Guard
// export function isSolid<K extends string, T>(
//   data: unknown,
// ): data is TSolid<K, T>;

// // 3. Autocomplete Lookup
// export function isSolid<K extends keyof ISolidRegistry>(
//   data: unknown,
// ): data is TSolid<K, ISolidRegistry[K]>;

// /**
//  * THE HIDDEN ENGINE
//  * We use 'any' or '...args' to capture the "Secret" second argument
//  * injected by the Transformer.
//  */
// export function isSolid(data?: unknown, ...args: any[]): boolean {
//   // The Transformer injects metadata as the 2nd argument.
//   // In the 'Value World', it's just args[0].
//   const injected = args[0] as TSolidMetadata | undefined;

//   const isGhostCall =
//     arguments.length === 0 || (arguments.length === 1 && data === undefined);

//   // 1. REGISTRATION PHASE (The "Chef" put the plate on the table)
//   if (injected && injected.key) {
//     console.log(
//       `[xalor:runtime] 📥 Secret Payload received for: "${injected.key}"`,
//     );
//     Registry.register(injected);
//   } else {
//     // If this hits, the transformer didn't rewrite this call
//     console.warn(
//       `[xalor:runtime] ⚠️ No metadata injected. Validation will require a manual Registry.get().`,
//     );
//   }

//   if (isGhostCall) return true;

//   // 2. VALIDATION PHASE
//   const key = injected?.key ?? '';
//   const metadata = injected || (key ? Registry.get(key) : undefined);

//   if (!metadata?.shape) {
//     console.error(
//       `[xalor:runtime] ❌ No blueprint for "${key}". Is the transformer active?`,
//     );
//     return false;
//   }

//   // Execute your validation logic here...
//   return validate(data, metadata.shape);
// }
// /* prettier-ignore */
// export function isSolid<_K extends string, _T>(data?: undefined, injected?: TSolidMetadata): true;
// /* prettier-ignore */
// export function isSolid<K extends string, T>(data: unknown, injected?: TSolidMetadata): data is TSolid<K, T>;
// /* prettier-ignore */
// export function isSolid<K extends keyof ISolidRegistry>(data: unknown): data is TSolid<K, ISolidRegistry[K]>;

// export function isSolid(data?: unknown, injected?: TSolidMetadata): boolean {
//   // 1. REGISTRATION: If the transformer injected metadata, save it immediately
//   if (injected) {
//     Registry.register(injected);
//   }

//   // 2. GHOST CALL CHECK: If no data was provided, we are just registering the type
//   // This handles the isSolid<"KEY", Type>() call pattern
//   if (
//     arguments.length === 0 ||
//     (arguments.length === 1 && data === undefined)
//   ) {
//     return true;
//   }

//   // 3. VALIDATION LOOKUP
//   const key = injected?.key ?? '';
//   const shape = injected?.shape || Registry.get(key)?.shape;

//   if (!shape) {
//     console.warn(
//       `[xalor] No shape found for key "${key || 'unknown'}". skipping...`,
//     );
//     return false;
//   }

//   // 4. EXECUTE VALIDATION
//   const ctx = createInitialContext();
//   ctx.currentKey = key;

//   const isValid = validate(data, shape, ctx);

//   // 5. ERROR PERSISTENCE
//   if (key) {
//     Registry.setErrors(key, isValid ? [] : ctx.errors);
//   }

//   return isValid;
// }
/**
 * Public Query API
 * Allows developers to "peek" into the Database of Types.
 */
export function getSolid(key: string): TSolidMetadata | undefined {
  return Registry.get(key);
}
/**
 * GET SOLID ERRORS
 * Retrieves the breadcrumb failure report for a specific key.
 * Used after isSolid() returns false.
 */
export function getSolidErrors(key: string): TSolidError[] {
  return Registry.getErrors(key);
}
/**
 * GET SOLID DEFAULT
 *
 * Retrieves a "Zero-Value" template for a specific key from the Vault.
 *
 * ----------------
 *
 * Automates the creation of valid data structures without manual boilerplate.
 * It recursively crawls the solidified blueprint to generate:
 * - Strings as ""
 * - Numbers as 0
 * - Arrays as []
 * - Objects with all required (non-optional) properties
 *
 * ----------------
 *
 * Ideal for initializing form states, resetting local state variables,
 * or generating skeleton objects for UI loaders that must adhere to a specific type.
 */
export function getSolidDefault<T>(key: string): T {
  return Registry.getDefault<T>(key);
}

/**
 * FUNCTIONS TO ADD
 *
//  * I.getSolidDefault<T>(key)
//  *  - The Template: Generates a "Zero-Value" object (strings to "", numbers to 0). Perfect for initializing form state.
 *
 * II.getSolidMock<T>(key)
 *  - The Faker: Generates an object with randomized valid data. Essential for unit tests and prototyping.
 *
 * III.getSolidSchema(key)
 *  - he Translator: Converts the internal TSolidShape into other formats (like JSON Schema or Zod) for ecosystem compatibility.
 *
 * ----
 * IV.clearSolidVault()
 *  - The Janitor: Wipes all registered types and errors. Critical for HMR and testing environments.
 *
 * V. exportSolidDatabase()
 *  - The Porter: Dumps the entire Vault into a serializable JSON object. Allows you to "save" the state of your types to a file.
 *
 * VI. importSolidDatabase(json)
 *  - The Rehydrator: Loads a previously exported JSON database into the live Vault.
 *
 * ---
 *  VI. isSolidEqual<K>(a, b)
 *   -The Deep Comparison: Checks if two objects are structurally identical based on the registered blueprint.
 *
 * VII.patchSolid<K, T>(data, partial)
 *  - The Safe Merger: Merges a partial object into an existing one, ensuring the final result still satisfies the blueprint.
 *
 * VIII. matchSolid<K>(data, handlers)
 *  - The Pattern Matcher: A functional "Switch" statement that executes different code paths based on which Solid Type the data matches.
 */
