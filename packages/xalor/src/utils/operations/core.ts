import type {
  TTypeGuard,
  TSolidMetadata,
  ISolidRegistry,
  TSolidBranded,
} from '../../models/types';
import { isNull, isObject, isKeyInObject } from '../guards';
/**
 * 🛰️ IS METADATA
 *
 * ROLE:
 * A structural check for the Xalor Miner's payload.
 * This ensures that a call to isXalor() contains the necessary
 * "DNA" (key, shape, area) before it is solidified in RAM.
 *
 * INVARIANTS:
 * - Must verify the presence of 'key' and 'shape' (The minimal blueprint).
 * - Must verify 'area' for Auditor traceability.
 */
export const isMetaData: TTypeGuard<TSolidMetadata> = (
  val: unknown,
): val is TSolidMetadata =>
  !isNull(val) &&
  isObject(val) &&
  isKeyInObject('key')(val) &&
  isKeyInObject('shape')(val) &&
  isKeyInObject('area')(val) &&
  isKeyInObject('version')(val);
/**
 * 💎 MARK AS SOLID
 *
 * ROLE:
 * A "Ghost" Type Narrower for Nominal Branding.
 * This utility bridges the gap between raw data and validated data
 * without introducing runtime overhead or using 'as' casts.
 *
 * STRATEGY:
 * Leveraging User-Defined Type Guards to apply a unique symbol brand
 * to the data structure. This "tags" the object as safe for use in
 * strict functions that require TSolid-branded inputs.
 *
 * @returns {true} - Always returns true, as validation happened prior.
 */
export function markAsSolid<K extends keyof ISolidRegistry, T>(
  _val: unknown,
): _val is TSolidBranded<K, T> {
  return true;
}
