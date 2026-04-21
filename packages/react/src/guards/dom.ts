import { VALID_DOM_PROPS, VALID_PROP_PREFIXES } from '../internal';
import type {
  TValidPrefix,
  TAllValidDOMProps,
  TValidDOMProp,
} from '../internal';
import { memoize, ObjectUtils } from '@axiom/core';
import type { TTypeGuard } from '@axiom/utility-types';
import { isString, isInSet } from '@axiom/guards';
const PROP_SET = new Set<TValidDOMProp>(ObjectUtils.keys(VALID_DOM_PROPS));

/**
 * @utilType util
 * @name isDynamicProp
 * @category Guards React
 * @description
 * @link #isDynamicProp
 */
export const isDynamicProp: TTypeGuard<TValidPrefix> = (
  prop: unknown,
): prop is TValidPrefix => {
  if (!isString(prop)) return false;

  const first = prop.charCodeAt(0);

  // Manually checking the codes is faster than Set.has for < 10 items
  // d (100), a (97), x (120), - (45), o (111)
  if (
    first !== 100 &&
    first !== 97 &&
    first !== 120 &&
    first !== 45 &&
    first !== 111
  ) {
    return false;
  }

  return VALID_PROP_PREFIXES.some((p) => prop.startsWith(p));
};
/**
 * @utilType util
 * @name isPropValid
 * @category Guards React
 * @description Memoized validator that checks if a string is a standard DOM attribute, SVG attribute, or React event handler.
 * @link #ispropvalid
 */
export const isPropValid = memoize(
  (prop: unknown): prop is TAllValidDOMProps => {
    if (!isString(prop) || !isInSet<TValidDOMProp>(PROP_SET)(prop))
      return false;

    if (PROP_SET.has(prop)) return true;

    // 2. Event Handlers (onXxx) - Your charCode optimization is excellent
    if (
      prop.length > 2 &&
      prop.charCodeAt(0) === 111 && // o
      prop.charCodeAt(1) === 110 && // n
      prop.charCodeAt(2) < 91 // A-Z
    )
      return true;

    // 3. Dynamic attributes
    return isDynamicProp(prop);
  },
);
/**
 * @utilType Guard
 * @name isDOMPropKey
 * @category Guards React
 * @description Type guard to verify if an unknown value is a string that represents a valid DOM property.
 * @link #isdompropkey

 */
export const isDOMPropKey: TTypeGuard<TValidDOMProp> = (
  value: unknown,
): value is TValidDOMProp => isString(value) && isPropValid(value);

// /**
//  * @utilType Guard
//  * @name isDOMEntry
//  * @category Guards React
//  * @description Validates if a key-value pair entry represents a valid DOM property for a specific HTML element type.
//  * @link #isdomentry
//  */
// // export const isDOMEntry: TTypeGuard<[TValidDOMProp, unknown]> = (
// //   entry
// // ): entry is [TValidDOMProp, unknown] =>
// //  isArray(entry) && isString(entry[0]) && isPropValid(entry[0]);

// export const isDOMEntry = <
//   TElement extends ElementType,
//   TProps extends ComponentPropsWithoutRef<TElement>,
// >(
//   entry: [PropertyKey, unknown],
// ): entry is Extract<
//   TEntries<TProps>,
//   [
//     Extract<keyof ComponentPropsWithoutRef<TElement>, string>,
//     TProps[keyof TProps],
//   ]
// > => isString(entry[0]) && isPropValid(entry[0]);

