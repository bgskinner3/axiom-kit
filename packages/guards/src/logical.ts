import type { TTypeGuard } from '@axiom/utility-types';
import { ObjectUtils } from '@axiom/core';
import { isString, isNumber, isSymbol,  isDefined } from './primitives';
import { isObject } from './structures';
/**
 * @utilType Guard
 * @name isInArray
 * @category Guards Core
 * @description Creates an O(1) optimized type guard to check if a value exists within a predefined array.
 * @link #isinarray
 *
 * ## 🧩 isInArray — Type Guard Factory for Array Membership
 *
 * Creates a **type guard** that checks whether a value exists in a given array.
 * Internally, it uses a `Set` for **O(1) lookup**, making repeated checks more efficient.
 *
 * @typeParam T - The type of elements in the target array.
 * @param target - The array of allowed values.
 * @returns A type guard function that narrows `unknown` to `T`.
 */
export const isInArray = <T>(target: readonly T[]): TTypeGuard<T> => {
  const set = new Set<unknown>(target);
  return (value: unknown): value is T =>
    set.has(value as T);
};

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
/**
 * @utilType guard
 * @name isInSet
 * @description Type-safe wrapper for Set.has that narrows a value to a specific union.
 */
export const isInSet = <T>(set: Set<unknown>) => 
  (value: unknown): value is T => 
    set.has(value);
/**
 * @utilType Guard
 * @name isKeyOfArray
 * @category Guards Core
 * @description Validates if a primitive value exists within a specific readonly array of allowed keys.
 * @link #iskeyofarray
 *
 * ## 🧩 isKeyOfArray — Type Guard for Allowed Primitive Keys
 *
 * ### 📘 Example Usage
 * ```ts
 * const allowedKeys = ['id', 'name', 'age'] as const;
 * const key: unknown = 'name';
 *
 * if (isKeyOfArray(allowedKeys)(key)) {
 *   // ✅ TypeScript now knows `key` is 'id' | 'name' | 'age'
 *   console.log(key); // 'name'
 * }
 *
 * const invalidKey: unknown = 'email';
 * isKeyOfArray(allowedKeys)(invalidKey); // false
 *
 * // Inline usage
 * isKeyOfArray(['x', 'y', 'z'] as const)('x'); // true
 * isKeyOfArray(['x', 'y', 'z'] as const)('a'); // false
 * ```
 */
export const isKeyOfArray =
  <T extends readonly (string | number | symbol)[]>(
    keys: T,
  ): TTypeGuard<T[number]> =>
  (key: unknown): key is T[number] =>
    (isString(key) || isNumber(key) || isSymbol(key)) &&
    keys.includes(key);

/**
 * @utilType Guard
 * @name isArrayOf
 * @category Guards Core
 * @description Verifies that a value is an array where every element satisfies a provided type guard.
 * @link #isarrayof
 *
 * ## 🧩 isArrayOf — Type Guard for Arrays of Specific Types
 *
 * Checks if a value is an array where **all elements satisfy a given type guard**.
 * This allows TypeScript to narrow types safely and perform runtime validation.
 *
 * @typeParam T - Type of array elements.
 * @param typeGuard - Type guard function for the array elements.
 * @param value - Value to validate.
 */
export const isArrayOf = <T>(
  typeGuard: TTypeGuard<T>,
  value: unknown,
): value is T[] => Array.isArray(value) && value.every(typeGuard);

/**
 * @utilType Guard
 * @name isRecordOf
 * @category Guards Core
 * @description Validates that a value is an object where all property values pass a specific type guard.
 * @link #isrecordof
 *
 * ## 🧩 isRecordOf — Type Guard for Objects with Uniform Value Types
 *
 * Checks if a value is an object where **all property values satisfy a given type guard**.
 * Useful for ensuring that a record has uniform value types and for type-safe access.
 *
 * @typeParam V - Type of the values in the record.
 * @param value - Value to check.
 * @param typeGuard - Type guard function applied to each property value.
 */
export const isRecordOf = <V>(
  value: unknown,
  typeGuard: TTypeGuard<V>,
): value is Record<string, V> =>
  isObject(value) && ObjectUtils.values(value).every(typeGuard);
