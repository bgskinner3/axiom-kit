import type { TSolidShape, TTypeGuard, TSolidMetadata } from '../../types';
import { isObject, isKeyInObject } from './objects';
import { isNull } from './primitives';
/**
 * FOCUSED SHAPE GUARDS
 *
 * These utilities provide type-safe narrowing for the TSolidShape union.
 * Essential for the recursive validation engine and AST generation to
 * resolve specific blueprint properties without type casting.
 */
/* prettier-ignore */ export const isPrimitiveShape = (s: TSolidShape): s is Extract<TSolidShape, { kind: 'primitive' }> => s.kind === 'primitive';
/* prettier-ignore */ export const isLiteralShape = (s: TSolidShape): s is Extract<TSolidShape, { kind: 'literal' }> => s.kind === 'literal';
/* prettier-ignore */ export const isUnionShape = (s: TSolidShape): s is Extract<TSolidShape, { kind: 'union' }> => s.kind === 'union';
/* prettier-ignore */ export const isObjectShape = (s: TSolidShape): s is Extract<TSolidShape, { kind: 'object' }> => s.kind === 'object';
/* prettier-ignore */ export const isArrayShape = (s: TSolidShape): s is Extract<TSolidShape, { kind: 'array' }> => s.kind === 'array';
/* prettier-ignore */ export const isBrandedShape = (s: TSolidShape): s is Extract<TSolidShape, { kind: 'branded' }> => s.kind === 'branded';
/* prettier-ignore */ export const isIntersectionShape = (s: TSolidShape): s is Extract<TSolidShape, { kind: 'intersection' }> => s.kind === 'intersection';
/* prettier-ignore */ export const isReferenceShape = (s: TSolidShape): s is Extract<TSolidShape, { kind: 'reference' }> => s.kind === 'reference';

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
