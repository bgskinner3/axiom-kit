import type { TExpect, TEqual } from '../src';
import { forceType, expectType } from '../src';
import type { TXOR, TTupleToIntersection } from '../src';

describe('Advanced Logic & Tuple Utilities', () => {
  describe('TXOR (Exclusive OR)', () => {
    type TEmailAuth = { email: string; otp: string };
    type TSocialAuth = { provider: 'google' | 'apple'; token: string };

    test('enforces mutually exclusive properties', () => {
      type Actual = TXOR<TEmailAuth, TSocialAuth>;
      type Expected =
        | (TEmailAuth & { provider?: never; token?: never })
        | (TSocialAuth & { email?: never; otp?: never });

      const _check: TExpect<TEqual<Actual, Expected>> = true;

      // Valid Email Auth
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);

      // Invalid: Cannot have both
      const val2 = { email: 'a', otp: 'b', token: 'c' };
      // @ts-expect-error - token is forbidden when email/otp are present
      forceType<Actual, Expected>(val2, _check);
    });

    test('handles overlapping shared keys by preserving them', () => {
      type A = { id: string; a: number };
      type B = { id: string; b: boolean };
      type Actual = TXOR<A, B>;
      type Expected = (A & { b?: never }) | (B & { a?: never });

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });
  });

  describe('TTupleToIntersection', () => {
    test('merges a duo of objects into a strict intersection', () => {
      type Actual = TTupleToIntersection<[{ a: string }, { b: number }]>;
      type Expected = { a: string } & { b: number };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('scales up to 5-ary intersections via explicit mapping', () => {
      type Penta = [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }, { e: 5 }];
      type Actual = TTupleToIntersection<Penta>;
      type Expected = { a: 1 } & { b: 2 } & { c: 3 } & { d: 4 } & { e: 5 };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('falls back to union if the tuple is too large (> 5)', () => {
      // Your implementation likely uses a switch/mapping for 1-5 and
      // falls back to T[number] for larger tuples.
      type Hex = [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }, { e: 5 }, { f: 6 }];
      type Actual = TTupleToIntersection<Hex>;
      type Expected =
        | { a: 1 }
        | { b: 2 }
        | { c: 3 }
        | { d: 4 }
        | { e: 5 }
        | { f: 6 };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('returns never for an empty tuple', () => {
      type Actual = TTupleToIntersection<[]>;
      const _check: TExpect<TEqual<Actual, never>> = true;
      forceType<Actual>({ id: '001', name: 'B', age: 30 }, _check);
    });

    test('correctly intersects overlapping keys within the tuple', () => {
      type Overlap = [
        { id: string; name: string },
        { id: string; age: number },
      ];
      type Actual = TTupleToIntersection<Overlap>;
      type Expected = { id: string; name: string } & {
        id: string;
        age: number;
      };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      forceType<Actual>({ id: '001', name: 'B', age: 30 }, _check);
      expectType<Expected>({ id: '001', name: 'B', age: 30 });
    });
  });
});
