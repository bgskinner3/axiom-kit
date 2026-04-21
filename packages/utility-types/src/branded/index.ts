const __brand: unique symbol = Symbol('brand');

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

/**
 * @utilType type
 * @name TFlavored
 * @category Branding Type Utilities
 * @description Allows implicit conversion from a base type but prevents conversion between different flavors.
 * @link #TFlavored
 *
 * @example
 * ```ts
 * type TUSD = TFlavored<number, 'USD'>;
 * type TEUR = TFlavored<number, 'EUR'>;
 *
 * let wallet: TUSD = 100; // Success: can assign raw numbers
 * let savings: TEUR = 50;
 *
 * // Error: Type 'TEUR' is not assignable to type 'TUSD'.
 * wallet = savings;
 * ```
 */
export type TFlavored<T, B> = T & { readonly [__brand]?: B };

/**
 * @utilType type
 * @name TUnBrand
 * @category Branding Type Utilities
 * @description Extracts the original base type (T) from a Branded type.
 * @link #TUnBrand
 *
 * @example
 * ```ts
 * type TByte = TBranded<number, 'Byte'>;
 * type TRaw = TUnBrand<TByte>; // TRaw is 'number'
 * ```
 */
export type TUnBrand<T> = T extends TBranded<infer U, infer _B> ? U : T;

/**
 * @utilType type
 * @name TMultiBranded
 * @category Branding Type Utilities
 * @description Allows a type to carry multiple brand tags simultaneously.
 * @link #TMultiBranded
 *
 * @example
 * ```ts
 * type TAdmin = TBranded<string, 'Admin'>;
 * type TModerator = TBranded<string, 'Moderator'>;
 *
 * type TSuperUser = TMultiBranded<string, ['Admin', 'Moderator']>;
 * ```
 */
export type TMultiBranded<T, B extends readonly unknown[]> = T & {
  readonly [__brand]: B[number];
};

/**
 * @utilType type
 * @name TNominal
 * @category Branding Type Utilities
 * @description Strict branding for objects to prevent structural compatibility even if shapes are identical.
 * @link #TNominal
 *
 * @example
 * ```ts
 * interface User { id: string }
 * type TNominalUser = TNominal<User, 'UserEntity'>;
 *
 * const rawUser = { id: '1' };
 * // Error: Cannot assign raw object to Nominal type without explicit guard/cast
 * const entity: TNominalUser = rawUser;
 * ```
 */
export type TNominal<T extends object, B> = T & TBranded<T, B>;
/**
 * @utilType type
 * @name TBrandGuard
 * @category Branding Type Utilities
 * @description Defines the signature for a pure Type Guard used to "bless" values without using 'as'.
 * @link #TBrandGuard
 *
 * @example
 * ```ts
 * type TByte = TBranded<number, 'Byte'>;
 *
 * const isByte: TBrandGuard<number, 'Byte'> = (n): n is TByte =>
 *   n >= 0 && n <= 255;
 * ```
 */
export type TBrandGuard<T, B> = (val: T) => val is TBranded<T, B>;
/**
 * @utilType type
 * @name TDeepUnBrand
 * @category Branding Type Utilities
 * @description Recursively removes all brand metadata from primitives, arrays, and nested objects.
 * @link #TDeepUnBrand
 *
 * @example
 * ```ts
 * interface State {
 *   count: TBranded<number, 'Counter'>;
 *   tags: TBranded<string, 'Tag'>[];
 * }
 *
 * type TRawState = TDeepUnBrand<State>;
 * // { count: number; tags: string[]; }
 * ```
 */
export type TDeepUnBrand<T> =
  T extends TBranded<infer U, infer _>
    ? TDeepUnBrand<U>
    : T extends object
      ? { [K in keyof T]: TDeepUnBrand<T[K]> }
      : T;
/**
 * @utilType type
 * @name TRefine
 * @category Branding Type Utilities
 * @description Appends an additional brand to an existing type without overwriting current metadata.
 * @link #TRefine
 *
 * @example
 * ```ts
 * type TValid = TBranded<string, 'Valid'>;
 * type TSanitized = TRefine<TValid, 'Sanitized'>;
 * ```
 */
export type TRefine<T, B> = T & TBranded<unknown, B>;
