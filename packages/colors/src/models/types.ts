/**
 * @utilType type
 * @name TColorDefinitions
 * @category Color Utilities
 * @description A collection of branded and template-literal types for representing colors in RGB, RGBA, HSL, and Hex formats.
 *
 * @example
 * ```ts
 * const primary: THex = '#ff0000';
 * const background: TCssRGB = 'rgb(255, 255, 255)';
 * const overlay: TRGBA = [0, 0, 0, 0.5];
 * ```
 */

export type TRGB = readonly [r: number, g: number, b: number];

export type TRGBTuple = [number, number, number];

export type TCssRGB = `rgb(${number}, ${number}, ${number})`;

export type TRGBA = readonly [r: number, g: number, b: number, a: number];

export type TCssRGBA = `rgba(${number}, ${number}, ${number}, ${number})`;

export type THSL = { h: number; s: number; l: number };

export type TCssHSL = `hsl(${number}, ${number}%, ${number}%)`;

export type THex = `#${string}`;

export type TColorInput = THex | TRGB | TRGBA | TCssRGB | TCssRGBA;
