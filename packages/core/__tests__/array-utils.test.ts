import { ArrayUtils } from '../src';

describe('ArrayUtils', () => {
  describe('every', () => {
    it('returns true when all elements match the predicate', () => {
      const nums = [2, 4, 6];
      const isEven = (n: number) => n % 2 === 0;
      expect(ArrayUtils.every(nums, isEven)).toBe(true);
      expect(ArrayUtils.every([2, 4, 7], isEven)).toBe(false);
    });

    it('acts as a type guard for the entire array', () => {
      const values: (string | null)[] = ['a', 'b', 'c'];
      const isString = (val: unknown): val is string => typeof val === 'string';

      if (ArrayUtils.every(values, isString)) {
        // TypeScript narrows 'values' to string[] here
        expect(values[0].toUpperCase()).toBe('A');
      }
    });
  });

  describe('some', () => {
    it('returns true if at least one element matches', () => {
      const values = [1, 'hello', false];
      const isString = (v: unknown) => typeof v === 'string';
      expect(ArrayUtils.some(values, isString)).toBe(true);
      expect(ArrayUtils.some([1, 2, 3], isString)).toBe(false);
    });

    it('returns false for an empty array', () => {
      expect(ArrayUtils.some([], () => true)).toBe(false);
    });
  });
  describe('includes', () => {
    it('returns true if element is in array', () => {
      expect(ArrayUtils.includes(['a', 'b', 'c'], 'b')).toBe(true);
      expect(ArrayUtils.includes([1, 2, 3], 4)).toBe(false);
    });
  });

  // describe('createFixedLengthArray', () => {
  //   it('returns array when correct length', () => {
  //     const arr = [1, 2, 3];
  //     expect(ArrayUtils.createFixedLengthArray(arr, 3)).toEqual([1, 2, 3]);
  //   });

  //   it('throws when array length mismatch', () => {
  //     expect(() => ArrayUtils.createFixedLengthArray([1, 2], 3)).toThrow(
  //       /must have exactly 3 elements/,
  //     );
  //   });
  // });

  describe('readAllItems', () => {
    it('returns a shallow copy of the array', () => {
      const original = [1, 2, 3];
      const copy = ArrayUtils.readAllItems(original);
      expect(copy).toEqual(original);
      expect(copy).not.toBe(original);
    });
  });

  describe('map', () => {
    it('maps items correctly', () => {
      expect(ArrayUtils.map([1, 2, 3], (n) => n * 2)).toEqual([2, 4, 6]);
      expect(ArrayUtils.map(['a', 'b'], (s) => s.toUpperCase())).toEqual([
        'A',
        'B',
      ]);
    });
  });

  describe('forEachUnion', () => {
    it('iterates over flat arrays', () => {
      const result: number[] = [];
      ArrayUtils.forEachUnion([1, 2, 3], (n) => result.push(n * 2));
      expect(result).toEqual([2, 4, 6]);
    });

    it('iterates over array of arrays', () => {
      const result: number[] = [];
      ArrayUtils.forEachUnion(
        [
          [1, 2],
          [3, 4],
        ],
        (n) => result.push(n),
      );
      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  describe('forEach', () => {
    it('executes callback for each element', () => {
      const result: number[] = [];
      ArrayUtils.forEach([1, 2, 3], (n) => result.push(n + 1));
      expect(result).toEqual([2, 3, 4]);

      const result2: number[] = [];
      ArrayUtils.forEach([10, 20], (n) => result2.push(n / 10));
      expect(result2).toEqual([1, 2]);
    });
  });

  describe('reduce', () => {
    it('reduces array with accumulator', () => {
      const sum = ArrayUtils.reduce([1, 2, 3], (acc, n) => acc + n, 0);
      expect(sum).toBe(6);

      const product = ArrayUtils.reduce([2, 3, 4], (acc, n) => acc * n, 1);
      expect(product).toBe(24);
    });
  });

  describe('flat', () => {
    it('flattens one level of nested arrays', () => {
      expect(ArrayUtils.flat([1, [2, 3], 4])).toEqual([1, 2, 3, 4]);
      expect(ArrayUtils.flat([[1, 2], 3])).toEqual([1, 2, 3]);
    });
  });

  describe('flatMap', () => {
    it('maps and flattens arrays', () => {
      expect(ArrayUtils.flatMap([1, 2, 3], (n) => [n, n * 2])).toEqual([
        1, 2, 2, 4, 3, 6,
      ]);
      expect(ArrayUtils.flatMap(['a', 'b'], (s) => [s.toUpperCase()])).toEqual([
        'A',
        'B',
      ]);
    });
  });

  describe('filter', () => {
    it('filters elements based on predicate', () => {
      const arr = [1, 2, 3, 4];
      const even = ArrayUtils.filter(arr, (n) => n % 2 === 0);
      expect(even).toEqual([2, 4]);
    });

    it('works with type narrowing', () => {
      const arr: (number | null)[] = [1, null, 3];
      const nonNull = ArrayUtils.filter(arr, (x): x is number => x !== null);
      expect(nonNull).toEqual([1, 3]);
      expect(ArrayUtils.filter(arr, (x): x is number => x !== null)).toEqual([
        1, 3,
      ]);
    });
  });

  describe('filterNonNullable', () => {
    it('removes null and undefined', () => {
      const arr = [1, null, 2, undefined, 3];
      expect(ArrayUtils.filterNonNullable(arr)).toEqual([1, 2, 3]);
      expect(ArrayUtils.filterNonNullable(arr)).toEqual([1, 2, 3]);
    });
  });
});
