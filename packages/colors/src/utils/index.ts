import type { TRGB, TCssRGB } from '../types';
import { assertIsRGBTuple } from '../guards';
/**
 * @utilType util
 * @name hexToRGB
 * @category Color
 * @description Converts a hex color string to an RGB tuple [r, g, b].
 * @link #hexToRGB
 *
 */
export const hexToRGB = (hex: string): TRGB => {
  const raw = hex.startsWith('#') ? hex.slice(1) : hex;
  const len = raw.length;

  // 1. Length check
  if (len !== 3 && len !== 6) {
    throw new Error(`Invalid hex length: "${hex}"`);
  }

  // 2. Character validation check
  // Since this is a utility, a quick regex test here is the most reliable way
  // to ensure parseInt doesn't return garbage or NaN.
  if (!/^[0-9a-fA-F]+$/.test(raw)) {
    throw new Error(`Invalid hex characters: "${hex}"`);
  }

  const num = parseInt(raw, 16);

  if (len === 3) {
    return [
      (num >> 8) * 17, // R
      ((num >> 4) & 0x0f) * 17, // G
      (num & 0x0f) * 17, // B
    ];
  }

  return [
    (num >> 16) & 0xff, // R
    (num >> 8) & 0xff, // G
    num & 0xff, // B
  ];
};

/**
 * @utilType util
 * @name validateRGB
 * @category Color
 * @description
 * @link #validateRGB
 *
 */
export const validateRGB = (input: TRGB | string): TRGB => {
  if (typeof input === 'string') return hexToRGB(input);
  assertIsRGBTuple(input);
  return input satisfies TRGB;
};
/**
 * @utilType util
 * @name getLuminance
 * @category Color
 * @description
 * @link #getLuminance
 *
 */
export const getLuminance = (rgb: TRGB | string): number => {
  const [r, g, b] = validateRGB(rgb);

  const transform = (channel: number) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b);
};

/**
 * ## 🎨 hexToRGBShorthand — Convert Hex Color to RGB Array
 *
 * Converts a **hex color string** into an RGB array `[r, g, b]`.
 * Supports both **3-character shorthand** (e.g., `#abc`) and **6-character hex** (e.g., `#aabbcc`).
 *
 * ---
 *
 * ### ⚙️ Core Purpose
 * - Convert a user-friendly or CSS hex color into a numeric RGB array.
 * - Handles shorthand hex and expands it automatically.
 * - Returns `null` for invalid hex strings.
 *
 * ---
 *
 * ### 📘 Example Usage
 * ```ts
 * hexToRGBShorthand('#abc');     // [170, 187, 204]
 * hexToRGBShorthand('#aabbcc');  // [170, 187, 204]
 * hexToRGBShorthand('invalid');  // null
 * ```
 *
 * ---
 *
 * ### 📌 Notes
 * - Input must be a valid 3- or 6-character hex string (case-insensitive).
 * - Output is always a `[number, number, number]` array if valid.
 */
export const hexToRGBShorthand = (
  hex: string,
): [number, number, number] | null => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(
    shorthandRegex,
    (_m, r, g, b) => r + r + g + g + b + b,
  );

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  if (!result) return null;

  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
};

/**
 * @utilType util
 * @name interpolateColor
 * @category Color
 * @description Linearly interpolates between two RGB colors based on a factor (0-1) and returns a CSS rgb() string.
 * @link #interpolatecolor
 *
 * ## 🎨 interpolateColor — Linear Interpolation Between Two RGB Colors
 * ...
 */
