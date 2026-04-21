import type {
  TTypeGuard,
  TAnyFunction,
  TAnyObject,
} from '@axiom/utility-types';
import { isNull } from './primitives';
/**
 * @utilType Guard
 * @name isFunction
 * @category Guards Core
 * @description Validates that a value is a callable function.
 * @link #isfunction
 */
export const isFunction: TTypeGuard<TAnyFunction> = (
  value: unknown,
): value is TAnyFunction => typeof value === 'function';
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
 * @name isMap
 * @category Guards Core
 * @description Validates that a value is an instance of a Map.
 * @link #ismap
 */
export const isMap: TTypeGuard<Map<unknown, unknown>> = <K, V, U>(
  term: Map<K, V> | U,
): term is Map<K, V> => term instanceof Map;
/**
 * @utilType Guard
 * @name isSet
 * @category Guards Core
 * @description Validates that a value is an instance of a Set.
 * @link #isset
 */
export const isSet: TTypeGuard<Set<unknown>> = <T, U>(
  term: Set<T> | U,
): term is Set<T> => term instanceof Set;

/**
 * @utilType Guard
 * @name isWeakMap
 * @category Guards Core
 * @description Validates that a value is an instance of a WeakMap.
 * @link #isweakmap
 */
export const isWeakMap: TTypeGuard<WeakMap<object, unknown>> = <
  K extends object,
  V,
  U,
>(
  term: WeakMap<K, V> | U,
): term is WeakMap<K, V> => term instanceof WeakMap;

/**
 * @utilType Guard
 * @name isWeakSet
 * @category Guards Core
 * @description Validates that a value is an instance of a WeakSet.
 * @link #isweakset
 */
export const isWeakSet: TTypeGuard<WeakSet<object>> = <T extends object, U>(
  term: WeakSet<T> | U,
): term is WeakSet<T> => term instanceof WeakSet;
/**
 * @utilType Guard
 * @name isInstanceOf
 * @category Guards Core
 * @description Checks if a value is an instance of a specific class constructor.
 * @link #isinstanceof
 */
export function isInstanceOf<T extends object, Args extends unknown[]>(
  value: unknown,
  constructor: new (...args: Args) => T,
): value is T {
  return value instanceof constructor;
}
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

/**
 * @utilType Guard
 * @name hasOwnProperty
 * @category Guards Core
 * @description A type-safe wrapper for Object.prototype.hasOwnProperty
 * that narrows the object type to include the specified key.
 */
export const hasOwnProperty = <T extends object, K extends PropertyKey>(
  obj: T,
  prop: K,
): obj is T & Record<K, unknown> => {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};
// // const { hasOwnProperty } = Object.prototype;
/**
 * @utilType guard
 * @description Narrows a value to a non-null, indexable object for deep operations.
 */
export const isDefinedObject: TTypeGuard<TAnyObject> = (
  val: unknown,
): val is TAnyObject => isObject(val);
