import type {
  TFilterKeysByValue,
  TStripType,
} from '../../src/primitives/filters';

/**
 * 🔥 THE AXIOM TYPE-TEST ENGINE
 * These helpers force a compiler error if the types don't match.
 */
type TEqual<T, U> =
  (<V>() => V extends T ? 1 : 2) extends <V>() => V extends U ? 1 : 2
    ? true
    : false;
type TExpect<T extends true> = T;

type TComplexUser = {
  readonly id: number;
  name: string;
  age?: number;
  bio: string | null;
  roles: string[] | 'guest';
  tags: string[] | undefined;
};

describe('Filter Primitives (Type-Level)', () => {
  it('should validate TFilterKeysByValue logic', () => {
    // 1. Standard primitives and nullables
    type ActualStrings = TFilterKeysByValue<TComplexUser, string>;
    type ExpectedStrings = 'name' | 'bio';
    type _t1 = TExpect<TEqual<ActualStrings, ExpectedStrings>>;

    // 2. Loose matching for optional numbers
    type ActualNums = TFilterKeysByValue<TComplexUser, number>;
    type ExpectedNums = 'id' | 'age';
    type _t2 = TExpect<TEqual<ActualNums, ExpectedNums>>;

    // 3. Union types (including subtypes)
    type ActualUnions = TFilterKeysByValue<TComplexUser, string[] | 'guest'>;
    type ExpectedUnions = 'roles' | 'tags';
    type _t3 = TExpect<TEqual<ActualUnions, ExpectedUnions>>;

    // If you're seeing this in a passing test, the types are valid!
    expect(true).toBe(true);
  });

  it('should validate TStripType logic', () => {
    // 1. Removing properties by type
    type StripNum = TStripType<TComplexUser, number>;
    type ExpectedStripNum = {
      name: string;
      age?: number;
      bio: string | null;
      roles: string[] | 'guest';
      tags: string[] | undefined;
    };
    type _t5 = TExpect<TEqual<StripNum, ExpectedStripNum>>;

    // 2. Readonly preservation
    type ReadonlyObj = { readonly id: number; name: string };
    type StripStr = TStripType<ReadonlyObj, string>;
    type ExpectedReadonly = { readonly id: number };
    type _t6 = TExpect<TEqual<StripStr, ExpectedReadonly>>;

    expect(true).toBe(true);
  });
});
// import { expectTypeTestsToPassAsync } from 'jest-tsd';
// import path from 'path';

// describe('Filter Primitives Type Checks', () => {
//   it('should pass all type assertions in filters.test-d.ts', async () => {
//     await expectTypeTestsToPassAsync(
//       // ✅ Update this path to __tests__
//       path.join(__dirname, 'filters.test-d.ts'),
//     );
//   }, 20000);
// });
