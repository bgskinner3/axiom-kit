/**
 * @utilType type
 * @name TPromisify
 * @category Advanced Type Utilities
 * @description Maps over an object type and wraps every property value in a Promise.
 * @link #tpromisify
 *
 * ## ⏳ TPromisify — Property-Level Promise Wrapper
 *
 * Transforms an interface so that every property becomes asynchronous.
 * This is ideal for defining the return types of data-fetching layers or
 * async proxies.
 *
 * @template T - The original object structure.
 *
 * @example
 * ```ts
 * interface UserData { id: string; age: number; }
 * type AsyncUser = TPromisify<UserData>;
 * // → { id: Promise<string>; age: Promise<number>; }
 * ```
 */
type TPromisify<T> = {
  [P in keyof T]: Promise<T[P]>;
};

/**
 * @utilType type
 * @name TPromiseType
 * @category Advanced Type Utilities
 * @description Unwraps a Promise type to extract the underlying value type.
 * @link #tpromisetype
 *
 * ## 🔓 TPromiseType — Promise Resolution Utility
 *
 * Extracts the "resolved" type from a Promise. If the type passed in isn't
 * a Promise, it resolves to `never`.
 *
 * @template T - The Promise type to unwrap.
 *
 * @example
 * ```ts
 * type ApiResponse = Promise<{ status: number }>;
 * type RawResponse = TPromiseType<ApiResponse>;
 * // → { status: number }
 * ```
 */
type TPromiseType<T> = T extends Promise<infer U> ? U : never;

export type { TPromiseType, TPromisify };
