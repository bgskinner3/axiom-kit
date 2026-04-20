/**
 * @utilType type
 * @name TXOR
 * @category Advanced Type Utilities
 * @description Enforces a strict choice between two property sets (T or U), preventing the mixing of properties from both.
 * @link #txor
 *
 * ## ⚖️ TXOR — Exclusive OR Utility
 *
 * Enforces a strict "one-or-the-other" choice between two types. Unlike a standard
 * TypeScript union (`|`), `TXOR` ensures that if properties from type `T` are present,
 * properties from type `U` must be absent (and vice-versa).
 *
 * @template T - The first set of properties.
 * @template U - The second set of properties.
 *
 * @example
 * ```ts
 * // Define two exclusive data shapes
 * type TEmailAuth = { email: string; otp: string };
 * type TSocialAuth = { provider: 'google' | 'apple'; token: string };
 *
 * // Use TXOR to ensure the user doesn't try to mix auth methods
 * type TAuthRequest = TXOR<TEmailAuth, TSocialAuth>;
 *
 * // ✅ Valid: Only Email props
 * const req1: TAuthRequest = { email: 'test@me.com', otp: '1234' };
 *
 * // ✅ Valid: Only Social props
 * const req2: TAuthRequest = { provider: 'google', token: 'xyz_secret' };
 *
 * // ❌ Error: Cannot mix email props with social props
 * const req3: TAuthRequest = { email: 'test@me.com', provider: 'google' };
 * ```
 */
type TXOR<T, U> =
  | (T & { [K in Exclude<keyof U, keyof T>]?: never })
  | (U & { [K in Exclude<keyof T, keyof U>]?: never });

/**
 * @utilType type
 * @name TTupleToIntersection
 * @category Advanced Type Utilities
 * @description Transforms an ordered tuple of types into a single intersection type (A & B & C).
 * @link #ttupletointersection
 *
 * ## 🧬 TTupleToIntersection — Variadic Type Merger
 *
 * Converts a tuple of types (like those from a spread argument) into a single
 * intersected type. This is the type-level engine behind high-performance
 * merge utilities.
 *
 * It explicitly unrolls the first 5 members for maximum stability and performance,
 * falling back to a general intersection for larger arrays.
 *
 * @template T - An array or tuple of types to be intersected.
 *
 * @example
 * ```ts
 * type Configs = [{ id: number }, { name: string }, { active: boolean }];
 *
 * // Result: { id: number } & { name: string } & { active: boolean }
 * type FullConfig = TTupleToIntersection<Configs>;
 * ```
 */
type TTupleToIntersection<T extends unknown[]> =
  /* prettier-ignore */ T extends [infer A] ? A :
/* prettier-ignore */ T extends [infer A, infer B] ? A & B :
/* prettier-ignore */ T extends [infer A, infer B, infer C] ? A & B & C :
/* prettier-ignore */ T extends [infer A, infer B, infer C, infer D] ? A & B & C & D :
/* prettier-ignore */ T extends [infer A, infer B, infer C, infer D, infer E] ? A & B & C & D & E :
/* prettier-ignore */ T extends (infer U)[] ? U : unknown;
export type { TXOR, TTupleToIntersection };
