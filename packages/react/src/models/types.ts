import { VALID_PROP_PREFIXES, VALID_DOM_PROPS } from './constants';
import type { TPrettify, TPrefixUnion } from '@axiom/utility-types';
import type {
  ComponentType,
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementType,
} from 'react';
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
 * Base dictionary keys for standard React/DOM attributes.
 */
export type TValidDOMProp = keyof typeof VALID_DOM_PROPS;

/**
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
/**
 * @utilType type
 * @name TPropType
 * @category React Utilities
 * @description Extracts the type of a specific prop from a React component.
 *
 * Extracts the type of a specific prop `K` from a React component `T`.
 *
 * This is a utility type for working with component props in a fully type-safe way.
 * It allows you to refer to a single prop’s type without manually extracting it
 * from the component's props interface.
 *
 * @template T - The React component type (must extend `ComponentType<object>`).
 * @template K - The key of the prop to extract (must be a valid key of `ComponentProps<T>`).
 *
 * @example
 * ```ts
 * import StatusIndicator from './StatusIndicator';
 *
 * type IndicatorType = TPropType<typeof StatusIndicator, 'indicator'>;
 * // IndicatorType is now the type of StatusIndicator's 'indicator' prop
 *
 * const value: IndicatorType = 'positive'; // TypeScript knows this is valid
 * ```
 *
 * @remarks
 * - Works for functional components, class components, and forwardRef components.
 * - Provides full type safety for prop extraction.
 */

export type TPropType<
  T extends ComponentType<object>,
  K extends keyof ComponentProps<T>,
> = ComponentProps<T>[K];

/**
 * @utilType type
 * @name TElementProp
 * @category React Utilities
 * @description Extracts the type of a specific prop from a React component.
 * Extracts the type of a specific prop `K` from a native HTML element or
 * React component `T`, explicitly excluding the `ref` to ensure
 * compatibility with standard prop-passing patterns.
 *
 * ---
 *
 * ### Why use this:
 * While `TPropType` is designed for complex components, `TElementProp`
 * is optimized for native elements (button, input, div). It uses
 * `ComponentPropsWithoutRef` to prevent "Ref-leakage" errors when
 * you are typing a value that will be passed as a prop but not used as a ref.
 *
 * ---
 *
 * @example
 * ```ts
 * // 1. Extract from a native element
 * type ButtonType = TElementProp<'button', 'type'>;
 * // Result: "button" | "submit" | "reset"
 *
 * // 2. Extract from an input event handler
 * type OnChange = TElementProp<'input', 'onChange'>;
 * ```
 */
export type TElementProp<
  T extends ElementType,
  K extends keyof ComponentPropsWithoutRef<T>,
> = ComponentPropsWithoutRef<T>[K];
