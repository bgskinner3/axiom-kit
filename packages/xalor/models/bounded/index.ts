import type { TAnyFunction } from '../types';
import { isSolid } from '../../src/index';

export type TREGISTRATION_BUILD_PARAMS = {
  key: string;
  typeImport: string;
};

export type TINTELLISENSE_REGISTRATION_SHAPE = {
  readonly fn: TAnyFunction;
  readonly signature: (props: TREGISTRATION_BUILD_PARAMS) => string;
};

export type TINTELLISENSE_REGISTRATION = Record<
  string,
  TINTELLISENSE_REGISTRATION_SHAPE
>;

export const REGISTERED_INTELLIGENCE_FUNCTIONS: TINTELLISENSE_REGISTRATION = {
  'is-solid-reg': {
    fn: isSolid,
    signature: () => `export function isSolid(data?: undefined): true;`,
  },
  'is-solid-resolution': {
    fn: isSolid,
    signature: ({ key, typeImport }) =>
      `export function isSolid(data: unknown): data is TSolid<'${key}', ${typeImport}>;`,
  },
} satisfies TINTELLISENSE_REGISTRATION;