export const interpolateColor = (
  start: { r: number; g: number; b: number },
  end: { r: number; g: number; b: number },
  factor: number,
): TCssRGB => {
  const result = {
    r: Math.round(start.r + (end.r - start.r) * factor),
    g: Math.round(start.g + (end.g - start.g) * factor),
    b: Math.round(start.b + (end.b - start.b) * factor),
  };

  return `rgb(${result.r}, ${result.g}, ${result.b})`;
};
/**
 * @utilType util
 * @name hexToHSL
 * @category Color
 * @description Converts a hex color string to an HSL (Hue, Saturation, Lightness) object.
 * @link #hextohsl
 *
 * @param hex - A hexadecimal color string (e.g., "#ff0000" or "ff0000")
 * @returns An object with h [0,360), s [0,1], and l [0,1].
 */
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const [r, g, b] = hexToRGB(hex).map((v) => v / 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0,
    s = 0;
  const d = max - min;

  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else if (max === b) h = ((r - g) / d + 4) * 60;
  }
  return { h, s, l };
}
/**
 * @utilType util
 * @name hexToNormalizedRGB
 * @category Color
 * @description Converts a hexadecimal color string to an RGB tuple normalized between 0 and 1.
 * @link #hextonormalizedrgb
 *
 * @param hex - A hex color string (3 or 6 digits).
 * @returns A tuple [r, g, b] where each component is 0–1.
 */
export const hexToNormalizedRGB = (hex: string): [number, number, number] => {
  const [r, g, b] = hexToRGB(hex);
  return [r / 255, g / 255, b / 255];
};

/**
 * @utilType util
 * @name isLumLessThan
 * @category Color
 * @description Determines whether the luminance of a color (in RGB array or HEX format) is less than the specified threshold. Uses `getLuminance()` internally.
 * @link #isLumLessThan
 *
 *
 * @example
 * ```ts
 * isLumLessThan('#000000', 0.2); // true
 * isLumLessThan([255,255,255], 0.2); // false
 * ```
 */
export const isLumLessThan = (
  color: TRGB | string,
  threshold: number,
): boolean => getLuminance(validateRGB(color)) < threshold;

/**
 * @utilType util
 * @name isLumGreaterThan
 * @category Color
 * @description Determines whether the luminance of a color is above the given threshold.
 * @link #isLumGreaterThan
 *
 *
 * @example
 * ```ts
 * isLumLessThan('#000000', 0.2); // true
 * isLumLessThan([255,255,255], 0.2); // false
 * ```
 */
export const isLumGreaterThan = (
  color: TRGB | string,
  threshold: number,
): boolean => getLuminance(validateRGB(color)) > threshold;

/**
 * @utilType util
 * @name contrastTextColor
 * @category Color
 * @description Returns an Accessible Text Color Based on Background
 * @link #contrastTextColor
 *
 *
 * ## 🎨 contrastTextColor — Returns an Accessible Text Color Based on Background
 *
 * Dynamically selects a readable text color (`black` or `white`) depending on
 * the background color’s luminance.
 *
 * The function can return:
 * - **Tailwind classes** (e.g. `'text-black'` / `'text-white'`)
 * - **CSS color values** (e.g. `'#000000'` / `'#ffffff'`)
 *
 * ---
 *
 * @param color - RGB tuple or HEX color string.
 * @param options - Optional configuration for return format and threshold.
 * @returns A string representing the contrasting text color (Tailwind or CSS).
 *
 * ---
 *
 * @example
 * ```ts
 * // Tailwind mode (default)
 * contrastTextColor('#000000');
 * // → 'text-white'
 *
 * // CSS mode
 * contrastTextColor('#ffffff', { mode: 'css' });
 * // → '#000000'
 *
 * // Custom threshold
 * contrastTextColor([120,120,120], { threshold: 0.2 });
 * // → 'text-white'
 * ```
 */
export const contrastTextColor = (
  color: TRGB | string,
  options: {
    light?: string; // Value to return if background is dark (needs light text)
    dark?: string; // Value to return if background is light (needs dark text)
    threshold?: number;
  } = {},
): string => {
  const { light = '#ffffff', dark = '#000000', threshold = 0.179 } = options;

  // Single calculation pass
  const isLight = getLuminance(validateRGB(color)) > threshold;

  // If the background is light, return dark text. Otherwise, return light text.
  return isLight ? dark : light;
};
