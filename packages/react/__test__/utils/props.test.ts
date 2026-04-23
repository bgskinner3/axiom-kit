/**
 * @jest-environment jsdom
 */
import {
  extractDOMProps,
  lazyProxy,
  extractComponentProps,
} from '../../src/utils';

describe('React Prop Utils', () => {
  describe('extractDOMProps', () => {
    it('strips non-DOM properties from the object', () => {
      const props = { id: 'foo', className: 'bar', customProp: 'hidden' };
      const domProps = extractDOMProps<'div', typeof props>(props);

      expect(domProps).toHaveProperty('id');
      expect(domProps).toHaveProperty('className');
      expect(domProps).not.toHaveProperty('customProp');
    });
  });
  describe('lazyProxy', () => {
    it('evaluates functions only when accessed and caches the result', () => {
      const spy = jest.fn(() => Math.random());
      const config = { a: 1, b: spy };
      const proxy = lazyProxy(config);

      expect(spy).not.toHaveBeenCalled();

      const firstCall = proxy.b;
      expect(spy).toHaveBeenCalledTimes(1);

      const secondCall = proxy.b;
      expect(spy).toHaveBeenCalledTimes(1); // Still 1 due to cache
      expect(firstCall).toBe(secondCall);
    });
    it('falls back to Reflect for non-string, missing, or symbol properties', () => {
      const config = { a: 1 };
      const proxy = lazyProxy(config);

      // 1. Access a missing property (hits !keys.has)
      expect((proxy as any)['nonExistent']).toBeUndefined();

      // 2. Access a Symbol property (hits !isString)
      const mySymbol = Symbol('test');
      const withSymbol: any = { [mySymbol]: 'bar' };
      const symbolProxy = lazyProxy(withSymbol);
      expect(symbolProxy[mySymbol]).toBe('bar');
    });

    it('returns non-function values directly without caching', () => {
      const config = { a: 100 }; // 'a' is a number, not a function
      const proxy = lazyProxy(config);

      // Hits the final 'return value' branch
      expect(proxy.a).toBe(100);
    });
  });
  describe('extractComponentProps', () => {
    it('extracts only whitelisted component props', () => {
      const props = {
        className: 'btn',
        onClick: () => {},
        variant: 'primary',
        disabled: false,
      };

      const result = extractComponentProps(props, ['className', 'variant']);

      expect(result).toEqual({
        className: 'btn',
        variant: 'primary',
      });
    });

    it('returns an empty object when no keys match', () => {
      const props = {
        a: 1,
        b: 2,
      };

      const result = extractComponentProps(props, ['c', 'd'] as any);

      expect(result).toEqual({});
    });

    it('returns all keys when full whitelist is provided', () => {
      const props = {
        className: 'box',
        id: 'test',
      };

      const result = extractComponentProps(props, ['className', 'id']);

      expect(result).toEqual(props);
    });

    it('does not mutate the original props object', () => {
      const props = {
        className: 'btn',
        variant: 'primary',
      };

      const original = { ...props };

      extractComponentProps(props, ['className']);

      expect(props).toEqual(original);
    });

    it('handles partial key matches correctly', () => {
      const props = {
        a: 1,
        b: 2,
        c: 3,
      };

      const result = extractComponentProps(props, ['a', 'c']);

      expect(result).toEqual({
        a: 1,
        c: 3,
      });
    });

    it('ignores non-existent keys safely', () => {
      const props = {
        name: 'test',
      };

      const result = extractComponentProps(props, ['name', 'fakeKey'] as any);

      expect(result).toEqual({
        name: 'test',
      });
    });

    it('preserves function values correctly', () => {
      const onClick = jest.fn();

      const props = {
        onClick,
        label: 'click me',
      };

      const result = extractComponentProps(props, ['onClick']);

      result!.onClick!();

      expect(onClick).toHaveBeenCalled();
    });

    it('handles empty props object', () => {
      const result = extractComponentProps({}, ['a', 'b'] as any);

      expect(result).toEqual({});
    });

    it('handles empty keys array', () => {
      const props = {
        a: 1,
        b: 2,
      };

      const result = extractComponentProps(props, [] as any);

      expect(result).toEqual({});
    });

    it('correctly narrows mixed-type props', () => {
      const props = {
        className: 'box',
        count: 5,
        active: true,
      };

      const result = extractComponentProps(props, ['count', 'active']);

      expect(result).toEqual({
        count: 5,
        active: true,
      });
    });
  });
});
