/**
 * @internal
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
// /**
//  * @internal
//  * Yields the foundational prefixes for the Axiom engine.
//  */
// function* yieldFoundationalPrefixes(): Generator<string> {
//   yield 'data-'; // HTML5
//   yield 'aria-'; // A11y
//   yield 'x-';    // Custom logic
//   yield '--';   // CSS Variables
//   yield 'on';   // React 19 / Native Events
// }

// // 🚀 Module load: Create the static lookup array once
// export const VALID_PROP_PREFIXES = Array.from(yieldFoundationalPrefixes());
