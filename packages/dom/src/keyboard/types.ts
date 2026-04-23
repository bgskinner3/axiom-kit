export type TKeyboardActionResult = {
  isPaste: boolean;
  isCopy: boolean;
  isClear: boolean;
  isAllowedKey: boolean;
  shouldBlockTyping: boolean;
};
export type ModifierKey = 'ctrl' | 'meta' | 'alt' | 'shift';

export type TShortcutDefinition = {
  key: string;
  modifiers: ModifierKey[];
};

export type TKeyboardConfig = {
  allowedKeys?: string[];
  clearKeys?: string[];
  copyShortcut?: TShortcutDefinition;
  pasteShortcut?: TShortcutDefinition;
};
