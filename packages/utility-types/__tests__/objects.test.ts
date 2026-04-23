import type { TExpect, TEqual } from '../src';
import { forceType, expectType } from '../src';
import type {
  TPrettify,
  TEnsure,
  TUnpackObject,
  TWriteable,
} from '../src/primitives';

describe('Object Type Utilities', () => {
  describe('TUnpackObject', () => {
    test('unpacks values from a const object (Enum-like)', () => {
      const _Colors = { red: '#ff0000', blue: '#0000ff' } as const;
      type ColorValues = TUnpackObject<typeof _Colors>;
      type Expected = '#ff0000' | '#0000ff';

      const _t1: TExpect<TEqual<ColorValues, Expected>> = true;
      const val: unknown = '#ff0000';
      forceType<ColorValues>(val, _t1);
      expectType<Expected>(val);
    });

    test('extracts union of value types from a standard interface', () => {
      type Mixed = { id: number; name: string; active: boolean };
      type MixedValues = TUnpackObject<Mixed>;
      type Expected = number | string | boolean;

      const _t2: TExpect<TEqual<MixedValues, Expected>> = true;
      const val: unknown = true;
      forceType<MixedValues>(val, _t2);
      expectType<Expected>(val);
    });

    test('unpacks item type from an array', () => {
      type ArrayVals = TUnpackObject<string[]>;
      const _t3: TExpect<TEqual<ArrayVals, string>> = true;
      const val: unknown = '';
      forceType<ArrayVals>(val, _t3);
      expectType<string>(val);
    });
  });
  describe('TEnsure', () => {
    type TPartialPost = { title?: string; body?: string; id: number };

    test('makes specific optional keys required', () => {
      type ValidatedPost = TPrettify<TEnsure<TPartialPost, 'title'>>;
      type Expected = { title: string; body?: string; id: number };

      const _t10: TExpect<TEqual<ValidatedPost, Expected>> = true;
      const val: unknown = {};
      forceType<ValidatedPost>(val, _t10);
      expectType<Expected>(val);
    });

    test('handles multiple keys and preserves non-targeted optionality', () => {
      type FullPost = TPrettify<TEnsure<TPartialPost, 'title' | 'body'>>;
      type Expected = { title: string; body: string; id: number };

      const _t11: TExpect<TEqual<FullPost, Expected>> = true;
      const val: unknown = {};
      forceType<FullPost>(val, _t11);
      expectType<Expected>(val);
    });

    test('removes undefined but preserves null from nullable fields', () => {
      interface NullableUser {
        bio?: string | null;
      }
      type EnsuredBio = TPrettify<TEnsure<NullableUser, 'bio'>>;
      type Expected = { bio: string | null };

      const _t13: TExpect<TEqual<EnsuredBio, Expected>> = true;
      const val: unknown = {};
      forceType<EnsuredBio>(val, _t13);
      expectType<Expected>(val);
    });
  });
  describe('TWriteable', () => {
    test('removes readonly modifiers from object properties', () => {
      type ReadonlyUser = { readonly id: number; readonly name: string };
      type MutableUser = TWriteable<ReadonlyUser>;
      type Expected = { id: number; name: string };

      const _t6: TExpect<TEqual<MutableUser, Expected>> = true;
      const val: unknown = { id: 1, name: 'test' };
      forceType<MutableUser>(val, _t6);
      expectType<Expected>(val);
    });

    test('performs shallow conversion (nested objects remain readonly)', () => {
      type DeepReadonly = { readonly meta: { readonly created: Date } };
      type ShallowMutable = TWriteable<DeepReadonly>;

      // meta should be mutable, but meta.created should stay readonly
      type MetaType = ShallowMutable['meta'];
      type ExpectedMeta = { readonly created: Date };

      const _t7: TExpect<TEqual<MetaType, ExpectedMeta>> = true;
      const val: unknown = {};
      forceType<MetaType>(val, _t7);
      expectType<ExpectedMeta>(val);
    });

    test('removes readonly from index signatures (dictionaries)', () => {
      type ReadonlyDict = { readonly [key: string]: number };
      type MutableDict = TWriteable<ReadonlyDict>;
      type Expected = { [key: string]: number };

      const _t8: TExpect<TEqual<MutableDict, Expected>> = true;
      const val: unknown = {};
      forceType<MutableDict>(val, _t8);
      expectType<Expected>(val);
    });
  });
});
