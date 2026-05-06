// models/guards/common/objects.ts
import type { TTypeGuard } from '../../types';
import { isNull, isString, isNumber, isSymbol } from './primitives';
/**
 * @utilType Guard
 * @name isArray
 * @category Guards Core
 * @description Validates that a value is an Array.
 * @link #isarray
 */
export const isArray: TTypeGuard<unknown[]> = <T, U>(
  term: Array<T> | U,
): term is Array<T> => Array.isArray(term);
/**
 * @utilType Guard
 * @name isObject
 * @category Guards Core
 * @description Validates that a value is a non-null, non-array object.
 * @link #isobject
 */
export const isObject: TTypeGuard<object> = <T extends object, U>(
  term: T | U,
): term is NonNullable<T> =>
  !isNull(term) && !isArray(term) && typeof term === 'object';

/**
 * @utilType Guard
 * @name isRecord
 * @category Guards Core
 * @description Validates that a value is a non-null object (and not an array)
 * that can be indexed by strings.
 */
export const isRecord: TTypeGuard<Record<string, unknown>> = (
  value: unknown,
): value is Record<string, unknown> =>
  isObject(value) &&
  value !== null &&
  !isArray(value) &&
  !(value instanceof Date) &&
  !(value instanceof RegExp);
/**
 * @utilType Guard
 * @name isKeyOfObject
 * @category Guards Core
 * @description Validates if a value is a valid property key (string, number, or symbol) of a specific object.
 * @link #iskeyofobject
 *
 * ## 🔑 isKeyOfObject — Object Key Validator
 *
 * This function returns a **TypeScript type guard**, allowing you to safely
 * access object properties with dynamic keys while retaining full type safety.
 *
 * @typeParam T - The type of the target object.
 * @returns A type guard `(key: unknown) => key is keyof T`.
 */
export const isKeyOfObject =
  <T extends object>(obj: T): TTypeGuard<keyof T> =>
  (key: unknown): key is keyof T =>
    (isString(key) || isNumber(key) || isSymbol(key)) && key in obj;

/**
 * @utilType Guard
 * @name isKeyInObject
 * @category Guards Core
 * @description Narrows an unknown value to an object containing a specific property key, allowing safe property access.
 * @link #iskeyinobject
 *
 * ## 📦 isKeyInObject — Object Property Guard
 *
 * Narrows the *object* itself. After calling this function, TypeScript knows that
 * the input is a non-null object containing the specified key.
 *
 * @param key - The property key to check for.
 * @returns A type guard that checks if an unknown value is an object containing the key.
 */
export const isKeyInObject =
  <K extends PropertyKey>(key: K) =>
  (obj: unknown): obj is Record<K, unknown> =>
    isObject(obj) && key in obj;
