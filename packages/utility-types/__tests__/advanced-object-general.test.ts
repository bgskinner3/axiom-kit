import type { TExpect, TEqual } from '../src';
import { forceType, expectType } from '../src';
import type {
  TNonNullableDeep,
  TNormalizeValue,
  TNormalizedBigIntToNumber,
  TPrettify,
} from '../src';

describe('Deep Normalization Utilities', () => {
  describe('TNonNullableDeep', () => {
    test('recursively removes null and undefined from nested objects and arrays', () => {
      type Base = {
        id: string | null;
        profile?: { bio: string | undefined; age: number | null | undefined };
        tags: (string | null)[];
      };
      type Actual = TPrettify<TNonNullableDeep<Base>>;
      type Expected = {
        id: string;
        profile: { bio: string; age: number };
        tags: string[];
      };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('recursively cleans objects within arrays', () => {
      type Base = { items: { id: string | null }[] };
      type Actual = TNonNullableDeep<Base>;
      type Expected = { items: { id: string }[] };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });
  });

  describe('TNormalizeValue (BigInt -> Number)', () => {
    test('converts BigInts in complex transactions including tuples', () => {
      type TRawTx = {
        hash: string;
        values: [bigint, bigint];
        meta: { gasPrice: bigint; nonce: bigint | null };
      };
      type Actual = TPrettify<TNormalizeValue<TRawTx>>;
      type Expected = {
        hash: string;
        values: [number, number];
        meta: { gasPrice: number; nonce: number | null };
      };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {
        hash: '0x1',
        values: [1, 2],
        meta: { gasPrice: 10, nonce: 1 },
      };

      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('preserves readonly modifiers while converting primitives', () => {
      type Base = { readonly amount: bigint; readonly tags: readonly bigint[] };
      type Actual = TNormalizeValue<Base>;
      type Expected = {
        readonly amount: number;
        readonly tags: readonly number[];
      };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      forceType<Actual>({ amount: 1, tags: [1] }, _check);
      expectType<Expected>({ amount: 1, tags: [1] });
    });
  });

  describe('TNormalizedBigIntToNumber', () => {
    test('simple conversion for configuration objects', () => {
      type Base = { retryLimit: bigint; timeout: bigint };
      type Actual = TNormalizedBigIntToNumber<Base>;
      type Expected = { retryLimit: number; timeout: number };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });

    test('handles optional and nullable BigInt fields', () => {
      type Base = { val?: bigint; maybeVal: bigint | null };
      type Actual = TNormalizedBigIntToNumber<Base>;
      type Expected = { val?: number; maybeVal: number | null };

      const _check: TExpect<TEqual<Actual, Expected>> = true;
      const val: unknown = {};
      forceType<Actual>(val, _check);
      expectType<Expected>(val);
    });
  });
});
