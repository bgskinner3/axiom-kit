import { expectType } from 'jest-tsd';
import type { TEqual, TExpect } from '../../test-utils';
import type {
  TCreateDiff,
  TMerge,
  TPrettify,
  TBigIntToggle,
} from '../../../src/primitives/logic';
import { forceType } from '../../test-utils';
// ==========================================
// TPrettify Tests
// ==========================================

// Without Prettify: { a: number } & { b: string }
// With Prettify: { a: number; b: string }
type Intersected = { a: number } & { b: string };
type Prettified = TPrettify<Intersected>;
type ExpectedPretty = { a: number; b: string };
export type _t1 = TExpect<TEqual<Prettified, ExpectedPretty>>;
expectType<ExpectedPretty>({} as Prettified);

// Ensures Prettify doesn't lose data in nested structures
type Deep = { user: { id: number } & { name: string } };
type PrettifiedDeep = TPrettify<Deep>;
export type _t2 = TExpect<
  TEqual<PrettifiedDeep, { user: { id: number } & { name: string } }>
>;

// ==========================================
// TMerge Tests
// ==========================================

// Case: Basic Override (O2 wins on conflicts)
type Base = { id: number; name: string; active: boolean };
type Update = { id: string; active: string };
type Merged = TPrettify<TMerge<Base, Update>>;
type ExpectedMerge = { id: string; name: string; active: string };
export type _t3 = TExpect<TEqual<Merged, ExpectedMerge>>;
expectType<ExpectedMerge>({} as Merged);

// Case 2: Additive Merge (New keys added)
type Additive = TPrettify<TMerge<{ a: 1 }, { b: 2 }>>;
export type _t4 = TExpect<TEqual<Additive, { a: 1; b: 2 }>>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type NoChange = TPrettify<TMerge<{ a: 1 }, {}>>;
export type _t5 = TExpect<TEqual<NoChange, { a: 1 }>>;

// ==========================================
// TCreateDiff Tests
// ==========================================

type A = { id: number; common: string; site: string };
type B = { age: number; common: string; site: string };
type Diff = TPrettify<TCreateDiff<A, B>>;
type ExpectedDiff = { id: number; age: number };
export type _t6 = TExpect<TEqual<Diff, ExpectedDiff>>;
expectType<ExpectedDiff>({} as Diff);

// TCreateDiff strips keys based on the NAME, regardless of the VALUE type.
type C = { id: string; value: string };
type D = { id: number; other: number };
type DiffTypeMismatch = TPrettify<TCreateDiff<C, D>>;
// 'id' is in both, so it is removed, even though types (string vs number) differ.
export type _t7 = TExpect<
  TEqual<DiffTypeMismatch, { value: string; other: number }>
>;

type UniqueA = { a: 1 };
type UniqueB = { b: 2 };
type TotalDiff = TPrettify<TCreateDiff<UniqueA, UniqueB>>;
export type _t8 = TExpect<TEqual<TotalDiff, { a: 1; b: 2 }>>;

type Same = { a: 1; b: 2 };
type NoDiff = TPrettify<TCreateDiff<Same, Same>>;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type _t9 = TExpect<TEqual<NoDiff, {}>>;

// ==========================================
// TBigIntToggle Tests
// ==========================================

// Case 1: BigInt to String (Database -> Frontend)
type FromDb = bigint;
type ToFrontend = TBigIntToggle<FromDb>;
export type _t10 = TExpect<TEqual<ToFrontend, string>>;

const bigIntValOne: unknown = '';
forceType<ToFrontend>(bigIntValOne);
expectType<string>(bigIntValOne);

// Case 2: String to BigInt (Frontend -> Database)
type FromInput = string;
type ToDb = TBigIntToggle<FromInput>;
export type _t11 = TExpect<TEqual<ToDb, bigint>>;
const bigIntValTwo: unknown = 0n;
forceType<ToDb>(bigIntValTwo);
expectType<bigint>(bigIntValTwo);

// Case 3: Literal BigInt to String
type SpecificId = 100n;
type ToggledLiteral = TBigIntToggle<SpecificId>;
// Note: TBigIntToggle targets the base primitive 'string'
export type _t12 = TExpect<TEqual<ToggledLiteral, string>>;

const bigIntValThree: unknown = '';
forceType<ToggledLiteral>(bigIntValThree);
expectType<string>(bigIntValThree);

// Case 4: Union Toggle (Ensures distributive property works)
type Mixed = string | bigint;
type ToggledUnion = TBigIntToggle<Mixed>;
// Should result in bigint | string (swapped)
export type _t13 = TExpect<TEqual<ToggledUnion, bigint | string>>;

const mixedVal: unknown = 'test'; // Could also be 100n
forceType<ToggledUnion>(mixedVal);

// We expect the variable to be the union, not just one side.
expectType<bigint | string>(mixedVal);
