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
// export function filterChildrenByDisplayName<T extends ReactNode>(
//   children: T,
//   displayName: string,
// ): ReactElement[] {
//   return Children.toArray(children).filter((child): child is ReactElement => {
//     // 1. Must be a valid React element
//     if (!isValidElement(child)) return false;

//     // 2. Use your new 'hasNameMetadata' guard to check safely
//     const type = child.type;

//     // Check standard components or ForwardRefs
//     return (
//       (typeof type === 'function' && type.displayName === displayName) ||
//       (typeof type === 'object' && type !== null && (type as any).displayName === displayName)
//     );
//   });
// }
