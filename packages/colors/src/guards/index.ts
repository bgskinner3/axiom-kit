import {
  isString,
  isArrayOf,
  isArray,
  isNumber,
  makeAssert,
} from '@bgskinner2/axiom-kit-guards';
import type { TRGB, THex, TRGBTuple, TTypeGuard, TAssert } from '../types';

/**
 * @utilType Guard
 * @name isRGBString
 * @category Guards Core
 * @description Validates if a string is a valid CSS rgb() or rgba() string.
 * @link #isrgbstring
 */
export const isRGBString: TTypeGuard<TRGB> = (
  value: unknown,
): value is TRGB => {
  if (typeof value !== 'string') return false;

  const str = value.trim().toLowerCase();

  // 1. Strict prefix/suffix check
  if (!str.startsWith('rgb(') || !str.endsWith(')')) return false;

  // 2. Extract content and split STRICTLY by commas
  const content = str.slice(4, -1);
  const parts = content.split(',');

  // Must have exactly 3 parts (r, g, b)
  if (parts.length !== 3) return false;

  // 3. Validate parts
  for (let i = 0; i < 3; i++) {
    const part = parts[i].trim();
    // Fail on empty parts or non-numeric strings
    if (part === '' || isNaN(Number(part))) return false;

    const n = Number(part);

    // Standard RGB range 0-255
    if (n < 0 || n > 255 || !Number.isInteger(n)) return false;
  }

  return true;
};

/**
 * @utilType Guard
 * @name isHexColor
 * @category Guards Core
 * @description Validates if a string is a valid 3 or 6-digit HEX color code.
 * @link #ishexcolor
 */
export const isHexColor: TTypeGuard<THex> = (value: unknown): value is THex => {
  return (
    isString(value) &&
    /^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(value)
  );
};

/**
 * @utilType Guard
 * @name isTuple3
 * @category Guards Core
 * @description Validates if a value is an array of exactly three non-NaN numbers.
 * @link #istuple3
 */
export const isTuple3: TTypeGuard<TRGBTuple> = (
  value: unknown,
): value is TRGBTuple =>
  isArrayOf((v): v is number => isNumber(v) && !Number.isNaN(v), value) &&
  value.length === 3;
/**
 * @utilType Guard
 * @name isRGBTuple
 * @category Guards Core
 * @description Checks if a value is a valid RGB tuple: an array of exactly three numbers between 0 and 255.
 * @link #isrgbtuple
 *
 * ### 📘 Example Usage
 * ```ts
 * isRGBTuple([255, 0, 0]);     // true (Red)
 * isRGBTuple([0, 256, 0]);     // false (Out of range)
 * isRGBTuple([128, 128]);      // false (Wrong length)
 * ```
 */
export const isRGBTuple: TTypeGuard<TRGB> = (input: unknown): input is TRGB =>
  isArray(input) &&
  input.length === 3 &&
  isNumber(input[0]) &&
  input[0] >= 0 &&
  input[0] <= 255 &&
  isNumber(input[1]) &&
  input[1] >= 0 &&
  input[1] <= 255 &&
  isNumber(input[2]) &&
  input[2] >= 0 &&
  input[2] <= 255;

/**
 *
 */
export const assertIsRGBTuple: TAssert<TRGB> = makeAssert(
  isRGBTuple,
  'isRGBTuple',
);
