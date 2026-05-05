import type { TSolidShape } from '../../transformer/types';
import type { TValidationContext } from '../../models';
import { createInitialContext } from './context';
import { validateObject } from './objects';
import { validateUnion } from './unions';
import { isObject, isNull, isRecord, isPrimitive } from '../utils';

const isType = (data: unknown, type: string): boolean => {
  if (type === 'object') return isRecord(data); // Reuses your isRecord
  return typeof data === type;
};

/**
 * Validates raw data against a Solid Shape.
 * No 'any', no 'as'.
 */
export function validate(
  data: unknown,
  shape: TSolidShape,
  ctx: TValidationContext = createInitialContext(),
): boolean {
  // 1. Handle Recursion Protection
  if (isObject(data) && !isNull(data)) {
    const validatedShapes = ctx.seen.get(data);
    if (validatedShapes?.has(shape)) return true;

    if (!validatedShapes) {
      ctx.seen.set(data, new Set([shape]));
    } else {
      validatedShapes.add(shape);
    }
  }

  // 2. Route by Shape Kind
  // TODO: REMOVE SWITCH
  switch (shape.kind) {
    case 'primitive':
      // return typeof data === shape.type;
      return isPrimitive(data);

    case 'literal':
      return data === shape.value;

    case 'union':
      return validateUnion(data, shape, ctx);

    case 'object':
      return validateObject(data, shape, ctx);

    case 'branded':
      // Validate the base (e.g., string) first
      return validate(data, shape.base, ctx);

    case 'reference':
      // Lookups for named recursion would go here
      return true;

    default:
      return false;
  }
}
