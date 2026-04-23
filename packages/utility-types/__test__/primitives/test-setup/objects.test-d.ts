import { expectType } from 'jest-tsd';
import type { TEqual, TExpect } from '../../test-utils';
import type {
  TEnsure,
  TUnpackObject,
  TWriteable,
  TPrettify,
} from '../../../src';

/**
 * TUnpackObject TESTS
 *
 * USECASE --
 *
 *
 */
export const Colors = { red: '#ff0000', blue: '#0000ff' } as const;
type ColorValues = TUnpackObject<typeof Colors>;
export type _t1 = TExpect<TEqual<ColorValues, '#ff0000' | '#0000ff'>>;
expectType<'#ff0000' | '#0000ff'>({} as ColorValues);

type Mixed = { id: number; name: string; active: boolean };
type MixedValues = TUnpackObject<Mixed>;
export type _t2 = TExpect<TEqual<MixedValues, number | string | boolean>>;

type ArrayVals = TUnpackObject<string[]>;
export type _t3 = TExpect<TEqual<ArrayVals, string>>;

type Dictionary = { [key: string]: number };
type DictVals = TUnpackObject<Dictionary>;
export type _t4 = TExpect<TEqual<DictVals, number>>;

type PrimValue = TUnpackObject<string>;
export type _t5 = TExpect<TEqual<PrimValue, never>>;

/**
 *  TEnsure TESTS
 *
 * USECASE --
 */
type TPartialPost = {
  title?: string;
  body?: string;
  id: number;
};

type ValidatedPost = TPrettify<TEnsure<TPartialPost, 'title'>>;
type ExpectedPost = { title: string; body?: string; id: number };
export type _t10 = TExpect<TEqual<ValidatedPost, ExpectedPost>>;
expectType<ExpectedPost>({} as ValidatedPost);

type FullPost = TPrettify<TEnsure<TPartialPost, 'title' | 'body'>>;
export type _t11 = TExpect<
  TEqual<FullPost, { title: string; body: string; id: number }>
>;

type StrictId = TPrettify<TEnsure<TPartialPost, 'id'>>;
export type _t12 = TExpect<TEqual<StrictId, TPrettify<TPartialPost>>>;

interface NullableUser {
  bio?: string | null;
}
type EnsuredBio = TPrettify<TEnsure<NullableUser, 'bio'>>;
// Should be required 'string | null' (removes undefined, keeps null)
export type _t13 = TExpect<TEqual<EnsuredBio, { bio: string | null }>>;

type AllEnsured = TPrettify<TEnsure<{ a?: 1; b?: 2 }, 'a' | 'b'>>;
export type _t14 = TExpect<TEqual<AllEnsured, { a: 1; b: 2 }>>;

// // @ts-expect-error - 'invalid' is not a keyof PartialPost
// type InvalidEnsure = TEnsure<TPartialPost, 'invalid'>;

/**
 * TWriteable TESTS
 *
 * use case --
 */

type ReadonlyUser = { readonly id: number; readonly name: string };
type MutableUser = TWriteable<ReadonlyUser>;
export type _t6 = TExpect<TEqual<MutableUser, { id: number; name: string }>>;
expectType<{ id: number; name: string }>({} as MutableUser);

type DeepReadonly = { readonly meta: { readonly created: Date } };
type ShallowMutable = TWriteable<DeepReadonly>;
export type _t7 = TExpect<
  TEqual<ShallowMutable['meta'], { readonly created: Date }>
>;

type ReadonlyDict = { readonly [key: string]: number };
type MutableDict = TWriteable<ReadonlyDict>;
export type _t8 = TExpect<TEqual<MutableDict, { [key: string]: number }>>;

type MethodObj = { move(): void };
type MutableMethod = TWriteable<MethodObj>;
export type _t9 = TExpect<TEqual<MutableMethod, { move(): void }>>;
