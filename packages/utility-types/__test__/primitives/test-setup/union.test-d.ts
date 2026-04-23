import { expectType } from 'jest-tsd';
import type { TEqual, TExpect } from '../../test-utils';
import type { TUnionToIntersection, TPrettify } from '../../../src';

/**
 * TUnionToIntersection Tests
 *
 * USE CASE
 * 1. Merging Distributed Configurations: Transforming a union of disjoint objects
 *    (e.g., from a plugin system or dynamic settings) into a single, cohesive interface.
 *
 *
 * 2. Function Overloading: Converting a union of function signatures into an
 *    overloaded function type, allowing a single function to handle multiple input/output types.
 *
 *
 * 3. Class Composition: Intersecting multiple class instances or constructor types
 *    to represent a "Mixin" or a combined capability object.
 *
 *
 * 4. Strict Requirement Enforcement: Ensuring that a value must satisfy every member
 *    of a union simultaneously (often resulting in 'never' for incompatible primitives).
 */
// merging config objects
type ObjectUnion = { a: string } | { b: number } | { c: boolean };
type IntersectedObj = TUnionToIntersection<ObjectUnion>;

// *** We use TPrettify to flatten the & result into a single object for comparison **
type ExpectedObj = { a: string; b: number; c: boolean };
export type _t1 = TExpect<TEqual<TPrettify<IntersectedObj>, ExpectedObj>>;
expectType<ExpectedObj>({} as TPrettify<IntersectedObj>);

// ----------------------
//  When you intersect functions, they become overloads TESTS
type FuncA = (a: string) => string;
type FuncB = (b: number) => number;
type CombinedFunc = TUnionToIntersection<FuncA | FuncB>;

export type _t2 = TExpect<
  CombinedFunc extends { (a: string): string; (b: number): number }
    ? true
    : false
>;

// ----------------------
//  incompatible primitives results in 'never' TESTS
type PrimitiveUnion = 'a' | 'b' | 'c';
type IntersectedPrim = TUnionToIntersection<PrimitiveUnion>;
// 'a' & 'b' & 'c' is impossible, so it should be never
export type _t3 = TExpect<TEqual<IntersectedPrim, never>>;

// ----------------------
// Mixed INSTANCE TESTS
class Alpha {
  a = 1;
}
class Beta {
  b = 2;
}
type IntersectedClass = TUnionToIntersection<Alpha | Beta>;
export type _t4 = TExpect<IntersectedClass extends Alpha & Beta ? true : false>;

// ----------------------

// If there is only one member, it should return that member unchanged.
type Single = { id: number };
type Result = TUnionToIntersection<Single>;
export type _t5 = TExpect<TEqual<Result, Single>>;
