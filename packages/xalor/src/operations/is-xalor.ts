import { XalethorService } from '../xalor-service';
import type {
  ISolidRegistry,
  TSolidMetadata,
  TStrictSolidMetaData,
  TSolidBranded,
} from '../models/types';
import { isMetaData } from '../utils/guards/operations';

type TXalorArgs<K extends keyof ISolidRegistry> =
  | /* prettier-ignore */ { mode?: never; injectedKey?: never; data?: undefined; injected?: TSolidMetadata } // Registration
  | /* prettier-ignore */ { mode: 'meta'; injectedKey: K; data?: never; injected?: never } // Resolution
  | /* prettier-ignore */ { mode: 'guard'; injectedKey: K; data: unknown; injected?: never } // Validation
  | /* prettier-ignore */ { mode: 'assert'; injectedKey: K; data: unknown; injected?: never } // Assertion
  | /* prettier-ignore */ { mode: 'parse'; injectedKey: K; data: unknown }
  | /* prettier-ignore */ { mode: 'parseAsync'; injectedKey: K; data: unknown };

/** I. REGISTRATION (Generic call for the Miner) */
/* prettier-ignore */ export function isXalor<_K extends keyof ISolidRegistry | (string & {}), _T>(): void;
/** II. RESOLUTION (Metadata lookup) */
/* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(params: {  mode: 'meta', injectedKey: K }): TStrictSolidMetaData;
/** III. VALIDATION (The Boolean Guard) */
/* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(params: { mode: 'guard', injectedKey: K, data: unknown }): params is { mode: 'guard', injectedKey: K, data: ISolidRegistry[K] }
/** IV. ASSERTION (The Auditor Enforcer) */
/* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(params: { mode: 'assert', injectedKey: K, data: unknown }): asserts params is { mode: 'assert', injectedKey: K, data: ISolidRegistry[K] };
/** V. PARSE (The Boolean Guard) */
/* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(params: { mode: 'parse', injectedKey: K, data: unknown }): TSolidBranded<K, ISolidRegistry[K]>;
/* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(params: { mode: 'parseAsync', injectedKey: K, data: unknown }): Promise<TSolidBranded<K, ISolidRegistry[K]>>;
/* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(params: TXalorArgs<K> = {}): void | boolean | TStrictSolidMetaData | Promise<TSolidBranded<K, ISolidRegistry[K]>> | TSolidBranded<K, ISolidRegistry[K]> {
 const { mode, injectedKey, data } = params;

if (!mode && isMetaData(params))  return XalethorService.solidify(params); 

 if(mode === 'meta')  return XalethorService.inspectMetaData(injectedKey)
  if(mode === 'guard') return XalethorService.validateShape(data, injectedKey);
  if (mode === 'assert') {
  if (!XalethorService.validateShape(data, injectedKey)) {
    XalethorService.panic(injectedKey);
  }
  return;
}
  if (mode === 'parse') {
    if (XalethorService.validateShape(data, injectedKey)) {
      // TypeScript allows this return because 'data' is part of the union 
      // via ISolidRegistry[K] (which is what TSolidBranded wraps)
      return data as TSolidBranded<K, ISolidRegistry[K]>; 
    }
    XalethorService.panic(injectedKey);
  }

  // 7. Async Parse Hat
  if (mode === 'parseAsync') {
    // We use an async iife or return a chain starting with data
    return Promise.resolve(data).then((val): TSolidBranded<K, ISolidRegistry[K]> => {
      if (XalethorService.validateShape(val, injectedKey)) {
        return val as TSolidBranded<K, ISolidRegistry[K]>;
      }
      XalethorService.panic(injectedKey);
    });
  }

}
// import {
//   isRegistration,
//   isValidation,
//   isResolution,
//   isMetaData,
//   isSolidKey,
//   buildValidationTools,
// } from './helpers';
// import { XalethorVault } from '../../../xalor-vault';
// import { isUndefined, isString } from '../../../utils/guards';
// import type { ISolidRegistry, TSolidMetadata } from '../../../models/types';

// const isAssertionIntent = (arg2: unknown, arg3: unknown): boolean =>
//   arg2 === true || arg3 === true;

// export function extractSolidKey(
//   ...args: unknown[]
// ): Extract<keyof ISolidRegistry, string> | undefined {
//   // We only care about the key slots (arg2 or arg3)
//   const [_, ...payload] = args;

//   // Find the last string provided in those slots
//   const key = payload.reverse().find(isString);

//   return isSolidKey(key) ? key : undefined;
// }
// /** I. REGISTRATION */
// /* prettier-ignore */ export function isXalor<_K extends keyof ISolidRegistry | (string & {}), _T>(data?: undefined, injected?: TSolidMetadata): true;
// /** II. RESOLUTION */
// /* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(data?: undefined, injectedKey?: K): TSolidMetadata;
// /** III. VALIDATION */
// /* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(data: unknown, injectedKey?: K): data is ISolidRegistry[K];
// /* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(data: unknown, assert: true, injectedKey?: K): asserts data is ISolidRegistry[K];
// /* prettier-ignore */ export function isXalor(...args: unknown[]): boolean | TSolidMetadata {
//    const [data, arg2, arg3] = args;
//   // 1. REGISTRATION & INJECTION
//    if (isRegistration(data, arg2)) {

//     const meta = isMetaData(arg2) ? arg2 : (isMetaData(data) ? data : null);
//     console.log(data, arg2, "METTTAA /\n\n\n")
//     if (meta) XalethorVault.solidify(meta);  //Registry.register(meta);
//     return true;
//   }

//   // 🔍 DOOR 2: RESOLUTION
//   // POSSIBEL INTERAGRATION FOR
//   //  d Type Extraction or Ghost Inference. ?? we declare a type ..
// if (isResolution(data) || (isUndefined(data) && isResolution(arg2))) {
//   // const key = String(isResolution(data) ? data : arg2);

//   // 💎 FIX: Use your polymorphic archive to return the full metadata
//   // This allows 'const meta = isXalor<"USER">()' to work again.
//   return false
// }

//   // 3. REGISTRATION GHOST-CALL HAT
//   // If no args or just (undefined): isXalor<K, T>()
//   if (arguments.length === 0 || (arguments.length === 1 && data === undefined)) {
//     return true;
//   }
//     if (isValidation(...args)) {
//     const key = extractSolidKey(...args);
//     const shouldAssert = isAssertionIntent(arg2, arg3);

//     if (!key) {
//       if (shouldAssert) throw new Error("[xalor] No valid Solid key found.");
//       return false;
//     }

//     const { guard, assert: rawAssert } = buildValidationTools(key);

//     if (shouldAssert) {
//       // 💡 THE FIX: Explicitly cast the assertion for the compiler
//       const assert: (val: unknown) => asserts val is unknown = rawAssert;
//       assert(data);
//       return true;
//     }

//     return guard(data);
//   }

//   return true;
// }
