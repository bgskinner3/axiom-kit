import { expectType } from 'jest-tsd';
import type { TEqual, TExpect } from '../../test-utils';
import type {
  TUnionResolver,
  TOmitMethods,
  TRequireIf,
  TIfValueRequire,
} from '../../../src';
import { forceType } from '../../test-utils';

/**
 * TUnionResolver TESTS
 *
 * USECASE --
 * Converts each member of a union into an array of objects with a `type` field.
 * NOTE: This implementation DOES distribute unions (e.g., 'a' | 'b' becomes {type: 'a'}[] | {type: 'b'}[]).
 */

// ----------------------

// ----------------------
type UR_Actual1 = TUnionResolver<'a' | 'b'>;
type UR_Expected1 = { type: 'a' }[] | { type: 'b' }[];
export type _ur1 = TExpect<TEqual<UR_Actual1, UR_Expected1>>;
const val: unknown = {};
forceType<UR_Actual1>(val);
expectType<UR_Expected1>(val);

// Case: single literal
type UR_Actual2 = TUnionResolver<'only'>;
type UR_Expected2 = { type: 'only' }[];
export type _ur2 = TExpect<TEqual<UR_Actual2, UR_Expected2>>;
const val2: unknown = {};
forceType<UR_Actual2>(val2);
expectType<UR_Expected2>(val2);

// Case: number union
type UR_Actual3 = TUnionResolver<1 | 2>;
type UR_Expected3 = { type: 1 }[] | { type: 2 }[];
export type _ur3 = TExpect<TEqual<UR_Actual3, UR_Expected3>>;
const val3: unknown = {};
forceType<UR_Actual3>(val3);
expectType<UR_Expected3>(val3);

// Case: mixed union
type UR_Actual4 = TUnionResolver<'a' | 1 | true>;
type UR_Expected4 = { type: 'a' }[] | { type: 1 }[] | { type: true }[];
export type _ur4 = TExpect<TEqual<UR_Actual4, UR_Expected4>>;
const val4: unknown = {};
forceType<UR_Actual4>(val4);
expectType<UR_Expected4>(val4);

// Edge Case: never
type UR_Actual5 = TUnionResolver<never>;
type UR_Expected5 = never;
export type _ur5 = TExpect<TEqual<UR_Actual5, UR_Expected5>>;
const val5: unknown = {};

forceType<UR_Actual5>(val5);
expectType<never>(val5);

// Edge Case: any/unknown
type UR_Actual6 = TUnionResolver<unknown>;
type UR_Expected6 = { type: unknown }[];
export type _ur6 = TExpect<TEqual<UR_Actual6, UR_Expected6>>;
const val6: unknown = {};
forceType<UR_Actual6>(val6);
expectType<UR_Expected6>(val6);

// Edge Case: unknown (duplicate of 6, but keeping for your structure)
type UR_Actual7 = TUnionResolver<unknown>;
type UR_Expected7 = { type: unknown }[];
export type _ur7 = TExpect<TEqual<UR_Actual7, UR_Expected7>>;
const val7: unknown = {};
forceType<UR_Actual7>(val7);
expectType<UR_Expected7>(val7);

// Case: object union
type ObjA = { a: 1 };
type ObjB = { b: 2 };
type UR_Actual8 = TUnionResolver<ObjA | ObjB>;
type UR_Expected8 = { type: ObjA }[] | { type: ObjB }[];
export type _ur8 = TExpect<TEqual<UR_Actual8, UR_Expected8>>;
const val8: unknown = {};
forceType<UR_Actual8>(val8);
expectType<UR_Expected8>(val8);
// ====================================================================================================
// ====================================================================================================
// ====================================================================================================
/**
 * TOmitMethods TESTS
 *
 * USECASE --
 * Removes function-like properties (methods) from a type,
 * preserving all non-function fields.
 */
// ----------------------
type TOmitM_Actual1 = TOmitMethods<{
  a: string;
  b: number;
  c: () => void;
  d: (x: number) => string;
}>;
type TOmitM_Expected1 = {
  a: string;
  b: number;
};
export type _tm1 = TExpect<TEqual<TOmitM_Actual1, TOmitM_Expected1>>;

const actual1: unknown = {};
forceType<TOmitM_Actual1>(actual1);
expectType<TOmitM_Expected1>(actual1);

// ----------------------
// identity case TEST
type OmitMActual2 = TOmitMethods<{
  a: string;
  b: number;
}>;

