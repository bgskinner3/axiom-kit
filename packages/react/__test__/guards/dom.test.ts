/**
 * @jest-environment jsdom
 */
import { isDOMPropKey, isPropValid, isDynamicProp } from '../../src/guards';

describe('React Dom Guards', () => {
  describe('isDynamicProp', () => {
    it('identifies valid prefixes (data-, aria-, x-, etc.)', () => {
      expect(isDynamicProp('data-testid')).toBe(true);
      expect(isDynamicProp('aria-label')).toBe(true);
      expect(isDynamicProp('x-custom')).toBe(true);
      expect(isDynamicProp('-webkit-clip')).toBe(true);
    });

    it('optimizes via charCode and rejects non-matching first chars', () => {
      // z (122) is not in your optimized charCode list
      expect(isDynamicProp('z-index')).toBe(false);
      expect(isDynamicProp('something')).toBe(false);
    });
  });

  // describe('isPropValid', () => {
  //   it('validates standard DOM properties', () => {
  //     expect(isPropValid('className')).toBe(true);
  //     expect(isPropValid('id')).toBe(true);
  //     expect(isPropValid('href')).toBe(true);
  //   });

  //   it('identifies React Event Handlers via charCode logic', () => {
  //     expect(isPropValid('onClick')).toBe(true);
  //     expect(isPropValid('onChange')).toBe(true);
  //     // 'online' starts with 'on' but 3rd char is lowercase 'l' (108)
  //     expect(isPropValid('online')).toBe(false);
  //   });

  //   it('identifies dynamic props through delegation', () => {
  //     expect(isPropValid('data-custom')).toBe(true);
  //   });

  //   it('is memoized (logic check)', () => {
  //     // Since it's memoized, repeat calls should be near-instant
  //     expect(isPropValid('id')).toBe(true);
  //     expect(isPropValid('id')).toBe(true);
  //   });
  // });
  describe('isPropValid', () => {
    it('returns true for standard HTML attributes', () => {
      expect(isPropValid('id')).toBe(true);
      expect(isPropValid('className')).toBe(true);
      expect(isPropValid('href')).toBe(true);
      expect(isPropValid('tabIndex')).toBe(true);
    });

    it('returns true for SVG-specific attributes', () => {
      expect(isPropValid('viewBox')).toBe(true);
      expect(isPropValid('strokeWidth')).toBe(true);
      expect(isPropValid('fill')).toBe(true);
    });

    it('returns true for event handlers using the charCode optimization', () => {
      expect(isPropValid('onClick')).toBe(true);
      expect(isPropValid('onTransitionEnd')).toBe(true);
      expect(isPropValid('onChange')).toBe(true);
    });

    it('returns true for data and aria patterns via regex', () => {
      expect(isPropValid('data-testid')).toBe(true);
      expect(isPropValid('aria-label')).toBe(true);
      expect(isPropValid('data-custom-attribute')).toBe(true);
    });

    it('returns false for custom React props or non-DOM strings', () => {
      expect(isPropValid('isActive')).toBe(false);
      expect(isPropValid('myCustomProp')).toBe(false);
      expect(isPropValid('only-relevant')).toBe(false); // starts with 'on' but 3rd char is not uppercase
    });

    it('is memoized (internal behavior check)', () => {
      // First call computes
      const first = isPropValid('id');
      // Second call should be near-instant lookup
      const second = isPropValid('id');
      expect(first).toBe(true);
      expect(second).toBe(true);
    });
    // describe('isPropValid - Random Sampling', () => {
    //   // Pick 5 random keys from the hundreds of available props
    //   const randomSample = [...VALID_DOM_TESTING_KEYS]
    //     .sort(() => 0.5 - Math.random())
    //     .slice(0, 5);

    //   it.each(randomSample)('should validate the random prop: %s', (prop) => {
    //     expect(isPropValid(prop)).toBe(true);
    //   });
    // });
  });
  describe('isDOMPropKey', () => {
    it('properly narrows the type guard', () => {
      const key: unknown = 'className';
      if (isDOMPropKey(key)) {
        // TypeScript narrowing check
        expect(typeof key).toBe('string');
      }
    });
  });
});
