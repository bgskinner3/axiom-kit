import { expectType } from 'jest-tsd';
import type { TEqual, TExpect, TNormalizeTypeValue } from '../../test-utils';
import type { TXOR, TTupleToIntersection } from '../../../src';
import { forceType } from '../../test-utils';

/**
 * TXOR TESTS
 *
 * USECASE --
 * We have two distinct login methods. We must ensure the developer
 * cannot provide a mix of credentials (e.g., an OTP with a Google Token).
 */

// XOR TEsting shapes
type TEmailAuth = { email: string; otp: string };
type TSocialAuth = { provider: 'google' | 'apple'; token: string };
type TAuthRequest = TXOR<TEmailAuth, TSocialAuth>;

type TActual1 = TXOR<TEmailAuth, TSocialAuth>;

type TExpected1 =
  | (TEmailAuth & { provider?: never; token?: never })
  | (TSocialAuth & { email?: never; otp?: never });

export type _tx1 = TExpect<TEqual<TActual1, TExpected1>>;
const xorValOne: unknown = {};
forceType<TActual1>(xorValOne);
expectType<TExpected1>(xorValOne);

// =========================================

// ---------------------------------------------------------
// EXTRACT TESTS
// ---------------------------------------------------------
type TEmailOnly = Extract<TAuthRequest, { email: string }>;
export type _tx2 = TExpect<
  TEqual<TEmailOnly, TEmailAuth & { provider?: never; token?: never }>
>;

// =========================================
// EDGCASES
// Overlapping keys
type A = { id: string; a: number };
type B = { id: string; b: boolean };

type TOverlap = TXOR<A, B>;

type TExpectedOverlap = (A & { b?: never }) | (B & { a?: never });

export type _tx3 = TExpect<TEqual<TOverlap, TExpectedOverlap>>;

const xorValTwo: unknown = {};
forceType<TOverlap>(xorValTwo);
expectType<TExpectedOverlap>(xorValTwo);

// =========================================
// Shared key with DIFFERENT types
type A2 = { id: string };
type B2 = { id: number };

type TConflict = TXOR<A2, B2>;
type TExpectedConflict = A2 | B2;

export type _tx4 = TExpect<
  TEqual<TNormalizeTypeValue<TConflict>, TNormalizeTypeValue<TExpectedConflict>>
>;

// =========================================
// Optional properties edge case
type A3 = { a?: string };
type B3 = { b?: number };

type TOptional = TXOR<A3, B3>;

type TExpectedOptional = (A3 & { b?: never }) | (B3 & { a?: never });

export type _tx5 = TExpect<TEqual<TOptional, TExpectedOptional>>;

const xorValFour: unknown = {};
forceType<TOptional>(xorValFour);
expectType<TExpectedOptional>(xorValFour);

// ====================================================================================================
// ====================================================================================================
// ====================================================================================================

/**
 * TTupleToIntersection TESTS
 *
 * USECASE --
 * Merging multiple configuration layers or plugin results into a single
 * strictly typed object.
 */

// 1. Single Member
type TSingle = [{ a: string }];
type TActualSingle = TTupleToIntersection<TSingle>;
type TExpectedSingle = { a: string };

export type _tt1 = TExpect<TEqual<TActualSingle, TExpectedSingle>>;

// 2. Dual Members (Most Common)
type TDuo = [{ a: string }, { b: number }];
type TActualDuo = TTupleToIntersection<TDuo>;
type TExpectedDuo = { a: string } & { b: number };

export type _tt2 = TExpect<TEqual<TActualDuo, TExpectedDuo>>;

const duoVal: unknown = {};
forceType<TActualDuo>(duoVal);
expectType<TExpectedDuo>(duoVal);

// 3. Max Explicit Members (5-ary)
type TPenta = [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }, { e: 5 }];
type TActualPenta = TTupleToIntersection<TPenta>;
type TExpectedPenta = { a: 1 } & { b: 2 } & { c: 3 } & { d: 4 } & { e: 5 };

export type _tt3 = TExpect<TEqual<TActualPenta, TExpectedPenta>>;

// 4. Fallback (Large Tuple > 5)
// Logic: T extends (infer U)[] ? U : never
// When the tuple is too large or generic, it should resolve to the union of its elements
type THex = [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }, { e: 5 }, { f: 6 }];
type TActualHex = TTupleToIntersection<THex>;

// Note: In the fallback case, it becomes the union of the elements
// because it can no longer safely map the specific indices.
type TExpectedHex =
  | { a: 1 }
  | { b: 2 }
  | { c: 3 }
  | { d: 4 }
  | { e: 5 }
  | { f: 6 };

export type _tt4 = TExpect<TEqual<TActualHex, TExpectedHex>>;

// 5. Empty Tuple Edge Case
type TEmpty = [];
type TActualEmpty = TTupleToIntersection<TEmpty>;
export type _tt5 = TExpect<TEqual<TActualEmpty, never>>;

// 6. Intersection of Overlapping Keys
type TOverlapA = [{ id: string; name: string }, { id: string; age: number }];
type TActualOverlap = TTupleToIntersection<TOverlapA>;
type TExpectedOverlapA = { id: string; name: string } & {
  id: string;
  age: number;
};

export type _tt6 = TExpect<TEqual<TActualOverlap, TExpectedOverlapA>>;

const overlapVal: unknown = {};
forceType<TActualOverlap>(overlapVal);
expectType<TExpectedOverlapA>(overlapVal);