type OmitMExpected2 = {
  a: string;
  b: number;
};

export type _tm2 = TExpect<TEqual<OmitMActual2, OmitMExpected2>>;
const actual2: unknown = {};
forceType<OmitMActual2>(actual2);
expectType<OmitMExpected2>(actual2);

// ----------------------
// empty object TEST

type OmitMActual3 = TOmitMethods<{
  a: () => void;
  b: (x: number) => string;
}>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type OmitMExpected3 = {};

export type _tm3 = TExpect<TEqual<OmitMActual3, OmitMExpected3>>;

const actual3: unknown = {};
forceType<OmitMActual3>(actual3);
expectType<OmitMExpected3>(actual3);

// ----------------------
// Optional methods TEST
type OmitMActual4 = TOmitMethods<{
  a?: () => void;
  b: string;
  c?: number;
}>;

type OmitMExpected4 = {
  b: string;
  c?: number;
};

export type _tm4 = TExpect<TEqual<OmitMActual4, OmitMExpected4>>;

const actual4: unknown = {};
forceType<OmitMActual4>(actual4);
expectType<OmitMExpected4>(actual4);

// ----------------------
// Union of function + non-function
type OmitMActual5 = TOmitMethods<{
  a: string | (() => void);
  b: number;
}>;

type OmitMExpected5 = {
  a: string | (() => void); // should NOT be removed (not purely a method)
  b: number;
};

export type _tm5 = TExpect<TEqual<OmitMActual5, OmitMExpected5>>;

const actual5: unknown = {};
forceType<OmitMActual5>(actual5);
expectType<OmitMExpected5>(actual5);

// ----------------------
// Mixed object + method + optional + readonly
type OmitMActual6 = TOmitMethods<{
  readonly a: string;
  readonly b: () => void;
  c?: () => number;
  d: boolean;
}>;

type OmitMExpected6 = {
  readonly a: string;
  d: boolean;
};

export type _tm6 = TExpect<TEqual<OmitMActual6, OmitMExpected6>>;
const actual6: unknown = {};
forceType<OmitMActual6>(actual6);
expectType<OmitMExpected6>(actual6);

// // ----------------------
// //Index signature
// type OmitMActual7 = TOmitMethods<{
//   [key: string]: unknown;
//   a: () => void;
//   b: number;
// }>;

// type OmitMExpected7 = {
//   [key: string]: unknown;
//   b: number;
// };

// export type _tm7 = TExpect<TEqual<OmitMActual7, OmitMExpected7>>;

// const actual7: unknown = {};
// forceType<OmitMActual7>(actual7);
// expectType<OmitMExpected7>(actual7);

// ----------------------
//Nested object methods (should NOT strip deeply)
type OmitMActual8 = TOmitMethods<{
  a: {
    x: () => void;
    y: string;
  };
  b: () => void;
}>;

type OmitMExpected8 = {
  a: {
    x: () => void; // untouched (deep removal not expected)
    y: string;
  };
};

export type _tm8 = TExpect<TEqual<OmitMActual8, OmitMExpected8>>;
const actual8: unknown = {};
forceType<OmitMActual8>(actual8);
expectType<OmitMExpected8>(actual8);

// ====================================================================================================
// ====================================================================================================
// ====================================================================================================

/**
 * TRequireIf TESTS
 *
 * USECASE --
 * This utility is designed for "Discriminated Requirement" logic. It solves
 * the common problem where an interface has optional properties that should
 * only exist (and must exist) under specific conditions.
 *
 * SCENARIO:
 * Imagine a 'Transaction' object.
 * - If the 'type' is 'WIRE', the 'iban' field is MANDATORY.
 * - If the 'type' is 'CASH', the 'iban' field is FORBIDDEN (to prevent data pollution).
 *
 * WHY USE THIS OVER STANDARD UNIONS?
 * Standard unions require you to manually redefine every shared property
 * (like id, timestamp, amount) in every branch. TRequireIf allows you to
 * take an existing Base Type and "inject" conditional logic onto it
 * dynamically, significantly reducing boilerplate and maintenance.
 *
 * BEHAVIOR:
 * 1. Requirement: Maps K2 to a required version of its type when K1 is V1.
 * 2. Exclusion: Maps K2 to 'undefined' when K1 is NOT V1.
 * 3. Preservation: Keeps all other properties of the Base Type intact.
 */

