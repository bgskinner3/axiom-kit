import { expectType } from 'jest-tsd';
import type { TEqual, TExpect } from '../../test-utils';
import type {
  TRecursivePartial,
  TRecursiveRequired,
  TRecursiveReadonly,
} from '../../../src';
import { forceType } from '../../test-utils';

/**
 * RECUREVIE TESTSSS
 *
 * TRecursivePartial , TRecursiveRequired, TRecursiveReadonly TESTS
 *
 * These utilities are used for deeply nested object structures such as
 * API payloads, app state, and configuration objects.
 *
 * - TRecursivePartial
 *   Used for partial updates (PATCH requests, form drafts, incremental state updates)
 *   where only some nested fields are provided.
 *
 * - TRecursiveRequired
 *   Used for fully validated objects (API responses, config validation)
 *   where all nested fields must exist.
 *
 * - TRecursiveReadonly
 *   Used for immutable structures (state snapshots, Redux stores, cached data)
 *   where deep mutation must be prevented.
 *
 * SUMMARY:
 * Partial → flexible updates
 * Required → strict completeness
 * Readonly → deep immutability
 */
// mOCK

// **** TESTING ALL THREE ***
// I. Multi-level Nesting TRecursivePartial

type TRecurPartial_Actual1 = TRecursivePartial<{ a: { b: { c: number } } }>;
type TRecurPartial_Expected1 = { a?: { b?: { c?: number } } };
export type _trp1 = TExpect<
  TEqual<TRecurPartial_Actual1, TRecurPartial_Expected1>
>;
const recursivePartial1: unknown = {};
forceType<TRecurPartial_Actual1>(recursivePartial1);
expectType<TRecurPartial_Expected1>(recursivePartial1);

// ------------------------------------------------------------------------

// Case: Arrays with Objects
type TRecurPartial_Actual2 = TRecursivePartial<{ list: { id: number }[] }>;
type TRecurPartial_Expected2 = { list?: { id?: number }[] };
export type _trp2 = TExpect<
  TEqual<TRecurPartial_Actual2, TRecurPartial_Expected2>
>;

const recursivePartial2: unknown = {};
forceType<TRecurPartial_Actual2>(recursivePartial2);
expectType<TRecurPartial_Expected2>(recursivePartial2);

// ------------------------------------------------------------------------

// Edge Case: Already Partial (Idempotency)
type TRecurPartial_Actual3 = TRecursivePartial<{ a?: string }>;
type TRecurPartial_Expected3 = { a?: string };
export type _trp3 = TExpect<
  TEqual<TRecurPartial_Actual3, TRecurPartial_Expected3>
>;

const recursivePartial3: unknown = {};
forceType<TRecurPartial_Actual3>(recursivePartial3);
expectType<TRecurPartial_Expected3>(recursivePartial3);

// ------------------------------------------------------------------------
//  confirms  'extends Function' check)
// is correctly identifying and skipping the function body.

type TRecurPartial_Fn_Actual = TRecursivePartial<{
  save: (id: string) => void;
}>;
type TRecurPartial_Fn_Expected = { save?: (id: string) => void };
export type _trp_fn = TExpect<
  TEqual<TRecurPartial_Fn_Actual, TRecurPartial_Fn_Expected>
>;

const recursivePartial4: unknown = {};
forceType<TRecurPartial_Fn_Actual>(recursivePartial4);
expectType<TRecurPartial_Fn_Expected>(recursivePartial4);

// ====================================================================================================
// ====================================================================================================
// ====================================================================================================

// ------------------------------------------------------------------------
// TRecursiveRequired: Deep Stripping
type TRecusRequired_Actual1 = TRecursiveRequired<{ a?: { b?: number } }>;
type TRecusRequired_Expected1 = { a: { b: number } };
export type _trr1 = TExpect<
  TEqual<TRecusRequired_Actual1, TRecusRequired_Expected1>
>;

const recursiveRequired1: unknown = {};
forceType<TRecusRequired_Actual1>(recursiveRequired1);
expectType<TRecusRequired_Expected1>(recursiveRequired1);

