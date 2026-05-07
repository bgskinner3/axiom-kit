import type { TAnyFunction } from '../types';
import { isSolid } from '../../index';
import { isXalor } from '../../operations/core/is-xalor';

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
    signature: () => `  export function isSolid(data?: undefined): true;`,
  },
  'is-solid-resolution': {
    fn: isSolid,
    signature: () =>
      `  export function isSolid<K extends keyof ISolidRegistry>(data: unknown, key?: K): data is TSolid<K, ISolidRegistry[K]>;`,
  },
  'is-xalor-register': {
    fn: isXalor,
    signature: () =>
      `  export function isXalor<K extends keyof ISolidRegistry>(data?: undefined, injected?: TSolidMetadata<K, ISolidRegistry[K]>): true;`,
  },
  'is-xalor-resolution': {
    fn: isXalor,
    signature: () =>
      `  export function isXalor<K extends keyof ISolidRegistry>(data?: undefined, injectedKey?: K): TSolidMetadata<K, ISolidRegistry[K]>;`,
  },
  'is-xalor-validation': {
    fn: isXalor,
    signature: () =>
      `  export function isXalor<K extends keyof ISolidRegistry>(data: unknown, injectedKey?: K): data is K extends keyof ISolidIdentity ? ISolidIdentity[K] : ISolidRegistry[K];`,
  },
  'is-xalor-assertion': {
    fn: isXalor,
    signature: () =>
      `  export function isXalor<K extends keyof ISolidRegistry>(data: unknown, assert: true, injectedKey?: K): asserts data is K extends keyof ISolidIdentity ? ISolidIdentity[K] : ISolidRegistry[K];`,
  },
} satisfies TINTELLISENSE_REGISTRATION;
