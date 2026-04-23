import type { TKeyboardConfig } from '../types';

export const DEFAULT_KEYBOARD_CONFIG: Required<TKeyboardConfig> = {
  allowedKeys: [
    'arrowleft',
    'arrowright',
    'arrowup',
    'arrowdown',
    'backspace',
    'delete',
    'tab',
  ],
  clearKeys: ['backspace', 'delete'],
  copyShortcut: {
    key: 'c',
    modifiers: ['ctrl', 'meta'],
  },
  pasteShortcut: {
    key: 'v',
    modifiers: ['ctrl', 'meta'],
  },
} satisfies Required<TKeyboardConfig>;
