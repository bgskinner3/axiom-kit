import type { TAnyFunction } from '../types';
// import { isSolid } from '../../src/index';
// import { isXalor } from '../../src/operations/core/is-xalor';

// export type TREGISTRATION_BUILD_PARAMS = {
//   key: string;
//   typeImport: string;
// };

// export type TINTELLISENSE_REGISTRATION_SHAPE = {
//   readonly fn: TAnyFunction;
//   readonly signature: (props: TREGISTRATION_BUILD_PARAMS) => string;
// };

// export type TINTELLISENSE_REGISTRATION = Record<
//   string,
//   TINTELLISENSE_REGISTRATION_SHAPE
// >;

// export const REGISTERED_INTELLIGENCE_FUNCTIONS: TINTELLISENSE_REGISTRATION = {
//   'is-solid-reg': {
//     fn: isSolid,
//     signature: () => `export function isSolid(data?: undefined): true;`,
//   },
//   'is-solid-resolution': {
//     fn: isSolid,
//     signature: ({ key, typeImport }) =>
//       `export function isSolid(data: unknown): data is TSolid<'${key}', ${typeImport}>;`,
//   },
//   'is-xalor-register': {
//     fn: isXalor,
//     signature: ({ key, typeImport }) =>
//       `export function isXalor(data?: undefined, injected?: TSolidMetadata<'${key}', ${typeImport}>): true;`,
//   },

//   // 2. RESOLUTION: const meta = isXalor<'KEY'>()
//   'is-xalor-resolution': {
//     fn: isXalor,
//     signature: ({ key, typeImport }) =>
//       `export function isXalor(data?: undefined, injectedKey?: '${key}'): TSolidMetadata<'${key}', ${typeImport}>;`,
//   },

//   // 3. VALIDATION: if (isXalor<'KEY'>(data))
//   'is-xalor-validation': {
//     fn: isXalor,
//     signature: ({ key, typeImport }) =>
//       `export function isXalor(data: unknown, injectedKey?: '${key}'): data is ${typeImport};`,
//   },

//   // 4. ASSERTION: isXalor<'KEY'>(data, true)
//   'is-xalor-assertion': {
//     fn: isXalor,
//     signature: ({ key, typeImport }) =>
//       `export function isXalor(data: unknown, assert: true, injectedKey?: '${key}'): asserts data is ${typeImport};`,
//   },
// } satisfies TINTELLISENSE_REGISTRATION;
