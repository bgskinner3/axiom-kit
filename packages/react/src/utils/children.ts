import type { ReactNode, ReactElement } from 'react';
import { isReactElement } from '../guards';
import { Children } from 'react';
/**
 * @utilType util
 * @name filterChildrenByDisplayName
 * @category Processors React
 * @description Filters a React children tree to find components matching a specific displayName.
 * @link #filterchildrenbydisplayname
 *
 * ## 🔍 filterChildrenByDisplayName — Selective Child Parsing
 *
 * Iterates over a ReactNode tree and returns only the children
 * matching the provided string. Ideal for composite components like Tabs or Steppers.
 */
export function filterChildrenByDisplayName<T extends ReactNode>(
  children: T,
  displayName: string,
): ReactElement[] {
  return Children.toArray(children).filter((child): child is ReactElement => {
    if (!isReactElement(child)) return false;
    // @ts-expect-error - displayName may exist on type
    return child.type?.displayName === displayName;
  });
}