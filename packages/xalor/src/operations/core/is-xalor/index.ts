import {
  isRegistration,
  isValidation,
  isResolution,
  isMetaData,
  isSolidKey,
  buildValidationTools,
} from './helpers';
import { Registry } from '../../../vault';
import { isUndefined, isString } from '../../../../models';
import type { ISolidRegistry, TSolidMetadata } from '../../../../models';

const isAssertionIntent = (arg2: unknown, arg3: unknown): boolean =>
  arg2 === true || arg3 === true;

export function extractSolidKey(
  ...args: unknown[]
): Extract<keyof ISolidRegistry, string> | undefined {
  // We only care about the key slots (arg2 or arg3)
  const [_, ...payload] = args;

  // Find the last string provided in those slots
  const key = payload.reverse().find(isString);

  return isSolidKey(key) ? key : undefined;
}
/** I. REGISTRATION */
/* prettier-ignore */ export function isXalor<_K extends string, _T>(data?: undefined, injected?: TSolidMetadata): true;
/** II. RESOLUTION */
/* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(data?: undefined, injectedKey?: K): TSolidMetadata;
/** III. VALIDATION */
/* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(data: unknown, injectedKey?: K): data is ISolidRegistry[K];
/* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(data: unknown, assert: true, injectedKey?: K): asserts data is ISolidRegistry[K];
/* prettier-ignore */ export function isXalor(...args: unknown[]): boolean | TSolidMetadata {
   const [data, arg2, arg3] = args;
  // 1. REGISTRATION & INJECTION
   if (isRegistration(data, arg2)) {
    const meta = isMetaData(arg2) ? arg2 : (isMetaData(data) ? data : null);
    if (meta) Registry.register(meta);
    return true; 
  }

  // 🔍 DOOR 2: RESOLUTION
  if (isResolution(data) || (isUndefined(data) && isResolution(arg2))) {
    const key = String(isResolution(data) ? data : arg2)
    return Registry.get(key)!
  }


  // 3. REGISTRATION GHOST-CALL HAT
  // If no args or just (undefined): isXalor<K, T>()
  if (arguments.length === 0 || (arguments.length === 1 && data === undefined)) {
    return true;
  }
    if (isValidation(...args)) {
    const key = extractSolidKey(...args);
 const shouldAssert = isAssertionIntent(arg2, arg3);

    if (!key) {
      if (shouldAssert) throw new Error("[xalor] No valid Solid key found.");
      return false;
    }

    const { guard, assert: rawAssert } = buildValidationTools(key);

    if (shouldAssert) {
      // 💡 THE FIX: Explicitly cast the assertion for the compiler
      const assert: (val: unknown) => asserts val is unknown = rawAssert;
      assert(data); 
      return true; 
    }

    return guard(data);
  }

  return true;
}

/**
 * I. REGISTRATION
 * Registers a TypeScript type into the Ambient Type Database at build-time.
 *
 * The Transformer intercepts this "Ghost Call," analyzes the generic type <T>,
 * and injects the runtime metadata into the Global Vault.
 *
 * @example
 * ```ts
 * export interface User {
 *   id: number;
 *   name: string;
 * }
 *
 * // The Miner solidifies this call into a runtime registration
 * isXalor<'USER', User>();
 * ```
 */
/**
 * II. RESOLUTION
 * Resolves a previously registered type metadata from the Ambient Vault.
 *
 * The Transformer sees the generic <K> and injects the string key
 * into the second argument to fetch the shape at runtime.
 *
 * @example
 * ```ts
 * // The Miner injects 'USER' as the second argument
 * const meta = isXalor<'USER'>();
 *
 * console.log(meta.shape.kind); // "object"
 * ```
 */
/**
 * III. VALIDATION
 * Proves that unknown data matches a registered "Solid" blueprint.
 *
 * Supports three sub-variants:
 * 1. Boolean: Returns true/false.
 * 2. Type Guard: Narrows the type in conditional blocks.
 * 3. Assertion: Throws a detailed error if validation fails.
 *
 * @example
 * ```ts
 * // 🛡️ Type Guard
 * if (isXalor<'USER'>(data)) {
 *   console.log(data.name); // 'data' is narrowed to User
 * }
 *
 * // 🚀 Assertion
 * isXalor<'USER'>(data, true); // Throws if data is invalid
 * ```
 */
