import type { TTypeGuard } from '@axiom/utility-types';
import { isString, isArrayOf, isArray, isNumber } from '@axiom/guards';
import type { TRGB, THex, TRGBTuple } from '../models';

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
  if (!isString(value)) return false;

  // Updated regex: 'a' is optional, and the 4th alpha value is optional
  const rgbRegex =
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+)?\s*\)$/i;

  const match = value.match(rgbRegex);
  if (!match) return false;

  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);

  return [r, g, b].every((v) => v >= 0 && v <= 255);
};

// /**
//  * @utilType Guard
//  * @name isHexColor
//  * @category Guards Core
//  * @description Validates if a string is a valid 3 or 6-digit HEX color code.
//  * @link #ishexcolor
//  */
export const isHexColor: TTypeGuard<THex> = (value: unknown): value is THex => {
  return isString(value) && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
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
// export const isRGBTuple: TTypeGuard<TRGB> = (input: unknown): input is TRGB => {
//   return (
//     isArray(input) &&
//     input.length === 3 &&
//     input.every((n) => isNumber(n) && n >= 0 && n <= 255)
//   );
// };
// NEW
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
