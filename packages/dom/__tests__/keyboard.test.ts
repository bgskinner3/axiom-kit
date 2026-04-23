import { getKeyboardAction } from '../src';

describe('getKeyboardAction', () => {
  // Helper to create mock events quickly
  const createMockEvent = (
    key: string,
    modifiers: Partial<KeyboardEvent> = {},
  ) => ({ key, ...modifiers }) as KeyboardEvent;

  describe('Semantic Shortcuts (Copy/Paste)', () => {
    it('identifies a copy action (Ctrl+C or Cmd+C)', () => {
      const macEvent = createMockEvent('c', { metaKey: true });
      const winEvent = createMockEvent('C', { ctrlKey: true }); // Test case insensitivity

      expect(getKeyboardAction(macEvent).isCopy).toBe(true);
      expect(getKeyboardAction(winEvent).isCopy).toBe(true);
    });

    it('identifies a paste action', () => {
      const event = createMockEvent('v', { ctrlKey: true });
      const action = getKeyboardAction(event);

      expect(action.isPaste).toBe(true);
      expect(action.shouldBlockTyping).toBe(false);
    });

    it('returns false for shortcuts if modifiers are missing', () => {
      const event = createMockEvent('c', { ctrlKey: false, metaKey: false });
      expect(getKeyboardAction(event).isCopy).toBe(false);
    });
  });

  describe('Navigation & Allowed Keys', () => {
    it('identifies allowed keys like Arrows and Tab', () => {
      expect(getKeyboardAction(createMockEvent('ArrowLeft')).isAllowedKey).toBe(
        true,
      );
      expect(getKeyboardAction(createMockEvent('Tab')).isAllowedKey).toBe(true);
    });

    it('identifies clear keys like Backspace or Delete', () => {
      const action = getKeyboardAction(createMockEvent('Backspace'));
      expect(action.isClear).toBe(true);
      expect(action.isAllowedKey).toBe(true);
    });
  });

  describe('Typing Prevention (shouldBlockTyping)', () => {
    it('returns true for random character keys not in whitelist', () => {
      const event = createMockEvent('p'); // 'p' is not in default allowedKeys
      expect(getKeyboardAction(event).shouldBlockTyping).toBe(true);
    });

    it('returns false for allowed characters even without modifiers', () => {
      // Assuming 'backspace' is in DEFAULT_KEYBOARD_CONFIG.allowedKeys
      const event = createMockEvent('Backspace');
      expect(getKeyboardAction(event).shouldBlockTyping).toBe(false);
    });
  });

  describe('Custom Configuration', () => {
    it('respects custom whitelists provided in config', () => {
      const config = { allowedKeys: ['p'] };
      const event = createMockEvent('p');

      const action = getKeyboardAction(event, config);
      expect(action.isAllowedKey).toBe(true);
      expect(action.shouldBlockTyping).toBe(false);
    });
  });
});
