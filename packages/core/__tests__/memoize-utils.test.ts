import { memoize } from '../src';

describe('memoize', () => {
  it('should return the correct value from the original function', () => {
    const fn = (s: string) => s.length;
    const memoized = memoize(fn);

    expect(memoized('hello')).toBe(5);
    expect(memoized('axiom')).toBe(5);
  });

  it('should only call the original function once for the same argument', () => {
    let callCount = 0;
    const fn = (s: string) => {
      callCount++;
      return s.toUpperCase();
    };

    const memoized = memoize(fn);

    // First call
    memoized('test');
    expect(callCount).toBe(1);

    // Second call with same arg
    memoized('test');
    expect(callCount).toBe(1); // Should still be 1

    // Call with different arg
    memoized('other');
    expect(callCount).toBe(2);
  });

  it('should handle falsy return values correctly (0, "", false)', () => {
    let callCount = 0;
    const fn = (_s: string) => {
      callCount++;
      return 0;
    };

    const memoized = memoize(fn);

    expect(memoized('a')).toBe(0);
    expect(memoized('a')).toBe(0);
    expect(callCount).toBe(1); // Should not re-run just because result was 0
  });

  it('should be safe from prototype pollution (Object.create(null))', () => {
    const fn = (s: string) => s;
    const memoized = memoize(fn);

    // 'toString' is a common property on the standard Object prototype
    // Because you used Object.create(null), 'toString' should not be "in cache"
    expect(memoized('toString')).toBe('toString');
  });
});
