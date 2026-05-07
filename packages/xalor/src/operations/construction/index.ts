// src/index.ts
//// eslint-disable-next-line @typescript-eslint/triple-slash-reference
// /// <reference path="../../../dist/solid-env.d.ts" />
import { Registry } from '../../vault';
import type { TSolidMetadata, TSolidError } from '../../models/types';
// import { isXalor } from '../core';
/**
 * Public Query API
 * Allows developers to "peek" into the Database of Types.
 */
export function getSolid(key: string): TSolidMetadata | undefined {
  // isXalor<''>();
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
