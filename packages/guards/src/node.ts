import type { TTypeGuard, TBufferLikeObject, TStream } from './models';
import { isObject } from './structures';
import { isArrayOf } from './logical';
import { isNumber } from './primitives';
/**
 * @utilType Guard
 * @name isBufferLikeObject
 * @category Guards Core
 * @description Validates if an object matches the shape of a serialized Buffer (e.g., { type: 'Buffer', data: number[] }).
 * @link #isbufferlikeobject
 * ---
 * ### Example Usage
 * ```ts
 * const buf = { type: 'Buffer', data: [1, 2, 3] };
 * const notBuf = { type: 'Buffer', data: ['a', 'b'] };
 *
 * isBufferLikeObject(buf); // true
 * isBufferLikeObject(notBuf); // false
 * ```
 *
 * ---
 * @param value - The value to check
 * @returns `true` if the value is a Buffer-like object, otherwise `false`
 */
export const isBufferLikeObject: TTypeGuard<TBufferLikeObject> = (
  value: unknown,
): value is TBufferLikeObject => {
  if (!isObject(value)) return false;

  const hasTypeBuffer = 'type' in value && value.type === 'Buffer';
  const hasNumberArrayData =
    'data' in value && isArrayOf(isNumber, (value as { data: unknown }).data);

  return hasTypeBuffer && hasNumberArrayData;
};




export const isStream: TTypeGuard<TStream> = (value: unknown): value is TStream => {
  // 1. Basic object check
  if (value === null || typeof value !== 'object') return false;

  // 2. Safe property access via Record
  const candidate = value as Record<string, unknown>;

  // 3. Strict function checks
  const hasPipe = typeof candidate['pipe'] === 'function';
  const hasOn = typeof candidate['on'] === 'function';

  return hasPipe && hasOn;
};