import type { SyntheticEvent } from "react";
/**
 * @utilType util
 * @name mergeEventHandlerClicks
 * @category Processors React
 * @description Orchestrates user and internal click handlers, allowing user-level preventDefault() to block internal logic.
 * @link #mergeeventhandlerclicks
 *
 * ## 🖱️ mergeEventHandlerClicks — Smart Event Composition
 *
 * Merges a user-provided event handler with an internal component handler.
 * The `internalHandler` will only execute if the `userHandler` does not call
 * `event.preventDefault()`.
 *
 * @template E - The type of the SyntheticEvent (e.g., React.MouseEvent)
 * @param userHandler - The external handler passed via props
 * @param internalHandler - The library logic that should run by default
 * @returns A single function that orchestrates both calls
 */
export function mergeEventHandlerClicks<E extends SyntheticEvent>(
  userHandler?: (event: E) => void,
  internalHandler?: (event: E) => void,
) {
  return (event: E) => {
    userHandler?.(event);

    if (!event.defaultPrevented) {
      internalHandler?.(event);
    }
  };
}