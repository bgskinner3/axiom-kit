import { expectType } from 'jest-tsd';
import type { TEqual, TExpect } from '../../test-utils';
import type { TFixedLengthArray } from '../../../src';
import { forceType } from '../../test-utils';

/**
 * TFixedLengthArray
 */

type TFL_Actual1 = TFixedLengthArray<[number, string]>;

type TFL_Expected1 = {
  0: number;
  1: string;
  length: number;
  [Symbol.iterator]: () => IterableIterator<number | string>;
};

export type _tfl1 = TExpect<TEqual<TFL_Actual1, TFL_Expected1>>;

const fixedArrayValOne: unknown = {};
forceType<TFL_Actual1>(fixedArrayValOne);
expectType<TFL_Expected1>(fixedArrayValOne);

// ====================================================================================================
type TFL_Actual2 = TFixedLengthArray<[1, 2, 3]>[0];
type TFL_Expected2 = 1;

export type _tfl2 = TExpect<TEqual<TFL_Actual2, TFL_Expected2>>;

const fixedArrayValTwo: unknown = 1;
forceType<TFL_Actual2>(fixedArrayValTwo);
expectType<TFL_Expected2>(fixedArrayValTwo);

// ====================================================================================================

type TFL_Actual3 = ReturnType<
  TFixedLengthArray<[1, 'a']>[typeof Symbol.iterator]
>;

type TFL_Expected3 = IterableIterator<1 | 'a'>;

export type _tfl3 = TExpect<TEqual<TFL_Actual3, TFL_Expected3>>;

const fixedArrayValThree: unknown = (function* () {
  yield* [1, 'a' as const];
})();
forceType<TFL_Actual3>(fixedArrayValThree);
expectType<TFL_Expected3>(fixedArrayValThree);

// ====================================================================================================

type TFL_Actual4 = TFixedLengthArray<[1, 2]>['length'];
type TFL_Expected4 = number;

export type _tfl4 = TExpect<TEqual<TFL_Actual4, TFL_Expected4>>;

const fixedArrayValFour: unknown = 2;
forceType<TFL_Actual4>(fixedArrayValFour);
expectType<TFL_Expected4>(fixedArrayValFour);

// ====================================================================================================

type TFL_Actual5 = keyof TFixedLengthArray<[number, number]>;

type TFL_Expected5 = '0' | '1' | 'length' | typeof Symbol.iterator;

export type _tfl5 = TExpect<TEqual<TFL_Actual5, TFL_Expected5>>;

const fixedArrayValFive: unknown = '0'; // '0' | '1' | 'length' | Symbol.iterator
forceType<TFL_Actual5>(fixedArrayValFive);
expectType<TFL_Expected5>(fixedArrayValFive);

// ====================================================================================================
// Ensure non-mutating methods are removed
type TFL_Actual6 =
  TFixedLengthArray<[number]> extends {
    map: unknown;
  }
    ? true
    : false;

type TFL_Expected6 = false;

export type _tfl6 = TExpect<TEqual<TFL_Actual6, TFL_Expected6>>;

const fixedArrayValSix: unknown = false;
forceType<TFL_Actual6>(fixedArrayValSix);
expectType<TFL_Expected6>(fixedArrayValSix);

// ====================================================================================================
// Empty tuple edge case

type TFL_Actual7 = TFixedLengthArray<[]>;

type TFL_Expected7 = {
  length: number;
  [Symbol.iterator]: () => IterableIterator<never>;
};

export type _tfl7 = TExpect<TEqual<TFL_Actual7, TFL_Expected7>>;

const fixedArrayValSeven: unknown = {};
forceType<TFL_Actual7>(fixedArrayValSeven);
expectType<TFL_Expected7>(fixedArrayValSeven);

// ====================================================================================================
// Single element tuple

type TFL_Actual8 = TFixedLengthArray<[42]>;

type TFL_Expected8 = {
  0: 42;
  length: number;
  [Symbol.iterator]: () => IterableIterator<42>;
};

export type _tfl8 = TExpect<TEqual<TFL_Actual8, TFL_Expected8>>;

const fixedArrayValEight: unknown = {};
forceType<TFL_Actual8>(fixedArrayValEight);
expectType<TFL_Expected8>(fixedArrayValEight);

// ====================================================================================================
// Wider array input (NOT tuple)

type TFL_Actual9 = TFixedLengthArray<number[]>;

type TFL_Expected9 = {
  length: number;
  [Symbol.iterator]: () => IterableIterator<number>;
};

export type _tfl9 = TExpect<TEqual<TFL_Actual9, TFL_Expected9>>;
const fixedArrayValNine: unknown = {
  length: 10,
  [Symbol.iterator]: function* () {
    yield 1;
  },
};
forceType<TFL_Actual9>(fixedArrayValNine);
expectType<TFL_Expected9>(fixedArrayValNine);