// ----------------------
type Base = {
  value: bigint;
  unit: 'eth' | 'gwei' | 'token';
  decimals?: number;
};

type TRequire_Actual1 = TRequireIf<Base, 'unit', 'token', 'decimals'>;

type TRequire_Expected1 =
  | {
      value: bigint;
      unit: 'token';
      decimals: number;
    }
  | {
      value: bigint;
      unit: Exclude<'eth' | 'gwei' | 'token', 'token'>;
      decimals?: never;
    };

export type _tr1 = TExpect<TEqual<TRequire_Actual1, TRequire_Expected1>>;

const actualOne: unknown = {};
forceType<TRequire_Actual1>(actualOne);
expectType<TRequire_Expected1>(actualOne);

// ----------------------
// NON-TRIGGER CASE TEST
// //-----------------------
type TRequire_Actual2 = TRequireIf<Base, 'unit', 'token', 'decimals'>['unit'];

type TRequire_Expected2 = 'eth' | 'gwei' | 'token';

export type _tr2 = TExpect<TEqual<TRequire_Actual2, TRequire_Expected2>>;

const actualTwo: unknown = '';
forceType<TRequire_Actual2>(actualTwo);
expectType<TRequire_Expected2>(actualTwo);

// ----------------------
// REQUIRED BEHAVIOR STRICTNESS TEST
// //-----------------------

type TRequire_Actual3 = Extract<
  TRequireIf<Base, 'unit', 'token', 'decimals'>,
  { unit: 'token' }
>;

type TRequire_Expected3 = {
  value: bigint;
  unit: 'token';
  decimals: number;
};

export type _tr3 = TExpect<TEqual<TRequire_Actual3, TRequire_Expected3>>;

const actualThree: unknown = '';
forceType<TRequire_Actual3>(actualThree);
expectType<TRequire_Expected3>(actualThree);

// ----------------------
// FORBIDDEN BEHAVIOR TEST
// //-----------------------
type TRequire_Actual4 = Extract<
  TRequireIf<Base, 'unit', 'token', 'decimals'>,
  { unit: 'eth' | 'gwei' } // Match the exclusion branch's full union
>;

type TRequire_Expected4 = {
  value: bigint;
  unit: 'eth' | 'gwei';
  decimals?: undefined;
};

export type _tr4 = TExpect<TEqual<TRequire_Actual4, TRequire_Expected4>>;

const actualFour: unknown = '';
forceType<TRequire_Actual4>(actualFour);
expectType<TRequire_Expected4>(actualFour);

// ----------------------
// multiple non-trigger values
// //-----------------------

type TRequire_Actual5 = TRequireIf<
  {
    mode: 'a' | 'b' | 'c';
    flag?: boolean;
  },
  'mode',
  'c',
  'flag'
>;

type TRequire_Expected5 =
  | {
      mode: 'c';
      flag: boolean;
    }
  | {
      mode: 'a' | 'b';
      flag?: never;
    };

export type _tr5 = TExpect<TEqual<TRequire_Actual5, TRequire_Expected5>>;
const actualFive: unknown = {};
forceType<TRequire_Actual5>(actualFive);
expectType<TRequire_Expected5>(actualFive);

// ----------------------
// optional trigger property
// //-----------------------
type TRequire_Actual6 = TRequireIf<
  {
    mode?: 'a' | 'b';
    flag?: boolean;
  },
  'mode',
  'b',
  'flag'
>;

type TRequire_Expected6 =
  | {
      mode: 'b'; // Trigger branch: 'mode' becomes required because it is exactly 'b'
      flag: boolean;
    }
  | {
      mode?: 'a'; // Exclusion branch: 'mode' remains optional (includes 'a' | undefined)
      flag?: undefined; // Matches the utility's use of 'undefined' for forbidden properties
    };

export type _tr6 = TExpect<TEqual<TRequire_Actual6, TRequire_Expected6>>;
const actualSix: unknown = {};
forceType<TRequire_Actual6>(actualSix);
expectType<TRequire_Expected6>(actualSix);
// ----------------------
// K2 already required
// //-----------------------

type TRequire_Actual7 = TRequireIf<
  {
    mode: 'a' | 'b';
    flag: number;
  },
  'mode',
  'b',
  'flag'
>;

type TRequire_Expected7 =
  | {
      mode: 'b';
      flag: number;
    }
  | {
      mode: 'a';
      flag?: never;
    };

