import type {
  TKeyboardConfig,
  TShortcutDefinition,
  TKeyboardActionResult,
} from './types';
import { DEFAULT_KEYBOARD_CONFIG } from './constants';
/**
 * @utilType util
 * @name getKeyboardAction
 * @category Dom Events
 * @description Interprets a keyboard event and returns semantic information about the user's intent.
 * @link #getKeyboardAction
 *
 *
 *
 *
 * This utility analyzes a `KeyboardEvent` and classifies it into meaningful actions
 * such as copy, paste, clear, or typing, based on a configurable keyboard policy.
 *
 * It is framework-agnostic (works with native DOM or React keyboard events) and
 * performs **no side effects**. Consumers decide how to respond to the result.
 *
 * ### Features
 * - Detects copy and paste shortcuts across platforms (Mac / Windows).
 * - Supports configurable allowed keys and clear keys.
 * - Fully data-driven via `TKeyboardConfig`.
 * - Pure and easily unit-testable.
 *
 * ### Example
 * ```ts
 * const action = getKeyboardAction(event, {
 *   allowedKeys: ['tab', 'enter'],
 *   clearKeys: ['escape'],
 * });
 *
 * if (action.isPaste) {
 *   updateWorkflow({ source: 'paste' });
 * }
 *
 * if (action.shouldBlockTyping) {
 *   event.preventDefault();
 * }
 * ```
 *
 * ### Default Behavior
 * When no config is provided, the function uses `DEFAULT_KEYBOARD_CONFIG`,
 * which includes standard navigation keys, copy/paste shortcuts, and
 * backspace/delete as clear actions.
 *
 * @param event - The keyboard event to interpret (native or React keyboard event).
 * @param config - Optional configuration to customize allowed keys, shortcuts, and clear behavior.
 * @returns An object describing the interpreted keyboard action.
 */
export function getKeyboardAction(
  event: KeyboardEvent,
  config: TKeyboardConfig = {},
): TKeyboardActionResult {
  const allowed = new Set(
    config.allowedKeys ?? DEFAULT_KEYBOARD_CONFIG.allowedKeys,
  );
  const clear = new Set(config.clearKeys ?? DEFAULT_KEYBOARD_CONFIG.clearKeys);

  const key = event.key.toLowerCase();

  const matches = (shortcut: TShortcutDefinition): boolean => {
    if (key !== shortcut.key) return false;
    return shortcut.modifiers.some((m) => {
      if (m === 'ctrl') return event.ctrlKey;
      if (m === 'meta') return event.metaKey;
      if (m === 'shift') return event.shiftKey;
      if (m === 'alt') return event.altKey;
      return false;
    });
  };

  const isCopy = matches(
    config.copyShortcut ?? DEFAULT_KEYBOARD_CONFIG.copyShortcut,
  );
  const isPaste = matches(
    config.pasteShortcut ?? DEFAULT_KEYBOARD_CONFIG.pasteShortcut,
  );
  const isClear = clear.has(key);
  const isAllowedKey = allowed.has(key);

  return {
    isPaste,
    isCopy,
    isClear,
    isAllowedKey,
    shouldBlockTyping: !isAllowedKey && !isCopy && !isPaste,
  };
}
