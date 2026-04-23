import type { TTypeGuard, THexByteString } from './types';
import type {
  TCamelCase,
  TSnakeCase,
  TKebabCase,
} from '@bgskinner2/axiom-kit-utility-types';
import { isString, isNonEmptyString } from './primitives';
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
 * @description Creates a type guard to validate if a value is a Hexadecimal Byte String.
 * @link #ishexbytestring
 * High-performance implementation using character-code checks instead of RegEx.
 *
 * Logic:
 * - Must be a non-empty string.
 * - Must have an even length (byte-aligned).
 * - Characters must be 0-9, a-f, or A-F.
 * - Optionally matches a specific required length.
 *
 * @param {number} [expectedLength] - Optional strict length requirement.
 * @returns {TTypeGuard<THexByteString>} A type guard function.
 *
 * @example
 * ```ts
 * const is6CharHex = isHexByteString(6);
 *
 * is6CharHex("0a1b2c");      // true
 * is6CharHex("0a1b2z");      // false (invalid 'z')
 * is6CharHex("0a1b");        // false (length mismatch)
 *
 * const isAnyHex = isHexByteString();
 * isAnyHex("abcdef00");      // true
 * ```
 */
export const isHexByteString = (
  expectedLength?: number,
): TTypeGuard<THexByteString> => {
  return (value: unknown): value is THexByteString => {
    // 1. Basic type & non-empty check
    if (!isNonEmptyString(value)) return false;

    const len = value.length;

    // 2. Length parity check (Hex bytes must be pairs)
    if (len % 2 !== 0) return false;

    // 3. Strict length requirement (early exit)
    if (expectedLength !== undefined && len !== expectedLength) return false;

    for (let i = 0; i < len; i++) {
      const code = value.charCodeAt(i);
      if (
        !(code >= 48 && code <= 57) &&
        !(code >= 65 && code <= 70) &&
        !(code >= 97 && code <= 102)
      ) {
        return false;
      }
    }

    return true;
  };
};
