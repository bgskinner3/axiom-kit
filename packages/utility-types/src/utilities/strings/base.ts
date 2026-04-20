/**
 * @utilType type
 * @name ToPath
 * @category Advanced Type Utilities
 * @description Recursively transforms a tuple of string segments into a forward-slash separated URL path.
 * @link #topath
 *
 * ## 🛣️ ToPath — Recursive Path Constructor
 *
 * Transforms a tuple of strings into a URL path. It recursively joins elements,
 * ensuring proper slash placement without trailing slashes.
 *
 * @template TItems - A tuple of path segments (e.g., ['api', 'v1']).
 */
type ToPath<TItems extends string[]> = TItems extends [
  infer Head extends string,
  ...infer Tail extends string[],
]
  ? `${Head}${Tail extends [] ? '' : `/${ToPath<Tail>}`}`
  : '';

/**
 * @utilType type
 * @name ToQueryString
 * @category Advanced Type Utilities
 * @description Transforms a tuple of parameter keys into a template literal query string with string placeholders.
 * @link #toquerystring
 *
 * ## 🔍 ToQueryString — Recursive Query Parameter Builder
 *
 * Maps a list of keys to a URI-compatible query string format (`key=${string}`).
 * Ideal for defining expected URL shapes in type-safe routing.
 *
 * @template TParams - A tuple of query keys (e.g., ['id', 'limit']).
 */
type ToQueryString<TParams extends string[]> = TParams extends [
  infer Head extends string,
  ...infer Tail extends string[],
]
  ? `${Head}=${string}${Tail extends [] ? '' : '&'}${ToQueryString<Tail>}`
  : '';

/**
 * @utilType type
 * @name TStrictURL
 * @category Advanced Type Utilities
 * @description Generates a strictly formatted URL template literal enforced by protocol, domain, path, and query params.
 * @link #tstricturl
 *
 * ## 🌐 TStrictURL — Type-Safe URL Template
 *
 * Enforces a valid endpoint structure at the type level. Validates protocol,
 * TLD (com/dev/io), and recursively builds out the path and query string.
 *
 * @template TProtocol - 'https' | 'http'.
 * @template TDomain - Must include a valid TLD.
 * @template TPath - Tuple of segments.
 * @template TParams - Tuple of query keys.
 */
type TStrictURL<
  TProtocol extends 'https' | 'http',
  TDomain extends `${string}.${'com' | 'dev' | 'io'}`,
  TPath extends string[] = [],
  TParams extends string[] = [],
> = `${TProtocol}://${TDomain}${TPath extends []
  ? ''
  : `/${ToPath<TPath>}`}${TParams extends []
  ? ''
  : `?${ToQueryString<TParams>}`}`;

export type { TStrictURL, ToPath, ToQueryString };
