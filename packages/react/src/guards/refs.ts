import { isDefined, isFunction, isObject, isKeyInObject } from '@axiom/guards';
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
export const isRefObject = <T>(ref: unknown): ref is RefObject<T> =>
  typeof ref === 'object' && ref !== null && 'current' in ref;

/**
 * @utilType Guard
 * @name isPromise
 * @category Guards React
 * @description Checks if a value is a Promise or a "Thenable" by validating the existence of a .then() method.
 * @link #ispromise
 *
 * ### 📘 Example Usage
 * ```ts
 * if (isPromise(data)) {
 *   data.then((res) => console.log(res));
 * }
 * ```
 */
export const isPromise = <T>(value: unknown): value is Promise<T> =>
  !!value && isKeyInObject('then')(value) && isFunction(value.then);
