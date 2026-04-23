import type { CSSProperties } from 'react';
import { ObjectUtils } from '@axiom/core';
/**
 * @utilType util
 * @name mergeCssVars
 * @category Processors React
 * @description Safely merges a dictionary of CSS variables into a React CSSProperties object.
 * @link #mergecssvars
 *
 * ## 🎨 mergeCssVars — Dynamic Style Injection
 *
 * Cleanly merges custom CSS variables with standard React style objects.
 * Automatically filters out `undefined` or empty values to keep the DOM clean.
 *
 * @param vars - Object containing CSS variable names (e.g., '--brand-color').
 * @param style - Existing React style object to merge with.
 * @returns A validated CSSProperties object.
 */
export function mergeCssVars<
  T extends Record<string, string | number | undefined>,
>(vars: T, style?: CSSProperties): CSSProperties {
  const filteredVars: Record<string, string> = ObjectUtils.fromEntries(
    ObjectUtils.entries(vars)
      .filter(([_, value]) => value != null && value !== '')
      .map(([key, value]) => [key, value!.toString()]),
  );

  return {
    ...filteredVars,
    ...style,
  };
}
