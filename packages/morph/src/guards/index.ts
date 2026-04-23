import type { TCamelCase, TSnakeCase, TKebabCase } from '@axiom/utility-types';

type TTypeGuard<T> = (value: unknown) => value is T;

/**
 * @utilType Guard
 * @name isCamelCase
 *@category Guards Core
 * @description Validates if a string follows camelCase naming conventions.
 * @link #iscamelcase
 */
export const isCamelCase: TTypeGuard<TCamelCase<string>> = (
  value,
): value is TCamelCase<string> =>
  typeof value === 'string' && /^[a-z]+(?:[A-Z][a-z0-9]*)*$/.test(value);
/**
 * @utilType Guard
 * @name isSnakeCase
 *@category Guards Core
 * @description Validates if a string follows snake_case naming conventions.
 * @link #issnakecase
 */
export const isSnakeCase: TTypeGuard<TSnakeCase<string>> = (
  value,
): value is TSnakeCase<string> =>
  typeof value === 'string' && /^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(value);

/**
 * @utilType Guard
 * @name isKebabCase
 *@category Guards Core
 * @description Validates if a string follows kebab-case naming conventions.
 * @link #iskebabcase
 */
export const isKebabCase: TTypeGuard<TKebabCase<string>> = (
  value,
): value is TKebabCase<string> =>
  typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
