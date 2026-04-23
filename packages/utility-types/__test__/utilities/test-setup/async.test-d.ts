import { expectType } from 'jest-tsd';
import type { TEqual, TExpect } from '../../test-utils';
import type { TPromiseType, TPromisify } from '../../../src';
import { forceType } from '../../test-utils';

/**
 * ASYNC TRANSFORMATION TESTS
 *
 * TPromiseType, TPromisify
 *
 * USE CASES
 *
 * These utilities are used for modeling and transforming asynchronous data
 * flows in type-safe API layers, service clients, and async abstractions.
 *
 * - TPromisify
 *   Wraps each property of an object in a Promise.
 *   Used for async service layers, lazy-loading APIs, and proxy-based
 *   data fetchers where each field resolves independently.
 *
 * - TPromiseType
 *   Extracts the resolved value from a Promise type.
 *   Used for unwrapping API responses, async function return types,
 *   and inferred result handling in async pipelines.
 *
 * SUMMARY:
 * Promisify → create async shape
 * PromiseType → extract resolved value
 */

// I. TPromiseType

// Case 1: Standard extraction
type TPT_Actual1 = TPromiseType<Promise<string>>;
type TPT_Expected1 = string;
export type _tpt1 = TExpect<TEqual<TPT_Actual1, TPT_Expected1>>;
const promiseValOne: unknown = '';
forceType<TPT_Actual1>(promiseValOne);
expectType<TPT_Expected1>(promiseValOne);

// ====================================================================================================

// Case 2: Object extraction
type TPT_Actual2 = TPromiseType<Promise<{ id: number; name: string }>>;
type TPT_Expected2 = { id: number; name: string };
export type _tpt2 = TExpect<TEqual<TPT_Actual2, TPT_Expected2>>;

const promiseValTwo: unknown = {};
forceType<TPT_Actual2>(promiseValTwo);
expectType<TPT_Expected2>(promiseValTwo);

// ====================================================================================================

// Case 3: Nested Promise (Should only unwrap one level)
// Note: Use Awaited<T> if you want recursive unwrapping, but your implementation
// currently only unwraps one level.
type TPT_Actual3 = TPromiseType<Promise<Promise<number>>>;
type TPT_Expected3 = Promise<number>;
export type _tpt3 = TExpect<TEqual<TPT_Actual3, TPT_Expected3>>;

const promiseValThree: unknown = 0;
forceType<TPT_Actual3>(promiseValThree);
expectType<TPT_Expected3>(promiseValThree);

// ====================================================================================================

// Case 4: Edge Case - Non-promise input (Should resolve to never)
type TPT_Actual4 = TPromiseType<string>;
type TPT_Expected4 = never;
export type _tpt4 = TExpect<TEqual<TPT_Actual4, TPT_Expected4>>;

const promiseValFour: unknown = '';
forceType<TPT_Actual4>(promiseValFour);
expectType<TPT_Expected4>(promiseValFour);

// ====================================================================================================
// ====================================================================================================
// ====================================================================================================

// I. TPromisify

type UserData = {
  id: string;
  age: number;
  isActive: boolean;
};

// Case 1: Standard object mapping
type TP_Actual1 = TPromisify<UserData>;
type TP_Expected1 = {
  id: Promise<string>;
  age: Promise<number>;
  isActive: Promise<boolean>;
};
export type _tp1 = TExpect<TEqual<TP_Actual1, TP_Expected1>>;

const promisifyOne: unknown = '';
forceType<TP_Actual1>(promisifyOne);
expectType<TP_Expected1>(promisifyOne);

// ====================================================================================================

// Case 2: Empty object
type TP_Actual2 = TPromisify<object>;
type TP_Expected2 = object;
export type _tp2 = TExpect<TEqual<TP_Actual2, TP_Expected2>>;

const promisifyTwo: unknown = '';
forceType<TP_Actual1>(promisifyTwo);
expectType<TP_Expected1>(promisifyTwo);

// ====================================================================================================

// Case 3: Optional properties
type TP_Actual3 = TPromisify<{ name?: string }>;
type TP_Expected3 = { name?: Promise<string | undefined> };
// Note: Mapped types preserve optionality.
export type _tp3 = TExpect<TEqual<TP_Actual3, TP_Expected3>>;

const promisifyThree: unknown = '';
forceType<TP_Actual3>(promisifyThree);
expectType<TP_Expected3>(promisifyThree);
