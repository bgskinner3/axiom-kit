import type { TExpect, TEqual } from '../src';
import { forceType, expectType } from '../src';
import type {
  TDeepWriteable,
  TDeepMap,
  TDeepBigIntToNumber,
  TDeepMerge,
  TPrettify,
} from '../src';

describe('Deep Object Utilities', () => {
  describe('TDeepWriteable', () => {
    test('deeply converts ReadonlyArray to mutable array', () => {
      type Actual = TDeepWriteable<ReadonlyArray<{ readonly id: number }>>;
      type Expected = { id: number }[];

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('protects built-in types like Date and RegExp', () => {
      type Actual = TDeepWriteable<{ readonly created: Date }>;
      type Expected = { created: Date };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('recursively converts nested tuples', () => {
      type TTupleBase = readonly [readonly [string, number], bigint];
      type Actual = TDeepWriteable<TTupleBase>;
      type Expected = [[string, number], bigint];

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      // forceType<Actual, Expected>([['a', 1], 100n], _check);
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });
  });

  describe('TDeepMap', () => {
    test('maps specific string literals deeply', () => {
      type Actual = TDeepMap<
        { status: 'PENDING' | 'DONE' },
        'PENDING',
        'START'
      >;
      type Expected = { status: 'START' | 'DONE' };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      // forceType<Actual, Expected>({ status: 'START' }, _check);
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('maps built-ins to primitives (Date -> number)', () => {
      type Actual = TDeepMap<{ timestamp: Date }, Date, number>;
      type Expected = { timestamp: number };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      // forceType<Actual, Expected>({ timestamp: 123456789 }, _check);
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });
  });

  describe('TDeepBigIntToNumber', () => {
    test('converts deeply nested BigInt arrays', () => {
      type Actual = TDeepBigIntToNumber<bigint[][]>;
      type Expected = number[][];

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      // forceType<Actual, Expected>([[0, 1]], _check);
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('handles optional and nullable BigInt fields', () => {
      type Actual = TDeepBigIntToNumber<{ id: bigint | null; count?: bigint }>;
      type Expected = { id: number | null; count?: number };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      // forceType<Actual, Expected>({ id: null }, _check);
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });
  });

  describe('TDeepMerge', () => {
    test('merges nested objects with property overrides', () => {
      type T1 = { user: { name: string; age: number } };
      type T2 = { user: { age: string; active: boolean } };
      type Actual = TPrettify<TDeepMerge<T1, T2>>;
      type Expected = { user: { name: string; age: string; active: boolean } };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      forceType<Actual>(
        { user: { name: 'A', age: '1', active: true } },
        _check,
      );
      expectType<Expected>({ user: { name: 'A', age: '1', active: true } });
    });

    test('promotes optional properties to required if present in second type', () => {
      type T1 = { id?: string; meta: { a: number } };
      type T2 = { id: string; meta: { b: number } };
      type Actual = TPrettify<TDeepMerge<T1, T2>>;
      type Expected = { id: string; meta: { a: number; b: number } };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      // forceType<Actual, Expected>({ id: '001', meta: { a: 1, b: 2 } }, _check);
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('allows primitive to override nested object structure', () => {
      type T1 = { nested: { a: number } };
      type T2 = { nested: string };
      type Actual = TPrettify<TDeepMerge<T1, T2>>;
      type Expected = { nested: string };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      // forceType<Actual, Expected>({ nested: 'override' }, _check);
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });
  });
});