// ------------------------------------------------------------------------
// Case: Mixed Nullables
type TRecusRequired_Actual2 = TRecursiveRequired<{ a?: string | null }>;
type TRecusRequired_Expected2 = { a: string | null }; // '?' is gone, 'null' remains
export type _trr2 = TExpect<
  TEqual<TRecusRequired_Actual2, TRecusRequired_Expected2>
>;

const recursiveRequired2: unknown = {};
forceType<TRecusRequired_Actual2>(recursiveRequired2);
expectType<TRecusRequired_Expected2>(recursiveRequired2);

// ------------------------------------------------------------------------
// Edge Case: Functions (Protection check)
type TRecusRequired_Actual3 = TRecursiveRequired<{ fn?: (x?: string) => void }>;
type TRecusRequired_Expected3 = { fn: (x?: string) => void };
export type _trr3 = TExpect<
  TEqual<TRecusRequired_Actual3, TRecusRequired_Expected3>
>;

const recursiveRequired3: unknown = {};
forceType<TRecusRequired_Actual3>(recursiveRequired3);
expectType<TRecusRequired_Expected3>(recursiveRequired3);

// ------------------------------------------------------------------------
// NOTE**
// If your utility "dives" into Date, it will try to make getTime() required
// and the types won't match Date anymore. This test ensures you didn't break it.
type TRecusRequired_BuiltIn_Actual = TRecursiveRequired<{ updated?: Date }>;
type TRecusRequired_BuiltIn_Expected = { updated: Date };
export type _trr_builtin = TExpect<
  TEqual<TRecusRequired_BuiltIn_Actual, TRecusRequired_BuiltIn_Expected>
>;

const recursiveRequired4: unknown = {};
forceType<TRecusRequired_BuiltIn_Actual>(recursiveRequired4);
expectType<TRecusRequired_BuiltIn_Expected>(recursiveRequired4);

// ====================================================================================================
// ====================================================================================================
// ====================================================================================================

// Case: Recursive Readonly
type TRecrReadonlyActual1 = TRecursiveReadonly<{ a: { b: number } }>;
type TRecrReadonlyExpected1 = { readonly a: { readonly b: number } };
export type _trrd1 = TExpect<
  TEqual<TRecrReadonlyActual1, TRecrReadonlyExpected1>
>;

const recursiveReadonly1: unknown = {};
forceType<TRecrReadonlyActual1>(recursiveReadonly1);
expectType<TRecrReadonlyExpected1>(recursiveReadonly1);

// ------------------------------------------------------------------------

// Case: Array to ReadonlyArray Pivot
type TRecrReadonlyActual2 = TRecursiveReadonly<{ tags: string[] }>;
type TRecrReadonlyExpected2 = { readonly tags: ReadonlyArray<string> };
export type _trrd2 = TExpect<
  TEqual<TRecrReadonlyActual2, TRecrReadonlyExpected2>
>;

const recursiveReadOnly2: unknown = {};
forceType<TRecrReadonlyActual2>(recursiveReadOnly2);
expectType<TRecrReadonlyExpected2>(recursiveReadOnly2);

// ------------------------------------------------------------------------

// Edge Case: Mutation Block (Structural check)
type TRecrReadonlyActual3 =
  TRecursiveReadonly<number[]> extends { push: unknown } ? true : false;
type TRecrReadonlyExpected3 = false;
export type _trrd3 = TExpect<
  TEqual<TRecrReadonlyActual3, TRecrReadonlyExpected3>
>;

const recursiveRReadonly3: unknown = {};
forceType<TRecrReadonlyActual3>(recursiveRReadonly3);
expectType<TRecrReadonlyExpected3>(recursiveRReadonly3);

// ------------------------------------------------------------------------
// **proves  recursion "dives" back into the array's 'infer U' type.
type TRecrReadonly_DeepArr_Actual = TRecursiveReadonly<{
  users: { id: number }[];
}>;
type TRecrReadonly_DeepArr_Expected = {
  readonly users: ReadonlyArray<{ readonly id: number }>;
};
export type _trrd_deep_arr = TExpect<
  TEqual<TRecrReadonly_DeepArr_Actual, TRecrReadonly_DeepArr_Expected>
>;

const recursiveRReadonly4: unknown = {};
forceType<TRecrReadonly_DeepArr_Actual>(recursiveRReadonly4);
expectType<TRecrReadonly_DeepArr_Expected>(recursiveRReadonly4);
