// import { XalethorVault } from '../xalor-vault';
// import { isUndefined, isString } from '../utils/guards';
// import type { ISolidRegistry, TSolidMetadata } from '../models/types';
// import {
//   isRegistration,
//   isValidation,
//   isResolution,
//   isMetaData,
//   isSolidKey,
// } from '../utils/guards/operations';
// /**

//  */

// /** I. REGISTRATION */
// /* prettier-ignore */ export function isXalor<_K extends string, _T>(data?: undefined, injected?: TSolidMetadata): true;
// /** II. RESOLUTION */
// /* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(data?: undefined, injectedKey?: K): TSolidMetadata;
// /** III. VALIDATION */
// /* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(data: unknown, injectedKey?: K): data is ISolidRegistry[K];
// /* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(data: unknown, assert: true, injectedKey?: K): asserts data is ISolidRegistry[K];
// /* prettier-ignore */ export function isXalor(...args: unknown[]): boolean | TSolidMetadata {

//    const [data, arg2, arg3] = args;
//    XalethorVault.resolve('')
//   // 1. REGISTRATION & INJECTION
//    if (isRegistration(data, arg2)) {

//     const meta = isMetaData(arg2) ? arg2 : (isMetaData(data) ? data : null);
//     if (meta) XalethorVault.solidify(meta);  //Registry.register(meta);
//     return true;
//   }

//   if (isResolution(data) || (isUndefined(data) && isResolution(arg2))) {
//     // const key = String(isResolution(data) ? data : arg2);

//     // 💎 FIX: Use your polymorphic archive to return the full metadata
//     // This allows 'const meta = isXalor<"USER">()' to work again.
//     return false
//   }

//   return true;
// }
