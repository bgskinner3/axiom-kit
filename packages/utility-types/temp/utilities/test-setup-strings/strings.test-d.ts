import { expectType } from 'jest-tsd';
import type { TEqual, TExpect } from '../../test-utils';
import type {
  TStrictURL,
  ToPath,
  ToQueryString,
} from '../../../src';
import { forceType } from '../../test-utils';

/**
 * String TESTS
 *
 *   TStrictURL, ToPath, ToQueryString,
 *
 * USE CASES
 * These utilities are used to construct and enforce type-safe URL structures,
 * including paths and query strings, at compile time.
 *
 * - ToPath
 *   Converts a tuple of strings into a valid URL path.
 *   Used for building typed route segments in API clients and routers.
 *
 * - ToQueryString
 *   Converts a tuple of keys into a query string template.
 *   Used for enforcing required query parameter structure in endpoints.
 *
 * - TStrictURL
 *   Builds a fully typed URL from protocol, domain, path, and query params.
 *   Used for enforcing correct API endpoint structure and preventing invalid URLs.
 *
 * SUMMARY:
 * Path → route construction
 * Query → parameter shaping
 * StrictURL → full endpoint safety
 */

// I.   TStrictURL

type TStrictURL_Actual1 = TStrictURL<
  'https',
  'myapp.com',
  ['api', 'v1'],
  ['id']
>;

/**
 * The utility resolves to exactly:
 * https:// + myapp.com + / + api/v1 + ? + id=${string}
 */
type TStrictURL_Expected1 = `https://myapp.com/api/v1?id=${string}`;

export type _turl1 = TExpect<TEqual<TStrictURL_Actual1, TStrictURL_Expected1>>;

const strictUrl1: unknown = '';
forceType<TStrictURL_Actual1>(strictUrl1);
expectType<TStrictURL_Expected1>(strictUrl1);

// ------------------------------------------------------------------------

// Protocol Check (http) and Domain Check (.io)
type TStrictURL_Actual2 = TStrictURL<'http', 'server.io'>;
type TStrictURL_Expected2 = 'http://server.io';
export type _turl2 = TExpect<TEqual<TStrictURL_Actual2, TStrictURL_Expected2>>;

const strictUrl2: unknown = '';
forceType<TStrictURL_Actual2>(strictUrl2);
expectType<TStrictURL_Expected2>(strictUrl2);

// ------------------------------------------------------------------------

// // Negative Test: Invalid TLD
// // @ts-expect-error: ".net" is not allowed by TDomain constraint
// type TStrictURL_InvalidTLD = TStrictURL<'https', 'test.net'>;

// // Value level check
// const apiEndpoint: TStrictURL<'https', 'site.dev', ['users']> =
//   'https://site.dev';
// expectType<'https://site.dev'>(apiEndpoint);

// ====================================================================================================
// ====================================================================================================
// ====================================================================================================

// II. ToPath

// Multi-segment path
type TPath_Actual1 = ToPath<['users', 'profiles', 'settings']>;
type TPath_Expected1 = 'users/profiles/settings';
export type _tp1 = TExpect<TEqual<TPath_Actual1, TPath_Expected1>>;

const pathOne: unknown = '';
forceType<TPath_Actual1>(pathOne);
expectType<TPath_Expected1>(pathOne);

// ------------------------------------------------------------------------

// Single segment
type TPath_Actual2 = ToPath<['home']>;
type TPath_Expected2 = 'home';
export type _tp2 = TExpect<TEqual<TPath_Actual2, TPath_Expected2>>;

const pathTwo: unknown = '';
forceType<TPath_Actual2>(pathTwo);
expectType<TPath_Expected2>(pathTwo);

// ------------------------------------------------------------------------

// Empty array
type TPath_Actual3 = ToPath<[]>;
type TPath_Expected3 = '';
export type _tp3 = TExpect<TEqual<TPath_Actual3, TPath_Expected3>>;

const myPath: ToPath<['v1', 'auth']> = 'v1/auth';
expectType<'v1/auth'>(myPath);

const pathThree: unknown = '';
forceType<TPath_Actual3>(pathThree);
expectType<TPath_Expected3>(pathThree);
// ====================================================================================================
// ====================================================================================================
// ====================================================================================================

// III. ToQueryString

// ------------------------------------------------------------------------
// Multiple parameters
type TQueryString_Actual1 = ToQueryString<['id', 'token', 'lang']>;
type TQueryString_Expected1 = `id=${string}&token=${string}&lang=${string}`;
export type _tqs1 = TExpect<
  TEqual<TQueryString_Actual1, TQueryString_Expected1>
>;

const queryOne: unknown = '';
forceType<TQueryString_Actual1>(queryOne);
expectType<TQueryString_Expected1>(queryOne);

// ------------------------------------------------------------------------

// Single parameter
type TQueryString_Actual2 = ToQueryString<['search']>;
type TQueryString_Expected2 = `search=${string}`;
export type _tqs2 = TExpect<
  TEqual<TQueryString_Actual2, TQueryString_Expected2>
>;

const queryTwo: unknown = '';
forceType<TQueryString_Actual2>(queryTwo);
expectType<TQueryString_Expected2>(queryTwo);

// ------------------------------------------------------------------------

// Value assignment (testing template literal compatibility)
// const validQS: ToQueryString<['pg']> = 'pg=1'; // Works because '1' matches string
// const invalidQS: ToQueryString<['pg']> = 'pg='; // Works because empty matches string
// expectType<`pg=${string}`>(validQS);
