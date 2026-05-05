import type { TTypeGuard, TPrimitive } from '../../../models';

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
 * @name isArray
 * @category Guards Core
 * @description Validates that a value is an Array.
 * @link #isarray
 */
export const isArray: TTypeGuard<unknown[]> = <T, U>(
  term: Array<T> | U,
): term is Array<T> => Array.isArray(term);
export const isString: TTypeGuard<string> = (value: unknown): value is string =>
  typeof value === 'string';

export const isNumber: TTypeGuard<number> = (value: unknown): value is number =>
  typeof value === 'number' && !isNaN(value); // Added !isNaN to avoid 'NaN' as a valid number

export const isBoolean: TTypeGuard<boolean> = (
  value: unknown,
): value is boolean => typeof value === 'boolean';

export const isBigInt: TTypeGuard<bigint> = (value: unknown): value is bigint =>
  typeof value === 'bigint';

////

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

export const isPrimitive: TTypeGuard<TPrimitive> = (
  value: unknown,
): value is TPrimitive =>
  isString(value) || isNumber(value) || isBoolean(value) || isBigInt(value);
