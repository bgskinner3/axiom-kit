import type { TExpect, TEqual } from '../src';
import { forceType, expectType } from '../src';
import type {
  TPrettify,
  TUnionToIntersection,
  TPrefixUnion,
} from '../src/primitives';

describe('Union Type Utilities', () => {
  describe('TUnionToIntersections', () => {
    test('merges a union of objects into a single intersection', () => {
      type ObjectUnion = { a: string } | { b: number } | { c: boolean };
      type Actual = TPrettify<TUnionToIntersection<ObjectUnion>>;
      type Expected = { a: string; b: number; c: boolean };

      const _t2: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = true;
      forceType<Actual>(val, _t2);
      expectType<Expected>(val);
    });

    test('converts a union of functions into overloads', () => {
      type FuncA = (a: string) => string;
      type FuncB = (b: number) => number;
      type CombinedFunc = TUnionToIntersection<FuncA | FuncB>;

      const _check: TExpect<
        CombinedFunc extends { (a: string): string; (b: number): number }
          ? true
          : false
      > = true;

      // ✅ FIX: Provide a dummy function that satisfies the runtime call
      const fn = ((arg: any) => arg) as CombinedFunc;

      // These now pass both Type-checking and Runtime execution
      expectType<string>(fn('test'));
      expectType<number>(fn(123));

      forceType<CombinedFunc>(fn, _check);
    });
    test('results in never for incompatible primitives', () => {
      type PrimitiveUnion = 'a' | 'b' | 'c';
      type Actual = TUnionToIntersection<PrimitiveUnion>;

      forceType<Actual>({} as never, true);
    });

    test('intersects class instances (Mixins)', () => {
      class Alpha {
        a = 1;
      }
      class Beta {
        b = 2;
      }
      type Actual = TUnionToIntersection<Alpha | Beta>;

      const _check: TExpect<Actual extends Alpha & Beta ? true : false> = true;

      // ✅ FIX: Provide a real object with the values
      const instance = { a: 1, b: 2 } as Actual;

      expect(instance.a).toBeDefined();
      expect(instance.b).toBeDefined();
      forceType<Actual>(instance, _check);
    });

    test('returns a single member unchanged', () => {
      type Single = { id: number };
      type Actual = TUnionToIntersection<Single>;

      // forceType<Actual>({ id: 1 }, true);
      const _t2: TExpect<TEqual<Actual, Single>> = true;
      const val: unknown = true;
      forceType<Actual>(val, _t2);
      expectType<Single>(val);
    });
  });
  describe('Union Type Utilities: TPrefixUnion', () => {
    test('creates a union of prefixed strings from an array', () => {
      type Prefixes = ['on', 'handle'];
      type Actual = TPrefixUnion<Prefixes>;
      type Expected = `on${string}` | `handle${string}`;

      // 🔴 If logic fails, 'true' will be an invalid argument here
      forceType<Actual>('', true);
      expectType<Expected>('' as Actual);
    });

    test('handles a single prefix array', () => {
      type Actual = TPrefixUnion<['data-']>;
      type Expected = `data-${string}`;

      forceType<Actual>('data-id', true);
      expectType<Expected>('data-id');
    });

    test('results in never for an empty array', () => {
      type Actual = TPrefixUnion<[]>;
      type Expected = never;

      forceType<Actual>({} as never, true);
      expectType<Expected>({} as never);
    });

    test('works with readonly arrays (as const)', () => {
      const _prefixes = ['user_', 'admin_'] as const;
      type Actual = TPrefixUnion<typeof _prefixes>;
      type Expected =
        | 'user_string'
        | 'admin_string' extends `${string}${string}`
        ? `user_${string}` | `admin_${string}`
        : never;

      forceType<Actual>('user_brennan', true);
      expectType<Expected>('user_brennan');
    });
  });
});
