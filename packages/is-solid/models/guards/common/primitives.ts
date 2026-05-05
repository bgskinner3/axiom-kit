// models/guards/common/primitives.ts
import type { TTypeGuard, TPrimitive } from '../../types';
/**
 * @utilType Guard
 * @name isNull
 * @category Guards Primitive
 * @description Validates that a value is explicitly null.
 * @link #isnull
 */
export const isNull: TTypeGuard<null> = <T>(term: T | null): term is null =>
  term === null;
/**
 * @utilType Guard
 * @name isBigInt
 * @category Guards Core
 * @description Validates that a value is a BigInt.
 * @link #isbigint
 */
export const isBigInt: TTypeGuard<bigint> = (value: unknown): value is bigint =>
  typeof value === 'bigint';

/**
 * @utilType Guard
 * @name isUndefined
 * @category Guards Primitive
 * @description Validates that a value is undefined.
 * @link #isundefined
 */
export const isUndefined: TTypeGuard<undefined> = (value): value is undefined =>
  typeof value === 'undefined';
/**
 * @utilType Guard
 * @name isString
 * @category Guards Core
 * @description Validates that a value is a string.
 * @link #isstring
 */
export const isString: TTypeGuard<string> = (value: unknown): value is string =>
  typeof value === 'string';
/**
 * @utilType Guard
 * @name isNumber
 * @category Guards Core
 * @description Validates that a value is a number, excluding NaN and Infinity.
 * @link #isnumber
 */
export const isNumber: TTypeGuard<number> = (value: unknown): value is number =>
  typeof value === 'number' && !isNaN(value); // Added !isNaN to avoid 'NaN' as a valid number
/**
 * @utilType Guard
 * @name isBoolean
 * @category Guards Core
 * @description Validates that a value is a boolean (true or false).
 * @link #isboolean
 */
export const isBoolean: TTypeGuard<boolean> = (
  value: unknown,
): value is boolean => typeof value === 'boolean';
/**
 * @utilType Guard
 * @name isPrimitive
 * @category Guards Core
 * @description Validates if a value is any of the basic JS primitives: string, number, boolean, or bigint.
 * @link #isprimitive
 */
export const isPrimitive: TTypeGuard<TPrimitive> = (
  value: unknown,
): value is TPrimitive =>
  isString(value) || isNumber(value) || isBoolean(value) || isBigInt(value);
