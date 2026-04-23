import type { TExpect, TEqual } from '../src';
import { forceType, expectType } from '../src';
import type {
  TRecursivePartial,
  TRecursiveRequired,
  TRecursiveReadonly,
  TPrettify,
} from '../src';

describe('Recursive Modifier Utilities', () => {
  describe('TRecursivePartial', () => {
    test('deeply applies optionality to nested objects', () => {
      type Actual = TPrettify<TRecursivePartial<{ a: { b: { c: number } } }>>;
      type Expected = { a?: { b?: { c?: number } } };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('recursively handles objects within arrays', () => {
      type Actual = TPrettify<TRecursivePartial<{ list: { id: number }[] }>>;
      type Expected = { list?: { id?: number }[] };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('stops recursion at function boundaries', () => {
      type Actual = TRecursivePartial<{ save: (id: string) => void }>;
      type Expected = { save?: (id: string) => void };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });
  });

  describe('TRecursiveRequired', () => {
    test('strips optionality deeply from nested structures', () => {
      type Actual = TPrettify<TRecursiveRequired<{ a?: { b?: number } }>>;
      type Expected = { a: { b: number } };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('removes "?" but preserves "null" (Strict Null Integrity)', () => {
      type Actual = TRecursiveRequired<{ a?: string | null }>;
      type Expected = { a: string | null };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('protects built-in types (Date) from being mangled', () => {
      type Actual = TRecursiveRequired<{ updated?: Date }>;
      type Expected = { updated: Date };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });
  });

  describe('TRecursiveReadonly', () => {
    test('deeply applies readonly to objects and nested arrays', () => {
      type Actual = TRecursiveReadonly<{ users: { id: number }[] }>;
      type Expected = {
        readonly users: ReadonlyArray<{ readonly id: number }>;
      };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = { users: [{ id: 1 }] };

      forceType<Actual>(val, _check);
      // @ts-expect-error - Array is now ReadonlyArray, no .push
      val.users.push({ id: 2 });
    });

    test('converts standard arrays to ReadonlyArray structures', () => {
      type Actual = TRecursiveReadonly<number[]>;
      // Verification: Does it still have .push?
      type HasPush = Actual extends { push: any } ? true : false;

      const _check: TExpect<TEqual<HasPush, false>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<readonly number[]>(val);
    });

    test('handles nested objects recursively', () => {
      type Actual = TRecursiveReadonly<{ a: { b: number } }>;
      type Expected = { readonly a: { readonly b: number } };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });
  });
});
