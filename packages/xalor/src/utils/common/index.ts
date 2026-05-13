import type { TTypeGuard, TAssert, TSolidShape } from '../../models/types';
import { XalethorService } from '../../xalor-service';

/**
 * Generates a rapid, zero-dependency 32-bit structural fingerprint from a raw string.
 * @param input - The raw string to hash.
 * @returns A string prefixed with 'sh_' followed by the base-36 hash.
 */
export const computeStringHash = (input: string): string => {
  let hash = 0;
  const len = input.length;

  for (let i = 0; i < len; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // Force 32-bit integer
  }

  // Use unsigned right shift (>>> 0) to avoid Math.abs()
  // This prevents negative hash collision skewing
  return `sh_${(hash >>> 0).toString(36)}`;
};
/**
 * @utilType util
 * @name assertValue
 * @category Validations Assertions
 * @description Asserts that a value passes a type guard check, throwing an error if it fails while preserving TS narrowing.
 * @link #assertvalue
 *
 * @throws {Error} If the value does not satisfy the type guard.
 *
 * @example
 * ```ts
 * const isString = (v: unknown): v is string => typeof v === 'string';
 * const myValue: unknown = "hello";
 * assertValue(myValue, isString); // narrows type of myValue to string
 * ```
 */
export function assertValue<T>(
  value: unknown,
  typeGuard: TTypeGuard<T>,
  message?: string,
): asserts value is T {
  if (!typeGuard(value)) {
    throw new Error(
      message ??
        `Assertion failed: value ${JSON.stringify(value)} does not satisfy ${typeGuard.name || 'type guard'}`,
    );
  }
}

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
  _key: string,
): TAssert<T> => {
  // 🚀 Adding 'asserts value is T' here satisfies the TAssert interface contract
  return (value: unknown, message?: string): asserts value is T => {
    assertValue(value, guard, message);
  };
};

// GENRATORS
export const generateRandomString = (maxLength: number = 20): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
  const length = Math.floor(Math.random() * Math.min(maxLength, 20)) + 5;
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length)),
  ).join('');
};
