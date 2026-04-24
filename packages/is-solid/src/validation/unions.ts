import type { TSolidShape } from '../../transformer/types';
import type { TValidationContext } from '../models';
import { validate } from './index';

/**
 * Checks if data satisfies at least one part of the union.
 */
export function validateUnion(
  data: unknown,
  shape: { values: TSolidShape[] },
  ctx: TValidationContext,
): boolean {
  // We use .some() to return true as soon as one match is found
  return shape.values.some((subShape) => validate(data, subShape, ctx));
}
