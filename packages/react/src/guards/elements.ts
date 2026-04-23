import type { TTypeGuard } from '../models';
import {
  isNil,
  isPrimitive,
  isArrayOf,
  isObject,
  isKeyInObject,
} from '@axiom/guards';
import { isValidElement, Fragment } from 'react';
import type { ReactElement, ReactNode, ReactPortal } from 'react';
/**
 * @utilType Guard
 * @name isValidReactNode
 * @category Guards React
 * @description Validates if a value is a valid ReactNode (primitives, elements, portals, or arrays of nodes).
 * @link #isvalidreactnode
 */
export const isValidReactNode: TTypeGuard<ReactNode> = (
  value: unknown,
): value is ReactNode =>
  isNil(value) ||
  isPrimitive(value) ||
  isValidElement(value) ||
  isReactPortal(value) ||
  isArrayOf(isValidReactNode, value);

/**
 * @utilType Guard
 * @name isReactElement
 * @category Guards React
 * @description Alias for React's isValidElement to identify valid React elements.
 * @link #isreactelement
 */
export const isReactElement: TTypeGuard<ReactElement> = (
  value: unknown,
): value is ReactElement => isValidElement(value);

/**
 * @utilType Guard
 * @name isFragment
 * @category Guards React
 * @description Checks if a React element is a Fragment (<>...</>).
 * @link #isfragment
 */
export const isFragment: TTypeGuard<ReactElement> = (
  value: unknown,
): value is ReactElement => isValidElement(value) && value.type === Fragment;

/**
 * @utilType Guard
 * @name isReactPortal
 * @category Guards React
 * @description Validates if a value is a ReactPortal created via ReactDOM.createPortal.
 * @link #isreactportal
 */
export const isReactPortal: TTypeGuard<ReactPortal> = (
  value: unknown,
): value is ReactPortal =>
  isObject(value) && isKeyInObject('containerInfo')(value);
