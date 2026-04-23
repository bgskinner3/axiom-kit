import { yieldFiltered, yieldEntries } from '../src';

describe('Iterator Utils', () => {
  describe('yieldFiltered', () => {
    it('should lazily filter items based on a type guard', () => {
      const input = [1, 'a', 2, 'b', 3];
      const isNumber = (v: unknown): v is number => typeof v === 'number';

      const generator = yieldFiltered(input, isNumber);
      const result = Array.from(generator);

      expect(result).toEqual([1, 2, 3]);
      // Verify laziness: result should be an array, but generator should be exhausted
      expect(generator.next().done).toBe(true);
    });

    it('should handle empty collections', () => {
      const isString = (v: unknown): v is string => typeof v === 'string';
      const result = Array.from(yieldFiltered([], isString));
      expect(result).toEqual([]);
    });

    it('should not execute the guard more than necessary (lazy check)', () => {
      const input = [1, 2, 3, 4];
      let callCount = 0;
      const guard = (v: number): v is number => {
        callCount++;
        return v < 3;
      };

      const gen = yieldFiltered(input, guard);

      gen.next(); // 1
      gen.next(); // 2

      expect(callCount).toBe(2); // Has not checked 3 or 4 yet
    });
    it('should correctly narrow types in the result', () => {
      const input: (string | number)[] = [1, 'a'];
      const isString = (v: any): v is string => typeof v === 'string';

      const result = Array.from(yieldFiltered(input, isString));

      // TypeScript should know 'result' is string[]
      // This line would throw a compiler error if the guard didn't narrow correctly
      const charCount: number = result[0].length;
      expect(typeof charCount).toBe('number');
    });
  });

  describe('yieldEntries', () => {
    interface TestObj {
      id: number;
      name: string;
      active: boolean;
      meta: string;
    }

    const data: TestObj = {
      id: 1,
      name: 'Axiom',
      active: true,
      meta: 'Core',
    };

    it('should yield entries that pass the key guard', () => {
      // Guard that only wants string-based keys
      const isStringKey = (
        key: keyof TestObj,
        value: any,
      ): key is 'name' | 'meta' => typeof value === 'string';

      const result = Array.from(yieldEntries(data, isStringKey));

      expect(result).toEqual([
        ['name', 'Axiom'],
        ['meta', 'Core'],
      ]);
    });

    // it('should ignore inherited prototype properties', () => {
    //   const prototype = { inherited: true };
    //   const obj = Object.create(prototype);
    //   obj.local = 'yes';

    //   const guard = (key: string, value: any): key is string => true;
    //   const result = Array.from(yieldEntries(obj, guard));

    //   expect(result).toEqual([['local', 'yes']]);
    //   expect(result).not.toContainEqual(['inherited', true]);
    // });

    it('should return an empty generator if no keys pass the guard', () => {
      const guard = (_key: any, _value: any): _key is never => false;
      const result = Array.from(yieldEntries(data, guard));
      expect(result).toEqual([]);
    });
  });
});
