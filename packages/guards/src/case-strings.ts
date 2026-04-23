import type { TTypeGuard, THexByteString } from './types';
import type { TCamelCase, TSnakeCase, TKebabCase } from '@axiom/utility-types';
import { isString, isNonEmptyString, isUndefined } from './primitives';
/**
 * @utilType Guard
 * @name isCamelCase
 * @category Guards Core
 * @description Validates if a string follows camelCase naming conventions.
 * @link #iscamelcase
 */
export const isCamelCase: TTypeGuard<TCamelCase<string>> = (
  value,
): value is TCamelCase<string> =>
  isString(value) && /^[a-z]+(?:[A-Z][a-z0-9]*)*$/.test(value);
/**
 * @utilType Guard
 * @name isSnakeCase
 * @category Guards Core
 * @description Validates if a string follows snake_case naming conventions.
 * @link #issnakecase
 */
export const isSnakeCase: TTypeGuard<TSnakeCase<string>> = (
  value,
): value is TSnakeCase<string> =>
  isString(value) && /^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(value);

/**
 * @utilType Guard
 * @name isKebabCase
 * @category Guards Core
 * @description Validates if a string follows kebab-case naming conventions.
 * @link #iskebabcase
 */
export const isKebabCase: TTypeGuard<TKebabCase<string>> = (
  value,
): value is TKebabCase<string> =>
  isString(value) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

/**
 * @utilType Guard
 * @name isHexByteString
 * @category Guards Core
 * @description Factory that creates a guard to validate if a string is a valid hex byte string, optionally enforcing length.
 * @link #ishexbytestring
 * Example usage:
 * ```ts
 * isHexString("0a1b2c"); // true
 * isHexString("0a1b2z"); // false (invalid character 'z')
 * isHexString("0a1b2c", 6); // true
 * isHexString("0a1b2c", 8); // false (length mismatch)
 * ```
 */
export const isHexByteString = (
  expectedLength?: number,
): TTypeGuard<THexByteString> => {
  return (value: unknown): value is THexByteString => {
    if (!isNonEmptyString(value)) return false;
    if (value.length % 2 !== 0) return false;
    if (!/^[0-9a-fA-F]+$/.test(value)) return false;
    if (!isUndefined(expectedLength) && value.length !== expectedLength)
      return false;
    return true;
  };
};
