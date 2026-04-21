import type { TTypeGuard } from '@axiom/utility-types';
import {
  isKeyOfObject,
  isFunction,
  isObject,
  isKeyInObject,
} from '@axiom/guards';
import type { ComponentType, ForwardRefExoticComponent } from 'react';
import type { TNamedComponent } from '../models';
/**
 * @utilType Guard
 * @name hasReactSymbol
 * @category Guards Reactt
 * @description Safe check for internal React symbols ($$typeof).
 * @link #hasreactsymbol
 */
export const hasReactSymbol = (value: unknown, symbol: symbol): boolean =>
  isKeyInObject('$$typeof')(value) && value.$$typeof === symbol;

/**
 * @utilType Guard
 * @name isComponentType
 * @category Guards React
 * @description Determines if a value is a valid React Component (Function or Class Component).
 * @link #iscomponenttype
 */
export const isComponentType: TTypeGuard<ComponentType<unknown>> = (
  value: unknown,
): value is ComponentType<unknown> =>
  isFunction(value) ||
  (isKeyInObject('prototype')(value) &&
    isObject(value.prototype) &&
    isKeyInObject('render')(value.prototype) &&
    isFunction(value.prototype.render));

/**
 * @utilType Guard
 * @name isForwardRef
 * @category Guards React
 * @description Validates if a component is wrapped in React.forwardRef.
 * @link #isforwardref
 */
export const isForwardRef: TTypeGuard<ForwardRefExoticComponent<object>> = (
  value: unknown,
): value is ForwardRefExoticComponent<object> =>
  hasReactSymbol(value, Symbol.for('react.forward_ref'));

/**
 * @utilType Guard
 * @name hasNameMetadata
 * @category Guards React
 * @description Checks if a component type has identifiable metadata (displayName, name, or type).
 * @link #hasnamemetadata
 */
export const hasNameMetadata = (type: unknown): type is TNamedComponent =>
  isFunction(type) &&
  // We check properties directly on the function/class object
  ((isKeyOfObject(type) &&
    (isKeyInObject('displayName')(type) ||
      isKeyInObject('name')(type) ||
      isKeyInObject('type')(type))) ||
    // Fallback for environments where isKeyInObject might strictly exclude functions
    'displayName' in type ||
    'name' in type ||
    'type' in type);
