import { VALID_PROP_PREFIXES, VALID_DOM_PROPS } from './constants';
import type { TPrettify, TPrefixUnion } from '@axiom/utility-types';
/**
 * TNamedComponent
 *
 * A structural contract for React components that carry identification metadata.
 *
 * ---
 *
 * ### Why this exists:
 * React components don't always store their names in the same place.
 * - **Standard Components**: Use `displayName` or `name` on the root.
 * - **ForwardRef**: Metadata is often tucked inside the `render` function.
 * - **Memo/Lazy**: The identity is nested inside a `type` property.
 *
 * This type allows our guards to recursively "drill down" through these
 * wrappers to find the true identity of a component, which is essential for
 * selective child parsing (e.g., `filterChildrenByDisplayName`).
 *
 * ---
 *
 * @example
 * ```ts
 * const MyComponent = memo(forwardRef(...));
 * // TNamedComponent allows us to find 'MyComponent' even 2 layers deep.
 * ```
 */
export type TNamedComponent = {
  displayName?: string;
  name?: string;
  render?: { displayName?: string; name?: string };
  type?: TNamedComponent;
};

export type TValidPrefix = (typeof VALID_PROP_PREFIXES)[number];
/**
 * @internal
 * Base dictionary keys for standard React/DOM attributes.
 */
export type TValidDOMProp = keyof typeof VALID_DOM_PROPS;

/**
 * @internal
 * The "Master Union" that powers your prop extraction.
 * Includes explicit keys + flexible patterns.
 */
export type TAllValidDOMProps =
  | TValidDOMProp
  | TPrefixUnion<typeof VALID_PROP_PREFIXES>;

/**
 * TDOMProps
 * Narrows the keys of T to only those that are valid for the DOM.
 */
export type TDOMProps<T> = TPrettify<{
  [K in keyof T as K extends TAllValidDOMProps ? K : never]: T[K];
}>;
