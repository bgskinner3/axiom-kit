import type { TTypeGuard } from '@axiom/utility-types';
import {
  isDefined,
  isFunction,
  isNil,
  isPrimitive,
  isObject,
  isKeyInObject,
} from '@axiom/guards';
import { isReactElement } from './elements';
import type { TPropType } from '../models';
import type {
  ComponentType,
  ReactNode,
  ReactElement,
  MouseEvent,
  ComponentProps,
} from 'react';
/**
 * @utilType Guard
 * @name hasChildren
 * @category Guards React
 * @description Validates if a props object contains a defined children property.
 * @link #haschildren
 */
export const hasChildren = (value: unknown): value is { children: ReactNode } =>
  isObject(value) &&
  isKeyInObject('children')(value) &&
  isDefined(value.children);

/**
 * @utilType Guard
 * @name hasOnClick
 * @category Guards React
 * @description Validates if a React element has a valid onClick function in its props.
 * @link #hasonclick
 * ---
 * ### 📘 Example Usage
 * ```ts
 * if (hasOnClick(child)) {
 *   return React.cloneElement(child, {
 *     onClick: (e) => { console.log('Clicked!'); child.props.onClick(e); }
 *   });
 * }
 * ```
 */
export const hasOnClick: TTypeGuard<
  ReactElement<{ onClick?: (e: MouseEvent<HTMLElement>) => void }>
> = (
  value: unknown,
): value is ReactElement<{
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}> => {
  return (
    isReactElement(value) &&
    !isNil(value.props) &&
    isKeyInObject('onClick')(value.props) &&
    isFunction(value.props.onClick)
  );
};

/**
 * @utilType Guard
 * @name createPropGuard
 * @category Guards React
 * @description Factory that creates a type guard for specific component props.
 * @link #createpropguard
 * @example
 * ```ts
 * import StatusIndicator from './StatusIndicator';
 *
 * // Create a type guard for the "indicator" prop
 * const isIndicator = createPropGuard<typeof StatusIndicator, 'indicator'>();
 *
 * const rawValue: string = "positive";
 *
 * if (isIndicator(rawValue)) {
 *   // TS now treats rawValue as StatusIndicatorProps['indicator']
 *   return <StatusIndicator indicator={rawValue} />;
 * }
 * ```
 *
 */
export function createPropGuard<
  T extends ComponentType<object>,
  K extends keyof ComponentProps<T>,
>(): TTypeGuard<TPropType<T, K>> {
  return (value: unknown): value is TPropType<T, K> => {
    // Check the value directly, not its type string
    return isPrimitive(value);
  };
}
