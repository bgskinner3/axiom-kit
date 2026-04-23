/**
 * Prefixes that are always considered valid for DOM elements.
 * Moving these to a constant allows for easier framework updates.
 */
export const VALID_PROP_PREFIXES = [
  'data-', // Standard HTML5
  'aria-', // Accessibility
  'x-', // Custom / Alpine
  '--', // CSS Variables
  'on', // React 19 / Native Events
] as const;
