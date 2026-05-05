import type { TSolidShape } from '../../transformer/types';
import type { TValidationContext } from '../models';
import { createInitialContext } from './context';
import { validateObject } from './objects';
import { validateUnion } from './unions';

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
  if (typeof data === 'object' && data !== null) {
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
      return typeof data === shape.type;

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
