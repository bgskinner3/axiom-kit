export const __brand: unique symbol = Symbol('brand');

/**
 * @utilType type
 * @name TBranded
 * @category Branding Type Utilities
 * @description Attaches a unique, opaque tag to a base type to prevent accidental type mixing.
 * @link #TBranded
 *
 * @example
 * ```ts
 * type TEmail = TBranded<string, 'Email'>;
 * type TUserId = TBranded<string, 'UserId'>;
 *
 * const email = "test@test.com" as TEmail;
 * const userId = "123" as TUserId;
 *
 * // Error: Type 'TUserId' is not assignable to type 'TEmail'.
 * const sendTo: TEmail = userId;
 * ```
 */
export type TBranded<T, B> = T & { readonly [__brand]: B };
