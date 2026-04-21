// import type {
//   TKeyboardConfig,
//   TShortcutDefinition,
//   TKeyboardActionResult,
// } from '../../types';
// import { DEFAULT_KEYBOARD_CONFIG } from '../../constants';
// /**
//  * @utilType util
//  * @name getKeyboardAction
//  * @category Dom Events
//  * @description Interprets a keyboard event and returns semantic information about the user's intent.
//  * @link #getKeyboardAction
//  *
//  *
//  *
//  *
//  * This utility analyzes a `KeyboardEvent` and classifies it into meaningful actions
//  * such as copy, paste, clear, or typing, based on a configurable keyboard policy.
//  *
//  * It is framework-agnostic (works with native DOM or React keyboard events) and
//  * performs **no side effects**. Consumers decide how to respond to the result.
//  *
//  * ### Features
//  * - Detects copy and paste shortcuts across platforms (Mac / Windows).
//  * - Supports configurable allowed keys and clear keys.
//  * - Fully data-driven via `TKeyboardConfig`.
//  * - Pure and easily unit-testable.
//  *
//  * ### Example
//  * ```ts
//  * const action = getKeyboardAction(event, {
//  *   allowedKeys: ['tab', 'enter'],
//  *   clearKeys: ['escape'],
//  * });
//  *
//  * if (action.isPaste) {
//  *   updateWorkflow({ source: 'paste' });
//  * }
//  *
//  * if (action.shouldBlockTyping) {
//  *   event.preventDefault();
//  * }
//  * ```
//  *
//  * ### Default Behavior
//  * When no config is provided, the function uses `DEFAULT_KEYBOARD_CONFIG`,
//  * which includes standard navigation keys, copy/paste shortcuts, and
//  * backspace/delete as clear actions.
//  *
//  * @param event - The keyboard event to interpret (native or React keyboard event).
//  * @param config - Optional configuration to customize allowed keys, shortcuts, and clear behavior.
//  * @returns An object describing the interpreted keyboard action.
//  */
// export function getKeyboardAction(
//   event: KeyboardEvent,
//   config: TKeyboardConfig = {},
// ): TKeyboardActionResult {
//   const matchesShortcut = (
//     event: KeyboardEvent,
//     shortcut: TShortcutDefinition,
//   ): boolean => {
//     if (event.key.toLowerCase() !== shortcut.key) {
//       return false;
//     }

//     return shortcut.modifiers.some((modifier) => {
//       if (modifier === 'ctrl') return event.ctrlKey;
//       if (modifier === 'meta') return event.metaKey;
//       if (modifier === 'alt') return event.altKey;
//       if (modifier === 'shift') return event.shiftKey;
//       return false;
//     });
//   };
//   const mergedConfig = {
//     ...DEFAULT_KEYBOARD_CONFIG,
//     ...config,
//   };

//   const key = event.key.toLowerCase();

//   const isCopy = matchesShortcut(event, mergedConfig.copyShortcut);
//   const isPaste = matchesShortcut(event, mergedConfig.pasteShortcut);
//   const isClear = mergedConfig.clearKeys.includes(key);
//   const isAllowedKey = mergedConfig.allowedKeys.includes(key);

//   return {
//     isPaste,
//     isCopy,
//     isClear,
//     isAllowedKey,
//     shouldBlockTyping: !isAllowedKey && !isCopy && !isPaste,
//   };
// }
