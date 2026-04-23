import type {
  TCreateDiff,
  TMerge,
  TPrettify,
  TBigIntToggle,
} from '../src/primitives';
import type { TExpect, TEqual } from '../src';
import { forceType, expectType } from '../src';

describe('Logic Type Utilities: Objects & Toggles', () => {
  describe('TPrettify', () => {
    test('flattens intersections into readable objects', () => {
      type Intersected = { a: number } & { b: string };
      type Prettified = TPrettify<Intersected>;
      type Expected = { a: number; b: string };

      const _typeTest: TExpect<TEqual<Prettified, Expected>> = true;

      const filteredKeys: unknown = {};
      forceType<Prettified>(filteredKeys, _typeTest);
      expectType<Expected>(filteredKeys);
    });

    test('preserves data in nested structures without shallow flattening', () => {
      type Deep = { user: { id: number } & { name: string } };
      type PrettifiedDeep = TPrettify<Deep>;
      type Expected = { user: { id: number } & { name: string } };

      // type _check = TExpect<TEqual<PrettifiedDeep, Expected>>;
      const _typeTest: TExpect<TEqual<PrettifiedDeep, Expected>> = true;
      const filteredKeys: unknown = {};
      forceType<PrettifiedDeep>(filteredKeys, _typeTest);
      expectType<Expected>(filteredKeys);
    });
  });

  describe('TMerge', () => {
    test('performs basic override where the second type wins conflicts', () => {
      type Base = { id: number; name: string; active: boolean };
      type Update = { id: string; active: string };
      type Merged = TPrettify<TMerge<Base, Update>>;
      type Expected = { id: string; name: string; active: string };

      const _typeTest: TExpect<TEqual<Merged, Expected>> = true;
      const filteredKeys: unknown = {};
      forceType<Merged>(filteredKeys, _typeTest);
      expectType<Expected>(filteredKeys);
    });

    test('performs additive merge for unique keys', () => {
      type Additive = TPrettify<TMerge<{ a: 1 }, { b: 2 }>>;

      const _typeTest: TExpect<TEqual<Additive, { a: 1; b: 2 }>> = true;
      const filteredKeys: unknown = {};
      forceType<Additive>(filteredKeys, _typeTest);
      expectType<{ a: 1; b: 2 }>(filteredKeys);
    });
  });

  describe('TCreateDiff', () => {
    test('extracts unique properties between two objects', () => {
      type A = { id: number; common: string; site: string };
      type B = { age: number; common: string; site: string };
      type Diff = TPrettify<TCreateDiff<A, B>>;
      type Expected = { id: number; age: number };

      const _typeTest: TExpect<TEqual<Diff, Expected>> = true;
      const filteredKeys: unknown = {};
      forceType<Diff>(filteredKeys, _typeTest);
      expectType<Expected>(filteredKeys);
    });

    test('strips keys based on name regardless of value type mismatch', () => {
      type C = { id: string; value: string };
      type D = { id: number; other: number };
      type Diff = TPrettify<TCreateDiff<C, D>>;

      const _typeTest: TExpect<TEqual<Diff, { value: string; other: number }>> =
        true;
      const filteredKeys: unknown = {};
      forceType<Diff>(filteredKeys, _typeTest);
      expectType<{ value: string; other: number }>(filteredKeys);
    });
  });

  describe('TBigIntToggle', () => {
    test('toggles BigInt to string (Database -> Frontend)', () => {
      type ToFrontend = TBigIntToggle<bigint>;

      const _typeTest: TExpect<TEqual<ToFrontend, string>> = true;
      const val: unknown = 100n;
      forceType<ToFrontend>(val, _typeTest);
      expectType<string>(val);
    });

    test('toggles string to BigInt (Frontend -> Database)', () => {
      type ToDb = TBigIntToggle<string>;

      const _typeTest: TExpect<TEqual<ToDb, bigint>> = true;
      const val: unknown = 100n;
      forceType<ToDb>(val, _typeTest);
      expectType<bigint>(val);
    });

    test('handles unions distributively (Mixed -> Swapped)', () => {
      type Mixed = string | bigint;
      type Toggled = TBigIntToggle<Mixed>;

      const _typeTest: TExpect<TEqual<Toggled, bigint | string>> = true;
      const val: unknown = 'test';
      forceType<Toggled>(val, _typeTest);
      expectType<bigint | string>(val);
    });
  });
});
