import { cloneDeep } from '../src/deep-clone';

describe('cloneDeep', () => {
  describe('Primitives & Basics', () => {
    it('returns primitives as-is', () => {
      expect(cloneDeep(42)).toBe(42);
      expect(cloneDeep('hello')).toBe('hello');
      expect(cloneDeep(true)).toBe(true);
      expect(cloneDeep(null)).toBe(null);
      expect(cloneDeep(undefined)).toBe(undefined);
    });

    it('handles NaN and Infinity', () => {
      expect(cloneDeep(NaN)).toBeNaN();
      expect(cloneDeep(Infinity)).toBe(Infinity);
    });
  });

  describe('Arrays', () => {
    it('creates a new array instance with cloned elements', () => {
      const original = [1, { a: 1 }, [2]];
      const clone = cloneDeep(original);

      expect(clone).toEqual(original);
      expect(clone).not.toBe(original);
      expect(clone[1]).not.toBe(original[1]); // Nested object check
      expect(clone[2]).not.toBe(original[2]); // Nested array check
    });

    it('handles empty arrays', () => {
      expect(cloneDeep([])).toEqual([]);
    });
  });

  describe('Objects', () => {
    it('creates a new object instance with cloned properties', () => {
      const original = { x: 1, y: { z: 2 } };
      const clone = cloneDeep(original);

      expect(clone).toEqual(original);
      expect(clone).not.toBe(original);
      expect(clone.y).not.toBe(original.y);
    });

    it('preserves null prototypes', () => {
      const pureObj = Object.create(null);
      pureObj.feat = 'pure';

      const clone = cloneDeep(pureObj);

      expect(Object.getPrototypeOf(clone)).toBeNull();
      expect(clone.feat).toBe('pure');
    });

    it('preserves custom class prototypes', () => {
      class TestUser {
        constructor(public name: string) {}
        greet() {
          return `Hi ${this.name}`;
        }
      }

      const user = new TestUser('Ben');
      const clone = cloneDeep(user);

      expect(clone).toBeInstanceOf(TestUser);
      expect(clone.greet()).toBe('Hi Ben');
      expect(clone).not.toBe(user);
    });
  });

  describe('Circular References', () => {
    it('handles self-referencing objects without infinite loops', () => {
      const original: any = { name: 'circular' };
      original.self = original;

      const clone = cloneDeep(original);

      expect(clone.self).toBe(clone);
      expect(clone.self).not.toBe(original);
    });

    it('handles complex circular cross-references', () => {
      const a: any = { name: 'A' };
      const b: any = { name: 'B' };
      a.link = b;
      b.link = a;

      const cloneA = cloneDeep(a);

      expect(cloneA.link.name).toBe('B');
      expect(cloneA.link.link).toBe(cloneA); // Circle preserved
    });
  });

  describe('Edge Cases', () => {
    it('clones objects with Symbol keys', () => {
      const sym = Symbol('id');
      const original = { [sym]: 'secret' };
      const clone = cloneDeep(original);

      expect(clone[sym]).toBe('secret');
    });

    it('handles deeply nested structures', () => {
      const original = { a: { b: { c: { d: { e: 5 } } } } };
      const clone = cloneDeep(original);
      expect(clone.a.b.c.d.e).toBe(5);
    });
  });
});
