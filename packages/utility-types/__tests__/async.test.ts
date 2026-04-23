import type { TExpect, TEqual } from '../src';
import { forceType, expectType } from '../src';
import type { TPromiseType, TPromisify, TPrettify } from '../src';

describe('Async Type Utilities', () => {
  describe('TPromiseType', () => {
    test('extracts resolved value from a standard Promise', () => {
      type Actual = TPromiseType<Promise<string>>;
      type Expected = string;

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = 'hello';

      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('extracts complex object types from Promises', () => {
      type Actual = TPromiseType<Promise<{ id: number; name: string }>>;
      type Expected = { id: number; name: string };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = { id: 1, name: 'Brennan' };

      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('unwraps only one level (shallow unwrapping)', () => {
      // Note: If you want deep unwrapping, use native Awaited<T>
      type Actual = TPromiseType<Promise<Promise<number>>>;
      type Expected = Promise<number>;

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = Promise.resolve(100);

      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('returns never for non-promise inputs', () => {
      type Actual = TPromiseType<string>;
      type Expected = never;

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      forceType<Actual>('', _check);
    });
  });

  describe('TPromisify', () => {
    test('wraps each property of an object in a Promise', () => {
      type UserData = { id: string; age: number; isActive: boolean };
      type Actual = TPromisify<UserData>;
      type Expected = {
        id: Promise<string>;
        age: Promise<number>;
        isActive: Promise<boolean>;
      };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {
        id: Promise.resolve('1'),
        age: Promise.resolve(30),
        isActive: Promise.resolve(true),
      };

      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('preserves optionality and handles undefined in unions', () => {
      // Mapped types like { [K in keyof T]: ... } preserve the '?' modifier
      type Actual = TPrettify<TPromisify<{ name?: string }>>;
      type Expected = { name?: Promise<string | undefined> };

      const _check: TExpect<TEqual<Actual, Expected>> = true;

      const val: unknown = {}; // Valid because it's optional
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('handles empty objects correctly', () => {
      type Actual = TPromisify<object>;
      type Expected = object;

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      forceType<Actual>({}, _check);
      expectType<Expected>({});
    });
  });
});
