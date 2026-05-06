import type { TTypeGuard, TAssert } from '../../../../models/types';
import {
  isNull,
  isObject,
  isKeyInObject,
  isUndefined,
  isString,
} from '../../../../models/guards';
import { Registry } from '../../../../src/vault';
import type { ISolidRegistry } from '../../../../models/types';
import { createInitialContext } from '../../../../src/validation/context';
import { validate } from '../../../../src/validation';

export const isMetaData: TTypeGuard<TSolidMetadata> = (
  val: unknown,
): val is TSolidMetadata =>
  !isNull(val) &&
  isObject(val) &&
  isKeyInObject('key')(val) &&
  isKeyInObject('shape')(val) &&
  isKeyInObject('area')(val) &&
  isKeyInObject('version')(val);

export function isRegistration(arg1: unknown, arg2: unknown): boolean {
  if (isMetaData(arg2)) return true;

  if (arguments.length <= 1) return isUndefined(arg1) || isMetaData(arg1);

  return false;
}

export const isResolution: TTypeGuard<keyof ISolidRegistry> = (
  val: unknown,
): val is keyof ISolidRegistry =>
  isString(val) && Registry.keys().includes(val);

// export const isValidation = (arg1: unknown, arg2: unknown): boolean => {
//   if (isUndefined(arg1)) return false;

//   if (isMetaData(arg2)) return true;

//   return isString(arg2) && Registry.has(arg2);
// };
export const isValidation = (...args: unknown[]): boolean => {
  const [data, arg2, arg3] = args;

  // 1. Must have data to validate
  if (isUndefined(data)) return false;

  // 2. Scan for a valid Blueprint (Key or Metadata)
  // Check arg2 (Manual/Injected) or arg3 (Injected during Assertion)
  const key = isString(arg2) ? arg2 : isString(arg3) ? arg3 : undefined;
  const hasMeta = isMetaData(arg2);

  // 3. THE BOTTOM LINE: Data exists + a valid blueprint is provided
  return isSolidKey(key) || hasMeta;
};

export const isSolidKey: TTypeGuard<Extract<keyof ISolidRegistry, string>> = (
  key: unknown,
): key is Extract<keyof ISolidRegistry, string> =>
  isString(key) && Registry.has(key);

export function buildValidationTools<
  K extends Extract<keyof ISolidRegistry, string>,
>(
  key: K,
): {
  guard: TTypeGuard<ISolidRegistry[K]>;
  assert: TAssert<ISolidRegistry[K]>;
} {
  const guard: TTypeGuard<ISolidRegistry[K]> = (
    val: unknown,
  ): val is ISolidRegistry[K] => {
    // Now TypeScript knows 'key' is definitely a string
    const meta = Registry.get(key);
    if (!meta) return false;

    const ctx = createInitialContext();
    ctx.currentKey = key;
    const isValid = validate(val, meta.shape, ctx);

    Registry.setErrors(key, isValid ? [] : ctx.errors);
    return isValid;
  };

  // 🚀 The Assert: Throws or narrows type
  const assert = (val: unknown): asserts val is ISolidRegistry[K] => {
    if (!guard(val)) {
      const errors = Registry.getErrors(key as string);
      const msg = errors[0]
        ? `[xalor] ${key} failed: ${errors[0].message}`
        : 'Validation failed';
      throw new Error(msg);
    }
  };

  return { guard, assert };
}
// export const isValidationd = (arg1: unknown, arg2: unknown, arg3?: unknown): boolean => {
//   // 1. We must have data in the first slot
//   if (isUndefined(arg1)) return false;

//   // 2. We must have a "Pointer" (The Key)
//   // The key could be in arg2 (manual) or arg3 (injected by Miner)
//   const potentialKey = isString(arg2) ? arg2 : (isString(arg3) ? arg3 : undefined);

//   // 3. THE BOTTOM LINE: Does the pointer exist in our Registry?
//   // We use isSolidKey here to perform the O(1) Map lookup
//   return isSolidKey(potentialKey) || isMetaData(arg2);
// };

// function isValidationd(...args: unknown[]) {

// }
