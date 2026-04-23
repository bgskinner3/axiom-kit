import type { TTypeGuard, TAssert } from '../models';
/**
 * @utilType Guard
 * @name isString
 * @category Guards Core
 * @description Validates that a value is a string.
 * @link #isstring
 */
export const isString: TTypeGuard<string> = (value): value is string =>
  typeof value === 'string';

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
 * @name isNumber
 * @category Guards Core
 * @description Validates that a value is a number, excluding NaN and Infinity.
 * @link #isnumber
 */
export const isNumber: TTypeGuard<number> = (value): value is number =>
  typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value);

/**
 * @utilType util
 * @name makeAssert
 * @category Validations Assertions
 * @description Higher-order utility that creates a reusable assertion function for a specific type guard.
 * @link #makeassert
 *
 * @example
 * ```ts
 * const isNumber = (v: unknown): v is number => typeof v === 'number';
 * const assertNumber = makeAssert(isNumber, 'myNumber');
 *
 * const value: unknown = 42;
 * assertNumber(value); // Narrows value type to number
 * ```
 */
export const makeAssert = <T>(
  guard: TTypeGuard<T>,
  key: string,
): TAssert<T> => {
  const defaultMsg = `Validation failed for property: ${key}`;
  return (value: unknown, message?: string): asserts value is T => {
    if (!guard(value)) {
      throw new Error(message ?? defaultMsg);
    }
  };
};
