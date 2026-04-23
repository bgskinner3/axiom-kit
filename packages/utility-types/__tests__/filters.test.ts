import type { TFilterKeysByValue, TStripType } from '../src/primitives';
import type { TExpect, TEqual } from '../src';
import { forceType, expectType } from '../src';

describe('TFilterKeysByValue Type Assertions', () => {
  type TComplexUser = {
    readonly id: number;
    name: string;
    age?: number;
    bio: string | null;
    roles: string[] | 'guest';
    tags: string[] | undefined;
  };

  test('Standard primitives and nullables', () => {
    type ActualStrings = TFilterKeysByValue<TComplexUser, string>;
    type ExpectedStrings = 'name' | 'bio';

    // Compile-time check
    const _typeTest: TExpect<TEqual<ActualStrings, ExpectedStrings>> = true;

    const filteredKeys: unknown = {};
    forceType<ActualStrings>(filteredKeys, _typeTest);
    expectType<ExpectedStrings>(filteredKeys);
  });

  test('Loose matching for optional numbers', () => {
    type ActualNums = TFilterKeysByValue<TComplexUser, number>;
    type ExpectedNums = 'id' | 'age';

    const _typeTest: TExpect<TEqual<ActualNums, ExpectedNums>> = true;

    const filteredKeys2: unknown = {};
    forceType<ActualNums>(filteredKeys2, _typeTest);
    expectType<ExpectedNums>(filteredKeys2);
  });

  test('Union types and subtypes', () => {
    type ActualUnions = TFilterKeysByValue<TComplexUser, string[] | 'guest'>;
    type ExpectedUnions = 'roles' | 'tags';

    const _typeTest: TExpect<TEqual<ActualUnions, ExpectedUnions>> = true;

    const filteredKeys2: unknown = {};
    forceType<ActualUnions>(filteredKeys2, _typeTest);
    expectType<ExpectedUnions>(filteredKeys2);
  });

  test('No matches (never)', () => {
    type ActualNever = TFilterKeysByValue<TComplexUser, boolean>;

    const _typeTest: TExpect<TEqual<ActualNever, never>> = true;
    const filteredKeys2: unknown = {};
    forceType<ActualNever>(filteredKeys2, _typeTest);
    expectType<never>(filteredKeys2);
  });
});
describe('TStripType Type Assertions', () => {
  type TComplexUser = {
    readonly id: number;
    name: string;
    age?: number;
    bio: string | null;
    roles: string[] | 'guest';
    tags: string[] | undefined;
  };

  test('Removing properties by exact type', () => {
    type StripNum = TStripType<TComplexUser, number>;
    type Expected = {
      name: string;
      age?: number; // age stays because 'number | undefined' !== 'number'
      bio: string | null;
      roles: string[] | 'guest';
      tags: string[] | undefined;
    };

    // Strict identity check
    const _typeTest: TExpect<TEqual<StripNum, Expected>> = true;

    // Assignment check
    const result: unknown = {};
    forceType<StripNum>(result, _typeTest);
    expectType<Expected>(result);
  });

  test('Preserving readonly modifiers', () => {
    type ReadonlyObj = { readonly id: number; name: string };
    type StripStr = TStripType<ReadonlyObj, string>;
    type Expected = { readonly id: number };

    const _typeTest: TExpect<TEqual<StripStr, Expected>> = true;
    const result: unknown = {};
    forceType<StripStr>(result, _typeTest);
    expectType<Expected>(result);
  });

  test('Selective stripping (ignores partial union matches)', () => {
    // Stripping 'string' should NOT remove 'string | null' (bio)
    type Actual = TStripType<TComplexUser, string>;

    // Check that 'bio' is still a key of the resulting type
    type BioKey = keyof Actual & 'bio';
    const _typeTest: TExpect<TEqual<BioKey, 'bio'>> = true;

    const result: unknown = {};
    forceType<BioKey>(result, _typeTest);
    expectType<string | null>(result);
  });

  test('Stripping optional unions correctly', () => {
    // This should remove 'tags' because 'string[] | undefined' matches exactly
    type StripOptional = TStripType<TComplexUser, string[] | undefined>;

    // Verify 'tags' is no longer a key (should be never)
    type TagsKey = keyof StripOptional & 'tags';
    const _typeTest: TExpect<TEqual<TagsKey, never>> = true;
    const result: unknown = {};
    forceType<TagsKey>(result, _typeTest);
    expectType<never>(result);
  });
});
