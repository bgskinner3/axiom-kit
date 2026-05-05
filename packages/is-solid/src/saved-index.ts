// import { Registry } from './vault';
// import type { TSolid, TSolidMetadata } from '../models';
// import { createInitialContext } from './validation/context';
// import { validate } from './validation';
// ======+> Abstract Syntax Tree (AST)."

// export function isSolid<_K extends string, _T>(
//   data?: undefined,
//   injected?: TSolidMetadata,
// ): true;
// export function isSolid<K extends string, T>(
//   data: unknown,
//   injected?: TSolidMetadata,
// ): data is TSolid<K, T>;
// export function isSolid(data?: unknown, injected?: TSolidMetadata): boolean {
//   if (injected) {
//     Registry.register(injected);
//   }

//   // If no data, we are in "Seeder" mode
//   if (
//     arguments.length === 0 ||
//     (arguments.length === 1 && data === undefined)
//   ) {
//     return true;
//   }

//   // If data exists, we are in "Guard" mode
//   const shape =
//     injected?.shape || (injected && Registry.get(injected?.key)?.shape);
//   if (!shape) return false;

//   return validate(data, shape);
// }
// TNormalizeValue<T>
// /**
//  * The 'isSolid' runtime implementation.
//  * @param data - The value to validate.
//  * @param injected - The metadata automatically injected by the Transformer.
//  */
// export function isSolid<K extends string, T>(
//   data: unknown,
//   injected?: TSolidMetadata,
// ): data is TSolid<K, T> {
//   // 1. If transformer injected metadata, register it
//   if (injected) {
//     Registry.register(injected);
//   }

//   // 2. Determine the shape to check against
//   // Priority: Injected metadata > Vault lookup
//   const shape = injected?.shape;

//   if (!shape) {
//     // If no shape found, we cannot validate
//     return false;
//   }

//   // 3. Run the Engine
//   return validate(data, shape, createInitialContext());
// }

// // /**
// //  * Public Query API
// //  * Allows developers to "peek" into the Database of Types.
// //  */
// export function getSolid(key: string): TSolidMetadata | undefined {
//   return Registry.get(key);
// }
/**
 export function isSolid<K extends string, T>(
  data?: unknown, // Now optional
  injected?: TSolidMetadata,
): data is TSolid<K, T> {
  // 1. Always register the "Solid" metadata if it was injected
  if (injected) {
    Registry.register(injected);
  }

  // 2. If no data was passed, we're done (Passive mode)
  if (arguments.length === 1 && injected) return true; 
  if (data === undefined && !injected) return false;

  // 3. Active Validation mode
  const shape = injected?.shape;
  if (!shape) return false;

  return validate(data, shape, createInitialContext());
}
 */

/**
 type TTYPE = {
 id: string
 meta: {
 count: number
 }
 }
 // registering the type 
 // this formatting shoudl register the type into our global store
isSolid<"KEY-1", TTYPE> 

///
now if a user wants the tpye 
we can use teh same ... with intellliesne the user can see what keys ahve ben registered etc... ,
passing a new type to overwrite it will cause an error .. 

type TCopy = isSolid<"KEY-1"> 


/// we can slo use it as a type guard 
 isSolid<"KEY-1">(data) 




 */
