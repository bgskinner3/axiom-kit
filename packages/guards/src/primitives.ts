import type { TTypeGuard } from '@axiom/utility-types';
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
 * @utilType Guard
 * @name isInteger
 * @category Guards Core
 * @description Checks whether a value is a valid integer.
 * @link #isinteger
 */
export const isInteger: TTypeGuard<number> = (value): value is number =>
  Number.isInteger(value);
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
 * @name isNonEmptyString
 * @category Guards Core
 * @description Validates that a value is a string with a length greater than zero (excluding whitespace).
 * @link #isnonemptystring
 */
export const isNonEmptyString: TTypeGuard<string> = (value): value is string =>
  typeof value === 'string' && value.length > 0 && value.trim().length > 0;
/**
 * @utilType Guard
 * @name isBoolean
 * @category Guards Core
 * @description Validates that a value is a boolean (true or false).
 * @link #isboolean
 */
export const isBoolean: TTypeGuard<boolean> = (value): value is boolean =>
  typeof value === 'boolean';

/**
 * @utilType Guard
 * @name isBigInt
 * @category Guards Core
 * @description Validates that a value is a BigInt.
 * @link #isbigint
 */
export const isBigInt: TTypeGuard<bigint> = (value): value is bigint =>
  typeof value === 'bigint';

/**
 * @utilType Guard
 * @name isSymbol
 * @category Guards Core
 * @description Validates that a value is a unique JavaScript symbol.
 * @link #issymbol
 */
export const isSymbol: TTypeGuard<symbol> = (value): value is symbol =>
  typeof value === 'symbol';
/**
 * @utilType Guard
 * @name isPrimitive
 * @category Guards Core
 * @description Validates if a value is any of the basic JS primitives: string, number, boolean, or bigint.
 * @link #isprimitive
 */
export const isPrimitive = (
  value: unknown,
): value is string | number | boolean =>
  isString(value) || isNumber(value) || isBoolean(value) || isBigInt(value);
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
 * @name isUndefined
 * @category Guards Primitive
 * @description Validates that a value is undefined.
 * @link #isundefined
 */
export const isUndefined: TTypeGuard<undefined> = (value): value is undefined =>
  typeof value === 'undefined';
/**
 * @utilType Guard
 * @name isDefined
 * @category Guards Primitive
 * @description Ensures a value is neither null nor undefined.
 * @link #isdefined
 */
export const isDefined: TTypeGuard<unknown> = (
  value,
): value is NonNullable<unknown> => value !== null && value !== undefined;
/**
 * @utilType Guard
 * @name isNil
 * @category Guards Primitive
 * @description Checks if a value is null or undefined (nullish).
 * @link #isnil
 */
export const isNil: TTypeGuard<null | undefined> = (
  value,
): value is null | undefined => value == null;