//packages/utility-types/src/utilities/core
import type { TPrettify } from '../../primitives';

type TConfigSchema = Record<string, Record<string, string>>;
/**
 * @utilType type
 * @name TIfValueRequire
 * @category Advanced Type Utilities
 * @description Enforces a dependency rule where a specific key's value determines if another key is required or forbidden.
 * @link #tifvaluerequire
 *
 * ## 🧠 TIfValueRequire — Conditional Schema Logic
 *
 * A specialized utility for configuration objects. If the value of `K1` matches `V1`,
 * then `K2` becomes a required key. Otherwise, `K2` is explicitly forbidden (undefined).
 */
type TIfValueRequire<
  T extends TConfigSchema,
  K1 extends keyof T,
  V1 extends keyof T[K1],
  K2 extends keyof T,
> = TPrettify<
  | ({ [P in K1]: V1 } & { [P in K2]: keyof T[K2] })
  | ({ [P in K1]?: Exclude<keyof T[K1], V1> } & { [P in K2]?: undefined })
>;
/**
 * @utilType type
 * @name TRequireIf
 * @category Advanced Type Utilities
 * @description Makes property K2 required if K1 matches value V1; otherwise, K2 is forbidden.
 * @link #trequireif
 *
 * ## ⚖️ TRequireIf — Conditional Requirement Utility
 *
 * Enforces that property `K2` becomes REQUIRED when property `K1` matches value `V1`.
 * If `K1` does NOT match `V1`, property `K2` must be undefined. This is ideal for
 * strict prop interfaces in React components.
 */
type TRequireIf<
  T,
  K1 extends keyof T,
  V1 extends T[K1],
  K2 extends string,
> = TPrettify<
  /* prettier-ignore */ | (Omit<T, K1 | (K2 & keyof T)> & { [P in K1]: V1  } & { [P in K2]-?: K2 extends keyof T ? Exclude<T[K2], undefined> : unknown })
  /* prettier-ignore */
  | (Omit<T, K1 | (K2 & keyof T)> & { [P in K1]: Exclude<T[K1], V1> } & { [P in K2]?: undefined })
>;
/**
 * @utilType type
 * @name TOmitMethods
 * @category Advanced Type Utilities
 * @description Strips all function properties (methods) from a type, leaving only data properties.
 * @link #tomitmethods
 *
 * ## 🗂️ TOmitMethods — Data-Only Utility
 *
 * Filters out any key whose value is a function. This is perfect for generating
 * DTOs (Data Transfer Objects) or state objects for serialization where logic
 * should be stripped away.
 */
type FunctionKeys<T> = {
  [K in keyof T]: string extends K // 1. Skip the general 'string' or 'number' indexers
    ? never
    : number extends K
      ? never
      : // 2. Omit the key if its value (minus undefined) is a function
        Exclude<T[K], undefined> extends (...args: never[]) => unknown
        ? K
        : never;
}[keyof T];

type TOmitMethods<T> = {
  // Use key remapping to filter out the identified function keys
  [K in keyof T as K extends FunctionKeys<T> ? never : K]: T[K];
};

/**
 * @utilType type
 * @name TUnionResolver
 * @category Advanced Type Utilities
 * @description Transforms a union of values into a discriminated union of tagged objects.
 * @link #tunionresolver
 *
 * ## 🏷️ TUnionResolver — Tagged Union Mapper
 *
 * Converts a simple union (e.g., `'a' | 'b'`) into an array of tagged objects
 * (e.g., `[{ type: 'a' }, { type: 'b' }]`). Useful for building registries or
 * configuration lists based on type unions.
 */
type TUnionResolver<T> = T extends infer U ? { type: U }[] : never;

export type { TUnionResolver, TOmitMethods, TRequireIf, TIfValueRequire };
