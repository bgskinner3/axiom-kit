// models/guards/common/objects.ts
import type { TTypeGuard } from '../../types';
import { isNull } from './primitives';
/**
 * @utilType Guard
 * @name isArray
 * @category Guards Core
 * @description Validates that a value is an Array.
 * @link #isarray
 */
export const isArray: TTypeGuard<unknown[]> = <T, U>(
  term: Array<T> | U,
): term is Array<T> => Array.isArray(term);
/**
 * @utilType Guard
 * @name isObject
 * @category Guards Core
 * @description Validates that a value is a non-null, non-array object.
 * @link #isobject
 */
export const isObject: TTypeGuard<object> = <T extends object, U>(
  term: T | U,
): term is NonNullable<T> =>
  !isNull(term) && !isArray(term) && typeof term === 'object';

/**
 * @utilType Guard
 * @name isRecord
 * @category Guards Core
 * @description Validates that a value is a non-null object (and not an array)
 * that can be indexed by strings.
 */
export const isRecord: TTypeGuard<Record<string, unknown>> = (
  value: unknown,
): value is Record<string, unknown> =>
  isObject(value) &&
  value !== null &&
  !isArray(value) &&
  !(value instanceof Date) &&
  !(value instanceof RegExp);
