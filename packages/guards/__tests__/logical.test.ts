import {
  isInArray,
  isKeyOfObject,
  isKeyInObject,
  isInSet,
  isKeyOfArray,
  isArrayOf,
  isRecordOf,
  hasDefinedKeys,
  isShape,
  isType,
  isRegExp,
  isDate,
  // helpers
  isString,
  isNumber,
  isBoolean,
} from '../src';

describe('Logical Type Guards', () => {
  describe('isInArray', () => {
    const check = isInArray(['a', 'b', 1]);
    it('returns true if value exists in the array', () => {
      expect(check('a')).toBe(true);
      expect(check(1)).toBe(true);
    });
    it('returns false if value is missing or undefined', () => {
      expect(check('c')).toBe(false);
      expect(check(undefined)).toBe(false);
    });
  });

  describe('isKeyOfObject', () => {
    const obj = { a: 1, b: 'two' };
    const check = isKeyOfObject(obj);
    it('returns true for valid keys', () => {
      expect(check('a')).toBe(true);
      expect(check('b')).toBe(true);
    });
    it('returns false for non-existent keys', () => {
      expect(check('c')).toBe(false);
      expect(check(123)).toBe(false);
    });
  });

  describe('isKeyInObject', () => {
    it('checks if a specific key exists in an unknown object', () => {
      const hasID = isKeyInObject('id');
      expect(hasID({ id: 100 })).toBe(true);
      expect(hasID({ name: 'foo' })).toBe(false);
      expect(hasID(null)).toBe(false);
    });
  });

  describe('isKeyOfArray', () => {
    const keys = ['id', 'name', 123] as const;
    const check = isKeyOfArray(keys);
    it('returns true if the value is one of the array elements', () => {
      expect(check('id')).toBe(true);
      expect(check(123)).toBe(true);
    });
    it('returns false otherwise', () => {
      expect(check('age')).toBe(false);
    });
  });

  describe('isArrayOf', () => {
    it('returns true if all elements pass the guard', () => {
      expect(isArrayOf(isString, ['a', 'b'])).toBe(true);
      expect(isArrayOf(isNumber, [1, 2, 3])).toBe(true);
    });
    it('returns false if any element fails or input is not an array', () => {
      expect(isArrayOf(isString, ['a', 1])).toBe(false);
      expect(isArrayOf(isString, 'not an array')).toBe(false);
    });
  });

  describe('isRecordOf', () => {
    it('returns true if all values in object pass the guard', () => {
      const obj = { x: 1, y: 2 };
      expect(isRecordOf(obj, isNumber)).toBe(true);
    });
    it('returns false if any value fails', () => {
      const obj = { x: 1, y: '2' };
      expect(isRecordOf(obj, isNumber)).toBe(false);
    });
  });

  describe('hasDefinedKeys', () => {
    type User = { id: number; name: string; age?: number };
    const isUser = hasDefinedKeys<User>(['id', 'name']);

    it('returns true when all required keys are present and defined', () => {
      expect(isUser({ id: 1, name: 'Alice' })).toBe(true);
      expect(isUser({ id: 1, name: 'Alice', age: 30 })).toBe(true);
    });

    it('returns false if a required key is missing or undefined', () => {
      expect(isUser({ id: 1 })).toBe(false);
      expect(isUser({ id: 1, name: undefined })).toBe(false);
      expect(isUser(null)).toBe(false);
    });
  });
  describe('isShape', () => {
    type Nested = {
      id: string;
      meta: { ok: boolean };
    };

    const isNested = isShape<Nested>({
      id: isString,
      meta: isShape<{ ok: boolean }>({
        ok: isBoolean,
      }),
    });

    it('✅ handles deep recursive validation', () => {
      const valid: unknown = { id: '1', meta: { ok: true } };
      expect(isNested(valid)).toBe(true);
    });

    it('❌ catches deep failures', () => {
      const invalid: unknown = { id: '1', meta: { ok: 'not-a-boolean' } };

      expect(isNested(invalid)).toBe(false);
    });

    it('❌ handles null/undefined inputs gracefully', () => {
      expect(isNested(null)).toBe(false);
      expect(isNested(undefined)).toBe(false);
    });

    it('❌ rejects primitive inputs', () => {
      expect(isNested('oops')).toBe(false);
      expect(isNested(42)).toBe(false);
      expect(isNested(true)).toBe(false);
    });

    it('❌ catches missing keys in nested objects', () => {
      const missing: unknown = { id: '1', meta: {} };
      expect(isNested(missing)).toBe(false);
    });

    it('❌ rejects null nested objects', () => {
      const invalid: unknown = { id: '1', meta: null };
      expect(isNested(invalid)).toBe(false);
    });
  });

  describe('Edge Case Audit', () => {
    it('isRecordOf should handle empty objects', () => {
      // Mathematically, an empty set contains no invalid values.
      expect(isRecordOf({}, isNumber)).toBe(true);
    });

    it('isArrayOf should handle empty arrays', () => {
      expect(isArrayOf(isString, [])).toBe(true);
    });

    it('isNumber should reject NaN and Infinity (Senior Move)', () => {
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber(Infinity)).toBe(false);
    });
  });

  describe('isType', () => {
    it('should return true if the schema (guard) passes', () => {
      const isString = (v: unknown): v is string => typeof v === 'string';
      expect(isType('hello', isString)).toBe(true);
    });

    it('should return false if the schema (guard) fails', () => {
      const isNumber = (v: unknown): v is number => typeof v === 'number';
      expect(isType('not a number', isNumber)).toBe(false);
    });
  });

  describe('isRegExp', () => {
    it('should return true for RegExp literals and instances', () => {
      expect(isRegExp(/abc/)).toBe(true);
      expect(isRegExp(new RegExp('abc'))).toBe(true);
    });

    it('should return false for non-RegExp values', () => {
      expect(isRegExp('/abc/')).toBe(false);
      expect(isRegExp({})).toBe(false);
      expect(isRegExp(null)).toBe(false);
    });
  });

  describe('isDate', () => {
    it('should return true for valid Date instances', () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date('2024-01-01'))).toBe(true);
    });

    it('should return false for "Invalid Date" instances', () => {
      // A Date instance that is technically a Date but has no time value
      expect(isDate(new Date('not-a-date'))).toBe(false);
    });

    it('should return false for non-Date values', () => {
      expect(isDate('2024-01-01')).toBe(false);
      expect(isDate(1713825000000)).toBe(false);
      expect(isDate(null)).toBe(false);
    });
  });

  describe('isInSet', () => {
    it('should return true if value exists in the set', () => {
      const set = new Set(['admin', 'editor', 'viewer']);
      const isRole = isInSet<string>(set);

      expect(isRole('admin')).toBe(true);
      expect(isRole('editor')).toBe(true);
    });

    it('should return false if value is missing from the set', () => {
      const set = new Set([1, 2, 3]);
      const isOneToThree = isInSet<number>(set);

      expect(isOneToThree(4)).toBe(false);
      expect(isOneToThree('1')).toBe(false); // Strict equality
    });

    it('should handle empty sets', () => {
      const isEmpty = isInSet(new Set());
      expect(isEmpty('anything')).toBe(false);
    });
  });
});