export type _tr7 = TExpect<TEqual<TRequire_Actual7, TRequire_Expected7>>;
const actualSeven: unknown = {};
forceType<TRequire_Actual7>(actualSeven);
expectType<TRequire_Expected7>(actualSeven);
// ----------------------
// This exposes a real design issue.
// //-----------------------
type TRequire_Actual8 = TRequireIf<
  {
    mode: 'a' | 'b';
  },
  'mode',
  'b',
  'flag'
>;

type TRequire_Expected8 =
  | {
      mode: 'b';
      flag: unknown;
    }
  | {
      mode: 'a';
      flag?: never;
    };

export type _tr8 = TExpect<TEqual<TRequire_Actual8, TRequire_Expected8>>;
const actualEight: unknown = {};
forceType<TRequire_Actual8>(actualEight);
expectType<TRequire_Expected8>(actualEight);

// ====================================================================================================
// ====================================================================================================
// ====================================================================================================

/**
 * TIfValueRequire TESTS
 *
 * USECASE --
 * Designed for hierarchical configuration schemas (Record<string, Record<string, string>>).
 * This utility enforces that if a specific VALUE (key of a sub-record) is chosen
 * for Category A, then a VALUE must also be provided for Category B.
 *
 * SCENARIO:
 * In a Theme Engine:
 * - If 'colorMode' is set to 'custom', then 'brandColor' MUST be defined.
 * - If 'colorMode' is 'light' or 'dark', 'brandColor' is FORBIDDEN (to ensure consistency).
 *
 * This prevents "half-configured" states in complex nested settings.
 *
 */

// ----------------------
// ----------------------
// SCHEMA SETUP
// ----------------------
type TAppConfig = {
  auth: {
    oidc: string;
    guest: string;
  };
  storage: {
    s3: string;
    local: string;
  };
};

// If auth is 'oidc', storage MUST be defined.
type TRequireIf_Actual1 = TIfValueRequire<
  TAppConfig,
  'auth',
  'oidc',
  'storage'
>;

type TRequireIf_Expected1 =
  | {
      auth: 'oidc';
      storage: 's3' | 'local';
    }
  | {
      auth?: 'guest';
      storage?: undefined;
    };

export type _tiv1 = TExpect<TEqual<TRequireIf_Actual1, TRequireIf_Expected1>>;
const actualIfRequireOne: unknown = {};
forceType<TRequireIf_Actual1>(actualIfRequireOne);
expectType<TRequireIf_Expected1>(actualIfRequireOne);

// ----------------------
//  Required Strictness (Triggered)
// ----------------------
type TRequireIf_Actual2 = Extract<TRequireIf_Actual1, { auth: 'oidc' }>;

type TRequireIf_Expected2 = {
  auth: 'oidc';
  storage: 's3' | 'local';
};

export type _tiv2 = TExpect<TEqual<TRequireIf_Actual2, TRequireIf_Expected2>>;

const actualIfRequireTwo: unknown = {};
forceType<TRequireIf_Actual2>(actualIfRequireTwo);
expectType<TRequireIf_Expected2>(actualIfRequireTwo);
// ----------------------
//  Forbidden Strictness (Non-Triggered)
// ----------------------
type TRequireIf_Actual3 = Extract<TRequireIf_Actual1, { auth?: 'guest' }>;

type TRequireIf_Expected3 = {
  auth?: 'guest';
  storage?: undefined;
};

export type _tiv3 = TExpect<TEqual<TRequireIf_Actual3, TRequireIf_Expected3>>;

const actualIfRequireThree: unknown = {};
forceType<TRequireIf_Actual3>(actualIfRequireThree);
expectType<TRequireIf_Expected3>(actualIfRequireThree);
// ----------------------
//  Multi-Value Categories
// ----------------------
type MultiConfig = {
  mode: { a: ''; b: ''; c: '' };
  feature: { x: ''; y: '' };
};

type TRequireIf_Actual4 = TIfValueRequire<MultiConfig, 'mode', 'a', 'feature'>;

type TRequireIf_Expected4 =
  | {
      mode: 'a';
      feature: 'x' | 'y';
    }
  | {
      mode?: 'b' | 'c';
      feature?: undefined;
    };

export type _tiv4 = TExpect<TEqual<TRequireIf_Actual4, TRequireIf_Expected4>>;

const actualIfRequireFour: unknown = {};
forceType<TRequireIf_Actual4>(actualIfRequireFour);
expectType<TRequireIf_Expected4>(actualIfRequireFour);
