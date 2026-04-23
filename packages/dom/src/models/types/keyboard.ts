/**
 * Represents the state and allowed status of a keyboard interaction.
 * Used to determine how an input component should react to a specific keydown event.
 */
export type TKeyboardActionResult = {
  /** True if the action matches the defined paste shortcut. */
  isPaste: boolean;
  /** True if the action matches the defined copy shortcut. */
  isCopy: boolean;
  /** True if the action matches a key designated to clear the input. */
  isClear: boolean;
  /** True if the key is explicitly allowed in the current configuration. */
  isAllowedKey: boolean;
  /** True if the current event should be prevented from updating the input value. */
  shouldBlockTyping: boolean;
};

/**
 * Standard modifier keys used for building keyboard shortcuts.
 */
export type ModifierKey = 'ctrl' | 'meta' | 'alt' | 'shift';

/**
 * Defines a specific keyboard shortcut by combining a primary key with modifier keys.
 */
export type TShortcutDefinition = {
  /** The primary key value (e.g., 'v', 'c', 'Enter'). */
  key: string;
  /** Array of required modifier keys that must be pressed simultaneously. */
  modifiers: ModifierKey[];
};

/**
 * Configuration object used to define global keyboard rules and shortcuts for a component.
 */
export type TKeyboardConfig = {
  /** List of key values that are explicitly permitted for entry. */
  allowedKeys?: string[];
  /** List of key values that should trigger a "clear" or "reset" action. */
  clearKeys?: string[];
  /** Shortcut definition for triggering a copy action. */
  copyShortcut?: TShortcutDefinition;
  /** Shortcut definition for triggering a paste action. */
  pasteShortcut?: TShortcutDefinition;
};
