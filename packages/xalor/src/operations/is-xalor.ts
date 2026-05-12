import { XalethorVault } from '../xalor-vault';
// import { isUndefined, isString } from '../utils/guards';
import type { ISolidRegistry, TSolidMetadata } from '../models/types';
import {
  // isRegistration,
  // isValidation,
  // isResolution,

  // isSolidKey,
  isMetaData,
} from '../utils/guards/operations';
// injected?: TSolidMetadata
type TXalorArgs<K extends keyof ISolidRegistry> =
  | {
      mode?: never;
      injectedKey?: never;
      data?: undefined;
    }
  | { mode: 'meta'; injectedKey: K; data?: never; injected?: never } // Resolution
  | { mode: 'type'; injectedKey: K; data?: never; injected?: never } // Extraction
  | { mode: 'guard'; injectedKey: K; data: unknown; injected?: never } // Validation
  | { mode: 'assert'; injectedKey: K; data: unknown; injected?: never }; // Assertion

/** I. REGISTRATION (Generic call for the Miner) */
/* prettier-ignore */ export function isXalor<_K extends keyof ISolidRegistry | (string & {}), _T>(): void;
/** II. RESOLUTION (Metadata lookup) */
/* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(params: {  mode: 'meta', injectedKey: K }): TSolidMetadata;
/** III. EXTRACTION (The Ghost Type helper) */
/* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(params: { mode: 'type', injectedKey: K }): ISolidRegistry[K];
/** IV. VALIDATION (The Boolean Guard) */
/* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(params: { mode: 'guard', injectedKey: K, data: unknown }): params is { mode: 'guard', injectedKey: K, data: ISolidRegistry[K] }
/** V. ASSERTION (The Auditor Enforcer) */
/* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(params: { mode: 'assert', injectedKey: K, data: unknown }): asserts params is { mode: 'assert', injectedKey: K, data: ISolidRegistry[K] };
/* prettier-ignore */ export function isXalor<K extends keyof ISolidRegistry>(params: TXalorArgs<K> = {}): void | boolean | TSolidMetadata {
 const { mode,  } = params;
//  if(XalethorVault.has(injectedKey))
  // if (!mode) {
  //   // If the transformer worked, 'params' is now populated with metadata
  //   // We check the 'params' object itself or a nested 'injected' property
  //   const meta = isMetaData(params) ? params : (params.injected || null);
    
  //   console.log(meta, "METTTAA /\n\n\n");
    
  //   if (meta) {
  //     console.log("HEREEE")
  //     XalethorVault.solidify(meta);
  //   }
  //   return; 
  // }

//  if(mode === 'type') {
//   return
//  }
//  if(mode === 'meta') {
//   return
//  }

//   if(mode === 'guard') {
//   return
//  }
//  if(mode === 'assert') {
//   return
//  }
}

// /* prettier-ignore */ export function isXalor(...args: unknown[]): void | boolean | TSolidMetadata {

// }
