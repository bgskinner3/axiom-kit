import { expectType } from 'jest-tsd';
import type { TEqual, TExpect } from '../../test-utils';
import type {
  TNonNullableDeep,
  TNormalizeValue,
  TNormalizedBigIntToNumber,
} from '../../../src';
import { forceType } from '../../test-utils';

/**
 * GENERAL TESTSSS
 *
 *   TNonNullableDeep, TNormalizeValue, TNormalizedBigIntToNumber, TESTS
 *
 * These utilities are used to sanitize and normalize deeply nested data
 * structures before runtime usage, API consumption, or serialization.
 *
 * - TNonNullableDeep
 *   Removes `null` and `undefined` recursively from all fields.
 *   Used for ensuring fully-initialized runtime data (API responses, validated state).
 *
 * - TNormalizeValue
 *   Recursively transforms values in a structure (e.g. bigint → number).
 *   Used for preparing data for JSON serialization or frontend consumption.
 *
 * - TNormalizedBigIntToNumber
 *   Internal mapped helper for TNormalizeValue.
 *   Ensures consistent recursive application across object keys.
 *
 * SUMMARY:
 * NonNullable → data sanitization
 * NormalizeValue → type conversion
 * BigIntMapper → structural recursion helper
 */

// ====================================================================================================
// ====================================================================================================
// ====================================================================================================

/**
 * TNonNullableDeep TESTS
 */

type TNullableBase = {
  id: string | null;
  profile?: {
    bio: string | undefined;
    age: number | null | undefined;
  };
  tags: (string | null)[];
};

type TNND_Actual1 = TNonNullableDeep<TNullableBase>;
type TNND_Expected1 = {
  id: string;
  profile: {
    bio: string;
    age: number;
  };
  tags: string[];
};

export type _tnnd1 = TExpect<TEqual<TNND_Actual1, TNND_Expected1>>;

const nndVal1: unknown = {};
forceType<TNND_Actual1>(nndVal1);
expectType<TNND_Expected1>(nndVal1);

// ------------------------------------------------------------------------

type TArrayOfObjectsBase = {
  items: { id: string | null }[];
};
type TNND_Actual2 = TNonNullableDeep<TArrayOfObjectsBase>;
type TNND_Expected2 = {
  items: { id: string }[];
};
export type _tnnd2 = TExpect<TEqual<TNND_Actual2, TNND_Expected2>>;
const nndVal2: unknown = {};
forceType<TNND_Actual2>(nndVal2);
expectType<TNND_Expected2>(nndVal2);

// ====================================================================================================
// ====================================================================================================
// ====================================================================================================

/**
 * TNormalizeValue TESTS
 */
type TRawTx = {
  hash: string;
  values: [bigint, bigint]; // Tuple check
  meta: {
    gasPrice: bigint;
    nonce: bigint | null;
  };
};

type TNV_Actual1 = TNormalizeValue<TRawTx>;
type TNV_Expected1 = {
  hash: string;
  values: [number, number];
  meta: {
    gasPrice: number;
    nonce: number | null;
  };
};

export type _tnv1 = TExpect<TEqual<TNV_Actual1, TNV_Expected1>>;

const nvVal1: unknown = {
  hash: '0x1',
  values: [1, 2],
  meta: { gasPrice: 10, nonce: 1 },
};
forceType<TNV_Actual1>(nvVal1);
expectType<TNV_Expected1>(nvVal1);

// ------------------------------------------------------------------------

type TReadonlyBase = {
  readonly amount: bigint;
  readonly tags: readonly bigint[];
};
type TNV_Actual2 = TNormalizeValue<TReadonlyBase>;
type TNV_Expected2 = {
  readonly amount: number;
  readonly tags: readonly number[];
};
export type _tnv2 = TExpect<TEqual<TNV_Actual2, TNV_Expected2>>;
const nvVal2: unknown = {};
forceType<TNV_Actual2>(nvVal2);
expectType<TNV_Expected2>(nvVal2);
// ====================================================================================================
// ====================================================================================================
// ====================================================================================================

/**
 * TNormalizedBigIntToNumber TESTS
 */
type TSimpleConfig = {
  retryLimit: bigint;
  timeout: bigint;
};

type TNBITN_Actual1 = TNormalizedBigIntToNumber<TSimpleConfig>;
type TNBITN_Expected1 = {
  retryLimit: number;
  timeout: number;
};

export type _tnbitn1 = TExpect<TEqual<TNBITN_Actual1, TNBITN_Expected1>>;

const bitnVal1: unknown = { retryLimit: 3, timeout: 5000 };
forceType<TNBITN_Actual1>(bitnVal1);
expectType<TNBITN_Expected1>(bitnVal1);

// ------------------------------------------------------------------------

type TOptionalBigInt = {
  val?: bigint;
  maybeVal: bigint | null;
};
type TNBITN_Actual2 = TNormalizedBigIntToNumber<TOptionalBigInt>;
type TNBITN_Expected2 = {
  val?: number;
  maybeVal: number | null;
};
export type _tnbitn2 = TExpect<TEqual<TNBITN_Actual2, TNBITN_Expected2>>;
