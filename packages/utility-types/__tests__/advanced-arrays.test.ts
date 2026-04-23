import type { TExpect, TEqual } from '../src';
import { forceType, expectType } from '../src';
import type { TFixedLengthArray } from '../src';

describe('Advanced Arrays', () => {
  describe('TFixedLengthArray', () => {
    test('converts tuple to an indexed object with an iterator', () => {
      type Actual = TFixedLengthArray<[number, string]>;
      type Expected = {
        0: number;
        1: string;
        length: number;
        [Symbol.iterator]: () => IterableIterator<number | string>;
      };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {
        0: 1,
        1: 'a',
        length: 2,
        [Symbol.iterator]: () => [][Symbol.iterator](),
      };

      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });
    test('extracts specific index values', () => {
      type Actual = TFixedLengthArray<[1, 2, 3]>[0];
      type Expected = 1;

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      forceType<Actual>(1, _check);
      expectType<Expected>(1);
    });

    test('verifies iterator return type', () => {
      type Actual = ReturnType<
        TFixedLengthArray<[1, 'a']>[typeof Symbol.iterator]
      >;
      type Expected = IterableIterator<1 | 'a'>;

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      // Runtime mock of an iterator
      const val: unknown = (function* () {
        yield* [1, 'a' as const];
      })();

      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('verifies keyof results', () => {
      type Actual = keyof TFixedLengthArray<[number, number]>;
      type Expected = '0' | '1' | 'length' | typeof Symbol.iterator;

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      forceType<Actual>('0', _check);
      expectType<Expected>('0');
    });

    test('ensures mutating methods like .map are removed', () => {
      // Should be false because .map should not exist on TFixedLengthArray
      type Actual =
        TFixedLengthArray<[number]> extends { map: unknown } ? true : false;
      type Expected = false;

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      forceType<Actual>(false, _check);
      expectType<Expected>(false);
    });

    test('handles empty tuple edge case', () => {
      type Actual = TFixedLengthArray<[]>;
      type Expected = {
        length: number;
        [Symbol.iterator]: () => IterableIterator<never>;
      };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('handles standard arrays (non-tuples)', () => {
      type Actual = TFixedLengthArray<number[]>;
      type Expected = {
        length: number;
        [Symbol.iterator]: () => IterableIterator<number>;
      };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {
        length: 10,
        [Symbol.iterator]: function* () {
          yield 1;
        },
      };

      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });
  });
});
