import {
  isDefined,
  isFunction,
  isNull,
  isObject,
  isKeyInObject,
} from '@axiom/guards';
import type { Ref, RefObject } from 'react';
/**
 * @utilType Guard
 * @name isRef
 * @category Guards React
 * @description Validates if a value is a valid React Ref, covering both Callback Refs and Object Refs (createRef/useRef).
 * @link #isref
 *
 * ### 📘 Example Usage
 * ```ts
 * isRef((el) => { console.log(el) }); // true (Callback Ref)
 * isRef({ current: document.createElement('div') }); // true (Object Ref)
 * ```
 *
 * @template T - The type of the element or value being referenced.
 */
export const isRef = <T>(value: unknown): value is Ref<T> =>
  isDefined(value) &&
  (isFunction(value) || (isObject(value) && 'current' in value));

/**
 * @utilType Guard
 * @name isRefObject
 * @category Guards React
 * @description Specifically narrows a Ref type to an object containing a .current property (RefObject).
 * @link #isrefobject
 *
 * ### 📘 Example Usage
 * ```ts
 * const myRef = useRef(null);
 * if (isRefObject(myRef)) {
 *   // ✅ Safely access myRef.current
 * }
 * ```
 */
export const isRefObject = <T>(ref: Ref<T>): ref is RefObject<T | null> =>
  !isNull(ref) && isObject(ref) && 'current' in ref;
export const isPromise = <T>(value: unknown): value is Promise<T> =>
  !!value && isKeyInObject('then')(value) && isFunction(value.then);
