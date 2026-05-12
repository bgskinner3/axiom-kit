import type {
  TTypeGuard,
  TSolidMetadata,
  // ISolidRegistry,
} from '../../models/types';
import { isObject, isKeyInObject } from './objects';
import { isNull } from './primitives';

export const isMetaData: TTypeGuard<TSolidMetadata> = (
  val: unknown,
): val is TSolidMetadata =>
  !isNull(val) &&
  isObject(val) &&
  isKeyInObject('key')(val) &&
  isKeyInObject('shape')(val) &&
  isKeyInObject('area')(val) &&
  isKeyInObject('version')(val);

// export function isRegistration(arg1: unknown, arg2: unknown): boolean {
//   if (isMetaData(arg2)) return true;

//   if (arguments.length <= 1) return isUndefined(arg1) || isMetaData(arg1);

//   return false;
// }

// export const isResolution: TTypeGuard<keyof ISolidRegistry> = (
//   val: unknown,
// ): val is keyof ISolidRegistry =>
//   isString(val) && XalethorVault.keys().includes(val);

// export const isValidation = (...args: unknown[]): boolean => {
//   const [data, arg2, arg3] = args;

//   // 1. Must have data to validate
//   if (isUndefined(data)) return false;

//   // 2. Scan for a valid Blueprint (Key or Metadata)
//   // Check arg2 (Manual/Injected) or arg3 (Injected during Assertion)
//   const key = isString(arg2) ? arg2 : isString(arg3) ? arg3 : undefined;
//   const hasMeta = isMetaData(arg2);

//   // 3. THE BOTTOM LINE: Data exists + a valid blueprint is provided
//   return isSolidKey(key) || hasMeta;
// };

// export const isSolidKey: TTypeGuard<Extract<keyof ISolidRegistry, string>> = (
//   key: unknown,
// ): key is Extract<keyof ISolidRegistry, string> =>
//   isString(key) && XalethorVault.has(key);

// export const isAssertionIntent = (arg2: unknown, arg3: unknown): boolean =>
//   arg2 === true || arg3 === true;
