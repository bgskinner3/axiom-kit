import {
  generateKeyMap,
  toKeyByField,
  capitalizedKeys,
  capitalizeArray,
} from '../src';

describe('ObjectTransformers', () => {
  describe('Capitalization utilities', () => {
    describe('capitalizeArray', () => {
      test('capitalizes all strings in an array', () => {
        const input = ['hello', 'world', 'test'] as const;
        const result = capitalizeArray(input);
        expect(result).toEqual(['Hello', 'World', 'Test']);
      });

      test('handles empty arrays', () => {
        expect(capitalizeArray([])).toEqual([]);
      });

      test('preserves single-character strings', () => {
        const input = ['a', 'b'] as const;
        expect(capitalizeArray(input)).toEqual(['A', 'B']);
      });
    });

    describe('capitalizedKeys', () => {
      test('capitalizes all string keys of an object', () => {
        const obj = { first: 1, second: 2, third: 3 };
        const result = capitalizedKeys(obj);
        expect(result).toEqual(['First', 'Second', 'Third']);
      });

      test('filters out non-string keys', () => {
        const obj = { 1: 'a', true: 'b', hello: 'world' };
        const result = capitalizedKeys(obj);
        expect(result).toEqual(['True', 'Hello']);
      });

      test('handles empty objects', () => {
        expect(capitalizedKeys({})).toEqual([]);
      });

      test('works with keys already capitalized', () => {
        const obj = { Hello: 1, World: 2 };
        expect(capitalizedKeys(obj)).toEqual(['Hello', 'World']);
      });
    });
  });
  describe('toKeyByField', () => {
    type Row = { id: number; name: string; age: number };

    const rows: Row[] = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ];

    test('maps array to record by id', () => {
      const result = toKeyByField(rows, 'id');

      expect(result).toEqual({
        1: { name: 'Alice', age: 25 },
        2: { name: 'Bob', age: 30 },
        3: { name: 'Charlie', age: 35 },
      });
    });

    test('maps array to record by name', () => {
      const result = toKeyByField(rows, 'name');

      expect(result).toEqual({
        Alice: { id: 1, age: 25 },
        Bob: { id: 2, age: 30 },
        Charlie: { id: 3, age: 35 },
      });
    });

    test('handles empty array', () => {
      const result = toKeyByField([], 'id');
      expect(result).toEqual({});
    });

    test('ensures key is omitted in output', () => {
      const result = toKeyByField(rows, 'id');
      Object.values(result).forEach((value) => {
        expect(value).not.toHaveProperty('id');
      });
    });
  });

  describe('generateKeyMap', () => {
    describe('generateKeyMap - basic usage', () => {
      test('generates keys with suffix only', () => {
        const keys = ['first', 'second', 'third'] as const;
        const suffix = 'Id';

        const result = generateKeyMap({ keys, suffix });

        expect(result).toEqual({
          first: 'firstId',
          second: 'secondId',
          third: 'thirdId',
        });
      });
    });
    describe('generateKeyMap - with prefix', () => {
      test('generates keys with prefix and suffix', () => {
        const keys = ['first', 'second'] as const;
        const prefix = 'my';
        const suffix = 'Key';

        const result = generateKeyMap({ keys, prefix, suffix });

        expect(result).toEqual({
          first: 'myFirstKey',
          second: 'mySecondKey',
        });
      });
    });
    describe('generateKeyMap - edge cases', () => {
      test('handles empty keys', () => {
        expect(generateKeyMap({ keys: [], suffix: 'X' })).toEqual({});
      });

      test('handles single-character keys', () => {
        const keys = ['a', 'b'] as const;
        const result = generateKeyMap({ keys, suffix: 'Z' });
        expect(result).toEqual({ a: 'aZ', b: 'bZ' });
      });

      test('handles prefix as empty string', () => {
        const keys = ['one', 'two'] as const;
        const result = generateKeyMap({ keys, prefix: '', suffix: 'X' });
        expect(result).toEqual({ one: 'oneX', two: 'twoX' });
      });
    });
  });
});
