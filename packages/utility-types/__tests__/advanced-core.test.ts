import type { TExpect, TEqual } from '../src';
import { forceType, expectType } from '../src';
import type {
  TUnionResolver,
  TOmitMethods,
  TPrettify,
  TRequireIf,
  TIfValueRequire,
} from '../src';

describe('Core Advanced Util Types', () => {
  describe('TUnionResolver', () => {
    test('distributes a union of literals into a union of arrays', () => {
      type Actual = TUnionResolver<'a' | 'b'>;
      type Expected = { type: 'a' }[] | { type: 'b' }[];

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      forceType<Actual>([{ type: 'a' }], _check);
      expectType<Expected>([{ type: 'b' }]);
    });

    test('handles mixed primitives (string, number, boolean)', () => {
      type Actual = TUnionResolver<'a' | 1 | true>;
      type Expected = { type: 'a' }[] | { type: 1 }[] | { type: true }[];

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      forceType<Actual>([{ type: 1 }], _check);
      expectType<Expected>([{ type: 1 }]);
    });

    test('results in never for never input', () => {
      type Actual = TUnionResolver<never>;
      const _check: TExpect<TEqual<Actual, never>> = true;
      forceType<Actual>('', _check);
    });

    test('handles object unions distributively', () => {
      type ObjA = { a: 1 };
      type ObjB = { b: 2 };
      type Actual = TUnionResolver<ObjA | ObjB>;
      type Expected = { type: ObjA }[] | { type: ObjB }[];

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      forceType<Actual>([{ type: { a: 1 } }], _check);
      expectType<Expected>([{ type: { a: 1 } }]);
    });
  });

  describe('TOmitMethods', () => {
    test('strips standard and arrow function properties', () => {
      type Actual = TOmitMethods<{
        a: string;
        b: number;
        c: () => void;
        d: (x: number) => string;
      }>;
      type Expected = { a: string; b: number };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      forceType<Actual>({ a: 'test', b: 1 }, _check);
      expectType<Expected>({ a: 'hi', b: 2 });
    });

    test('strips optional methods while preserving optional primitives', () => {
      type Actual = TOmitMethods<{ a?: () => void; b: string; c?: number }>;
      type Expected = { b: string; c?: number };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      forceType<Actual>({ b: 'valid' }, _check);
      expectType<Expected>({ b: 'valid' });
    });

    test('preserves properties that are unions of functions and primitives', () => {
      // 💡 This is a critical edge case: if a value COULD be a string,
      // it is NOT strictly a method and should be preserved.
      type Actual = TOmitMethods<{ a: string | (() => void); b: number }>;
      type Expected = { a: string | (() => void); b: number };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('preserves metadata (readonly) on remaining properties', () => {
      type Actual = TOmitMethods<{
        readonly a: string;
        readonly b: () => void;
        c?: () => number;
        d: boolean;
      }>;
      type Expected = { readonly a: string; d: boolean };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('performs shallow removal only', () => {
      type Actual = TOmitMethods<{
        a: { x: () => void; y: string };
        b: () => void;
      }>;
      type Expected = { a: { x: () => void; y: string } };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });
  });
  describe('Logic Utilities: TRequireIf', () => {
    type Base = {
      value: bigint;
      unit: 'eth' | 'gwei' | 'token';
      decimals?: number;
    };

    test('creates a discriminated union based on the trigger value', () => {
      type Actual = TRequireIf<Base, 'unit', 'token', 'decimals'>;
      type Expected =
        | { value: bigint; unit: 'token'; decimals: number }
        | { value: bigint; unit: 'eth' | 'gwei'; decimals?: never };

      // We use TPrettify in the check to ensure intersections match flat objects
      const _check: TExpect<TEqual<TPrettify<Actual>, TPrettify<Expected>>> =
        true;

      const val: unknown = { value: 100n, unit: 'token', decimals: 18 };
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('strictly enforces "decimals: number" in the trigger branch', () => {
      type TriggerBranch = Extract<
        TRequireIf<Base, 'unit', 'token', 'decimals'>,
        { unit: 'token' }
      >;
      type Expected = { value: bigint; unit: 'token'; decimals: number };

      const _check: TExpect<
        TEqual<TPrettify<TriggerBranch>, TPrettify<Expected>>
      > = true;
      const val: unknown = {};
      forceType<TriggerBranch>(val, _check);
      expectType<Expected>(val);
    });

    test('strictly forbids "decimals" in the exclusion branch', () => {
      type ExclusionBranch = Extract<
        TRequireIf<Base, 'unit', 'token', 'decimals'>,
        { unit: 'eth' | 'gwei' }
      >;
      type Expected = {
        value: bigint;
        unit: 'eth' | 'gwei';
        decimals?: undefined;
      };

      const _check: TExpect<
        TEqual<TPrettify<ExclusionBranch>, TPrettify<Expected>>
      > = true;

      const val = { value: 1n, unit: 'eth' };
      forceType<ExclusionBranch>(val, _check);
      expectType<Expected>(val);
    });

    test('handles optional trigger properties', () => {
      type Actual = TRequireIf<
        { mode?: 'a' | 'b'; flag?: boolean },
        'mode',
        'b',
        'flag'
      >;
      type Expected =
        | { mode: 'b'; flag: boolean }
        | { mode?: 'a'; flag?: undefined };

      const _check: TExpect<TEqual<TPrettify<Actual>, TPrettify<Expected>>> =
        true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('handles multiple non-trigger values correctly', () => {
      type Actual = TRequireIf<
        { mode: 'a' | 'b' | 'c'; flag?: boolean },
        'mode',
        'c',
        'flag'
      >;
      type Expected =
        | { mode: 'c'; flag: boolean }
        | { mode: 'a' | 'b'; flag?: never };

      const _check: TExpect<TEqual<TPrettify<Actual>, TPrettify<Expected>>> =
        true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('handles missing properties by injecting "unknown" (Edge Case)', () => {
      // If 'flag' doesn't exist on base, it's injected as unknown in the trigger branch
      type Actual = TRequireIf<{ mode: 'a' | 'b' }, 'mode', 'b', 'flag'>;
      type Expected =
        | { mode: 'b'; flag: unknown }
        | { mode: 'a'; flag?: never };

      const _check: TExpect<TEqual<TPrettify<Actual>, TPrettify<Expected>>> =
        true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });
  });
  describe('Configuration Utilities: TIfValueRequire', () => {
    type TAppConfig = {
      auth: { oidc: string; guest: string };
      storage: { s3: string; local: string };
    };

    test('creates a discriminated union based on schema values', () => {
      // If auth is 'oidc', storage MUST be one of its keys.
      type Actual = TIfValueRequire<TAppConfig, 'auth', 'oidc', 'storage'>;
      type Expected =
        | { auth: 'oidc'; storage: 's3' | 'local' }
        | { auth?: 'guest'; storage?: undefined };

      const _check: TExpect<TEqual<TPrettify<Actual>, TPrettify<Expected>>> =
        true;

      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('strictly enforces storage keys when trigger is active', () => {
      type Actual = TIfValueRequire<TAppConfig, 'auth', 'oidc', 'storage'>;
      type Triggered = Extract<Actual, { auth: 'oidc' }>;
      type Expected = { auth: 'oidc'; storage: 's3' | 'local' };

      const _check: TExpect<TEqual<TPrettify<Triggered>, TPrettify<Expected>>> =
        true;
      forceType<Triggered>({ auth: 'oidc', storage: 'local' }, _check);
      expectType<Expected>({ auth: 'oidc', storage: 'local' });
    });

    test('forbids storage key when trigger is inactive', () => {
      type Actual = TIfValueRequire<TAppConfig, 'auth', 'oidc', 'storage'>;
      type Inactive = Extract<Actual, { auth?: 'guest' }>;
      type Expected = { auth?: 'guest'; storage?: undefined };

      const _check: TExpect<TEqual<TPrettify<Inactive>, TPrettify<Expected>>> =
        true;
      forceType<Actual>('', _check);
      const val = { auth: 'guest' } as Inactive;
      // @ts-expect-error - storage must be undefined when auth is guest
      val.storage = 's3';
    });

    test('handles multi-value categories and complex unions', () => {
      type MultiConfig = {
        mode: { a: ''; b: ''; c: '' };
        feature: { x: ''; y: '' };
      };
      type Actual = TIfValueRequire<MultiConfig, 'mode', 'a', 'feature'>;
      type Expected =
        | { mode: 'a'; feature: 'x' | 'y' }
        | { mode?: 'b' | 'c'; feature?: undefined };

      const _check: TExpect<TEqual<TPrettify<Actual>, TPrettify<Expected>>> =
        true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });
  });
});
