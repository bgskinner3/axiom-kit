import { expectType } from 'jest-tsd';
import type { TEqual, TExpect } from '../../test-utils';
import type {
  TFilterKeysByValue,
  TStripType,
} from '../../../src/primitives/filters';

type TComplexUser = {
  readonly id: number;
  name: string;
  age?: number;
  bio: string | null;
  roles: string[] | 'guest';
  tags: string[] | undefined;
};

// ==========================================
// TFilterKeysByValue Assertions
// ==========================================

// Case: Standard primitives and nullables
type ActualStrings = TFilterKeysByValue<TComplexUser, string>;
type ExpectedStrings = 'name' | 'bio';
export type _t1 = TExpect<TEqual<ActualStrings, ExpectedStrings>>; // IDE Check
expectType<ExpectedStrings>({} as ActualStrings); // CLI Check

// Case: Loose matching for optional numbers
type ActualNums = TFilterKeysByValue<TComplexUser, number>;
type ExpectedNums = 'id' | 'age';
export type _t2 = TExpect<TEqual<ActualNums, ExpectedNums>>;
expectType<ExpectedNums>({} as ActualNums);

// Case: Union types (including subtypes)
type ActualUnions = TFilterKeysByValue<TComplexUser, string[] | 'guest'>;
type ExpectedUnions = 'roles' | 'tags';
export type _t3 = TExpect<TEqual<ActualUnions, ExpectedUnions>>;
expectType<ExpectedUnions>({} as ActualUnions);

// Case: No matches
type ActualNever = TFilterKeysByValue<TComplexUser, boolean>;
export type _t4 = TExpect<TEqual<ActualNever, never>>;
expectType<never>({} as ActualNever);

// ==========================================
// TStripType Assertions
// ==========================================

// Case: Removing properties by type
type StripNum = TStripType<TComplexUser, number>;
type ExpectedStripNum = {
  name: string;
  age?: number; // age stays because 'number | undefined' !== 'number'
  bio: string | null;
  roles: string[] | 'guest';
  tags: string[] | undefined;
};
export type _t5 = TExpect<TEqual<StripNum, ExpectedStripNum>>;
expectType<ExpectedStripNum>({} as StripNum);

// Case: Readonly preservation
type ReadonlyObj = { readonly id: number; name: string };
type StripStr = TStripType<ReadonlyObj, string>;
type ExpectedReadonly = { readonly id: number };
export type _t6 = TExpect<TEqual<StripStr, ExpectedReadonly>>;
expectType<ExpectedReadonly>({} as StripStr);

// Case: Selective stripping (doesn't strip sub-parts of unions)
type ActualSelective = TStripType<TComplexUser, string>;
export type _t7 = TExpect<TEqual<keyof ActualSelective & 'bio', 'bio'>>;
expectType<string | null>({} as ActualSelective['bio']);

// Case: Stripping optional unions
type StripOptional = TStripType<TComplexUser, string[] | undefined>;
export type _t8 = TExpect<TEqual<keyof StripOptional & 'tags', never>>;
expectType<never>({} as keyof StripOptional & 'tags');
