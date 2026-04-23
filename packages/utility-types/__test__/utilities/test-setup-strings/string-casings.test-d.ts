import { expectType } from 'jest-tsd';
import type { TEqual, TExpect } from '../../test-utils';
import type {
  TCamelCase,
  TKebabCase,
  TSnakeCase,
} from '../../../src';
import { forceType } from '../../test-utils';

/**
 * String CASING TESTS
 *
 *    TCamelCase, TKebabCase, TSnakeCase,
 *
 */

// I. TCamelCase
// Standard conversion
type TCC_Actual1 = TCamelCase<'hello_world'>;
type TCC_Expected1 = 'helloWorld';
export type _tcc1 = TExpect<TEqual<TCC_Actual1, TCC_Expected1>>;

const camel1: unknown = '';
forceType<TCC_Actual1>(camel1);
expectType<TCC_Expected1>(camel1);

// ------------------------------------------------------------------------

// Handle consecutive uppercase (Default: preserve)
type TCC_Actual2 = TCamelCase<'USER_ID'>;
type TCC_Expected2 = 'userId'; // TWords lowercase logic applied
export type _tcc2 = TExpect<TEqual<TCC_Actual2, TCC_Expected2>>;

const camel2: unknown = '';
forceType<TCC_Actual2>(camel2);
expectType<TCC_Expected2>(camel2);

// ------------------------------------------------------------------------

// Handle kebab and space inputs
type TCC_Actual3 = TCamelCase<'get-user-data' | 'fetch items'>;
type TCC_Expected3 = 'getUserData' | 'fetchItems';
export type _tcc3 = TExpect<TEqual<TCC_Actual3, TCC_Expected3>>;

const camel3: unknown = '';
forceType<TCC_Actual3>(camel3);
expectType<TCC_Expected3>(camel3);

// ------------------------------------------------------------------------

// Options: Force lowercase for consecutive uppercase
type TCC_Actual4 = TCamelCase<
  'API_Response',
  { preserveConsecutiveUppercase: false }
>;
type TCC_Expected4 = 'apiResponse';
export type _tcc4 = TExpect<TEqual<TCC_Actual4, TCC_Expected4>>;

const camel4: unknown = '';
forceType<TCC_Actual4>(camel4);
expectType<TCC_Expected4>(camel4);

// ------------------------------------------------------------------------

// ====================================================================================================
// ====================================================================================================
// ====================================================================================================

// II. TKebabCase

// Standard conversion
type TKC_Actual1 = TKebabCase<'snake_case_input'>;
type TKC_Expected1 = 'snake-case-input';
export type _tkc1 = TExpect<TEqual<TKC_Actual1, TKC_Expected1>>;

const kebab1: unknown = '';
forceType<TKC_Actual1>(kebab1);
expectType<TKC_Expected1>(kebab1);
// ------------------------------------------------------------------------

// Camel to Kebab (via TWords splitting)
type TKC_Actual2 = TKebabCase<
  'camelCaseInput',
  { preserveConsecutiveUppercase: false }
>;
type TKC_Expected2 = 'camel-case-input';

export type _tkc2 = TExpect<TEqual<TKC_Actual2, TKC_Expected2>>;
const kebab2: unknown = '';
forceType<TKC_Actual2>(kebab2);
expectType<TKC_Expected2>(kebab2);

// ------------------------------------------------------------------------

// Option: Preserve Uppercase (Default)
type TKC_Actual3 = TKebabCase<'User_ID'>;
type TKC_Expected3 = 'User-ID';
export type _tkc3 = TExpect<TEqual<TKC_Actual3, TKC_Expected3>>;
const kebab3: unknown = '';
forceType<TKC_Actual3>(kebab3);
expectType<TKC_Expected3>(kebab3);
// ------------------------------------------------------------------------

// Option: Strict Lowercase Kebab
type TKC_Actual4 = TKebabCase<
  'User_ID',
  { preserveConsecutiveUppercase: false }
>;
type TKC_Expected4 = 'user-id';
export type _tkc4 = TExpect<TEqual<TKC_Actual4, TKC_Expected4>>;
const kebab4: unknown = '';
forceType<TKC_Actual4>(kebab4);
expectType<TKC_Expected4>(kebab4);
// ====================================================================================================
// ====================================================================================================
// ====================================================================================================

// II. TSnakeCase
// Standard conversion
type TSC_Actual1 = TSnakeCase<'kebab-case-input'>;
type TSC_Expected1 = 'kebab_case_input';
export type _tsc1 = TExpect<TEqual<TSC_Actual1, TSC_Expected1>>;

const snake1: unknown = 'kebab_case_input';
forceType<TSC_Actual1>(snake1);
expectType<TSC_Expected1>(snake1);

// ------------------------------------------------------------------------

// Handle spaces
type TSC_Actual2 = TSnakeCase<'hello world'>;
type TSC_Expected2 = 'hello_world';
export type _tsc2 = TExpect<TEqual<TSC_Actual2, TSC_Expected2>>;

const snake2: unknown = 'hello_world';
forceType<TSC_Actual2>(snake2);
expectType<TSC_Expected2>(snake2);

// ------------------------------------------------------------------------

// Option: Strict snake_case
type TSC_Actual3 = TSnakeCase<
  'HTTP_Response',
  { preserveConsecutiveUppercase: false }
>;
type TSC_Expected3 = 'http_response';
export type _tsc3 = TExpect<TEqual<TSC_Actual3, TSC_Expected3>>;

const snake3: unknown = 'http_response';
forceType<TSC_Actual3>(snake3);
expectType<TSC_Expected3>(snake3);

// Option: Preserve Uppercase (Default)
type TSC_Actual4 = TSnakeCase<'User_ID'>;
type TSC_Expected4 = 'User_ID';
export type _tsc4 = TExpect<TEqual<TSC_Actual4, TSC_Expected4>>;

const snake4: unknown = 'User_ID';
forceType<TSC_Actual4>(snake4);
