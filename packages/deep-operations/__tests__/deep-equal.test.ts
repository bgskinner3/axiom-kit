import { areDeepEqual } from '../src/deep-equal';


describe('areDeepEqual', () => {
  describe('Primitives & Identity', () => {
    it('returns true for identical primitives', () => {
      expect(areDeepEqual(1, 1)).toBe(true);
      expect(areDeepEqual('abc', 'abc')).toBe(true);
      expect(areDeepEqual(null, null)).toBe(true);
    });

    it('handles NaN correctly via Object.is', () => {
      expect(areDeepEqual(NaN, NaN)).toBe(true);
    });

    it('distinguishes between -0 and +0', () => {
      expect(areDeepEqual(-0, +0)).toBe(false);
    });

    it('returns false for different primitives', () => {
      expect(areDeepEqual(1, 2)).toBe(false);
      expect(areDeepEqual('a', 'b')).toBe(false);
      expect(areDeepEqual(true, false)).toBe(false);
    });
  });

  describe('Dates', () => {
    it('returns true for dates with the same timestamp', () => {
      const d1 = new Date('2024-01-01T00:00:00Z');
      const d2 = new Date('2024-01-01T00:00:00Z');
      expect(areDeepEqual(d1, d2)).toBe(true);
    });

    it('returns false for different dates', () => {
      const d1 = new Date('2024-01-01');
      const d2 = new Date('2024-01-02');
      expect(areDeepEqual(d1, d2)).toBe(false);
    });
  });

  describe('Arrays', () => {
    it('returns true for matching arrays', () => {
      expect(areDeepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it('returns false if lengths differ', () => {
      expect(areDeepEqual([1, 2], [1, 2, 3])).toBe(false);
    });

    it('returns false if content differs', () => {
      expect(areDeepEqual([1, 2], [1, 5])).toBe(false);
    });

    it('handles nested arrays', () => {
      expect(areDeepEqual([[1], [2]], [[1], [2]])).toBe(true);
      expect(areDeepEqual([[1], [2]], [[1], [3]])).toBe(false);
    });
  });

  describe('Objects', () => {
    it('returns true for structurally identical objects', () => {
      const a = { x: 1, y: { z: 2 } };
      const b = { x: 1, y: { z: 2 } };
      expect(areDeepEqual(a, b)).toBe(true);
    });

    it('returns false if keys differ', () => {
      expect(areDeepEqual({ a: 1 }, { b: 1 })).toBe(false);
      expect(areDeepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it('returns false if values differ', () => {
      expect(areDeepEqual({ a: 1 }, { a: 2 })).toBe(false);
    });

    it('handles null prototype objects', () => {
      const a = Object.create(null);
      const b = Object.create(null);
      a.test = 1;
      b.test = 1;
      expect(areDeepEqual(a, b)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('returns false for different types with same "shape"', () => {
      // Both are empty but types differ
      expect(areDeepEqual([], {})).toBe(false);
    });

    it('handles Symbol keys', () => {
      const sym = Symbol('key');
      const a = { [sym]: 'val' };
      const b = { [sym]: 'val' };
      const c = { [sym]: 'other' };

      expect(areDeepEqual(a, b)).toBe(true);
      expect(areDeepEqual(a, c)).toBe(false);
    });

    it('works as a Type Guard', () => {
      const val: unknown = { id: 10 };
      const target = { id: 10 };

      if (areDeepEqual(target, val)) {
        // Narrowing check: TypeScript should allow accessing .id
        expect(val.id).toBe(10);
      }
    });
  });
});