/**
 * @utilType Guard
 * @name hasDefinedKeys
 * @category Guards Core
 * @description Factory that creates a type guard to verify an object contains a specific set of required, non-undefined keys.
 * @link #hasdefinedkeys
 *
 * ## 🔑 hasDefinedKeys — Required Property Guard Factory
 *
 * Creates a type guard that ensures an object contains a specific set of **required keys**
 * and that their values are **defined** (not `undefined`).
 *
 * @typeParam T - The target object type to validate against.
 * @param requiredKeys - An array of keys from type `T` that must be present and defined.
 * @returns A type guard function.
 */
export const hasDefinedKeys = <T extends object>(
  requiredKeys: (keyof T)[],
): ((value: unknown) => value is T) => {
  return (value: unknown): value is T => {
    if (!value || !isObject(value)) return false;
    return requiredKeys.every(
      (key) => isKeyInObject(key)(value) && isDefined(value[key]),
    );
  };
};

/**
 * @utilType Guard
 * @name isShape
 * @category Guards Core
 * @description Factory for creating recursive structural type guards that validate an object against a schema of guards.
 * @link #isshape
 *
 * ## 🧩 isShape — Recursive Structural Type Guard Factory
 *
 * Creates a **high-fidelity type guard** that validates whether an unknown object
 * conforms to a specific structural "contract" defined by a schema of guards.
 *
 * @typeParam T - The target interface or object type to validate.
 * @param schema - A mapping of keys from `T` to their corresponding `TTypeGuard`.
 * @returns A type guard function that narrows `unknown` to `T`.
 */
export const isShape = <T extends object>(
  schema: { [K in keyof T]: TTypeGuard<T[K]> }
): TTypeGuard<T> => {
  const schemaKeys = Object.keys(schema) as (keyof T)[];
  
  return (value: unknown): value is T => {
    if (!isObject(value)) return false;
    for (const key of schemaKeys) {
        const guard = schema[key];
      // Direct check is faster than calling another higher-order guard
      if (!isKeyInObject(key)(value) || !guard(value[key])) {
        return false;
      }
    }
    return true;
  };
};


/**
 * @utilType Guard
 * @name isType
 * @category Guards Core
 * @description A helper to execute a type guard schema against a value for immediate narrowing.
 * @link #istype
 *
 * @param value - The value to validate.
 * @param schema - The TTypeGuard to execute.
 * ### 📘 Example Usage
 * ```ts
 * // 1. Use a primitive guard
 * if (isType(name, isString)) {
 *   console.log(name.toUpperCase());
 * }
 *
 * // 2. Use a complex literal/shape guard (Fixes 'Bill' | 'Bob' issue)
 * const isOwner = isOneOf(['Bill', 'Bob'] as const);
 *
 * if (isType(rawData, isOwner)) {
 *   // ✅ rawData is narrowed from 'unknown' to exactly 'Bill' | 'Bob'
 *   console.log(`Welcome back, ${rawData}`);
 * }
 * ```
 *
 * ---
 *
 * ### 📌 Notes
 * - **Abstraction**: It doesn't care if the schema is a simple check (`isNumber`)
 *   or a complex tree (`isShape`). It treats all guards as a black box.
 * - **Zero Casting**: Eliminates the need for `as T` by providing a
 *   boolean-based type proof.
 *
 * @typeParam T - The target type expected for the value.
 * @param value - The raw, untrusted data (usually `unknown`).
 * @param schema - The `TTypeGuard` function used to verify the data.
 * @returns A boolean indicating if the value matches the type `T`.
 */
export const isType = <T>(value: unknown, schema: TTypeGuard<T>): value is T =>
  schema(value);


/**
 * @utilType Guard
 * @name isRegExp
 * @category Guards Core
 * @description A helper to execute a type guard schema against a value for immediate narrowing.
 * @link #isRegExp
 */
export const isRegExp = <T extends RegExp>(val: unknown): val is T => {
  return val instanceof RegExp;
};


/**
 * @utilType Guard
 * @name isDate
 * @category Guards Core
 * @description Checks if a value is a valid Date instance.
 * @link #isDate
 */
export const isDate = <T extends Date>(val: unknown): val is T => {
  return val instanceof Date && !isNaN(val.getTime());
};